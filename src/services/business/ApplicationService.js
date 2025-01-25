// src/services/business/ApplicationService.js
import { institutionService, documentService, inspectionService } from '../api';

export class ApplicationService {
  static async submitApplication(data) {
    try {
      // Step 1: Validate all required documents
      const documentValidation = await this.validateDocuments(data.documents);
      if (!documentValidation.isValid) {
        throw new Error(documentValidation.errors.join(', '));
      }

      // Step 2: Create institution record
      const institution = await institutionService.create(data.institution);

      // Step 3: Upload and link documents
      const documentUploadPromises = Object.entries(data.documents)
        .map(([type, file]) => documentService.upload(file, {
          institutionId: institution.id,
          type
        }));
      await Promise.all(documentUploadPromises);

      // Step 4: Schedule initial review
      await this.scheduleInitialReview(institution.id);

      return institution;
    } catch (error) {
      throw new Error(`Application submission failed: ${error.message}`);
    }
  }

  static async validateDocuments(documents) {
    const requiredDocuments = [
      'registration',
      'license',
      'qualityManual',
      'safetyPolicy'
    ];

    const errors = [];
    
    // Check required documents
    requiredDocuments.forEach(doc => {
      if (!documents[doc]) {
        errors.push(`Missing required document: ${doc}`);
      }
    });

    // Validate document types and sizes
    Object.entries(documents).forEach(([type, file]) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        errors.push(`${type} exceeds size limit`);
      }
      
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        errors.push(`Invalid file type for ${type}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static async scheduleInitialReview(institutionId) {
    // Assign reviewers based on availability
    const availableReviewers = await this.getAvailableReviewers();
    
    if (availableReviewers.length === 0) {
      throw new Error('No reviewers available');
    }

    // Create review task
    const review = await reviewService.create({
      institutionId,
      reviewerId: availableReviewers[0].id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return review;
  }
}

// src/services/business/InspectionService.js
export class InspectionService {
  static async scheduleInspection(institutionId) {
    try {
      // Get institution details
      const institution = await institutionService.get(institutionId);

      // Find available inspectors
      const availableInspectors = await this.getAvailableInspectors(
        institution.location.county
      );

      if (availableInspectors.length === 0) {
        throw new Error('No inspectors available in the region');
      }

      // Schedule inspection
      const inspection = await inspectionService.create({
        institutionId,
        inspectorId: availableInspectors[0].id,
        scheduledDate: this.getNextAvailableDate(),
        type: 'INITIAL',
        status: 'SCHEDULED'
      });

      // Send notifications
      await this.sendInspectionNotifications(inspection);

      return inspection;
    } catch (error) {
      throw new Error(`Inspection scheduling failed: ${error.message}`);
    }
  }

  static getNextAvailableDate() {
    // Implementation to find next available date
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default to 14 days from now
    return date;
  }
}