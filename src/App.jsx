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
    details: 'Epinephrine 1 mg IV/IO every 3–5 minutes.',
    options: [
      { text: 'Rhythm changes to shockable', nextStep: 3 },
      { text: 'Rhythm remains non-shockable', nextStep: 7 },
    ],
  },
  {
    step: 'Administer Amiodarone or Lidocaine for Shockable Rhythm',
    details: 'Amiodarone 300 mg IV/IO first dose, then 150 mg IV/IO. Alternatively, Lidocaine 1–1.5 mg/kg IV/IO.',
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
    details: 'Atropine 1 mg IV every 3–5 minutes (max 3 mg). Consider Epinephrine or Dopamine infusion.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Tachycardia with a Pulse',
    details: 'If narrow complex, administer Adenosine 6 mg rapid IV push. If wide complex, consider Amiodarone 150 mg IV over 10 minutes or Lidocaine.',
    options: [
      { text: 'Improvement noted', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleOptionClick = (nextStep) => {
    if (nextStep !== null) {
      setCurrentStep(nextStep);
    } else {
      alert('Algorithm completed!');
      setCurrentStep(0);
    }
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
      </header>
    </div>
  );
}

export default App;