//src/components/documents/__tests__/DocumentManagement.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DocumentManagement } from '../DocumentManagement';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock AuthContext
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    role: 'admin',
    user: { id: 'test-user-1' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Helper function to create mock files
const createMockFile = (
  name: string, 
  type: string, 
  size: number
): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('DocumentManagement Component', () => {
  const defaultProps = {
    onDocumentUpdate: jest.fn(),
    onError: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <AuthProvider>
        <DocumentManagement {...defaultProps} {...props} />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic Rendering Tests
  describe('Rendering', () => {
    it('renders upload area', () => {
      renderComponent();
      expect(screen.getByText(/drag and drop files/i)).toBeInTheDocument();
    });

    it('displays initial documents when provided', () => {
      const initialDocuments = [{
        id: '1',
        name: 'test.pdf',
        type: 'application/pdf',
        size: 1024,
        status: 'pending' as const,
        uploadDate: new Date().toISOString(),
        history: []
      }];

      renderComponent({ initialDocuments });
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('shows admin actions when user has admin role', () => {
      renderComponent();
      const initialDoc = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);
      
      fireEvent.change(input, { target: { files: [initialDoc] } });
      
      expect(screen.getByText('Approve')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();
    });
  });

  // File Upload Tests
  describe('File Upload', () => {
    it('handles single file upload', async () => {
      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });
    });

    it('shows upload progress', async () => {
      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/uploading/i)).toBeInTheDocument();
      });
    });

    it('handles file validation errors', async () => {
      renderComponent({
        validation: {
          maxSize: 500, // 500 bytes
          maxFiles: 1,
          allowedTypes: ['application/pdf']
        }
      });

      const file = createMockFile('test.txt', 'text/plain', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalled();
      });
    });

    it('enforces maximum file limit', async () => {
      renderComponent({
        validation: {
          maxSize: 1024 * 1024,
          maxFiles: 1,
          allowedTypes: ['application/pdf']
        }
      });

      const files = [
        createMockFile('test1.pdf', 'application/pdf', 1024),
        createMockFile('test2.pdf', 'application/pdf', 1024)
      ];

      const input = screen.getByLabelText(/drag and drop files/i);
      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Maximum 1 files allowed')
          })
        );
      });
    });
  });

  // Document Actions Tests
  describe('Document Actions', () => {
    it('handles document approval', async () => {
      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const approveButton = screen.getByText('Approve');
        fireEvent.click(approveButton);
      });

      expect(defaultProps.onDocumentUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'valid',
          workflowState: 'approved'
        })
      );
    });

    it('handles document deletion', async () => {
      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });

      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });

  // Drag and Drop Tests
  describe('Drag and Drop', () => {
    it('handles file drag and drop', async () => {
      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const dropZone = screen.getByText(/drag and drop files/i).parentElement;

      fireEvent.dragOver(dropZone!);
      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [file]
        }
      });

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('displays error when upload fails', async () => {
      const mockError = new Error('Upload failed');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

      renderComponent();
      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText(/drag and drop files/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('shows error boundary fallback on component error', () => {
      const ThrowError = () => {
        throw new Error('Test error');
        return null;
      };

      render(
        <DocumentManagement 
          {...defaultProps}
          ErrorComponent={ThrowError}
        />
      );

      expect(screen.getByText(/error loading document management/i)).toBeInTheDocument();
    });
  });
});