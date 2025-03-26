import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import './ImportSchemaPage.scss';

interface ImportSchemaPageProps {
  handleNext: () => void;
}

const ImportSchemaPage: React.FC<ImportSchemaPageProps> = ({ handleNext }) => {
  const [controllerFiles1, setControllerFiles1] = useState<FileList | null>(null);
  const [controllerFiles2, setControllerFiles2] = useState<FileList | null>(null);
  const [relevantFiles, setRelevantFiles] = useState<FileList | null>(null);
  const [schemaFiles, setSchemaFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<FileList | null>>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files);
    }
  };

  return (
    <Box className="import-schema-page">
      <Typography variant="h6">Option 1: Upload Controller files and Relevant Files</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setControllerFiles1)} />
        </Button>
        {controllerFiles1 && <Typography variant="body2" className="file-name">{controllerFiles1[0].name}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Relevant Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setRelevantFiles)} />
        </Button>
        {relevantFiles && <Typography variant="body2" className="file-name">{relevantFiles[0].name}</Typography>}
      </Box>
      <Typography variant="h6">Option 2: Upload Controller files and Schema</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setControllerFiles2)} />
        </Button>
        {controllerFiles2 && <Typography variant="body2" className="file-name">{controllerFiles2[0].name}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Schema Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setSchemaFiles)} />
        </Button>
        {schemaFiles && <Typography variant="body2" className="file-name">{schemaFiles[0].name}</Typography>}
      </Box>
      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ImportSchemaPage;