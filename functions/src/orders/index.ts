import * as functions from 'firebase-functions';
import {
  COLLECTIONS,
  db,
  serverTimestamp,
  timestampToDate,
  unauthorizedResponse,
  verifyToken,
} from '../utils';
import type { CreateOrderRequest, Order, OrderDoc } from './types';

/**
 * Create a new order
 * POST /orders
 */
export const createOrder = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'POST');
    response.status(204).send('');
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Verify authentication
  const userId = await verifyToken(request);
  if (!userId) {
    unauthorizedResponse(response);
    return;
  }

  try {
    const { items, total, paymentMethod } = request.body as CreateOrderRequest;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      response.status(400).json({ error: 'Items are required' });
      return;
    }

    if (typeof total !== 'number' || total <= 0) {
      response.status(400).json({ error: 'Valid total is required' });
      return;
    }

    if (!paymentMethod) {
      response.status(400).json({ error: 'Payment method is required' });
      return;
    }

    // Create the order
    const orderData = {
      userId,
      items,
      total,
      status: 'pending' as const,
      paymentMethod,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTIONS.ORDERS).add(orderData);

    const order: Order = {
      id: docRef.id,
      userId,
      items,
      total,
      status: 'pending',
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    response.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    response.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * Get orders for the authenticated user
 * GET /orders
 */
export const getOrders = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET');
    response.status(204).send('');
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Verify authentication
  const userId = await verifyToken(request);
  if (!userId) {
    unauthorizedResponse(response);
    return;
  }

  try {
    const snapshot = await db
      .collection(COLLECTIONS.ORDERS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders: Order[] = snapshot.docs.map((doc) => {
      const data = doc.data() as OrderDoc;
      return {
        id: doc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        status: data.status,
        paymentMethod: data.paymentMethod,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      };
    });

    response.json({ orders, total: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    response.status(500).json({ error: 'Failed to fetch orders' });
  }
});
