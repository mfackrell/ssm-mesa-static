import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js"; // <--- Specific Import

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  // --- STEP 1: Topic Selection ---
  const topic = await selectTopic();
  console.log(`Topic Selected: "${topic}"`);

  // --- STEP 2: Instagram Caption Generation ---
  // We explicitly call the Instagram generator here. 
  // Later we can add generateLinkedInPost(topic) in parallel if needed.
  const instagramCaption = await generateInstagramCaption(topic);
  console.log("Instagram caption generated successfully.");

  console.log("Orchestrator finished successfully.");

  return {
    status: "completed",
    topic: topic,
    instagramCaption: instagramCaption 
  };
}
