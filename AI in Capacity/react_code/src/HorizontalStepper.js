import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UserForm from './UserForm'
import ResourceList from './ResourceList';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
    return ['Enter Details', 'Match Criteria','Eligible Resources'];
}





export default function HorizontalStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [UID, setUID] = React.useState("");
  const [pageId, setPageId] = React.useState("userForm");
  const steps = getSteps();

  const getStepContent= (stepIndex,pageId)=> {
    if (UID!== ""){
      stepIndex =2
    }
    switch (stepIndex) {
          case 0:
            return <UserForm parentPageId={pageId}/>
          case 1:
            return <UserForm parentPageId={pageId} getUniqueID={uniqueIDforresponseAPI}/>
          case 2:
            return <ResourceList ResponseUniqueID={UID}/>
          default:
            return 'Unknown step';
    }
  }
  
   const uniqueIDforresponseAPI=(resUniqueID)=>{
    setUID(resUniqueID);
  }

  const handleNext = () => {
    if (activeStep===0){
           setPageId("matchCriteria");
    }
    if (activeStep===1){
      setPageId("ResourceList");
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep===0){
      setPageId("matchCriteria");
  }else{
    setPageId("userForm");
  }

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
 };
  

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography variant="inherit" className={classes.instructions}>{getStepContent(activeStep,pageId)}</Typography>
            <div align="center">
              <Button
                disabled={activeStep === 0 && pageId === "userForm"}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              {activeStep===steps.length-1 ? <div></div> :
              <Button variant="contained" color="primary" onClick={handleNext}>
                 Next
              </Button>}
              
            </div>
          </div>
        )}
      </div>
    </div>
  )}; 