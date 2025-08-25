import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pharmacy app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Pharmacy Data Discrepancy Analysis/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders file upload component', () => {
  render(<App />);
  const uploadElement = screen.getByText(/Upload Pharmacy Invoice/i);
  expect(uploadElement).toBeInTheDocument();
});
