
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from jsonschema import validate, ValidationError
from fastapi.middleware.cors import CORSMiddleware

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
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
 
 