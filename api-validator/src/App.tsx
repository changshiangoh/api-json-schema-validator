import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import './App.scss';
import ImportSchemaPage from './pages/ImportSchemaPage';
import ValidateRequestPage from './pages/ValidateRequestPage';

const steps = ['Import Schema', 'Validate Request'];

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box className="app-container">
      <Box className="stepper-container">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="page-container">
        {activeStep === 0 ? (
          <ImportSchemaPage handleNext={handleNext} />
        ) : (
          <ValidateRequestPage handleBack={handleBack} />
        )}
      </Box>
    </Box>
  );
};

export default App;