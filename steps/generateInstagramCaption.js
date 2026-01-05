import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInstagramCaption(topic) {
  console.log(`Generating Instagram caption for topic: "${topic}"`);

  const systemPrompt = `
You are a trauma-informed Christian psychologist and a viral Instagram content strategist. You specialize in "Instagram Therapy" style content—visual, skimmable, and deeply resonant. You fight back against spiritual manipulation using Godly truth, but you do so with a tone that stops the scroll.
`;

  const userPrompt = `
The audience is intelligent and intuitive but conditioned to doubt themselves. They are scrolling quickly. You must catch them immediately.

TOPIC: ${topic}

STRICT INSTAGRAM FORMATTING:
1. **The Hook:** The first line must be short, punchy, and visible *before* the "more" fold. No filler.
2. **The Body:** Use clean line breaks between every single sentence or short paragraph. Instagram collapses text; whitespace is crucial for readability.
3. **The Tone:** Compassionate, reflective, "I see you" energy. Not clinical.
4. **The Arc:** - Start with the feeling (e.g., "You feel crazy when...").
   - Move to the internal shift (e.g., "So you stop speaking up...").
   - Gently name the pattern (e.g., "This isn't just sensitivity, it's...").
5. **The Close:** A specific, open-ended question to drive comments (engagement).

CONSTRAINTS:
- Do NOT use "Title:" or "Caption:" labels. Just the text.
- Do NOT provide advice or 3-step solutions. Just validation.
- Include 15 relevant hashtags at the very bottom, separated by dots or space.

GENERATE NOW.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, 
    });

    const caption = completion.choices[0].message.content;

    // --- LOGGING THE RESPONSE ---
    console.log("\n=== INSTAGRAM RESPONSE START ===");
    console.log(caption);
    console.log("=== INSTAGRAM RESPONSE END ===\n");
    // ----------------------------
    
    return caption;

  } catch (error) {
    console.error("Error generating Instagram caption:", error);
    throw new Error("Failed to generate Instagram caption.");
  }
}
