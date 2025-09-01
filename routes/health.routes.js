import express from 'express';
import { getHealth, getDetailedHealth, getReadiness, getLiveness } from '../controllers/health.controller.js';

const router = express.Router();

// Basic health check
router.get('/', getHealth);

// Detailed health information
router.get('/detailed', getDetailedHealth);

// Kubernetes readiness probe
router.get('/ready', getReadiness);

// Kubernetes liveness probe
router.get('/live', getLiveness);

export default router; 