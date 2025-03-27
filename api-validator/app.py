
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from jsonschema import validate, ValidationError
from fastapi.middleware.cors import CORSMiddleware
import javalang
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
class SchemaData(BaseModel):
    schemaData: dict
class InputData(BaseModel):
    inputData: dict

@app.post("/validate/")
async def validate_data(schemaData: SchemaData, inputData: InputData):
    try:
        validate(instance=inputData.inputData, schema=schemaData.schemaData)
        return {"message": "Data is valid."}
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Data is invalid: {e.message}")

class GenerateSchemaRequest(BaseModel):
    controller_content: str
    class_content: str

@app.post("/generate-schema/")
async def generate_schema(request: GenerateSchemaRequest):
    object_name = extract_request_body_object(request.controller_content)
    json_schema = build_json_schema(request.class_content, object_name)
    return json_schema
def extract_request_body_object(controller_content):
    pattern = r'@RequestBody\s+(\w+)'
    match = re.search(pattern, controller_content)
    if match:
        return match.group(1)
    return None
def build_json_schema(java_content, object_name):
    tree = javalang.parse.parse(java_content)
    schema = {
        "type": "object",
        "properties": {},
        "required": []
    }
    
    def parse_class(class_node):
        class_schema = {
            "type": "object",
            "properties": {},
            "required": []
        }
        for field in class_node.fields:
            for declarator in field.declarators:
                field_name = declarator.name
                field_type = field.type.name
                if field_type in class_names:
                    nested_class_node = class_nodes[field_type]
                    class_schema["properties"][field_name] = parse_class(nested_class_node)
                else:
                    class_schema["properties"][field_name] = {"type": map_java_type_to_json_type(field_type)}
                class_schema["required"].append(field_name)
        return class_schema
    
    def map_java_type_to_json_type(java_type):
        type_mapping = {
            "String": "string",
            "int": "integer",
            "Integer": "integer",
            "boolean": "boolean",
            "Boolean": "boolean",
            "double": "number",
            "Double": "number",
            "float": "number",
            "Float": "number"
        }
        return type_mapping.get(java_type, "string")
    
    class_nodes = {node.name: node for path, node in tree if isinstance(node, javalang.tree.ClassDeclaration)}
    class_names = class_nodes.keys()
    
    if object_name in class_names:
        schema = parse_class(class_nodes[object_name])
    
    return schema
 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
 