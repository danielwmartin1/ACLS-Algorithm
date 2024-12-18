import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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