import * as functions from 'firebase-functions';
import { COLLECTIONS, db, timestampToDate } from '../utils';
import type { Product, ProductDoc } from './types';

/**
 * Get all products
 * GET /products
 */
export const getProducts = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).send('');
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS).orderBy('createdAt', 'desc').get();

    const products: Product[] = snapshot.docs.map((doc) => {
      const data = doc.data() as ProductDoc;
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        seller: data.seller,
        imageUrl: data.imageUrl,
        category: data.category,
        stock: data.stock,
        createdAt: timestampToDate(data.createdAt),
      };
    });

    response.json({ products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * Get a single product by ID
 * GET /products/:id
 */
export const getProductById = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).send('');
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const productId = request.query.id as string;

  if (!productId) {
    response.status(400).json({ error: 'Product ID is required' });
    return;
  }

  try {
    const doc = await db.collection(COLLECTIONS.PRODUCTS).doc(productId).get();

    if (!doc.exists) {
      response.status(404).json({ error: 'Product not found' });
      return;
    }

    const data = doc.data() as ProductDoc;
    const product: Product = {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      seller: data.seller,
      imageUrl: data.imageUrl,
      category: data.category,
      stock: data.stock,
      createdAt: timestampToDate(data.createdAt),
    };

    response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).json({ error: 'Failed to fetch product' });
  }
});
