import { handleVertexGenerateContent } from './vertexHandler.js';

/**
 * Google Vertex AI Nano Banana Image Synthesizer
 * Generates an authentic, standalone promotional image for YouTube Community
 * using Google Cloud Vertex AI (gemini-2.5-flash-image / Nano Banana).
 * 
 * Multimodal: Directly processes and incorporates up to 2 user-uploaded reference images
 * (such as brand logo, product UI, or app screenshot) alongside the prompt requirements.
 */
export async function handleGenerateImage(body = {}) {
  const prompt = body.prompt || 'creative promotional visual for YouTube Community';
  const aspectRatio = body.aspectRatio || '1:1';
  const referenceImages = body.referenceImages || [];

  try {
    const parts = [];
    let refImageCount = 0;

    // Attach up to 2 reference images uploaded by the user for multimodal synthesis
    if (Array.isArray(referenceImages) && referenceImages.length > 0) {
      for (const img of referenceImages.slice(0, 2)) {
        const rawUrl = img.url || img.dataUrl || (typeof img === 'string' ? img : '');
        if (rawUrl && rawUrl.startsWith('data:')) {
          const match = rawUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            refImageCount++;
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
      }
    }

    const refGuidance = refImageCount > 0
      ? `\n\nREFERENCE IMAGES PROVIDED:
The brand has uploaded ${refImageCount} reference image(s) above (such as their official brand logo, product UI, or app screenshot).
MANDATORY: Analyze these uploaded images carefully. Extract the brand visual identity, colors, logo shape, product UI elements, and combine them into this promotional image for: "${prompt}".`
      : '';

    const aiPrompt = `You are Google Vertex AI Nano Banana, Google's native multimodal image generation model.
Generate a complete, high-impact, standalone promotional image for YouTube Community representing:
"${prompt}"${refGuidance}

CRITICAL RULES:
1. Generate ONLY the standalone promotional visual/artwork itself as an image.
2. Incorporate the uploaded reference assets (logo / product screenshot) naturally and prominently into the artwork.
3. DO NOT output a document template, poster flyer layout, application UI mockup, fake bullet points, or fake buttons ("Apply Now", "Deliverables").
4. Produce a stunning, polished, high-resolution visual ready to be uploaded directly as an image on YouTube Community.
5. Desired aspect ratio: ${aspectRatio}.`;

    parts.push({ text: aiPrompt });

    console.log(`🍌 [Google Vertex AI Nano Banana] Requesting genuine image generation (ref images: ${refImageCount}, aspect: ${aspectRatio})...`);

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
        console.log(`✅ [Google Vertex AI Nano Banana] Successfully synthesized genuine image (${mimeType}, base64 len: ${imagePart.inlineData.data.length})`);

        return {
          status: 200,
          data: {
            success: true,
            provider: 'google_vertex_ai',
            model: 'gemini-2.5-flash-image (Nano Banana)',
            dataUrl,
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
