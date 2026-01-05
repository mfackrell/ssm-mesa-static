import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js"; // <--- Specific Import
const { generateFacebookCaption } = require('./steps/generateFacebookCaption'); // path to file above

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  // --- STEP 1: Topic Selection ---
  const topic = await selectTopic();
  console.log(`Topic Selected: "${topic}"`);

async function ssmOrchestrator() {
  // Concurrent execution
  const [facebookContent, instagramContent] = await Promise.all([
    generateFacebookCaption(openai),
    generateInstagramCaption(openai)
  ]);
  console.log("Instagram caption generated successfully.");

  console.log("Orchestrator finished successfully.");

  return {
    status: "completed",
    topic: topic,
    facebookContent, 
    instagramContent  };
}
