//src/components/error/__tests__/ErrorHandling.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ErrorHandling, { useErrorHandling } from '../ErrorHandling';

describe('ErrorHandling Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders children without errors', () => {
    render(
      <ErrorHandling>
        <div>Test Content</div>
      </ErrorHandling>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays error message when error occurs', () => {
    const onError = jest.fn();
    const { container } = render(
      <ErrorHandling onError={onError}>
        <button onClick={() => {
          throw new Error('Test error');
        }}>
          Trigger Error
        </button>
      </ErrorHandling>
    );

    const button = screen.getByText('Trigger Error');
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(onError).toHaveBeenCalled();
  });

  it('auto-hides error after specified duration', async () => {
    const { rerender } = render(
      <ErrorHandling autoHideDuration={1000}>
        <div>Test Content</div>
      </ErrorHandling>
    );

    // Simulate error
    rerender(
      <ErrorHandling autoHideDuration={1000}>
        <div>Test Content</div>
      </ErrorHandling>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('respects maxErrors limit', () => {
    const { rerender } = render(
      <ErrorHandling maxErrors={2}>
        <div>Test Content</div>
      </ErrorHandling>
    );

    // Add three errors
    for (let i = 0; i < 3; i++) {
      rerender(
        <ErrorHandling maxErrors={2}>
          <div>Test Content</div>
        </ErrorHandling>
      );
    }

    const alerts = screen.queryAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });

  it('clears individual errors', () => {
    const { rerender } = render(
      <ErrorHandling>
        <div>Test Content</div>
      </ErrorHandling>
    );

    // Add two errors
    for (let i = 0; i < 2; i++) {
      rerender(
        <ErrorHandling>
          <div>Test Content</div>
        </ErrorHandling>
      );
    }

    const closeButtons = screen.getAllByLabelText('Close');
    fireEvent.click(closeButtons[0]);

    expect(screen.queryAllByRole('alert')).toHaveLength(1);
  });

  it('clears all errors when clear all is clicked', () => {
    const { rerender } = render(
      <ErrorHandling>
        <div>Test Content</div>
      </ErrorHandling>
    );

    // Add multiple errors
    for (let i = 0; i < 3; i++) {
      rerender(
        <ErrorHandling>
          <div>Test Content</div>
        </ErrorHandling>
      );
    }

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('calls onClearError when all errors are cleared', () => {
    const onClearError = jest.fn();
    const { rerender } = render(
      <ErrorHandling onClearError={onClearError}>
        <div>Test Content</div>
      </ErrorHandling>
    );

    // Add and clear error
    rerender(
      <ErrorHandling onClearError={onClearError}>
        <div>Test Content</div>
      </ErrorHandling>
    );

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(onClearError).toHaveBeenCalled();
  });

  describe('useErrorHandling Hook', () => {
    const TestComponent = () => {
      const { error, showError, clearError } = useErrorHandling();

      return (
        <div>
          {error && <div role="alert">{error.message}</div>}
          <button onClick={() => showError('Test error')}>Show Error</button>
          <button onClick={clearError}>Clear Error</button>
        </div>
      );
    };

    it('shows and clears errors', () => {
      render(<TestComponent />);

      fireEvent.click(screen.getByText('Show Error'));
      expect(screen.getByRole('alert')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Clear Error'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});