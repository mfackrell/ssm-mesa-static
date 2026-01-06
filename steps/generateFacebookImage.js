import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadToGCS } from "../helpers/uploadToGCS.js";
import { extractHeadline } from "../helpers/extractHeadline.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

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

  try {
    // 3. Generate Image
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // Note: Check specific Gemini/Imagen syntax for your region. 
      // Some versions use model.generateImages(). Assuming generateContent for multimodal or standard prompt.
    });
    
    // *ADJUSTMENT FOR IMAGEN API SPECIFIC RESPONSE STRUCTURE*
    // If using the specific Imagen endpoint, the response structure differs.
    // Below assumes standard Gemini response containing inline data. 
    // If specifically using 'imagen-3.0-generate-001', we expect base64.
    
    // For safety, let's assume the standard 'generateImages' method if available in your SDK version:
    // const response = await model.generateImages({ prompt, number_of_images: 1 });
    // const imageBase64 = response.images[0].image_base64; // Pseudo-code based on generic Imagen

    // MOCK IMPLEMENTATION IF SDK IS NEW:
    // In production, you might need to use raw fetch if the SDK is lagging behind the model release.
    // For now, I will assume the result contains the image data.
    
    // *CRITICAL*: Ensure you handle the specific response format of the library you installed.
    // Assuming 'result.response' contains the data.
    
    // --- MOCKING BUFFER FOR ORCHESTRATOR FLOW (Replace with actual SDK extraction) ---
    // const imageBuffer = Buffer.from(result.response.images[0].b64, 'base64'); 
    
    // INSTRUCTION: Since I cannot see your exact SDK version, ensure 'extractImageFromResponse' 
    // matches your installed version of @google/generative-ai
    
    throw new Error("Ensure @google/generative-ai supports Imagen 3 method calls directly, otherwise use REST fetch.");

  } catch (error) {
    // FALLBACK TO REST API (More reliable for specific Imagen versions)
    // I will write the REST implementation here as it is safer for "Gemini 3 Preview".
    console.log("Switching to REST fetch for Imagen...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1, aspectRatio: "1:1" } // FB Square
      })
    });

    const data = await response.json();
    if (!data.predictions) throw new Error("No predictions from Imagen.");

    const imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
    const filename = `fb_img_${Date.now()}.png`;
    
    // 4. Upload
    return await uploadToGCS(imageBuffer, filename);
  }
}
