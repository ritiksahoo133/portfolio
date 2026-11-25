import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../../App';
import { THEME_STORAGE_KEY } from '../../../theme/theme';

describe('Theme UI & Portfolio Regression', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'light');
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));
  });

  it('renders desktop and mobile theme controls and updates DOM theme attributes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const desktopSwitcher = screen.getByTestId('theme-switcher-desktop');
    expect(desktopSwitcher).toBeInTheDocument();

    const lightBtn = desktopSwitcher.querySelector('[data-theme-option="light"]') as HTMLButtonElement;
    const darkBtn = desktopSwitcher.querySelector('[data-theme-option="dark"]') as HTMLButtonElement;
    const systemBtn = desktopSwitcher.querySelector('[data-theme-option="system"]') as HTMLButtonElement;

    expect(systemBtn).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Switch to Light
    await user.click(lightBtn);
    expect(lightBtn).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    // Switch back to Dark via quick mobile toggle
    const quickToggle = screen.getByTestId('theme-quick-toggle');
    await user.click(quickToggle);
    expect(darkBtn).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('exposes the 3-way theme switcher inside the mobile navigation drawer', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const mobileSwitcher = screen.getByTestId('theme-switcher-mobile');
    expect(mobileSwitcher).toBeInTheDocument();

    const lightOption = mobileSwitcher.querySelector('[data-theme-option="light"]') as HTMLButtonElement;
    await user.click(lightOption);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('preserves core sections, project modal, resume download, and contact details across theme switches', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      render(<App />);

      // Verify all key sections are present
      expect(document.getElementById('home')).toBeInTheDocument();
      expect(document.getElementById('about')).toBeInTheDocument();
      expect(document.getElementById('experience')).toBeInTheDocument();
      expect(document.getElementById('skills')).toBeInTheDocument();
      expect(document.getElementById('projects')).toBeInTheDocument();
      expect(document.getElementById('education')).toBeInTheDocument();
      expect(document.getElementById('contact')).toBeInTheDocument();

      // Switch to Light mode
      const desktopSwitcher = screen.getByTestId('theme-switcher-desktop');
      const lightBtn = desktopSwitcher.querySelector('[data-theme-option="light"]') as HTMLButtonElement;
      await user.click(lightBtn);
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');

      // Open and close a Project Case Breakdown modal in Light mode
      const breakdownButtons = screen.getAllByRole('button', { name: /case breakdown/i });
      await user.click(breakdownButtons[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close project details/i }));

      // Verify resume link and recipient email remain intact
      const resumeLinks = screen.getAllByRole('link', { name: /resume/i });
      expect(resumeLinks.length).toBeGreaterThan(0);
      expect(screen.getAllByText(/ritiksahoo133@gmail\.com/i).length).toBeGreaterThan(0);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
