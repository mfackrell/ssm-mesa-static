import { uploadToGCS } from "../helpers/uploadToGCS.js";
import { extractHeadline } from "../helpers/extractHeadline.js";

export async function generateInstagramImage(caption) {
  console.log("Starting Instagram Image Generation...");

  const headline = await extractHeadline(caption, "Instagram");
  
  const prompt = `
Create a vertical Instagram graphic (1080x1350).
Style: Minimalist, premium typography, soft strength. 
Colors: Deep charcoal, off-white, soft gold.
NO people, NO cliches.
Context: Recognized emotional harm.

TEXT TO RENDER: "${headline}"
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1, aspectRatio: "3:4" } // Vertical
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Imagen request failed (${response.status}): ${body}`);
    }

    const data = await response.json();
    if (!data.predictions) throw new Error(JSON.stringify(data));

    const imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
    const filename = `ig_img_${Date.now()}.png`;

    return await uploadToGCS(imageBuffer, filename);

  } catch (error) {
    console.error("IG Image Gen Failed:", error);
    throw error;
  }
}
