import React from 'react';
import { useState } from 'react';
import './App.css';
import Modal from './Modal';

export const aclsSteps = [
  {
    step: 'Assess the Patient',
    options: [
      { text: 'Patient is unresponsive', nextStep: 1 },
      { text: 'Patient is responsive', nextStep: null },
    ],
  },
  {
    step: 'Activate Emergency Response & Check Pulse',
    options: [
      { text: 'No pulse', nextStep: 2 },
      { text: 'Pulse detected but abnormal breathing', nextStep: 6 },
      { text: 'Pulse detected and normal breathing', nextStep: null },
    ],
  },
  {
    step: 'Start CPR and Attach Defibrillator',
    options: [
      { text: 'Shockable rhythm (VF/pVT)', nextStep: 3 },
      { text: 'Non-shockable rhythm (Asystole/PEA)', nextStep: 4 },
      { text: 'Bradycardia with a Pulse', nextStep: 8 },
      { text: 'Narrow-Complex Tachycardia', nextStep: 9 },
      { text: 'Wide-Complex Tachycardia', nextStep: 10 },
      { text: 'Atrial Fibrillation', nextStep: 11 },
      { text: 'Atrial Flutter', nextStep: 12 },
    ],
  },
  {
    step: 'Deliver Shock and Continue CPR',
    options: [
      { text: 'Rhythm improves', nextStep: null },
      { text: 'No improvement', nextStep: 5 },
    ],
  },
  {
    step: 'Continue CPR and Administer Epinephrine',
    details: 'Epinephrine 1 mg IV/IO every 3–5 minutes. No maximum number of doses.',
    options: [
      { text: 'Rhythm changes to shockable', nextStep: 3 },
      { text: 'Rhythm remains non-shockable', nextStep: 7 },
    ],
  },
  {
    step: 'Administer Amiodarone or Lidocaine for Shockable Rhythm',
    details: 'Amiodarone: 300 mg IV/IO first dose, then 150 mg IV/IO (max 450 mg). Lidocaine: 1–1.5 mg/kg IV/IO, then 0.5–0.75 mg/kg IV/IO every 5–10 minutes (max 3 mg/kg). Alternate these medications as necessary.',
    options: [
      { text: 'Rhythm improves', nextStep: null },
      { text: 'Rhythm remains shockable', nextStep: 3 },
    ],
  },
  {
    step: 'Consider Advanced Airway and Reassess',
    details: 'Consider advanced airway placement and reassess rhythm.',
    options: [
      { text: 'Patient regains pulse', nextStep: null },
      { text: 'No improvement', nextStep: 2 },
    ],
  },
  {
    step: 'Provide Rescue Breathing',
    details: 'Provide 1 breath every 6 seconds.',
    options: [
      { text: 'Patient improves', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Bradycardia with a Pulse',
    details: 'Atropine: 1 mg IV every 3–5 minutes (max 3 mg). Consider Epinephrine or Dopamine infusion.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Narrow-Complex Tachycardia',
    details: 'Adenosine 6 mg IV push, then 12 mg if needed (max 18 mg).',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Wide-Complex Tachycardia',
    details: 'Amiodarone 150 mg IV over 10 minutes or Lidocaine. Alternate medications as required.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Atrial Fibrillation',
    details: 'Rate control with beta-blockers or calcium channel blockers. Consider anticoagulation.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Atrial Flutter',
    details: 'Rate control with beta-blockers or calcium channel blockers. Consider anticoagulation.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
];

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

  const handleDeliverShock = (step) => {
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
        <h1 className='aclsHeader'>Interactive ACLS Algorithm</h1>
        <div className="step-container">
          <h2 className="aclsStep">{aclsSteps[currentStep].step}</h2>
          {aclsSteps[currentStep].details && <p>{aclsSteps[currentStep].details}</p>}
          <div className="options">
            {aclsSteps[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.nextStep)}
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
          <h3>Medication Cycle</h3>
          <p>Epinephrine: {medicationCycle.epinephrine}</p>
          <p>Amiodarone: {medicationCycle.amiodarone}</p>
          <p>Lidocaine: {medicationCycle.lidocaine}</p>
          <p>Atropine: {medicationCycle.atropine}</p>
          <p>Adenosine: {medicationCycle.adenosine}</p>
          <p>Rate Control (Beta-blockers/Calcium-channel blockers): {medicationCycle.rateControl}</p>
          <h3>Shock Cycle</h3>
          <p>{shockCycle}</p>
        </div>
      </main>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
    </div>
  );
}

export default App;