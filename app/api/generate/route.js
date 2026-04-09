import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req) {
  try {
    const { lang, level, xp, completedLessons } = await req.json()

    const levelLabel = xp < 100 ? 'absolute beginner A1' :
      xp < 300 ? 'beginner A1-A2' :
      xp < 600 ? 'elementary A2' :
      xp < 1000 ? 'intermediate B1' :
      xp < 1500 ? 'upper intermediate B2' : 'advanced B2-C1'

    const weakAreas = completedLessons?.length < 3 ? 'greetings, numbers, basic vocabulary' :
      completedLessons?.length < 6 ? 'verbs, sentence structure, time expressions' :
      'complex grammar, TEF exam strategies, advanced vocabulary'

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a professional French language teacher creating a daily homework assignment for a TEF Canada student.

Student level: ${levelLabel}
XP points: ${xp}
Completed lessons: ${completedLessons?.join(', ') || 'none yet'}
Weak areas to focus on: ${weakAreas}
Interface language: ${lang || 'en'}

Create an engaging, structured daily French homework assignment. Include:
1. A warm-up vocabulary exercise (5 words with translations)
2. A grammar focus point with explanation and 3 examples
3. A practice exercise (fill in blanks or translate sentences)
4. A speaking prompt (describe something in French)
5. A cultural tip about French Canada

Format it clearly with emojis and sections. Make it appropriate for ${levelLabel} level. Keep it encouraging and motivating. Total length should be comprehensive but not overwhelming - about 400-500 words.`
      }]
    })

    const lesson = message.content[0].text

    return Response.json({ lesson })
  } catch (err) {
    console.error('Generate error:', err)
    return Response.json({ 
      error: 'Failed to generate lesson',
      details: err.message 
    }, { status: 500 })
  }
}