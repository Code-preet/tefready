import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set in environment variables.' }, { status: 500 });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { level = 'A1', completedCount = 0, lang = 'en' } = body;

  const prompt = `You are a professional French language teacher specializing in TEF Canada exam preparation for immigrants. Generate a practical daily French lesson.

Student level: ${level}
Lessons completed so far: ${completedCount}
Student's native language context: ${lang}

Return ONLY a valid JSON object. No markdown, no code blocks, no backticks, no preamble. The JSON must be on a single line or well-formatted but NOT wrapped in \`\`\`json.

{
  "title": "short lesson title in English",
  "topic": "one sentence describing what this lesson covers",
  "concept": "2-3 clear, practical sentences explaining the grammar or vocabulary concept. Keep it simple and relatable for immigrants. Reference Canadian daily life.",
  "vocabulary": [
    {
      "french": "the French word or phrase",
      "phonetic": "English phonetic pronunciation guide",
      "english": "English meaning",
      "example": "A simple complete French sentence using this word"
    }
  ],
  "exercises": [
    {
      "question": "question in English",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": 0
    }
  ],
  "tip": "One practical tip specifically about using this French in Canada (Quebec, Ottawa, or bilingual workplaces). Mention real Canadian context."
}

Requirements:
- Exactly 5 vocabulary items
- Exactly 4 multiple choice exercises  
- Make it practical for Canadian immigrant life (healthcare, banking, work, school, transit)
- The tip must be specific to Canada, not generic French advice`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({ error: 'Anthropic API error' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content
      .map(c => (c.type === 'text' ? c.text : ''))
      .join('')
      .replace(/```json|```/g, '')
      .trim();

    const lesson = JSON.parse(text);
    return NextResponse.json(lesson);
  } catch (e) {
    console.error('Generate lesson error:', e);
    return NextResponse.json({ error: 'Failed to generate lesson: ' + e.message }, { status: 500 });
  }
}
