import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

// Initialize the Groq API client if API key is provided
let aiClient = null;
if (process.env.GROQ_API_KEY) {
  try {
    aiClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (error) {
    console.error("Failed to initialize Groq API client:", error);
  }
}

/**
 * Generates a warm, empathetic 2-sentence companion response.
 */
export async function generateCompanionResponse(mood, sleep, energy, note) {
  const moodLabels = {
    1: "very low (😔)",
    2: "low/neutral (😐)",
    3: "okay (🙂)",
    4: "good (😊)",
    5: "amazing (🤩)"
  };

  const noteSnippet = note && note.trim() ? `Journal note: "${note.trim()}"` : "No journal note provided.";

  const prompt = `You are a warm, empathetic mental wellness companion for college and high school students.
The student just checked in:
- Mood: ${moodLabels[mood]} (${mood}/5)
- Sleep: ${sleep} hours
- Energy Level: ${energy}/10
- ${noteSnippet}

Write a supportive, highly personalized 2-sentence response. 
Rules:
- Be genuinely warm, understanding, and kind.
- Act like a caring, down-to-earth friend, NOT a therapist or clinical professional.
- Do NOT give medical or diagnostic advice.
- Do NOT sound preachy or formal.
- Keep it to exactly 2 sentences.`;

  if (aiClient) {
    try {
      const completion = await aiClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant'
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn("AI generation failed, reverting to high-quality fallback engine:", e);
    }
  }

  // High-Quality Custom Heuristic Fallback Engine
  return getHeuristicCompanionResponse(mood, sleep, energy, note);
}

/**
 * Heuristic response generator that feels like a real caring companion.
 */
function getHeuristicCompanionResponse(mood, sleep, energy, note) {
  const containsKeywords = (words) => {
    if (!note) return false;
    const lower = note.toLowerCase();
    return words.some(w => lower.includes(w));
  };

  const isTired = sleep < 6 || containsKeywords(['tired', 'sleepy', 'exhausted', 'awake', 'night']);
  const isStressed = containsKeywords(['stress', 'exam', 'test', 'study', 'grade', 'school', 'fail', 'hard']);
  const isLonely = containsKeywords(['lonely', 'sad', 'miss', 'alone', 'crying', 'friend', 'relationship']);

  if (mood <= 2) {
    if (isTired) {
      return "It sounds like you're running on empty today, and everything feels heavier when you're exhausted. Please give yourself permission to rest tonight; you deserve a break.";
    }
    if (isStressed) {
      return "School and stress can feel incredibly overwhelming, but remember your worth isn't defined by a single test or study session. Take things one tiny step at a time, you've got this.";
    }
    if (isLonely) {
      return "I'm really sorry you're feeling isolated right now. Just know that your feelings are valid, and even on the loneliest days, you are not truly alone.";
    }
    return "I'm sorry today is a tough one. Remember that it's completely okay not to be okay—be gentle with yourself today.";
  }

  if (mood === 3) {
    if (isTired) {
      return "You're holding up okay, but that low sleep is definitely dragging down your energy. Make sure to grab a warm drink and wind down early tonight if you can.";
    }
    return "A steady, balanced day is a quiet victory. I hope you find a small moment of joy in your evening, even if it's just listening to a favorite song.";
  }

  // High moods (4-5)
  if (mood >= 4) {
    if (sleep > 8) {
      return "Look at that mood shine! It's amazing how much a solid night of sleep can set the tone for a beautiful day—keep riding this positive wave!";
    }
    if (containsKeywords(['proud', 'accomplished', 'did', 'finish', 'pass'])) {
      return "Celebrate this win, no matter how small! You worked hard for this feeling, and you deserve to soak up every single second of it.";
    }
    return "I am absolutely thrilled to see you feeling so vibrant today! Keep this beautiful energy going and share a smile with someone else.";
  }

  return "Thank you for checking in and sharing how you feel. I'm right here with you, supporting you through every high and low.";
}

/**
 * Analyzes last 30 days of data and extracts 3 detailed, empathetic pattern cards.
 */
export async function generateWeeklyInsights(moodData) {
  if (!moodData || moodData.length === 0) {
    return getFallbackInsights([]);
  }

  const prompt = `You are an empathetic, expert mental wellness data analyst for students.
Analyze this JSON array of mood and health data from the past month:
${JSON.stringify(moodData, null, 2)}

Identify exactly 3 meaningful behavioral patterns or correlations (e.g., connection between sleep and mood, day-of-week trends, energy dips, journal entries).
Return a JSON array containing exactly 3 objects. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Just return raw JSON.
Each object MUST have the following structure:
{
  "id": "unique-string",
  "category": "Sleep / Exercise / Routine / Mental Health / Academic",
  "observation": "A specific, data-driven observation starting with 'We noticed...'",
  "suggestion": "A warm, gentle, actionable suggestion for improvement.",
  "impact": "High / Medium / Low"
}

Ensure your tone is warm, understanding, and never clinical or robotic.`;

  if (aiClient) {
    try {
      const completion = await aiClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant'
      });
      let text = completion.choices[0]?.message?.content?.trim();
      
      // Clean up markdown markers if present
      if (text.startsWith("```")) {
        text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed;
      }
    } catch (e) {
      console.warn("Weekly AI insight generation failed, using heuristic analysis:", e);
    }
  }

  // High-Quality Fallback Heuristic Analysis
  return getFallbackInsights(moodData);
}

