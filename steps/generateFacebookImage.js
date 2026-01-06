import { uploadToGCS } from "../helpers/uploadToGCS.js";
import { extractHeadline } from "../helpers/extractHeadline.js";

export async function generateFacebookImage(caption) {
  console.log("Starting Facebook Image Generation...");

  // 1. Get the precise text for the image
  const headline = await extractHeadline(caption, "Facebook");
  console.log(`Extracted Headline for FB: "${headline}"`);

  // 2. Construct the Prompt
  const prompt = `
Create a powerful, share-worthy Facebook graphic (1200x1350).
Purpose: Spark recognition of subtle emotional harm.
Design: Minimalist, premium typography, clean layout, warm muted colors (slate, navy, sand).
NO photos of people, NO cliches, NO chaotic imagery.
Emotional Tone: Calm strength, clarity.

TEXT TO RENDER ON IMAGE: "${headline}"

Context from caption: ${caption.substring(0, 200)}...
  `;

  // Use REST call consistently for Imagen to avoid SDK compatibility issues.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: prompt }],
      parameters: { sampleCount: 1, aspectRatio: "1:1" } // FB Square
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Imagen request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  if (!data.predictions) throw new Error("No predictions from Imagen.");

  const imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
  const filename = `fb_img_${Date.now()}.png`;
  
  // 4. Upload
  return await uploadToGCS(imageBuffer, filename);
}
