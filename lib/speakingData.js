export const speakingTasks = [
  {
    id: 'task1',
    number: 1,
    type: 'Monologue',
    title: 'Tâche 1 — Monologue',
    timeLimit: 180,
    prepTime: 60,
    clbLevel: 'CLB 6–8',
    color: '#7C3AED',
    icon: '🗣️',
    prompt: `Vous revenez d'un voyage au Québec. Racontez votre expérience à un ami. Parlez des endroits que vous avez visités, de la culture que vous avez découverte, et expliquez pourquoi vous recommanderiez (ou non) ce voyage.`,
    englishHint: 'Talk about a trip to Quebec. Describe places you visited, culture you discovered, and whether you would recommend it.',
    tips: [
      'Organize your speech: introduction, main points, conclusion',
      'Use past tenses: passé composé and imparfait',
      'Give specific details and examples',
      'Express your personal opinion clearly'
    ],
    vocabulary: ['le patrimoine', 'la gastronomie', 'dépaysant', 'inoubliable', 'je vous conseille vivement', 'en ce qui me concerne']
  },
  {
    id: 'task2',
    number: 2,
    type: 'Interaction',
    title: 'Tâche 2 — Interaction',
    timeLimit: 240,
    prepTime: 60,
    clbLevel: 'CLB 7–9',
    color: '#0D9488',
    icon: '💬',
    prompt: `Vous cherchez un appartement à louer à Montréal. Expliquez votre situation à un agent immobilier : votre budget, le quartier que vous préférez, le nombre de chambres dont vous avez besoin, et vos autres critères importants. Posez également des questions sur les démarches à suivre pour louer en tant que nouvel arrivant au Canada.`,
    englishHint: 'You are looking for an apartment in Montreal. Explain your situation to a real estate agent and ask questions about the rental process as a newcomer.',
    tips: [
      'Use polite formal language with an agent',
      'Ask clear questions using est-ce que or pourriez-vous',
      'Express conditions: je préférerais... / j\'aurais besoin de...',
      'Show you understand their responses by asking follow-up questions'
    ],
    vocabulary: ['le loyer', 'les charges comprises', 'le bail', 'une pièce', 'le quartier', 'à proximité de', 'je serais intéressé(e) par']
  },
  {
    id: 'task3',
    number: 3,
    type: 'Point de vue',
    title: 'Tâche 3 — Point de vue',
    timeLimit: 300,
    prepTime: 90,
    clbLevel: 'CLB 8–12',
    color: '#D97706',
    icon: '⚖️',
    prompt: `Le télétravail devrait-il devenir la norme pour tous les emplois de bureau ? Donnez votre point de vue en présentant des arguments pour et contre, puis défendez votre position personnelle. Appuyez-vous sur des exemples concrets tirés de votre expérience ou de l'actualité.`,
    englishHint: 'Should remote work become the norm for all office jobs? Present arguments for and against, then defend your personal position with concrete examples.',
    tips: [
      'Structure: présenter le sujet → arguments pour → arguments contre → votre position',
      'Use linking words: d\'abord, ensuite, de plus, cependant, en revanche, en conclusion',
      'Express nuance: certes... mais / il est vrai que... cependant',
      'Use subjunctive for opinions: je pense que c\'est important que les gens puissent...'
    ],
    vocabulary: ['la productivité', 'l\'équilibre travail-vie', 'le lien social', 'l\'isolement', 'flexible', 'en présentiel', 'à distance', 'selon moi']
  }
]

export const scoringRubric = {
  fluency: { label: 'Fluency & Delivery', description: 'How smoothly and naturally you speak', weight: 25 },
  vocabulary: { label: 'Vocabulary Range', description: 'Variety and appropriateness of words used', weight: 25 },
  grammar: { label: 'Grammar Accuracy', description: 'Correct use of French grammar structures', weight: 25 },
  coherence: { label: 'Coherence & Task', description: 'How well you address the prompt and organize ideas', weight: 25 }
}
