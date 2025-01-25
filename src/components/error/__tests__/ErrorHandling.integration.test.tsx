//src/components/error/__tests__/ErrorHandling.integration.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedErrorHandling } from '../EnhancedErrorHandling';
import { DocumentManagement } from '../../documents/DocumentManagement';

describe('ErrorHandling Integration Tests', () => {
  // Mock file for document upload tests
  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File(['mock content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('Document Upload Integration', () => {
    it('handles document upload errors correctly', async () => {
      const onError = jest.fn();
      const oversizedFile = createMockFile('large.pdf', 'application/pdf', 15 * 1024 * 1024); // 15MB

      render(
        <EnhancedErrorHandling onError={onError}>
          <DocumentManagement maxFileSize={10 * 1024 * 1024} /> {/* 10MB limit */}
        </EnhancedErrorHandling>
      );

      const input = screen.getByLabelText(/upload document/i);
      await userEvent.upload(input, oversizedFile);

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('exceeds size limit')
        })
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/file size exceeds/i);
    });

    it('handles multiple concurrent upload errors', async () => {
      const files = [
        createMockFile('invalid1.exe', 'application/x-msdownload', 1024),
        createMockFile('invalid2.exe', 'application/x-msdownload', 1024)
      ];

      render(
        <EnhancedErrorHandling>
          <DocumentManagement 
            allowedTypes={['application/pdf', 'image/jpeg']} 
          />
        </EnhancedErrorHandling>
      );

      const input = screen.getByLabelText(/upload document/i);
      await userEvent.upload(input, files);

      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
      expect(alerts[0]).toHaveTextContent(/invalid file type/i);
    });

    it('groups similar errors', async () => {
      render(
        <EnhancedErrorHandling grouped>
          <DocumentManagement 
            allowedTypes={['application/pdf']}
          />
        </EnhancedErrorHandling>
      );

      const files = Array.from({ length: 5 }, (_, i) => 
        createMockFile(`invalid${i}.exe`, 'application/x-msdownload', 1024)
      );

      const input = screen.getByLabelText(/upload document/i);
      await userEvent.upload(input, files);

      const errorGroups = screen.getAllByRole('alert');
      expect(errorGroups).toHaveLength(1);
      expect(errorGroups[0]).toHaveTextContent(/5 files with invalid type/i);
    });
  });

  describe('Network Error Integration', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('handles network timeout errors', async () => {
      // Mock a network timeout
      jest.spyOn(global, 'fetch').mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 5000)
        )
      );

      render(
        <EnhancedErrorHandling>
          <DocumentManagement />
        </EnhancedErrorHandling>
      );

      const uploadButton = screen.getByText(/upload/i);
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/network timeout/i);
      });
    });

    it('handles server errors with retry functionality', async () => {
      const serverError = new Error('Server Error');
      const fetchMock = jest.spyOn(global, 'fetch')
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ ok: true } as Response);

      render(
        <EnhancedErrorHandling>
          <DocumentManagement />
        </EnhancedErrorHandling>
      );

      // Trigger upload
      const uploadButton = screen.getByText(/upload/i);
      await userEvent.click(uploadButton);

      // Wait for error and retry button
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/server error/i);
      });

      // Click retry
      const retryButton = screen.getByText(/retry/i);
      await userEvent.click(retryButton);

      // Verify retry was successful
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation Integration', () => {
    const TestForm = () => {
      const [formError, setFormError] = React.useState(null);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;

        if (!email.includes('@')) {
          setFormError(new Error('Invalid email format'));
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <input type="text" name="email" />
          <button type="submit">Submit</button>
        </form>
      );
    };

    it('displays form validation errors', async () => {
      render(
        <EnhancedErrorHandling>
          <TestForm />
        </EnhancedErrorHandling>
      );

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'invalid-email');
      
      const submitButton = screen.getByText('Submit');
      await userEvent.click(submitButton);

      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email format/i);
    });
  });

  describe('Error Recovery', () => {
    it('recovers from component errors', async () => {
      const ErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
        if (shouldError) throw new Error('Component Error');
        return <div>Component recovered</div>;
      };

      const { rerender } = render(
        <EnhancedErrorHandling>
          <ErrorComponent shouldError={true} />
        </EnhancedErrorHandling>
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/component error/i);

      // Recover
      rerender(
        <EnhancedErrorHandling>
          <ErrorComponent shouldError={false} />
        </EnhancedErrorHandling>
      );

      expect(screen.getByText('Component recovered')).toBeInTheDocument();
    });

    it('maintains error history through recoveries', async () => {
      render(
        <EnhancedErrorHandling persistentErrors>
          <DocumentManagement />
        </EnhancedErrorHandling>
      );

      // Trigger multiple errors
      const errorTriggers = [
        { file: createMockFile('large.pdf', 'application/pdf', 20 * 1024 * 1024) },
        { file: createMockFile('invalid.exe', 'application/x-msdownload', 1024) }
      ];

      for (const { file } of errorTriggers) {
        const input = screen.getByLabelText(/upload document/i);
        await userEvent.upload(input, file);
      }

      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });
});