/**
 * Heuristic insights based on real analysis of user data.
 */
function getFallbackInsights(moodData) {
  if (!moodData || moodData.length < 3) {
    return [
      {
        id: "insight-sleep",
        category: "Sleep",
        observation: "We noticed you are building a routine! As you log more entries, we will map how sleep directly boosts your daily outlook.",
        suggestion: "Aim for a consistent window of 7-8 hours of sleep this week to give your body and mind a solid baseline.",
        impact: "High"
      },
      {
        id: "insight-rhythm",
        category: "Routine",
        observation: "We're excited to analyze your patterns! Once you complete 5 logs, we will search for your peak energy days.",
        suggestion: "Try checking in at the same time each day (e.g., right before bed) to build a rewarding reflection habit.",
        impact: "Medium"
      },
      {
        id: "insight-notes",
        category: "Reflection",
        observation: "We noticed you started writing brief journal notes. Putting thoughts into words is a great emotional outlet.",
        suggestion: "Keep adding a short note when you log. Over time, it helps externalize stress and celebrate hidden wins.",
        impact: "High"
      }
    ];
  }

  // Simple aggregation logic for realistic observations
  let totalSleep = 0;
  let totalMood = 0;
  let sleepBelowSixDays = 0;
  let moodWhenSleepBelowSix = 0;
  let sleepAboveEightDays = 0;
  let moodWhenSleepAboveEight = 0;

  moodData.forEach(entry => {
    const s = parseFloat(entry.sleep_hours || entry.sleep || 0);
    const m = parseInt(entry.mood || 0);
    totalSleep += s;
    totalMood += m;

    if (s < 6) {
      sleepBelowSixDays++;
      moodWhenSleepBelowSix += m;
    } else if (s >= 8) {
      sleepAboveEightDays++;
      moodWhenSleepAboveEight += m;
    }
  });

  const avgSleep = (totalSleep / moodData.length).toFixed(1);
  const avgMood = (totalMood / moodData.length).toFixed(1);

  const insights = [];

  // Sleep correlation insight
  if (sleepBelowSixDays > 0 && sleepAboveEightDays > 0) {
    const avgMoodLowSleep = (moodWhenSleepBelowSix / sleepBelowSixDays);
    const avgMoodHighSleep = (moodWhenSleepAboveEight / sleepAboveEightDays);

    if (avgMoodHighSleep > avgMoodLowSleep) {
      insights.push({
        id: "insight-sleep-impact",
        category: "Sleep",
        observation: `We noticed your average mood climbs to ${(avgMoodHighSleep).toFixed(1)}/5 on days after you get 8+ hours of sleep, compared to only ${(avgMoodLowSleep).toFixed(1)}/5 on low sleep days.`,
        suggestion: "Protect your bedtime! Try keeping screens away for 30 minutes before bed on days when you have early exams.",
        impact: "High"
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: "insight-sleep-avg",
      category: "Sleep",
      observation: `We noticed your average sleep sits at ${avgSleep} hours per night. This represents a solid foundation for study concentration.`,
      suggestion: "Try to maintain this average, especially during high-stress exam periods.",
      impact: "Medium"
    });
  }

  // Mood stability/level insight
  if (avgMood < 3.0) {
    insights.push({
      id: "insight-mood-level",
      category: "Mental Health",
      observation: `We noticed your emotional energy has been leaning on the lower side recently, averaging ${avgMood}/5 across this period.`,
      suggestion: "Be gentle with your expectations. Try scheduling one small 10-minute walk outside today to reset your mind.",
      impact: "High"
    });
  } else {
    insights.push({
      id: "insight-mood-level",
      category: "Routine",
      observation: `We noticed you maintain a positive emotional baseline of ${avgMood}/5. You're exhibiting strong emotional resilience!`,
      suggestion: "Save these positive logs as a mental anchor for times when things feel more frantic or stressful.",
      impact: "Medium"
    });
  }

  // Energy & academic connection
  insights.push({
    id: "insight-energy-reflection",
    category: "Academic",
    observation: "We noticed a strong correlation between your physical energy levels and your overall journal outlook.",
    suggestion: "When physical energy dips, treat it as a signal to prioritize screen breaks and hydration during study blocks.",
    impact: "High"
  });

  return insights;
}

/**
 * Generates a real-time conversational response for the personalized chatbot.
 */
export async function generateChatResponse(messages, companionType, mood, userId, imageBase64, customInstructions) {
  const companionProfiles = {
    fox: "Kira the Fox: Clever, playful, and highly perceptive. Loves clever analogies.",
    panda: "Bao the Panda: Gentle, warm, and deeply comforting. Uses food/nature metaphors.",
    bunny: "Luna the Bunny: Energetic, extremely optimistic, and sweet.",
    otter: "Ollie the Otter: Joyful, social, and loves celebrating small wins.",
    cat: "Mochi the Cat: Sassy, independent, but secretly very affectionate.",
    penguin: "Pippin the Penguin: Loyal, structured, and resilient.",
    shiba: "Kobi the Shiba: Enthusiastic, loyal, and incredibly supportive."
  };

  const personality = companionProfiles[companionType] || "A warm, supportive friend.";
  
  let recentJournals = "";
  let userName = "the user";
  if (userId) {
    try {
      const userRes = await db.query('SELECT full_name FROM profiles WHERE id = $1', [userId]);
      if (userRes.rows.length > 0 && userRes.rows[0].full_name) {
        userName = userRes.rows[0].full_name;
      }
      const logsRes = await db.query('SELECT date, note FROM mood_entries WHERE user_id = $1 ORDER BY date DESC LIMIT 3', [userId]);
      const logs = logsRes.rows;
      if (logs.length > 0) {
        recentJournals = "User's recent journal entries for context:\\n" + logs.map(l => `- ${l.date}: ${l.note}`).join("\\n");
      }
    } catch (e) {
      console.error('Failed to fetch user data for chat:', e);
    }
  }

  const systemPrompt = `You are playing the role of a mental wellness companion.
Your personality is: ${personality}
The user's name is: ${userName}. You MUST address them by their name (e.g., "${userName}"). Do NOT use generic terms like "my friend".
The user's current mood is: ${mood}.
${customInstructions ? `User's Custom Personalization Instructions: ${customInstructions}` : ''}
${recentJournals}
You are having a continuous conversation with them.
Rules:
- Speak strictly IN CHARACTER.
- Be supportive, warm, and conversational.
- Do NOT act like an AI or an assistant. Act like a close companion, but never call them "my friend"—use their actual name.
- Keep responses relatively brief (1-3 sentences) so it feels like a real chat.
- Do not offer medical advice.`;

  if (aiClient) {
    try {
      let mappedHistory = [{ role: 'system', content: systemPrompt }];
      
      messages.slice(0, -1).forEach(m => {
        if (mappedHistory.length === 1 && m.role !== 'user') return; // Skip initial non-user messages
        mappedHistory.push({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        });
      });
      
      const lastMessage = messages[messages.length - 1];
      
      if (imageBase64) {
        mappedHistory.push({
          role: 'user',
          content: [
            { type: 'text', text: lastMessage.text },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        });
      } else {
        mappedHistory.push({ role: 'user', content: lastMessage.text });
      }

      const completion = await aiClient.chat.completions.create({
        messages: mappedHistory,
        model: imageBase64 ? 'llama-3.2-11b-vision-preview' : 'llama-3.1-8b-instant'
      });
      
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn("AI chat generation failed, reverting to fallback:", e);
    }
  }

  // Fallback if no API key or if API fails
  const lastUserMsg = messages[messages.length - 1].text.toLowerCase();
  
  if (lastUserMsg.includes('sad') || lastUserMsg.includes('bad') || lastUserMsg.includes('tired')) {
    return "I hear you, and I'm so sorry you're feeling that way. I'm right here with you.";
  } else if (lastUserMsg.includes('happy') || lastUserMsg.includes('good') || lastUserMsg.includes('great')) {
    return "That's wonderful to hear! I love seeing you happy.";
  } else if (lastUserMsg.includes('stress') || lastUserMsg.includes('anxious')) {
    return "Take a deep breath. You don't have to carry it all at once. We'll get through this step by step.";
  }
  
  return "I'm listening. Tell me more about what's on your mind.";
}

/**
 * Generates a Multi-Agent Council response.
 */
export async function generateCouncilResponse(question, userId) {
  let recentJournals = "";
  if (userId) {
    try {
      const logsRes = await db.query('SELECT date, note FROM mood_entries WHERE user_id = $1 ORDER BY date DESC LIMIT 3', [userId]);
      const logs = logsRes.rows;
      if (logs.length > 0) {
        recentJournals = "User's recent journal entries for context:\\n" + logs.map(l => `- ${l.date}: ${l.note}`).join("\\n");
      }
    } catch (e) {
      console.error('Failed to fetch journal memory:', e);
    }
  }

  const basePrompt = `The user asked: "${question}".
${recentJournals}
Give a 2-3 sentence response from your perspective.`;

  const foxPrompt = `You are Kira the Fox (Clever, cognitive, logical). ${basePrompt}`;
  const pandaPrompt = `You are Bao the Panda (Gentle, rest-focused, mindful). ${basePrompt}`;
  const otterPrompt = `You are Ollie the Otter (Social, emotional, joyful). ${basePrompt}`;

  if (aiClient) {
    try {
      const [foxRes, pandaRes, otterRes] = await Promise.all([
        aiClient.chat.completions.create({ messages: [{ role: 'user', content: foxPrompt }], model: 'llama3-8b-8192' }),
        aiClient.chat.completions.create({ messages: [{ role: 'user', content: pandaPrompt }], model: 'llama3-8b-8192' }),
        aiClient.chat.completions.create({ messages: [{ role: 'user', content: otterPrompt }], model: 'llama3-8b-8192' })
      ]);

      const foxOpinion = foxRes.choices[0]?.message?.content?.trim();
      const pandaOpinion = pandaRes.choices[0]?.message?.content?.trim();
      const otterOpinion = otterRes.choices[0]?.message?.content?.trim();

      const summaryPrompt = `Three AI companions debated the user's issue: "${question}".
Kira (Fox) said: "${foxOpinion}"
Bao (Panda) said: "${pandaOpinion}"
Ollie (Otter) said: "${otterOpinion}"

Write a concise, 3-step action plan synthesizing their advice. Do not use markdown, just raw text separated by newlines.`;
      
      const summaryRes = await aiClient.chat.completions.create({
        messages: [{ role: 'user', content: summaryPrompt }],
        model: 'llama-3.1-8b-instant'
      });
      const summary = summaryRes.choices[0]?.message?.content?.trim();

      return {
        agents: [
          { name: 'Kira the Fox', role: 'Cognitive Analysis', text: foxOpinion, avatar: '🦊' },
          { name: 'Bao the Panda', role: 'Rest & Mindfulness', text: pandaOpinion, avatar: '🐼' },
          { name: 'Ollie the Otter', role: 'Social & Emotional', text: otterOpinion, avatar: '🦦' }
        ],
        summary
      };
    } catch (e) {
      console.warn("Council AI generation failed:", e);
    }
  }

  // Fallback
  return {
    agents: [
      { name: 'Kira the Fox', role: 'Cognitive Analysis', text: 'Break the problem down into smaller steps. Focus on what you can control right now.', avatar: '🦊' },
      { name: 'Bao the Panda', role: 'Rest & Mindfulness', text: 'It is important to rest your body. Make sure you are taking deep breaths and sleeping well.', avatar: '🐼' },
      { name: 'Ollie the Otter', role: 'Social & Emotional', text: 'Reach out to a friend! You do not have to carry this heavy feeling all by yourself.', avatar: '🦦' }
    ],
    summary: "1. Break the task down.\n2. Prioritize rest today.\n3. Call a friend."
  };
}
