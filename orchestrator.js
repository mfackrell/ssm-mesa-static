import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js";
import { generateFacebookCaption } from "./steps/generateFacebookCaption.js"; // Fixed import style
import { generatePinterestCaption } from "./steps/generatePinterestCaption.js"; // <--- New Import

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  try {
    // --- STEP 1: Topic Selection ---
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    // --- STEP 2: Content Generation (Concurrent) ---
    // Note: We pass 'topic' only. The functions handle their own OpenAI instances.
    const [facebookContent, instagramContent, pinterestData] = await Promise.all([
      generateFacebookCaption(topic),
      generateInstagramCaption(topic),
      generatePinterestCaption(topic)
    ]);

    console.log("Content generated successfully.");

    return {
      status: "completed",
      topic: topic,
      facebookContent, 
      instagramContent,
      pinterestTitle: pinterestData.title,
      pinterestCaption: pinterestData.caption
    };

  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
}
