import type * as functions from 'firebase-functions';
import { auth } from './firestore';

/**
 * Verify the Firebase ID token from the request
 */
export async function verifyToken(request: functions.https.Request): Promise<string | null> {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(response: functions.Response) {
  return response.status(401).json({
    error: 'Unauthorized',
    message: 'Invalid or missing authentication token',
  });
}
