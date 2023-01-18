import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ayy', () => {
  render(<App />);
  const ayylement = screen.getByText(/ayy/i);
  expect(ayylement).toBeInTheDocument();
});
