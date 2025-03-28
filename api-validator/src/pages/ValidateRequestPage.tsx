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
  const { schemaFile } = useFileStore();

  const validateJson = async () => {
      const element = document.getElementById("input-data")?.querySelector('textarea') as HTMLTextAreaElement;      
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
          schemaData: { schemaData: schemaFile },
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
      {result && (
        <Box className={`result-box ${result.startsWith("Data is valid") ? 'valid' : 'invalid'}`}>
          <p>{result}</p>
        </Box>
      )}

      <div id={"input-data"} className="validate-request-field">
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
    </Box>
  );
};

export default ValidateRequestPage;