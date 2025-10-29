// Playwright test setup for Tax-management-Website
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  baseURL: 'http://localhost:5173', // Vite default dev server
});

export { expect };
