import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

interface DataRecord {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

// In-memory store for demo purposes
const dataStore: DataRecord[] = [];

// GET all data
router.get('/', (_req: Request, res: Response) => {
  res.json({
    data: dataStore,
    count: dataStore.length,
    timestamp: new Date().toISOString(),
  });
});

// POST new data with validation
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, value } = req.body;

    if (!name || value === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: name, value',
      });
    }

    // Call validation service
    const validationServiceUrl = process.env.VALIDATION_SERVICE_URL || 'http://localhost:8000';

    try {
      const validationResponse = await axios.post(
        `${validationServiceUrl}/validate`,
        { name, value },
        { timeout: 5000 }
      );

      if (!validationResponse.data.valid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResponse.data.errors,
        });
      }
    } catch (error) {
      console.error('Validation service error:', error);
      return res.status(503).json({
        error: 'Validation service unavailable',
      });
    }

    // Create record
    const record: DataRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      value: Number(value),
      timestamp: new Date().toISOString(),
    };

    dataStore.push(record);

    res.status(201).json({
      message: 'Data created successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({
      error: 'Failed to create data',
    });
  }
});

// GET single record
router.get('/:id', (req: Request, res: Response) => {
  const record = dataStore.find((r) => r.id === req.params.id);

  if (!record) {
    return res.status(404).json({
      error: 'Record not found',
    });
  }

  res.json({ data: record });
});

export default router;
