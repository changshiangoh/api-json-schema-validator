import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import './ValidateRequestPage.scss';
import axios from 'axios';
import useFileStore from '../zustand/FileStore';

interface ValidateRequestPageProps {
  handleBack: () => void;
}

const ValidateRequestPage: React.FC<ValidateRequestPageProps> = ({ handleBack }) => {
  const [result, setResult] = useState('');
  const { schema } = useFileStore();


  const schema2 = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"}
    },
    "required": ["name", "age"]
  }

  const data = {
      "name": "John Doe",
      "age": 30
  }

  const validateJson = async () => {
      const element1 = document.getElementById("input-data-1")?.querySelector('input') as HTMLInputElement;
      const element2 = document.getElementById("input-data-2")?.querySelector('input') as HTMLInputElement;
      const inputData = element2.value || "";
      let inputJson;
      try {
        inputJson = JSON.parse(inputData);
      } catch {
        setResult("This is not a valid JSON format.")
      }
    try {
      if (inputJson) {
        const response = await axios.post('http://localhost:8000/validate/', {
          schemaData: { schemaData: schema },
          inputData: { inputData: inputJson },
        });
        setResult(response.data.message || response.data.detail);
      }
    } catch (error: any) {
      console.log(">>>>>>>>", error)
      setResult(error.response.data.detail || 'An error occurred');
    }
  };
  
  return (
    <Box className="validate-request-page" >
      <div id={"input-data-1"} className="validate-request-field"> 
        <TextField
          label="API URL"
          variant="outlined"
          className="text-field"
        />
      </div>
      <div id={"input-data-2"} className="validate-request-field">
        <TextField
          label="JSON Input Field"
          variant="outlined"
          className="text-field"
          multiline
          rows={10}
        />
      </div>
      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={validateJson} className="back-button">
          Validate
        </Button>
      </Box> 

      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={handleBack} className="back-button">
          Back
        </Button>
      </Box>

    
      {result && <p>{result}</p>}
    </Box>
  );
};

export default ValidateRequestPage;