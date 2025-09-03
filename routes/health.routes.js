import express from 'express';
import { getHealth, getDetailedHealth, getReadiness, getLiveness } from '../controllers/health.controller.js';

const router = express.Router();

// Basic health check
router.get('/', getHealth);

// Detailed health information
router.get('/detailed', getDetailedHealth);

// Readiness probe
router.get('/ready', getReadiness);

// Liveness probe
router.get('/live', getLiveness);

export default router; 