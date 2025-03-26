import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import './ValidateRequestPage.scss';
import axios from 'axios';

interface ValidateRequestPageProps {
  handleBack: () => void;
}

const ValidateRequestPage: React.FC<ValidateRequestPageProps> = ({ handleBack }) => {
  const [result, setResult] = useState('');

  const schema = {
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
      const element = document.getElementById("input-data")?.querySelector('input') as HTMLInputElement;
      const inputData = element.value || "";
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
      setResult(error.response.data.detail || 'An error occurred');
    }
  };
  
  return (
    <Box className="validate-request-page">
      <div id={"input-data"}>
        <TextField
          label="Validate Request Field"
          variant="outlined"
          className="validate-request-field"
        />
      </div>
      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={handleBack} className="back-button">
          Back
        </Button>
      </Box>

      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={validateJson} className="back-button">
          Validate
        </Button>
      </Box>  
      {result && <p>{result}</p>}
    </Box>
  );
};

export default ValidateRequestPage;