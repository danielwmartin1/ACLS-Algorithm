import { useState } from 'react'
import './App.css'
import Modal from './Modal';

const aclsSteps = [
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
      { text: 'Non-shockable rhythm (Asystole/PEA)', nextStep: 4 }, // spell-checker: disable-line
      { text: 'Bradycardia with a Pulse', nextStep: 8 },
      { text: 'Tachycardia with a Pulse', nextStep: 9 },
      { text: 'Atrial Fibrillation', nextStep: 10 },
      { text: 'Atrial Flutter', nextStep: 11 },
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
    step: 'Administer Amiodarone or Lidocaine for Shockable Rhythm', // spell-checker: disable-line
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
    step: 'Tachycardia with a Pulse',
    details: 'Narrow complex: Adenosine 6 mg IV push, then 12 mg if needed (max 18 mg). Wide complex: Amiodarone 150 mg IV over 10 minutes or Lidocaine. Alternate medications as required.', // spell-checker: disable-line
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Atrial Fibrillation',
    details: 'Rate control with beta-blockers or calcium channel blockers. Consider anticoagulation.', // spell-checker: disable-line
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
    amiodarone: 0, // spell-checker: disable-line
    lidocaine: 0,
    atropine: 0,
    adenosine: 0,
  });
  const [modalMessage, setModalMessage] = useState(null);

  const handleOptionClick = (nextStep) => {
    if (nextStep === 5 || nextStep === 4) {
      updateMedicationCycle(nextStep);
    }

    if (nextStep !== null) {
      setCurrentStep(nextStep);
    } else {
      setModalMessage('Algorithm completed!');
      setCurrentStep(0);
      setMedicationCycle({
        epinephrine: 0,
        amiodarone: 0,
        lidocaine: 0,
        atropine: 0,
        adenosine: 0,
      });
    }
  };

  const updateMedicationCycle = (step) => {
    const newCycle = { ...medicationCycle };
    if (step === 5) {
      if (newCycle.amiodarone < 2) { // spell-checker: disable-line
        newCycle.amiodarone += 1; // spell-checker: disable-line
      } else if (newCycle.lidocaine < 3) {
        newCycle.lidocaine += 1;
      } else {
        setModalMessage('Maximum doses of Amiodarone and Lidocaine reached!'); // spell-checker: disable-line
        return;
      }
    } else if (step === 4) {
      if (newCycle.epinephrine < 10) {
        newCycle.epinephrine += 1;
      } else {
        setModalMessage('Maximum dose of Epinephrine reached!');
        return;
      }
    }
    setMedicationCycle(newCycle);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive ACLS Algorithm</h1>
        <div className="step-container">
          <h2>{aclsSteps[currentStep].step}</h2>
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
        <div className="medication-tracker">
          <h3>Medication Cycle</h3>
          <p>Epinephrine: {medicationCycle.epinephrine}</p>
          <p>Amiodarone: {medicationCycle.amiodarone} {/* spell-checker: disable-line */}</p>
          <p>Lidocaine: {medicationCycle.lidocaine}</p>
          <p>Atropine: {medicationCycle.atropine}</p>
          <p>Adenosine: {medicationCycle.adenosine}</p>
        </div>
      </header>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
    </div>
  );
}

export default App;
