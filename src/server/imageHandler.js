import fs from 'fs';
import path from 'path';
import { handleVertexGenerateContent, getVertexAccessToken } from './vertexHandler.js';

/**
 * Uploads generated image base64 data to Google Cloud / Firebase Storage bucket
 * Target Bucket: nefra-creators-x.firebasestorage.app
 */
async function uploadToFirebaseBucket(base64Data, mimeType = 'image/png', filename) {
  try {
    const accessToken = await getVertexAccessToken();
    if (!accessToken) {
      console.warn('⚠️ [Firebase Bucket] No service account access token available for server-side upload.');
      return null;
    }

    const rawBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || 'nefra-creators-x.firebasestorage.app';
    const bucket = rawBucket.replace(/^gs:\/\//, '').replace(/\/$/, '');
    const filePath = `generated_artwork/${filename}`;
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(filePath)}`;

    const buffer = Buffer.from(base64Data, 'base64');
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': mimeType
      },
      body: buffer
    });

    if (res.ok) {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media`;
      console.log(`☁️ [Firebase Storage Bucket] Successfully stored generated artwork: ${publicUrl}`);
      return publicUrl;
    } else {
      const err = await res.text();
      console.warn('⚠️ [Firebase Storage Bucket] Upload returned non-ok status:', err);
    }
  } catch (err) {
    console.warn('⚠️ [Firebase Storage Bucket] Server-side upload failed:', err.message);
  }
  return null;
}

/**
 * Helper to resolve an image input to a base64 string and mimeType
 */
