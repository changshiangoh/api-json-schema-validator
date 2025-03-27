import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import './ImportSchemaPage.scss';
import useFileStore from '../zustand/FileStore';
import axios from 'axios';

interface ImportSchemaPageProps {
  handleNext: () => void;
}

const ImportSchemaPage: React.FC<ImportSchemaPageProps> = ({ handleNext }) => {
  const [controllerFiles1, setControllerFiles1] = useState<FileList | null>(null);
  const [controllerFiles2, setControllerFiles2] = useState<FileList | null>(null);
  const [relevantFiles, setRelevantFiles] = useState<FileList | null>(null);
  const [schemaFiles, setSchemaFiles] = useState<FileList | null>(null);

  const { schema, controllerFile, relevantObjects, setControllerFile, setRelevantObjects, setSchema } = useFileStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<FileList | null>>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files);
    }
  };

    const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file : FileList | null) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files);
    }
  };

  const setValue = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target?.result as string;
            console.log(content); // This is where you get the file content

            // Save the content to Zustand store
            setControllerFile(content);
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
  }

  const setValue3 = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target?.result as string;
            console.log(content); // This is where you get the file content

            // Save the content to Zustand store
            try {
              setSchema(JSON.parse(content));
            } catch {
              console.log("schema not in valid JSON format")
            }     
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
  }

  const setValue2 = (fileList: FileList | null) => {
      if (fileList) {
          let mergedContent = '';
          let filesProcessed = 0;

          Array.from(fileList).forEach((file, index) => {
              const reader = new FileReader();
              reader.onload = function(event) {
                  const content = event.target?.result as string;
                  mergedContent += content + (index < fileList.length - 1 ? '\n' : '');
                  filesProcessed++;

                  // Check if all files have been processed
                  if (filesProcessed === fileList.length) {
                      console.log(mergedContent); // This is where you get the merged file content

                      // Save the merged content to Zustand store
                      setRelevantObjects(mergedContent);
                  }
              };
              reader.readAsText(file);
          });
      } else {
          console.error('No files selected');
      }
  };

  const handleNext2 = async () => {
    if (schema === "") {
      try {
        const response = await axios.post('http://localhost:8000/generate-schema/', {
          controller_content: controllerFile,
          class_content: relevantObjects,
        });
        console.log(">>>>hello", response.data);
        setSchema(response.data);
        
      } catch (error) {
        console.error('Error generating schema:', error);
      }
    }
    handleNext();
  };


  return (
    <Box className="import-schema-page">
      <Typography variant="h6">Option 1: Upload Controller files and Relevant Files</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange2(e, setValue)} />
        </Button>
        {controllerFiles1 && <Typography variant="body2" className="file-name">{controllerFiles1[0].name}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Relevant Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden multiple onChange={(e) => handleFileChange2(e, setValue2)} />
        </Button>
        {relevantFiles && <Typography variant="body2" className="file-name">{relevantFiles[0].name}</Typography>}
      </Box>
      <Typography variant="h6">Option 2: Upload Controller files and Schema</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange2(e, setValue)} />
        </Button>
        {controllerFiles2 && <Typography variant="body2" className="file-name">{controllerFiles2[0].name}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Schema Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange2(e, setValue3)} />
        </Button>
        {schemaFiles && <Typography variant="body2" className="file-name">{schemaFiles[0].name}</Typography>}
      </Box>
      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={handleNext2}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ImportSchemaPage;