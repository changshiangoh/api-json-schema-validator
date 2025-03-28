import React, { useState } from 'react';
import { Button, Box, Typography, Select, MenuItem, TextField } from '@mui/material';
import './ImportSchemaPage.scss';
import useFileStore from '../zustand/FileStore';
import axios from 'axios';

interface ImportSchemaPageProps {
  handleNext: () => void;
}

const ImportSchemaPage: React.FC<ImportSchemaPageProps> = ({ handleNext }) => {
  const [selected, setSelected] = useState('');
  
  const { controllerFileName, relevantObjectsName, schemaFileName, schemaFile, controllerFile, relevantObjects, setControllerFile, setRelevantObjects, setSchemaFile, setControllerFileName, setRelevantObjectsName, setSchemaFileName } = useFileStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file : FileList | null) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files);
    }
  };

  const setController = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target?.result as string;
            setControllerFile(content);
            setControllerFileName(file.name);
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
  }

  const setSchema = (fileList: FileList | null) => {
    setRelevantObjects("");
    const file = fileList?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target?.result as string;
            try {
              setSchemaFile(JSON.parse(content));
              setSchemaFileName(file.name);
            } catch {
              console.log("schema not in valid JSON format")
            }     
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
  }

  const setRelevantObject = (fileList: FileList | null) => {
    setSchemaFile("")
      if (fileList) {
          let mergedContent = '';
          let fileName = '';
          let filesProcessed = 0;

          Array.from(fileList).forEach((file, index) => {
              const reader = new FileReader();
              reader.onload = function(event) {
                  const content = event.target?.result as string;
                  mergedContent += content + (index < fileList.length - 1 ? '\n' : '');
                  fileName += file.name + ",";
                  filesProcessed++;

                  if (filesProcessed === fileList.length) {
                      setRelevantObjects(mergedContent);
                      setRelevantObjectsName(fileName.slice(0, fileName.length-1));
                  }
              };
              reader.readAsText(file);
          });
      } else {
          console.error('No files selected');
      }
  };

  const onNextClicked = async () => {
    const element1 = document.getElementById("input-data-1")?.querySelector('input') as HTMLInputElement;
    if (relevantObjects !== "") {
      try {
        const response = await axios.post('http://localhost:8000/generate-schema/', {
          controller_content: controllerFile,
          class_content: relevantObjects,
          url: element1.value,
          request_type: selected
        });
        setSchemaFile(response.data);
        setSchemaFileName("Schema.json")
        
      } catch (error) {
        console.error('Error generating schema:', error);
      }
    }
    handleNext();
  };

  const handleChange = (event: any) => {
    setSchemaFile("")
    setSelected(event.target.value);
    console.log('Selected option:', event.target.value);
  };


  return (
    <Box className="import-schema-page">
      <div className="validate-request-field"> 
        <Select
            className='text-field'
            value={selected}
            onChange={handleChange}
            displayEmpty
        >
            <MenuItem value="" disabled>
                <em>Select method type</em>
            </MenuItem>
            <MenuItem value="Post">Post</MenuItem>
            <MenuItem value="Put">Put</MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
        </Select>
      </div>
        
      <div id={"input-data-1"} className="validate-request-field"> 
        <TextField
          label="API URL"
          variant="outlined"
          className="text-field"
        />
      </div>

      <Typography variant="h6">Option 1: Upload Controller file and Relevant Files</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller File</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setController)} />
        </Button>
        {controllerFileName && <Typography variant="body2" className="file-name">{controllerFileName}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Relevant Files</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden multiple onChange={(e) => handleFileChange(e, setRelevantObject)} />
        </Button>
        {relevantObjectsName && <Typography variant="body2" className="file-name">{relevantObjectsName}</Typography>}
      </Box>
      <Typography variant="h6">Option 2: Upload Controller file and Schema</Typography>
      <Box className="upload-container">
        <Typography variant="body1">Controller File</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setController)} />
        </Button>
        {controllerFileName && <Typography variant="body2" className="file-name">{controllerFileName}</Typography>}
      </Box>
      <Box className="upload-container">
        <Typography variant="body1">Schema</Typography>
        <Button variant="contained" component="label">
          Upload
          <input type="file" hidden onChange={(e) => handleFileChange(e, setSchema)} />
        </Button>
        {schemaFileName && <Typography variant="body2" className="file-name">{schemaFileName}</Typography>}
      </Box>
      <Box className="button-container">
        <Button variant="contained" color="primary" onClick={onNextClicked}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ImportSchemaPage;