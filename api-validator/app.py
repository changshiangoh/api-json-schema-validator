
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
    url: str
    request_type: str

@app.post("/generate-schema/")
async def generate_schema(request: GenerateSchemaRequest):
    object_name = extract_request_body_object(request.controller_content, request.url, request.request_type)
    json_schema = build_json_schema(request.class_content, object_name)
    return json_schema
def extract_request_body_object(controller_content, url, request_type):
    # Extract the path from the URL
    url_path = re.sub(r'^https?://[^/]+', '', url)
    
    # Extract controller mapping
    controller_pattern = r'@RequestMapping\("([^"]+)"\)\s+public\s+class\s+\w+'
    controller_match = re.search(controller_pattern, controller_content)
    controller_mapping = controller_match.group(1) if controller_match else ''
    # Split the URL by the controller mapping
    if controller_mapping and controller_mapping in url_path:
        remaining_url = url_path.split(controller_mapping)[-1]
    else:
        remaining_url = url_path
    # Extract method mappings based on request type
    method_pattern = rf'@({request_type}Mapping)\("([^"]+)"\)\s+public\s+\w+\s+\w+\((?:@RequestBody\s+(\w+))?'
    method_matches = re.findall(method_pattern, controller_content)
    
    for method, endpoint, request_body in method_matches:
        if remaining_url.startswith(endpoint):
            return request_body
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
    else:
        schema = {
            "type": "object",
            "properties": {
                "data": {"type": map_java_type_to_json_type(object_name)}
            },
            "required": ["data"]
        }
    
    return schema
 
 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
 