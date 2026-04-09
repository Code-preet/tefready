export async function POST(req) {
  try {
    const { lang, level, xp, completedLessons } = await req.json()

    const levelLabel = xp < 100 ? 'absolute beginner A1' :
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
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a professional French language teacher creating a daily homework assignment for a TEF Canada student.

Student level: ${levelLabel}
XP points: ${xp}
Completed lessons: ${completedLessons?.join(', ') || 'none yet'}
Weak areas: ${weakAreas}
Interface language: ${lang || 'en'}

Create an engaging structured daily French homework. Include:
1. Warm-up vocabulary (5 words with translations and examples)
2. Grammar focus point with explanation and 3 examples
3. Practice exercise (fill in blanks or translate 3 sentences)
4. Speaking prompt (describe something in French)
5. Cultural tip about French Canada

Format clearly with emojis and sections. Appropriate for ${levelLabel} level. Keep it encouraging. About 400-500 words.`
        }]
      })
    })

    const data = await response.json()
    const lesson = data.content?.[0]?.text || 'Could not generate lesson.'
    return Response.json({ lesson })
  } catch (err) {
    console.error('Generate error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}