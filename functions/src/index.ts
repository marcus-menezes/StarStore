/**
 * StarStore Cloud Functions
 *
 * This file exports all the Cloud Functions for the StarStore application.
 */

// Products functions
export { getProducts, getProductById } from './products';

// Orders functions
export { createOrder, getOrders } from './orders';

// Users functions
export { onUserCreated } from './users';
