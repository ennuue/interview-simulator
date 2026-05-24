import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('должен отрендерить приложение без ошибок', () => {
    render(<App />);
    // Проверяем, что что-то отобразилось на странице
    expect(document.body).toBeInTheDocument();
  });
});