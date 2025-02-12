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
      { text: 'Narrow-Complex Tachycardia', nextStep: 9 },
      { text: 'Wide-Complex Tachycardia', nextStep: 10 },
      { text: 'Atrial Fibrillation', nextStep: 11 },
      { text: 'Atrial Flutter', nextStep: 12 },
      { text: 'Bradycardia with a Pulse', nextStep: 8 },
      { text: 'Normal Sinus Rhythm', nextStep: 13 },
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
  {
    step: 'Normal Sinus Rhythm',
    details: 'The patient has returned to a normal sinus rhythm.',
    options: [
      { text: 'Restart Algorithm', nextStep: 0 },
    ],
  },
];