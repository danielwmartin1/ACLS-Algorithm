import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import App, { aclsSteps } from './App';

describe('ACLS Steps', () => {
  test('aclsSteps is defined', () => {
    expect(aclsSteps).toBeDefined();
  });

  test('aclsSteps has the correct structure', () => {
    aclsSteps.forEach((step) => {
      expect(step).toHaveProperty('step');
      expect(step).toHaveProperty('options');
      expect(Array.isArray(step.options)).toBe(true);
      if (step.details) {
        expect(step).toHaveProperty('details');
      }
    });
  });

  test('each option in aclsSteps has the correct structure', () => {
    aclsSteps.forEach((step) => {
      step.options.forEach((option) => {
        expect(option).toHaveProperty('text');
        expect(option).toHaveProperty('nextStep');
      });
    });
  });
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    const linkElement = screen.getByText(/Interactive ACLS Algorithm/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders initial step', () => {
    render(<App />);
    const initialStep = screen.getByText(aclsSteps[0].step);
    expect(initialStep).toBeInTheDocument();
  });

  test('renders options for initial step', () => {
    render(<App />);
    aclsSteps[0].options.forEach((option) => {
      const optionElement = screen.getByText(option.text);
      expect(optionElement).toBeInTheDocument();
    });
  });

  test('handles option click and updates step', () => {
    render(<App />);
    const optionElement = screen.getByText(aclsSteps[0].options[0].text);
    fireEvent.click(optionElement);
    const nextStep = screen.getByText(aclsSteps[1].step);
    expect(nextStep).toBeInTheDocument();
  });

  test('displays modal message when algorithm is completed', () => {
    render(<App />);
    const optionElement = screen.getByText(aclsSteps[0].options[1].text);
    fireEvent.click(optionElement);
    const modalMessage = screen.getByText(/Algorithm completed!/i);
    expect(modalMessage).toBeInTheDocument();
  });

  test('updates medication cycle correctly', () => {
    render(<App />);
    const initialStepButton = screen.getByText(aclsSteps[0].options[0].text);
    fireEvent.click(initialStepButton);
    const nextStepButton = screen.getByText(aclsSteps[1].options[0].text);
    fireEvent.click(nextStepButton);
    const nextStep = screen.getByText(aclsSteps[2].step);
    expect(nextStep).toBeInTheDocument();
  });
});
test('updates medication cycle correctly for Bradycardia with a Pulse', () => {
  render(<App />);
  
  // Navigate to Bradycardia with a Pulse step
  fireEvent.click(screen.getByText(aclsSteps[0].options[0].text)); // Assess the Patient -> Patient is unresponsive
  fireEvent.click(screen.getByText(aclsSteps[1].options[0].text)); // Activate Emergency Response & Check Pulse -> No pulse
  fireEvent.click(screen.getByText(aclsSteps[2].options[2].text)); // Start CPR and Attach Defibrillator -> Bradycardia with a Pulse

  // Check if the Bradycardia with a Pulse step is displayed
  expect(screen.getByText(aclsSteps[8].step)).toBeInTheDocument();

  // Click on the option to simulate medication administration
  fireEvent.click(screen.getByText(aclsSteps[8].options[0].text)); // Bradycardia with a Pulse -> Improvement noted

  // Check if the medication cycle is updated correctly
  expect(screen.getByText(/Atropine: 1/)).toBeInTheDocument();

  // Simulate reaching the maximum dose of Atropine
  for (let i = 0; i < 2; i++) {
    fireEvent.click(screen.getByText(aclsSteps[8].options[0].text)); // Bradycardia with a Pulse -> Improvement noted
  }

  // Check if the maximum dose of Atropine is reached
  expect(screen.getByText(/Atropine: 3/)).toBeInTheDocument();

  // Check if the modal message is displayed when the maximum dose is reached
  fireEvent.click(screen.getByText(aclsSteps[8].options[0].text)); // Bradycardia with a Pulse -> Improvement noted
  expect(screen.getByText(/Maximum dose of Atropine reached!/)).toBeInTheDocument();
});