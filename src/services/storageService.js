import { ref, uploadString, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export const FIREBASE_STORAGE_BUCKET_URI = 'gs://nefra-creators-x.firebasestorage.app';

/**
 * Format raw byte size into human readable string (e.g. 14.5 MB)
 */
export function formatFileSize(bytes = 0) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

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

/**
 * Uploads a deliverable file (video draft or image/thumbnail) directly to the Firebase Storage bucket.
 * Target Bucket: gs://nefra-creators-x.firebasestorage.app
 * Path: escrow_deliverables/{contractId}/{timestamp}_{cleanName}
 *
 * @param {Object} params
 * @param {File|Blob} params.file - File object to upload
 * @param {string} params.contractId - Escrow contract ID
 * @param {Function} [params.onProgress] - Optional progress callback (percent: 0-100)
 * @returns {Promise<{ name: string, size: number, type: string, downloadUrl: string, storagePath: string, bucket: string }>}
 */
export async function uploadDeliverableFileToFirebase({
  file,
  contractId = 'contract',
  onProgress
}) {
  if (!file) throw new Error('No file provided for upload');

  const cleanContractId = String(contractId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFilename = file.name ? file.name.replace(/[^a-zA-Z0-9_.-]/g, '_') : `deliverable_${Date.now()}`;
  const storagePath = `escrow_deliverables/${cleanContractId}/${Date.now()}_${cleanFilename}`;

  console.log(`📤 [Firebase Storage] Uploading deliverable "${file.name}" to bucket (${FIREBASE_STORAGE_BUCKET_URI}/${storagePath})...`);

  try {
    const fileRef = ref(storage, storagePath);
    const contentType = file.type || (file.name.match(/\.(mp4|mov|webm)$/i) ? 'video/mp4' : 'image/jpeg');

    const metadata = {
      contentType,
      customMetadata: {
        contractId: String(contractId),
        originalName: file.name,
        bucket: FIREBASE_STORAGE_BUCKET_URI,
        uploadedAt: new Date().toISOString(),
        app: 'NEFRA Creators X Escrow'
      }
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    const downloadUrl = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            if (typeof onProgress === 'function') {
              onProgress(progress);
            }
          }
        },
        (error) => {
          console.warn(`⚠️ [Firebase Storage] Task error:`, error.message);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    console.log(`✅ [Firebase Storage] Deliverable uploaded to Firebase bucket:`, downloadUrl);
    return {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      type: contentType,
      downloadUrl,
      storagePath,
      bucket: FIREBASE_STORAGE_BUCKET_URI,
      uploadedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn(`⚠️ [Firebase Storage] Bucket upload encountered error (${err.message}). Using local object fallback.`);
    const objectUrl = URL.createObjectURL(file);
    return {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      downloadUrl: objectUrl,
      storagePath,
      bucket: FIREBASE_STORAGE_BUCKET_URI,
      isLocalFallback: true,
      uploadedAt: new Date().toISOString()
    };
  }
}

/**
 * Uploads multiple files sequentially to Firebase Storage bucket.
 */
export async function uploadMultipleDeliverablesToFirebase({
  files,
  contractId,
  onFileProgress
}) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const res = await uploadDeliverableFileToFirebase({
      file,
      contractId,
      onProgress: (pct) => {
        if (typeof onFileProgress === 'function') {
          onFileProgress(i, pct);
        }
      }
    });
    results.push(res);
  }
  return results;
}

