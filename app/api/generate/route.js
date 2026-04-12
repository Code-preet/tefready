export async function POST(req) {
  try {
    const { lang, xp, completedLessons } = await req.json()

    const levelLabel = !xp || xp < 100 ? 'absolute beginner A1' :
      xp < 300 ? 'beginner A1-A2' :
      xp < 600 ? 'elementary A2' :
      xp < 1000 ? 'intermediate B1' :
      xp < 1500 ? 'upper intermediate B2' : 'advanced B2-C1'

    const weakAreas = !completedLessons?.length ? 'greetings, numbers, basic vocabulary' :
      completedLessons.length < 6 ? 'verbs, sentence structure, time expressions' :
      'complex grammar, TEF exam strategies, advanced vocabulary'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `You are a professional French language teacher creating a daily lesson for a TEF Canada student.

Student level: ${levelLabel}
XP points: ${xp || 0}
Completed lessons: ${completedLessons?.join(', ') || 'none yet'}
Weak areas: ${weakAreas}
Interface language: ${lang || 'en'}

Respond ONLY with a valid JSON object, no markdown, no code blocks, no extra text:

{
  "title": "<short engaging title for today's lesson, e.g. 'Talking About Your Day'>",
  "topic": "<one sentence describing the focus, e.g. 'Practice reflexive verbs and daily routine vocabulary'>",
  "concept": "<2-3 sentence grammar or concept explanation appropriate for ${levelLabel} level>",
  "vocabulary": [
    { "french": "<French word or phrase>", "phonetic": "<pronunciation>", "english": "<English meaning>", "example": "<short French example sentence>" },
    { "french": "<French word or phrase>", "phonetic": "<pronunciation>", "english": "<English meaning>", "example": "<short French example sentence>" },
    { "french": "<French word or phrase>", "phonetic": "<pronunciation>", "english": "<English meaning>", "example": "<short French example sentence>" },
    { "french": "<French word or phrase>", "phonetic": "<pronunciation>", "english": "<English meaning>", "example": "<short French example sentence>" },
    { "french": "<French word or phrase>", "phonetic": "<pronunciation>", "english": "<English meaning>", "example": "<short French example sentence>" }
  ],
  "tip": "<one interesting cultural tip about French Canada relevant to the lesson topic>"
}`
        }]
      })
    })

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''

    let lesson
    try {
      lesson = JSON.parse(rawText)
    } catch {
      const clean = rawText.replace(/```json|```/g, '').trim()
      lesson = JSON.parse(clean)
    }

    return Response.json({ lesson })
  } catch (err) {
    console.error('Generate error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}