async function resolveImageToInlineData(img) {
  const rawUrl = img?.url || img?.dataUrl || (typeof img === 'string' ? img : '');
  if (!rawUrl) return null;

  // 1. Data URL
  if (rawUrl.startsWith('data:')) {
    const match = rawUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      let mimeType = match[1].toLowerCase();
      // Ensure mimeType is supported by Gemini vision
      if (mimeType.includes('svg')) mimeType = 'image/png';
      return { mimeType, data: match[2] };
    }
  }

  // 2. Remote HTTP/HTTPS URL
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    try {
      const res = await fetch(rawUrl);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        let mimeType = res.headers.get('content-type') || 'image/png';
        if (mimeType.includes('svg')) mimeType = 'image/png';
        return { mimeType, data: buf.toString('base64') };
      }
    } catch (e) {
      console.warn('[Image Resolver] Remote image fetch failed:', e.message);
    }
  }

  // 3. Local relative path (e.g. /LOGO.png or public/...)
  try {
    const cleanPath = rawUrl.split('?')[0].replace(/^\//, '');
    const localFile = path.resolve(process.cwd(), 'public', cleanPath);
    if (fs.existsSync(localFile)) {
      const fileBuf = fs.readFileSync(localFile);
      const ext = path.extname(localFile).toLowerCase();
      let mimeType = ext === '.png' ? 'image/png' : (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'image/png';
      return { mimeType, data: fileBuf.toString('base64') };
    }
  } catch (e) {
    console.warn('[Image Resolver] Local image read failed:', e.message);
  }

  return null;
}

/**
 * Google Vertex AI Nano Banana Image Synthesizer
 * Generates an authentic, standalone promotional image for YouTube Community
 * using Google Cloud Vertex AI (gemini-2.5-flash-image / Nano Banana).
 * 
 * Multimodal: Directly processes and incorporates user-uploaded reference images
 * (Brand Logo & Product/Visual Screenshot) into the generated artwork.
 */
export async function handleGenerateImage(body = {}) {
  const prompt = body.prompt || 'creative promotional visual for YouTube Community';
  const aspectRatio = body.aspectRatio || '1:1';
  const referenceImages = body.referenceImages || [];

  try {
    const parts = [];
    let hasLogo = false;
    let hasVisual = false;
    let refCount = 0;

    // Attach reference images with explicit contextual labels for Gemini Nano Banana
    if (Array.isArray(referenceImages) && referenceImages.length > 0) {
      for (let i = 0; i < Math.min(referenceImages.length, 2); i++) {
        const item = referenceImages[i];
        const role = item.role || (i === 0 ? 'logo' : 'visual');
        const resolved = await resolveImageToInlineData(item);

        if (resolved && resolved.data) {
          refCount++;
          if (role === 'logo') {
            hasLogo = true;
            parts.push({
              text: `[REFERENCE ASSET 1: OFFICIAL BRAND LOGO]\nThis is the authentic brand logo. You MUST incorporate this exact logo design, colors, and branding elements cleanly into the generated promotional creative:`
            });
            parts.push({
              inlineData: {
                mimeType: resolved.mimeType,
                data: resolved.data
              }
            });
          } else {
            hasVisual = true;
            parts.push({
              text: `[REFERENCE ASSET 2: PRODUCT / APP UI SCREENSHOT]\nThis is the actual product, software interface, or device being promoted. You MUST feature this exact product / UI as the central hero element of the generated artwork:`
            });
            parts.push({
              inlineData: {
                mimeType: resolved.mimeType,
                data: resolved.data
              }
            });
          }
        }
      }
    }

    // Build strong conditioning instructions for the image synthesis
    const referenceRules = [];
    if (hasLogo) {
      referenceRules.push('- BRAND LOGO REQUIREMENT: The official brand logo provided above MUST be visibly embedded in the artwork (in an upper corner, on the product packaging, or on a sleek illuminated badge). Do NOT replace it with a generic placeholder icon.');
    }
    if (hasVisual) {
      referenceRules.push('- HERO PRODUCT REQUIREMENT: The product / UI screenshot from the reference image above MUST be the main visual focus and hero subject of the image. Preserve its authentic interface, buttons, and design while staging it in an epic, professional promotional studio setup.');
    }

    const aiPrompt = `TASK: HIGH-IMPACT PROMOTIONAL ARTWORK SYNTHESIS (YOUTUBE COMMUNITY)

CAMPAIGN TOPIC & REQUIREMENT:
"${prompt}"

CRITICAL RECONSTRUCTION DIRECTIVES:
1. MULTIMODAL SYNTHESIS WITH PROVIDED ASSETS:
${referenceRules.length > 0 ? referenceRules.join('\n') : '- Create an authentic, unique, bespoke promotional visual that perfectly embodies the campaign concept.'}
2. STANDALONE PROMOTIONAL VISUAL ONLY:
   - Output ONLY the standalone promotional visual/artwork as a pure image.
   - Do NOT produce a poster document layout, template flyer with bullet points, fake paragraph text, or fake clickable buttons ("Apply Now", "Deliverables").
   - It must look like a high-budget commercial advertising visual ready to post directly on YouTube Community.
3. LIGHTING & COMPOSITION:
   - Modern studio lighting with subtle volumetric glow, crisp edge definition, and cinematic depth of field.
4. DESIRED ASPECT RATIO: ${aspectRatio}.`;

    parts.push({ text: aiPrompt });

    console.log(`🍌 [Google Vertex AI Nano Banana] Synthesizing image (Ref Assets: ${refCount}, Logo: ${hasLogo}, Product: ${hasVisual}, Aspect: ${aspectRatio})...`);

    const res = await handleVertexGenerateContent({
      model: 'gemini-2.5-flash-image',
      accessToken: body.accessToken,
      payload: {
        contents: [{
          role: 'user',
          parts
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      }
    });

    if (res.status === 200 && res.data) {
      const candidateParts = res.data.candidates?.[0]?.content?.parts || [];
      const imagePart = candidateParts.find(p => p.inlineData && p.inlineData.data);
      const textPart = candidateParts.find(p => p.text)?.text || '';

      if (imagePart) {
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;
        const filename = `nefra_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

        console.log(`✅ [Google Vertex AI Nano Banana] Successfully synthesized genuine image (${mimeType}, base64 length: ${imagePart.inlineData.data.length})`);

        // Upload to Firebase Storage bucket immediately
        const storageUrl = await uploadToFirebaseBucket(imagePart.inlineData.data, mimeType, filename);

        return {
          status: 200,
          data: {
            success: true,
            provider: 'google_vertex_ai',
            model: 'gemini-2.5-flash-image (Nano Banana)',
            dataUrl,
            storageUrl: storageUrl || null,
            imageUrl: storageUrl || dataUrl,
            mimeType,
            description: textPart,
            aspectRatio
          }
        };
      }
    }

    // If image generation failed, report the exact Google error
    const errMsg = res.data?.error?.message || 'Google Vertex AI Nano Banana returned no image data.';
    console.warn('⚠️ [Google Vertex AI Nano Banana] Image generation error:', errMsg);
    return {
      status: res.status || 500,
      data: {
        success: false,
        error: errMsg
      }
    };
  } catch (err) {
    console.error('❌ [Google Vertex AI Image Gen] Error:', err.message);
    return {
      status: 500,
      data: {
        success: false,
        error: err.message
      }
    };
  }
}
