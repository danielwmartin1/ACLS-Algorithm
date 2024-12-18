import { useState } from 'react'
import './App.css'

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
      { text: 'Non-shockable rhythm (Asystole/PEA)', nextStep: 4 },
      { text: 'Bradycardia with a Pulse', nextStep: 8 },
      { text: 'Tachycardia with a Pulse', nextStep: 9 },
      { text: 'SVT (Supraventricular Tachycardia)', nextStep: 10 },
      { text: 'A-fib (Atrial Fibrillation)', nextStep: 11 },
      { text: 'VT (Ventricular Tachycardia)', nextStep: 12 },
      { text: 'VF (Ventricular Fibrillation)', nextStep: 13 },
      { text: 'Asystole', nextStep: 14 },
      { text: 'PEA (Pulseless Electrical Activity)', nextStep: 15 },
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
    step: 'Tachycardia with a Pulse',
    details: 'Narrow complex: Adenosine 6 mg IV push, then 12 mg if needed (max 18 mg). Wide complex: Amiodarone 150 mg IV over 10 minutes or Lidocaine. Alternate medications as required.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'SVT (Supraventricular Tachycardia)',
    details: 'Adenosine 6 mg IV push, then 12 mg if needed (max 18 mg).',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'A-fib (Atrial Fibrillation)',
    details: 'Rate control with beta-blockers or calcium channel blockers.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'VT (Ventricular Tachycardia)',
    details: 'Amiodarone 150 mg IV over 10 minutes or Lidocaine.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'VF (Ventricular Fibrillation)',
    details: 'Defibrillation and CPR.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Asystole',
    details: 'CPR and Epinephrine 1 mg IV/IO every 3–5 minutes.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'PEA (Pulseless Electrical Activity)',
    details: 'CPR and Epinephrine 1 mg IV/IO every 3–5 minutes.',
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
  });

  const handleOptionClick = (nextStep) => {
    if (nextStep === 5 || nextStep === 4) {
      updateMedicationCycle(nextStep);
    }

    if (nextStep !== null) {
      setCurrentStep(nextStep);
    } else {
      alert('Algorithm completed!');
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
      if (newCycle.amiodarone < 2) {
        newCycle.amiodarone += 1;
      } else if (newCycle.lidocaine < 3) {
        newCycle.lidocaine += 1;
      } else {
        alert('Maximum doses of Amiodarone and Lidocaine reached!');
        return;
      }
    } else if (step === 4) {
      if (newCycle.epinephrine < 10) {
        newCycle.epinephrine += 1;
      } else {
        alert('Maximum dose of Epinephrine reached!');
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
          <p>Amiodarone: {medicationCycle.amiodarone}</p>
          <p>Lidocaine: {medicationCycle.lidocaine}</p>
          <p>Atropine: {medicationCycle.atropine}</p>
          <p>Adenosine: {medicationCycle.adenosine}</p>
        </div>
      </header>
    </div>
  );
}

export default App;