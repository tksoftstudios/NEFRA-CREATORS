/**
 * AI Content Creator Firestore Synchronization Service
 * 
 * Provides real-time synchronization, multi-browser syncing, and persistent
 * cloud storage for AI-generated posts, artwork, and copy via Cloud Firestore.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const AI_POSTS_COLLECTION = 'ai_posts';

/**
 * Sanitizes post data to ensure Firestore 1MB document limit is never exceeded.
 * Replaces any lingering huge inline data: URLs with safe references.
 */
function sanitizePostForFirestore(post, userId) {
  const cleanPost = { ...post };

  cleanPost.userId = userId || post.userId || 'guest';
  cleanPost.updatedAt = serverTimestamp();
  cleanPost.timestamp = post.timestamp || (post.createdAt ? new Date(post.createdAt).getTime() : Date.now());

  // Clean uploadedImages to prevent storing massive base64 blobs in Firestore
  if (Array.isArray(cleanPost.uploadedImages)) {
    cleanPost.uploadedImages = cleanPost.uploadedImages.map(img => {
      if (img.url && img.url.startsWith('data:') && img.url.length > 50000) {
        return {
          id: img.id,
          name: img.name,
          role: img.role,
          url: '/LOGO.png' // Fallback lightweight reference
        };
      }
      return img;
    });
  }

  // Ensure revisions don't store multi-megabyte base64 strings
  if (Array.isArray(cleanPost.revisions)) {
    cleanPost.revisions = cleanPost.revisions.map(rev => {
      if (rev.imageUrl && rev.imageUrl.startsWith('data:') && rev.imageUrl.length > 50000) {
        return {
          ...rev,
          imageUrl: '/creator_collab_poster.jpg'
        };
      }
      return rev;
    });
  }

  return cleanPost;
}

/**
 * Save or update an AI Content Creator post in Cloud Firestore.
 * 
 * @param {Object} post - The post object
 * @param {string} [userId] - Optional owner user UID
 * @returns {Promise<boolean>} Success status
 */
export async function saveAIPostToFirestore(post, userId) {
  if (!db || !post || !post.id) {
    console.warn('[AI Content Firestore] DB not initialized or missing post ID');
    return false;
  }

  try {
    const postRef = doc(db, AI_POSTS_COLLECTION, String(post.id));
    const sanitized = sanitizePostForFirestore(post, userId);
    await setDoc(postRef, sanitized, { merge: true });
    return true;
  } catch (error) {
    console.error('[AI Content Firestore] Failed to save post:', error);
    return false;
  }
}

/**
 * Delete an AI Content Creator post from Cloud Firestore.
 * 
 * @param {string} postId - Post ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAIPostFromFirestore(postId) {
  if (!db || !postId) return false;

  try {
    const postRef = doc(db, AI_POSTS_COLLECTION, String(postId));
    await deleteDoc(postRef);
    return true;
  } catch (error) {
    console.error('[AI Content Firestore] Failed to delete post:', error);
    return false;
  }
}

/**
 * Subscribe to real-time Cloud Firestore updates for AI posts.
 * Automatically synchronizes changes across multiple open browser windows and devices.
 * 
 * @param {string} [userId] - User UID for tenant scoping
 * @param {Function} onPostsUpdated - Callback receiving updated posts array
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAIPosts(userId, onPostsUpdated) {
  if (!db) {
    console.warn('[AI Content Firestore] DB not initialized, live sync unavailable');
    return () => {};
  }

  try {
    const colRef = collection(db, AI_POSTS_COLLECTION);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Filter by userId if scoped, or include if matching or shared
          if (!userId || !data.userId || data.userId === userId || data.userId === 'guest' || data.userId === 'shared') {
            posts.push({
              id: docSnap.id,
              ...data
            });
          }
        });
        onPostsUpdated(posts);
      },
      (error) => {
        console.warn('[AI Content Firestore] Real-time listener warning:', error.message);
      }
    );

    return unsubscribe;
  } catch (e) {
    console.warn('[AI Content Firestore] Failed to subscribe to Firestore:', e);
    return () => {};
  }
}

/**
 * Seed initial demo posts to Firestore if collection is empty.
 * 
 * @param {Array} defaultPosts - Initial posts array
 * @param {string} [userId] - Current user ID
 */
export async function seedInitialPostsToFirestore(defaultPosts, userId) {
  if (!db || !Array.isArray(defaultPosts) || defaultPosts.length === 0) return;

  try {
    const colRef = collection(db, AI_POSTS_COLLECTION);
    const snap = await getDocs(query(colRef, limit(1)));
    if (snap.empty) {
      console.log('[AI Content Firestore] Seeding initial posts to Firestore...');
      for (const p of defaultPosts) {
        await saveAIPostToFirestore(p, userId || 'shared');
      }
    }
  } catch (e) {
    console.warn('[AI Content Firestore] Seeding skipped:', e.message);
  }
}
