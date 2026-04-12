import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set.' }, { status: 500 });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { prompt: writingPrompt = '', text = '' } = body;

  if (!text || text.length < 10) {
    return NextResponse.json({ error: 'Text too short.' }, { status: 400 });
  }

  const systemPrompt = `You are an expert TEF Canada French writing examiner. Evaluate the student's written response and provide constructive feedback.

Writing task: ${writingPrompt}

Student's response: ${text}

Return ONLY a valid JSON object with NO markdown, NO code blocks:

{
  "score": "a score like 'B1 level' or 'CLB 6' or 'Needs Work' based on their French quality. If they wrote in English, note that but still give helpful feedback.",
  "strengths": "2-3 sentences about what they did well. Be encouraging. If they used good French structures or vocabulary, mention them specifically.",
  "improve": "2-3 specific, actionable suggestions to improve their French writing for TEF Canada. Be concrete and practical.",
  "phrase": "Give them one excellent French phrase or sentence they could use for this type of writing task (formal email, report, etc.). Make it a model example they can learn from."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'API error' }, { status: 500 });
    }

    const data = await response.json();
    const responseText = data.content
      .map(c => (c.type === 'text' ? c.text : ''))
      .join('')
      .replace(/```json|```/g, '')
      .trim();

    const feedback = JSON.parse(responseText);
    return NextResponse.json(feedback);
  } catch (e) {
    console.error('Feedback error:', e);
    return NextResponse.json({
      score: 'Review Complete',
      strengths: 'Good effort putting together a response. Writing practice is essential for TEF success.',
      improve: 'Focus on formal register (vous, pas de contractions), clear paragraph structure, and linking words (premièrement, ensuite, enfin).',
      phrase: 'Je vous écris afin de vous informer que...',
    });
  }
}
