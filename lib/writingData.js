// lib/writingData.js — TEF Canada Expression écrite
// Two tasks: formal message + opinion essay

export const writingTasks = [

  // ── TASK 1 — Formal message / email ──────────────────────────────────────
  {
    id: 'w1',
    number: 1,
    type: 'Message formel',
    icon: '📧',
    color: '#2563EB',
    colorBg: '#EFF6FF',
    colorBorder: '#BFDBFE',
    clbLevel: 'CLB 5–7',
    timeRecommended: 25,  // minutes
    wordCount: { min: 150, max: 200 },
    title: 'Tâche 1 — Message formel',

    prompt: `Vous avez récemment emménagé dans un appartement à Montréal. Depuis votre arrivée, vous avez constaté plusieurs problèmes : le chauffage fonctionne mal, il y a une fuite d'eau dans la salle de bain, et l'ascenseur est en panne depuis deux semaines. Vous avez déjà signalé ces problèmes verbalement à votre propriétaire, mais rien n'a été fait.

Rédigez un courriel formel à votre propriétaire pour :
• Rappeler les problèmes signalés
• Exprimer votre mécontentement de façon polie mais ferme
• Demander une date précise d'intervention
• Mentionner les conséquences possibles si la situation n'est pas résolue rapidement`,

    format: {
      title: 'Structure recommandée',
      parts: [
        { label: 'Objet du courriel', desc: 'Indiquez clairement le sujet (ex: Problèmes de logement non résolus — Appartement 302)' },
        { label: 'Formule d\'appel', desc: 'Madame, Monsieur, / Madame Dupont,' },
        { label: 'Introduction (2–3 lignes)', desc: 'Rappelez le contexte : votre emménagement, vos signalements précédents' },
        { label: 'Développement (5–7 lignes)', desc: 'Listez les problèmes précisément. Exprimez votre insatisfaction poliment' },
        { label: 'Demande concrète (2–3 lignes)', desc: 'Demandez une date d\'intervention. Utilisez le conditionnel de politesse' },
        { label: 'Formule de clôture', desc: 'Veuillez agréer, Madame/Monsieur, l\'expression de mes salutations distinguées.' },
        { label: 'Signature', desc: 'Votre prénom, nom, numéro d\'appartement, numéro de téléphone' },
      ]
    },

    usefulPhrases: [
      { fr: 'Je me permets de vous contacter au sujet de…', en: 'I am writing to you regarding…' },
      { fr: 'Malgré mes signalements précédents…', en: 'Despite my previous reports…' },
      { fr: 'Je vous serais reconnaissant(e) de bien vouloir…', en: 'I would be grateful if you would…' },
      { fr: 'Dans l\'attente d\'une réponse rapide de votre part…', en: 'Awaiting your prompt response…' },
      { fr: 'Dans le cas contraire, je me verrai dans l\'obligation de…', en: 'Otherwise, I will be obliged to…' },
      { fr: 'Je vous prie de prendre en compte l\'urgence de la situation.', en: 'I urge you to consider the urgency of the situation.' },
    ],

    scoringCriteria: [
      { criterion: 'Contenu et pertinence', desc: 'Tous les points du sujet sont abordés', points: '/5' },
      { criterion: 'Cohérence et organisation', desc: 'Structure logique, paragraphes bien organisés', points: '/5' },
      { criterion: 'Richesse lexicale', desc: 'Vocabulaire varié et approprié au registre formel', points: '/5' },
      { criterion: 'Correction grammaticale', desc: 'Peu d\'erreurs de grammaire, conjugaison correcte', points: '/5' },
    ],

    sampleAnswer: `Objet : Problèmes de logement non résolus — Appartement 302, 1245 rue Saint-Denis

Madame, Monsieur,

Je me permets de vous contacter par écrit au sujet de plusieurs problèmes persistants dans mon appartement, que j'ai emménagé le 1er septembre dernier. Malgré mes signalements verbaux répétés au cours des deux dernières semaines, aucune intervention n'a été réalisée à ce jour.

Je vous rappelle les problèmes en question : premièrement, le système de chauffage est défaillant et la température dans mon appartement n'atteint pas les normes minimales exigées par la loi. Deuxièmement, une fuite d'eau est présente dans la salle de bain depuis mon emménagement, ce qui risque d'endommager les installations. Enfin, l'ascenseur est hors service depuis plus de deux semaines, ce qui représente une contrainte importante, notamment pour les résidents à mobilité réduite.

Je vous serais très reconnaissant(e) de bien vouloir planifier les réparations nécessaires dans les meilleurs délais et de me communiquer une date précise d'intervention pour chacun de ces problèmes. Sachez que la Régie du logement impose au propriétaire de maintenir le logement en bon état d'habitabilité.

Dans l'attente d'une réponse rapide de votre part, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Alex Jourdain
Appartement 302 — 1245 rue Saint-Denis, Montréal
Tél. : 514-555-0198`,
  },

  // ── TASK 2 — Opinion essay ────────────────────────────────────────────────
  {
    id: 'w2',
    number: 2,
    type: 'Texte d\'opinion',
    icon: '✍️',
    color: '#7C3AED',
    colorBg: '#EDE9FE',
    colorBorder: '#C4B5FD',
    clbLevel: 'CLB 7–9',
    timeRecommended: 35,
    wordCount: { min: 200, max: 250 },
    title: 'Tâche 2 — Texte d\'opinion',

    prompt: `De plus en plus d'entreprises offrent à leurs employés la possibilité de travailler à distance, depuis leur domicile ou d'un espace de coworking, plutôt que de se rendre au bureau chaque jour.

Rédigez un texte d'opinion dans lequel vous :
• Présentez les avantages du télétravail
• Exposez les inconvénients ou risques éventuels
• Défendez clairement votre position personnelle sur cette pratique
• Utilisez des exemples concrets pour appuyer vos arguments`,

    format: {
      title: 'Structure recommandée',
      parts: [
        { label: 'Introduction (3–4 lignes)', desc: 'Présentez le sujet + contexte actuel + annoncez votre plan' },
        { label: 'Paragraphe 1 — Avantages (4–6 lignes)', desc: 'Au moins 2 arguments. Utilisez des exemples précis' },
        { label: 'Paragraphe 2 — Inconvénients (4–6 lignes)', desc: 'Au moins 2 arguments opposés. Montrez une vision équilibrée' },
        { label: 'Paragraphe 3 — Votre position (3–4 lignes)', desc: 'Défendez clairement votre point de vue avec justification' },
        { label: 'Conclusion (2–3 lignes)', desc: 'Synthèse + ouverture sur une question plus large' },
      ]
    },

    usefulPhrases: [
      { fr: 'D\'un côté… de l\'autre côté…', en: 'On one hand… on the other hand…' },
      { fr: 'Il est indéniable que…', en: 'It is undeniable that…' },
      { fr: 'En revanche / Cependant / Néanmoins…', en: 'However / Nevertheless…' },
      { fr: 'À mon avis / Selon moi / Je suis d\'avis que…', en: 'In my opinion / I believe that…' },
      { fr: 'Force est de constater que…', en: 'One cannot deny that…' },
      { fr: 'En définitive / En conclusion / Pour conclure…', en: 'Ultimately / In conclusion…' },
      { fr: 'Si certes… il n\'en reste pas moins que…', en: 'While it is true that… it remains that…' },
    ],

    scoringCriteria: [
      { criterion: 'Contenu et pertinence', desc: 'Position claire, arguments développés, exemples concrets', points: '/5' },
      { criterion: 'Cohérence et organisation', desc: 'Structure avec intro/développement/conclusion, connecteurs logiques', points: '/5' },
      { criterion: 'Richesse lexicale', desc: 'Vocabulaire varié, expressions idiomatiques B2, pas de répétitions', points: '/5' },
      { criterion: 'Correction grammaticale', desc: 'Subjonctif, conditionnel, concordance des temps, accords', points: '/5' },
    ],

    sampleAnswer: `Le télétravail, qui s'est considérablement développé depuis la pandémie de 2020, soulève des questions fondamentales sur l'organisation du travail moderne. Si cette pratique présente indéniablement des avantages, elle comporte également des défis qu'il convient d'examiner avec nuance.

D'un côté, le travail à distance offre une flexibilité précieuse aux employés. En s'affranchissant des déplacements quotidiens, ils gagnent du temps, réduisent leur stress et peuvent mieux organiser leur journée. Une étude canadienne a d'ailleurs montré que les télétravailleurs déclarent en moyenne une satisfaction professionnelle plus élevée. Sur le plan environnemental, la réduction des trajets contribue également à diminuer les émissions de carbone.

Cependant, le télétravail n'est pas exempt d'inconvénients. L'isolement social constitue un risque réel : certains employés souffrent de l'absence d'interactions avec leurs collègues, ce qui peut nuire à leur bien-être mental. De plus, la frontière entre vie professionnelle et vie privée peut devenir floue, entraînant des risques de surmenage. Les jeunes employés, en particulier, peuvent perdre des occasions d'apprentissage informel qui s'opère naturellement au bureau.

À mon avis, la solution idéale réside dans un modèle hybride qui combine le meilleur des deux approches. Travailler deux ou trois jours depuis le domicile tout en maintenant une présence régulière au bureau permettrait de préserver les liens sociaux tout en bénéficiant de la flexibilité du télétravail.

En définitive, la question n'est pas de choisir entre présence totale et télétravail exclusif, mais bien d'adapter l'organisation du travail aux besoins réels des équipes et des individus.`,
  },
];
