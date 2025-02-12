import React from 'react';
import { useState } from 'react';
import './App.css';
import './index.css';
import Modal from './Modal';
import { aclsSteps } from './constants';



function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [medicationCycle, setMedicationCycle] = useState({
    epinephrine: 0,
    amiodarone: 0,
    lidocaine: 0,
    atropine: 0,
    adenosine: 0,
    rateControl: 0, // Combined cycle for beta-blockers and calcium-channel blockers
  });
  const [modalMessage, setModalMessage] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [medicationMessage, setMedicationMessage] = useState(null);
  const [showRhythmCheck, setShowRhythmCheck] = useState(false);
  const [shockCycle, setShockCycle] = useState(0);

  const handleOptionClick = (nextStep) => {
    if (nextStep === 5 || nextStep === 4 || nextStep === 8 || nextStep === 9 || nextStep === 10 || nextStep === 3 || nextStep === 11 || nextStep === 12) {
      setPendingAction(nextStep);
    } else {
      proceedToNextStep(nextStep);
    }
  };

  const proceedToNextStep = (nextStep) => {
    if (nextStep !== null) {
      setCurrentStep(nextStep);
    } else {
      setModalMessage('End of Algorithm');
    }
  };

  const handleAdministerMedication = (step) => {
    const medicationDetails = aclsSteps[step]?.details || 'Medication given';
    let medicationName;
    if (step === 11 || step === 12) {
      medicationName = 'Beta-blockers or Calcium-channel blockers';
    } else {
      medicationName = medicationDetails.split(':')[0].split(' ')[0]; // Extract the medication name from the details
    }
    setMedicationMessage(`${medicationName} given`);
    updateMedicationCycle(step);
    setPendingAction(null);
    setTimeout(() => {
      setMedicationMessage(null);
      setShowRhythmCheck(true);
      setTimeout(() => {
        setShowRhythmCheck(false);
        proceedToNextStep(2); // Reset to picking the rhythm
      }, 2000); // Show the rhythm check message for 2 seconds
    }, 2000); // Show the medication message for 2 seconds
  };

  const handleDeliverShock = (_step) => {
    setShowCountdown(true);
    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
      setCountdown(countdownValue);
      countdownValue -= 1;
      if (countdownValue < 0) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          setShowCountdown(false);
          setPendingAction(null);
          setCountdown(3); // Reset countdown state
          setShockCycle(shockCycle + 1); // Increment shock cycle
          proceedToNextStep(2); // Reset to picking the rhythm
        }, 2000); // Additional 2 seconds to make the total duration 5 seconds
      }
    }, 1000);
  };

  const updateMedicationCycle = (step) => {
    const newCycle = { ...medicationCycle };
    switch (step) {
      case 4:
        if (newCycle.epinephrine < 10) {
          newCycle.epinephrine += 1;
        } else {
          setModalMessage('Maximum Epinephrine dosage reached');
        }
        break;
      case 5:
        if (newCycle.amiodarone < 2) {
          newCycle.amiodarone += 1;
        } else if (newCycle.lidocaine < 3) {
          newCycle.lidocaine += 1;
        } else {
          setModalMessage('Maximum Amiodarone/Lidocaine dosage reached');
        }
        break;
      case 8:
        if (newCycle.atropine < 3) {
          newCycle.atropine += 1;
        } else {
          setModalMessage('Maximum Atropine dosage reached');
        }
        break;
      case 9:
        if (newCycle.adenosine < 3) {
          newCycle.adenosine += 1;
        } else {
          setModalMessage('Maximum Adenosine dosage reached');
        }
        break;
      case 11:
      case 12:
        if (newCycle.rateControl < 3) {
          newCycle.rateControl += 1;
        } else {
          setModalMessage('Maximum Beta-blockers/Calcium-channel blockers dosage reached');
        }
        break;
      default:
        break;
    }
    setMedicationCycle(newCycle);
  };

  return (
    <div className="App">
      <main className="App-header">
        <div className="step-container">
          <h2 className="aclsStep">{aclsSteps[currentStep].step}</h2>
          {aclsSteps[currentStep].details && <p>{aclsSteps[currentStep].details}</p>}
          <div className="options">
            {aclsSteps[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.nextStep)}
                className={
                  option.text.includes('unresponsive') ? 'unresponsive' :
                  option.text.includes('responsive') ? 'responsive' :
                  option.text.includes('No pulse') ? 'no-pulse' :
                  option.text.includes('Pulse detected but abnormal breathing') ? 'abnormal-breathing' :
                  option.text.includes('Pulse detected and normal breathing') ? 'normal-breathing' :
                  option.text.includes('Patient regains pulse') ? 'regains-pulse' :
                  option.text.includes('No improvement') ? 'no-improvement' : ''
                }
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
        {pendingAction && (
          <div className="action-buttons">
            <button onClick={() => handleAdministerMedication(pendingAction)}>Administer Medication</button>
            {(pendingAction === 3 || pendingAction === 5) && (
              <button onClick={() => handleDeliverShock(pendingAction)}>Deliver Shock</button>
            )}
          </div>
        )}
        {showCountdown && (
          <div className="countdown-popup">
            <h2>{countdown > 0 ? countdown : 'Clear!'}</h2>
          </div>
        )}
        {medicationMessage && (
          <div className="countdown-popup">
            <h2>{medicationMessage}</h2>
          </div>
        )}
        {showRhythmCheck && (
          <div className="countdown-popup">
            <h2>Check rhythm</h2>
          </div>
        )}
        <div className="medication-tracker">
          <h3 className="medCycle">Medication Cycle</h3>
          <p>Epinephrine: {medicationCycle.epinephrine}</p>
          <p>Amiodarone: {medicationCycle.amiodarone}</p>
          <p>Lidocaine: {medicationCycle.lidocaine}</p>
          <p>Atropine: {medicationCycle.atropine}</p>
          <p>Adenosine: {medicationCycle.adenosine}</p>
          <p>Rate Control (Beta-blockers/Calcium-channel blockers): {medicationCycle.rateControl}</p>
          <h3 className="shockCycle">Shock Cycle</h3>
          <p className="shockCycleAmount">{shockCycle}</p>
        </div>
      </main>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
    </div>
  );
}

export default App;