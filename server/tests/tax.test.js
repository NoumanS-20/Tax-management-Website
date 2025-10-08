const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const TaxForm = require('../models/TaxForm');
const jwt = require('jsonwebtoken');

describe('Tax Management Endpoints', () => {
  let user;
  let accessToken;

  beforeAll(async () => {
    // Create a test user
    user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    await user.save();

    // Generate access token
    accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await TaxForm.deleteMany({});
  });

  describe('POST /api/tax', () => {
    it('should create a new tax form', async () => {
      const taxFormData = {
        assessmentYear: '2024-25',
        financialYear: '2023-24',
        formType: 'ITR-1',
        personalInfo: {
          panNumber: 'ABCDE1234F',
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          }
        },
        income: {
          salary: 500000,
          businessIncome: 0,
          capitalGains: 0,
          houseProperty: 0,
          otherIncome: 0
        },
        deductions: {
          section80C: 150000,
          section80D: 25000,
          section80G: 0,
          section24: 0,
          section80E: 0,
          section80TTA: 0,
          otherDeductions: 0
        },
        exemptions: {
          hra: 0,
          lta: 0,
          medicalAllowance: 0,
          otherExemptions: 0
        }
      };

      const response = await request(app)
        .post('/api/tax')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taxFormData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.taxForm.assessmentYear).toBe('2024-25');
      expect(response.body.data.taxForm.formType).toBe('ITR-1');
    });

    it('should not create tax form without authentication', async () => {
      const taxFormData = {
        assessmentYear: '2024-25',
        financialYear: '2023-24',
        formType: 'ITR-1'
      };

      const response = await request(app)
        .post('/api/tax')
        .send(taxFormData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tax')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tax', () => {
    beforeEach(async () => {
      // Create test tax forms
      const taxForm1 = new TaxForm({
        userId: user._id,
        assessmentYear: '2024-25',
        financialYear: '2023-24',
        formType: 'ITR-1',
        status: 'draft'
      });
      await taxForm1.save();

      const taxForm2 = new TaxForm({
        userId: user._id,
        assessmentYear: '2023-24',
        financialYear: '2022-23',
        formType: 'ITR-2',
        status: 'filed'
      });
      await taxForm2.save();
    });

    it('should get user tax forms', async () => {
      const response = await request(app)
        .get('/api/tax')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.taxForms).toHaveLength(2);
    });

    it('should filter by assessment year', async () => {
      const response = await request(app)
        .get('/api/tax?assessmentYear=2024-25')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.taxForms).toHaveLength(1);
      expect(response.body.data.taxForms[0].assessmentYear).toBe('2024-25');
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/tax?status=draft')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.taxForms).toHaveLength(1);
      expect(response.body.data.taxForms[0].status).toBe('draft');
    });
  });

  describe('POST /api/tax/:id/submit', () => {
    let taxForm;

    beforeEach(async () => {
      taxForm = new TaxForm({
        userId: user._id,
        assessmentYear: '2024-25',
        financialYear: '2023-24',
        formType: 'ITR-1',
        status: 'draft',
        documents: [
          {
            name: 'Form 16',
            type: 'form16',
            url: '/uploads/test.pdf',
            size: 1024,
            uploadedAt: new Date(),
            status: 'verified'
          }
        ]
      });
      await taxForm.save();
    });

    it('should submit tax form for review', async () => {
      const response = await request(app)
        .post(`/api/tax/${taxForm._id}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('submitted for review');
    });

    it('should not submit form without required documents', async () => {
      // Create form without documents
      const emptyForm = new TaxForm({
        userId: user._id,
        assessmentYear: '2024-26',
        financialYear: '2024-25',
        formType: 'ITR-1',
        status: 'draft'
      });
      await emptyForm.save();

      const response = await request(app)
        .post(`/api/tax/${emptyForm._id}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required documents');
    });
  });
});
