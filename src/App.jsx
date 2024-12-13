import { useState } from 'react'
import './App.css'

const aclsSteps = [
  {
    step: 'Check Responsiveness',
    options: [
      { text: 'Patient is unresponsive', nextStep: 1 },
      { text: 'Patient is responsive', nextStep: null },
    ],
  },
  {
    step: 'Call for Help & Check Pulse',
    options: [
      { text: 'No pulse', nextStep: 2 },
      { text: 'Pulse detected', nextStep: 3 },
    ],
  },
  {
    step: 'Start Chest Compressions and Attach AED',
    options: [
      { text: 'Continue CPR', nextStep: 4 },
      { text: 'AED advises shock', nextStep: 5 },
    ],
  },
  {
    step: 'Administer Epinephrine',
    options: [
      { text: 'Epinephrine given', nextStep: 6 },
      { text: 'Skip Epinephrine', nextStep: 6 },
    ],
  },
  {
    step: 'Monitor and Provide Ventilations',
    options: [
      { text: 'Patient improves', nextStep: null },
      { text: 'Condition worsens', nextStep: 2 },
    ],
  },
  {
    step: 'Continue CPR and Reassess',
    options: [
      { text: 'Patient regains pulse', nextStep: null },
      { text: 'No improvement', nextStep: 7 },
    ],
  },
  {
    step: 'Administer Amiodarone',
    options: [
      { text: 'Amiodarone given', nextStep: 8 },
      { text: 'Skip Amiodarone', nextStep: 8 },
    ],
  },
  {
    step: 'Deliver Shock',
    options: [
      { text: 'Continue CPR after shock', nextStep: 4 },
      { text: 'Patient regains pulse', nextStep: null },
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

export default App
