import { uploadToGCS } from "../helpers/uploadToGCS.js";

export async function generatePinterestImage(pinterestData) {
  console.log("Starting Pinterest Image Generation (Model: gemini-3-pro-image-preview)...");
  
  // Use the Title generated in the text step as the overlay
  const textOverlay = pinterestData.title || "Subtle Recognition"; 

  const prompt = `
Create a Pinterest graphic (1080x1920).
Style: Elegant, modern typography, minimalist, warm palette (sands, charcoal, cream).
Mood: Grounding, reflective, safe.
NO people, NO clips arts.

TEXT TO RENDER: "${textOverlay}"
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:predict?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { 
          sampleCount: 1, 
          aspectRatio: "9:16",
          safetyFilterLevel: "block_none",
          personGeneration: "allow_adult"
        } 
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini Image request failed (${response.status}): ${body}`);
    }

    const data = await response.json();
    if (!data.predictions) throw new Error(JSON.stringify(data));

    const imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
    const filename = `pin_img_${Date.now()}.png`;

    return await uploadToGCS(imageBuffer, filename);

  } catch (error) {
    console.error("Pinterest Image Gen Failed:", error);
    throw error;
  }
}
