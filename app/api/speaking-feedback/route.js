export async function POST(req) {
  try {
    const { transcript, prompt, taskType, clbLevel } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are an official TEF Canada French speaking examiner. Evaluate this spoken French response.

TASK TYPE: ${taskType}
TARGET LEVEL: ${clbLevel}
PROMPT GIVEN: ${prompt}
STUDENT TRANSCRIPT: ${transcript}

Score on the official TEF Canada rubric. Respond ONLY with valid JSON, no markdown, no extra text:

{
  "overallScore": <number 0-100>,
  "clbEstimate": "<e.g. CLB 7-8>",
  "scores": {
    "fluency": <number 0-25>,
    "vocabulary": <number 0-25>,
    "grammar": <number 0-25>,
    "coherence": <number 0-25>
  },
  "summary": "<2-3 sentences of honest constructive feedback in English>",
  "improvements": [
    "<specific improvement tip 1>",
    "<specific improvement tip 2>",
    "<specific improvement tip 3>",
    "<specific improvement tip 4>"
  ],
  "vocabularySuggestions": [
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"},
    {"word": "<French word or phrase>", "meaning": "<English meaning>"}
  ]
}`
        }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let feedbackObj
    try {
      feedbackObj = JSON.parse(text)
    } catch {
      const clean = text.replace(/```json|```/g, '').trim()
      feedbackObj = JSON.parse(clean)
    }

    return Response.json({ feedback: feedbackObj })
  } catch (err) {
    console.error('Speaking feedback error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}