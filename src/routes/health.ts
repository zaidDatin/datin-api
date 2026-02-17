import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check validation service
    const validationServiceUrl = process.env.VALIDATION_SERVICE_URL || 'http://localhost:8000';
    let validationHealthy = false;

    try {
      const response = await fetch(`${validationServiceUrl}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      validationHealthy = response.ok;
    } catch (error) {
      console.warn('Validation service health check failed:', error);
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        validation: validationHealthy,
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

export default router;
