import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFacebookCaption(topic) {
  console.log(`Generating Facebook caption for topic: "${topic}"`);

  // 1. Define the Persona
  const systemPrompt = `
You are a trauma-informed Christian Centered psychologist and viral Facebook content strategist. 
Your audience is intelligent but conditioned to doubt themselves.
Tone: Compassionate, reflective, curiosity-driven. Never preachy.
  `;

  // 2. Define the Task (User Prompt) - This was missing in your code
  const userPrompt = `
Write a Facebook post based on this TOPIC: ${topic}

Formatting requirements:
- Begin with a scroll-stopping hook (short, emotional).
- Use whitespace (1–3 sentences per paragraph).
- Use emojis for pacing.
- Build from everyday moments → internal effects → realization.
- Do NOT name "abuse" until late; use "harmful patterns."
- End with a reflective question.
- Add 8–12 hashtags at the bottom.
Output only the post.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }, // Now valid because userPrompt is defined
      ],
      temperature: 0.7, 
    });

    const caption = completion.choices[0].message.content;
    
    // --- LOGGING THE RESPONSE ---
    console.log("\n=== FACEBOOK RESPONSE START ===");
    console.log(caption);
    console.log("=== FACEBOOK RESPONSE END ===\n");
    // ----------------------------    
    return caption;

  } catch (error) {
    console.error("Error generating Facebook caption:", error);
    throw new Error("Failed to generate Facebook caption.");
  }
}
