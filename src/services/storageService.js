import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export const FIREBASE_STORAGE_BUCKET_URI = 'gs://nefra-creators-x.firebasestorage.app';

/**
 * Uploads an AI-generated image (base64 data URL) directly to the Firebase Storage bucket.
 * Target Bucket: gs://nefra-creators-x.firebasestorage.app
 * 
 * @param {Object} params
 * @param {string} params.dataUrl - Base64 Data URL (data:image/png;base64,...)
 * @param {string} [params.filename] - Custom destination filename
 * @param {string} [params.brandName] - Company or brand name for subfolder organization
 * @returns {Promise<string>} Download URL from Firebase Storage, or original dataUrl if fallback needed
 */
export async function uploadGeneratedArtworkToFirebase({
  dataUrl,
  filename,
  brandName = 'brand'
}) {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return dataUrl;
  }

  // If already a remote URL, no need to re-upload
  if (dataUrl.startsWith('https://') || dataUrl.startsWith('http://')) {
    return dataUrl;
  }

  // Must be a data URL
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  const cleanBrand = brandName.toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'brand';
  const fileId = filename || `artwork_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;
  const storagePath = `generated_artwork/${cleanBrand}/${fileId}`;

  try {
    console.log(`📤 [Firebase Storage] Uploading generated artwork to bucket (${FIREBASE_STORAGE_BUCKET_URI}/${storagePath})...`);
    
    const imageRef = ref(storage, `${FIREBASE_STORAGE_BUCKET_URI}/${storagePath}`);
    const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const snapshot = await uploadString(imageRef, dataUrl, 'data_url', {
      contentType: mimeType,
      customMetadata: {
        model: 'Google Vertex AI Nano Banana (gemini-2.5-flash-image)',
        app: 'NEFRA Creators X',
        uploadedAt: new Date().toISOString()
      }
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(`✅ [Firebase Storage] Artwork safely stored in bucket:`, downloadUrl);
    return downloadUrl;
  } catch (err) {
    console.warn(`⚠️ [Firebase Storage] Could not upload to bucket (${err.message}). Retaining local artwork data.`);
    return dataUrl;
  }
}
