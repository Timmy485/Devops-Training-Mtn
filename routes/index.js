
import express from 'express';
import healthRoutes from './health.routes.js';
import momoRoutes from './momo.routes.js';

const router = express.Router();

// App information route - shows app details when launched fresh
router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'DevSecOps Training API is running successfully! 🚀',
		app: {
			name: 'DevSecOps Agent',
			version: '1.0.0',
			description: 'DevSecOps Agent for MoMo payment integration and financial services',
			environment: process.env.NODE_ENV || 'development',
			port: process.env.PORT || 3001,
			timestamp: new Date().toISOString()
		},
		endpoints: {
			health: '/health',
			momo: '/api/momo',
			documentation: 'Check individual route modules for API documentation'
		},
		features: [
			'MoMo payment integration',
			'Health monitoring and status checks',
			'Secure API with authentication',
			'Comprehensive logging and monitoring'
		],
		status: 'operational',
		uptime: process.uptime()
	});
});

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