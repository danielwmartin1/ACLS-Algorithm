import { useState } from 'react';
import './App.css';
import './buttons.css';
import './index.css';
import Modal from './Modal';
import { aclsSteps } from './constants';
import PropTypes from 'prop-types';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [medicationCycle, setMedicationCycle] = useState({
    epinephrine: 0,
    amiodarone: 0,
    lidocaine: 0,
    atropine: 0,
    adenosine: 0,
    rateControl: 0,
  });
  const [modalMessage, setModalMessage] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [medicationMessage, setMedicationMessage] = useState(null);
  const [showRhythmCheck, setShowRhythmCheck] = useState(false);
  const [shockCycle, setShockCycle] = useState(0);

  const handleOptionClick = (nextStep) => {
    if ([3, 4, 5, 8, 9, 10, 11, 12].includes(nextStep)) {
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
    const medicationName = getMedicationName(step);
    setMedicationMessage(`${medicationName} given`);
    updateMedicationCycle(step);
    setPendingAction(null);
    setTimeout(() => {
      setMedicationMessage(null);
      setShowRhythmCheck(true);
      setTimeout(() => {
        setShowRhythmCheck(false);
        proceedToNextStep(2);
      }, 2000);
    }, 2000);
  };

  const handleDeliverShock = () => {
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
          setCountdown(3);
          setShockCycle(shockCycle + 1);
          proceedToNextStep(2);
        }, 2000);
      }
    }, 1000);
  };

  const updateMedicationCycle = (step) => {
    const newCycle = { ...medicationCycle };
    switch (step) {
      case 4:
        newCycle.epinephrine = incrementCycle(newCycle.epinephrine, 10, 'Epinephrine');
        break;
      case 5:
        newCycle.amiodarone = incrementCycle(newCycle.amiodarone, 2, 'Amiodarone');
        newCycle.lidocaine = incrementCycle(newCycle.lidocaine, 3, 'Lidocaine');
        break;
      case 8:
        newCycle.atropine = incrementCycle(newCycle.atropine, 3, 'Atropine');
        break;
      case 9:
        newCycle.adenosine = incrementCycle(newCycle.adenosine, 3, 'Adenosine');
        break;
      case 11:
      case 12:
        newCycle.rateControl = incrementCycle(newCycle.rateControl, 3, 'Beta-blockers/Calcium-channel blockers');
        break;
      default:
        break;
    }
    setMedicationCycle(newCycle);
  };

  const incrementCycle = (currentValue, maxValue, medicationName) => {
    if (currentValue < maxValue) {
      return currentValue + 1;
    } else {
      setModalMessage(`Maximum ${medicationName} dosage reached`);
      return currentValue;
    }
  };

  const getMedicationName = (step) => {
    switch (step) {
      case 4: return 'Epinephrine';
      case 5: return 'Amiodarone';
      case 8: return 'Atropine';
      case 9: return 'Adenosine';
      case 11: 
      case 12: return 'Beta-blockers or Calcium-channel blockers';
      default: return 'Medication';
    }
  };

  return (
    <div className="App">
      <main className="App-header">
        <StepDisplay currentStep={currentStep} handleOptionClick={handleOptionClick} />
        {pendingAction && (
          <ActionButtons
            pendingAction={pendingAction}
            handleAdministerMedication={handleAdministerMedication}
            handleDeliverShock={handleDeliverShock}
          />
        )}
        {showCountdown && <CountdownDisplay countdown={countdown} />}
        {medicationMessage && <MessageDisplay message={medicationMessage} />}
        {showRhythmCheck && <MessageDisplay message="Check rhythm" />}
        <MedicationTracker medicationCycle={medicationCycle} shockCycle={shockCycle} />
      </main>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
    </div>
  );
}

const StepDisplay = ({ currentStep, handleOptionClick }) => (
  <div className="step-container">
    <h2 className="aclsStep">{aclsSteps[currentStep].step}</h2>
    {aclsSteps[currentStep].details && <p>{aclsSteps[currentStep].details}</p>}
    <div className="options">
      {aclsSteps[currentStep].options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option.nextStep)}
          className={getButtonClass(option.text)}
        >
          {option.text}
        </button>
      ))}
    </div>
  </div>
);

const getButtonClass = (text) => {
  if (text.includes('unresponsive')) return 'unresponsive';
  if (text.includes('responsive')) return 'responsive';
  if (text.includes('No pulse')) return 'no-pulse';
  if (text.includes('Pulse detected but abnormal breathing')) return 'abnormal-breathing';
  if (text.includes('Pulse detected and normal breathing')) return 'normal-breathing';
  if (text.includes('Patient regains pulse')) return 'regains-pulse';
  if (text.includes('No improvement')) return 'no-improvement';
  if (text.includes('Shockable rhythm (VF/pVT)')) return 'shockable-rhythm';
  if (text.includes('Non-shockable rhythm (Asystole/PEA)')) return 'non-shockable-rhythm';
  if (text.includes('Narrow-Complex Tachycardia')) return 'narrow-complex-tachycardia';
  if (text.includes('Wide-Complex Tachycardia')) return 'wide-complex-tachycardia';
  if (text.includes('Atrial Fibrillation')) return 'atrial-fibrillation';
  if (text.includes('Atrial Flutter')) return 'atrial-flutter';
  if (text.includes('Bradycardia with a Pulse')) return 'bradycardia';
  if (text.includes('Normal Sinus Rhythm')) return 'normal-sinus-rhythm';
  return '';
};

const ActionButtons = ({ pendingAction, handleAdministerMedication, handleDeliverShock }) => (
  <div className="action-buttons">
    {pendingAction !== 3 && pendingAction !== 5 && (
      <button onClick={() => handleAdministerMedication(pendingAction)} className="administer-medication">
        Administer Medication
      </button>
    )}
    {(pendingAction === 3 || pendingAction === 5) && (
      <button onClick={() => handleDeliverShock(pendingAction)} className="deliver-shock">
        Deliver Shock
      </button>
    )}
  </div>
);

ActionButtons.propTypes = {
  pendingAction: PropTypes.number.isRequired,
  handleAdministerMedication: PropTypes.func.isRequired,
  handleDeliverShock: PropTypes.func.isRequired,
};

const CountdownDisplay = ({ countdown }) => (
  <div className="countdown-popup">
    <h2>{countdown > 0 ? countdown : 'Clear!'}</h2>
  </div>
);

CountdownDisplay.propTypes = {
  countdown: PropTypes.number.isRequired,
};

const MessageDisplay = ({ message }) => (
  <div className="countdown-popup">
    <h2>{message}</h2>
  </div>
);

MessageDisplay.propTypes = {
  message: PropTypes.string.isRequired,
};

const MedicationTracker = ({ medicationCycle, shockCycle }) => (
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
);

StepDisplay.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleOptionClick: PropTypes.func.isRequired,
};


MedicationTracker.propTypes = {
  medicationCycle: PropTypes.shape({
    epinephrine: PropTypes.number,
    amiodarone: PropTypes.number,
    lidocaine: PropTypes.number,
    atropine: PropTypes.number,
    adenosine: PropTypes.number,
    rateControl: PropTypes.number,
  }).isRequired,
  shockCycle: PropTypes.number.isRequired,
};

export default App;