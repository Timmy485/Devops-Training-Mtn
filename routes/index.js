
import express from 'express';
import healthRoutes from './health.routes.js';
import momoRoutes from './momo.routes.js';

const router = express.Router();

// Public routes
router.use('/health', healthRoutes);

// API routes (authentication handled within each route module)
router.use('/api/momo', momoRoutes);

// 404 handler for unmatched routes within this router
router.all('*', (req, res) => {
	res.status(404).json({
		error: 'Endpoint not found',
		path: req.originalUrl
	});
});

export default router; 