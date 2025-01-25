//src/components/test/DocumentManagement.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentManagement } from '../documents/DocumentManagement';
import { ErrorBoundary } from '../error/ErrorBoundary';

describe('DocumentManagement Integration Tests', () => {
  const mockDocument = {
    id: '1',
    name: 'test.pdf',
    type: 'application/pdf',
    size: 1024,
    file: new File([''], 'test.pdf', { type: 'application/pdf' }),
    uploadDate: new Date().toISOString(),
    status: 'pending' as const,
    workflowState: 'draft' as const,
    history: []
  };

  it('handles document upload successfully', async () => {
    const onUploadComplete = jest.fn();

    render(
      <ErrorBoundary>
        <DocumentManagement
          onUploadComplete={onUploadComplete}
        />
      </ErrorBoundary>
    );

    const fileInput = screen.getByLabelText(/upload document/i);
    fireEvent.change(fileInput, { target: { files: [mockDocument.file] } });

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockDocument.name,
          type: mockDocument.type
        })
      );
    });
  });

  it('handles validation errors correctly', async () => {
    const invalidFile = new File([''], 'test.exe', { type: 'application/x-msdownload' });
    
    render(
      <ErrorBoundary>
        <DocumentManagement
          allowedTypes={['.pdf', '.doc']}
        />
      </ErrorBoundary>
    );

    const fileInput = screen.getByLabelText(/upload document/i);
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it('integrates with workflow state changes', async () => {
    const onStateChange = jest.fn();

    render(
      <ErrorBoundary>
        <DocumentManagement
          initialDocument={mockDocument}
          onStateChange={onStateChange}
        />
      </ErrorBoundary>
    );

    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockDocument.id,
          workflowState: 'submitted'
        })
      );
    });
  });

  it('persists document state through error recovery', async () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <DocumentManagement
          initialDocument={mockDocument}
          ErrorComponent={ErrorComponent}
        />
      </ErrorBoundary>
    );

    // Verify error boundary caught the error
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Try recovery
    const tryAgainButton = screen.getByText(/try again/i);
    fireEvent.click(tryAgainButton);

    // Rerender without error component
    rerender(
      <ErrorBoundary>
        <DocumentManagement
          initialDocument={mockDocument}
        />
      </ErrorBoundary>
    );

    // Verify document state persisted
    expect(screen.getByText(mockDocument.name)).toBeInTheDocument();
  });
});