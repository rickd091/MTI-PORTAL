//src/components/error/__tests__/EnhancedErrorHandling.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedErrorHandling, { ErrorState } from '../EnhancedErrorHandling';

describe('EnhancedErrorHandling Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createError = (overrides?: Partial<ErrorState>): Partial<ErrorState> => ({
    message: 'Test error',
    severity: 'error',
    title: 'Error Title',
    timestamp: new Date(),
    ...overrides
  });

  describe('Basic Functionality', () => {
    it('renders children without errors', () => {
      render(
        <EnhancedErrorHandling>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('displays error with all components', async () => {
      const onAction = jest.fn();
      const { rerender } = render(
        <EnhancedErrorHandling>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add error
      rerender(
        <EnhancedErrorHandling initialErrors={[
          createError({
            title: 'Error Title',
            message: 'Error Message',
            actionLabel: 'Retry',
            retryable: true,
            onAction
          }) as ErrorState
        ]}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error Message')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();

      // Test action button
      await userEvent.click(screen.getByText('Retry'));
      expect(onAction).toHaveBeenCalled();
    });

    it('handles theme changes', () => {
      const { rerender } = render(
        <EnhancedErrorHandling theme="light">
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add error in light theme
      rerender(
        <EnhancedErrorHandling 
          theme="light"
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const lightError = screen.getByRole('alert');
      expect(lightError).toHaveClass('bg-red-50');

      // Change to dark theme
      rerender(
        <EnhancedErrorHandling 
          theme="dark"
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const darkError = screen.getByRole('alert');
      expect(darkError).toHaveClass('bg-red-900');
    });
  });

  describe('Error Management', () => {
    it('respects maxErrors limit', async () => {
      const { rerender } = render(
        <EnhancedErrorHandling maxErrors={2}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add three errors
      const errors = [
        createError({ message: 'Error 1' }),
        createError({ message: 'Error 2' }),
        createError({ message: 'Error 3' })
      ] as ErrorState[];

      rerender(
        <EnhancedErrorHandling maxErrors={2} initialErrors={errors}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const alerts = screen.queryAllByRole('alert');
      expect(alerts).toHaveLength(2);
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
      expect(screen.getByText('Error 3')).toBeInTheDocument();
    });

    it('groups errors when grouped prop is true', async () => {
      const { rerender } = render(
        <EnhancedErrorHandling grouped>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add grouped errors
      const groupedErrors = [
        createError({ groupId: 'group1', message: 'Group 1 Error 1' }),
        createError({ groupId: 'group1', message: 'Group 1 Error 2' }),
        createError({ groupId: 'group2', message: 'Group 2 Error 1' })
      ] as ErrorState[];

      rerender(
        <EnhancedErrorHandling grouped initialErrors={groupedErrors}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const group1Errors = screen.getAllByText(/Group 1 Error/);
      const group2Errors = screen.getAllByText(/Group 2 Error/);
      expect(group1Errors).toHaveLength(2);
      expect(group2Errors).toHaveLength(1);
    });

    it('handles error removal correctly', async () => {
      const onClearError = jest.fn();
      const { rerender } = render(
        <EnhancedErrorHandling onClearError={onClearError}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add error
      rerender(
        <EnhancedErrorHandling 
          onClearError={onClearError}
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const closeButton = screen.getByLabelText('Close');
      await userEvent.click(closeButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(onClearError).toHaveBeenCalled();
    });
  });

  describe('Auto-hide Functionality', () => {
    it('auto-hides errors after specified duration', async () => {
      const { rerender } = render(
        <EnhancedErrorHandling autoHideDuration={1000}>
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add error
      rerender(
        <EnhancedErrorHandling 
          autoHideDuration={1000}
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    it('does not auto-hide when persistentErrors is true', async () => {
      const { rerender } = render(
        <EnhancedErrorHandling 
          autoHideDuration={1000}
          persistentErrors
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      // Add error
      rerender(
        <EnhancedErrorHandling 
          autoHideDuration={1000}
          persistentErrors
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Position Variants', () => {
    it.each([
      ['top-right', 'top-4 right-4'],
      ['top-left', 'top-4 left-4'],
      ['bottom-right', 'bottom-4 right-4'],
      ['bottom-left', 'bottom-4 left-4']
    ])('renders in correct position for %s', async (position, expectedClass) => {
      const { container } = render(
        <EnhancedErrorHandling 
          position={position as any}
          initialErrors={[createError() as ErrorState]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      const errorStack = container.querySelector('.error-stack');
      expect(errorStack).toHaveClass(expectedClass);
    });
  });

  describe('Action Handlers', () => {
    it('executes retry action when retry button is clicked', async () => {
      const onAction = jest.fn();
      render(
        <EnhancedErrorHandling
          initialErrors={[
            createError({
              retryable: true,
              onAction
            }) as ErrorState
          ]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      await userEvent.click(screen.getByText('Retry'));
      expect(onAction).toHaveBeenCalled();
    });

    it('executes custom action when action button is clicked', async () => {
      const onAction = jest.fn();
      render(
        <EnhancedErrorHandling
          initialErrors={[
            createError({
              actionLabel: 'Custom Action',
              onAction
            }) as ErrorState
          ]}
        >
          <div>Test Content</div>
        </EnhancedErrorHandling>
      );

      await userEvent.click(screen.getByText('Custom Action'));
      expect(onAction).toHaveBeenCalled();
    });
  });

  describe('Error Boundary Integration', () => {
    it('catches and displays runtime errors', () => {
      const ErrorComponent = () => {
        throw new Error('Runtime error');
      };

      render(
        <EnhancedErrorHandling>
          <ErrorComponent />
        </EnhancedErrorHandling>
      );

      expect(screen.getByText('Runtime error')).toBeInTheDocument();
    });
  });
});