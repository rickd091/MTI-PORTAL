import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

/**
 * OpenAPI specification configuration
 * This sets up the documentation for all API endpoints
 */
export const openApiOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MTI-PORTAL API Documentation',
      version,
      description: 'API documentation for the Maritime Training Institution Accreditation System',
      license: {
        name: 'Private',
        url: 'https://example.com',
      },
      contact: {
        name: 'API Support',
        url: 'https://mti-portal.example.com/support',
        email: 'support@mti-portal.example.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Production API server',
      },
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'An error occurred while processing your request',
            },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'string',
              },
              example: {
                email: 'Email is required',
                password: 'Password must be at least 12 characters',
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'REVIEWER', 'INSPECTOR', 'INSTITUTION', 'VERIFIER', 'QA_OFFICER'],
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'email', 'role'],
        },
        Institution: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            registrationNumber: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
            },
            address: {
              type: 'string',
            },
            contactEmail: {
              type: 'string',
              format: 'email',
            },
            contactPhone: {
              type: 'string',
            },
            website: {
              type: 'string',
              format: 'url',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'name', 'status'],
        },
        Document: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
            fileUrl: {
              type: 'string',
              format: 'url',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            uploadedBy: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'title', 'fileUrl', 'status'],
        },
        Inspection: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            institutionId: {
              type: 'string',
              format: 'uuid',
            },
            inspectorId: {
              type: 'string',
              format: 'uuid',
            },
            inspectionDate: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['SCHEDULED', 'COMPLETED', 'CANCELED'],
            },
            report: {
              type: 'object',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'institutionId', 'inspectorId', 'status'],
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            code: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            institutionId: {
              type: 'string',
              format: 'uuid',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'title', 'institutionId', 'status'],
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized - Authentication credentials were missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Authentication failed',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - The user does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'You do not have permission to access this resource',
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found - The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation Error - The request data failed validation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Validation failed',
                errors: {
                  email: 'Invalid email address',
                  password: 'Password must be at least 12 characters',
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Server Error - An unexpected error occurred',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'An unexpected error occurred. Please try again later.',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Institutions',
        description: 'Institution management endpoints',
      },
      {
        name: 'Documents',
        description: 'Document management endpoints',
      },
      {
        name: 'Inspections',
        description: 'Inspection scheduling and reporting endpoints',
      },
      {
        name: 'Courses',
        description: 'Course and training program endpoints',
      },
      {
        name: 'Reports',
        description: 'Reporting and analytics endpoints',
      },
      {
        name: 'System',
        description: 'System health and monitoring endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

// Generate OpenAPI specification
export const openApiSpec = swaggerJsdoc(openApiOptions);

/**
 * Sample API documentation for Auth endpoints
 * This would be placed in the auth controller file
 */
/* 
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate user and generate JWT token
 *     description: Authenticate a user using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123!
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 mfaRequired:
 *                   type: boolean
 *                   example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * Helper function to get the API documentation route handler
 */
export const getSwaggerMiddleware = () => {
  const swaggerUi = require('swagger-ui-express');
  return [swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })];
};
