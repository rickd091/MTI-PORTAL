// src/tests/unit/ApplicationService.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ApplicationService } from '../../services/business/ApplicationService';
import { mockInstitutionData } from '../mocks/institutionData';

describe('ApplicationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitApplication', () => {
    it('should successfully submit a valid application', async () => {
      const mockData = {
        institution: mockInstitutionData,
        documents: {
          registration: new File([''], 'registration.pdf', { type: 'application/pdf' }),
          license: new File([''], 'license.pdf', { type: 'application/pdf' })
        }
      };

      const result = await ApplicationService.submitApplication(mockData);
      expect(result.id).toBeDefined();
      expect(result.status).toBe('PENDING_REVIEW');
    });

    it('should throw error for missing required documents', async () => {
      const mockData = {
        institution: mockInstitutionData,
        documents: {}
      };

      await expect(ApplicationService.submitApplication(mockData))
        .rejects.toThrow('Missing required documents');
    });
  });
});

// src/tests/integration/ApplicationWorkflow.test.js
describe('Application Workflow Integration', () => {
  it('should complete full application workflow successfully', async () => {
    // Set up test data
    const applicationData = {
      // Test data
    };

    // Submit application
    const application = await ApplicationService.submitApplication(applicationData);
    expect(application.status).toBe('PENDING_REVIEW');

    // Process review
    const review = await ReviewService.processReview(application.id);
    expect(review.status).toBe('APPROVED');

    // Schedule inspection
    const inspection = await InspectionService.scheduleInspection(application.id);
    expect(inspection.status).toBe('SCHEDULED');
  });
});

// src/tests/e2e/applications.spec.js
describe('Application Submission E2E', () => {
  beforeEach(() => {
    cy.login('institution-user');
    cy.visit('/applications/new');
  });

  it('should submit application successfully', () => {
    // Fill institution details
    cy.get('[name="name"]').type('Test Institution');
    cy.get('[name="type"]').select('PRIVATE');
    
    // Upload documents
    cy.get('[data-testid="document-upload"]').attachFile('test-doc.pdf');
    
    // Submit form
    cy.get('[type="submit"]').click();
    
    // Assert success
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Application submitted successfully');
  });
});