/**
 * TEF Speaking Simulation Data
 *
 * Two full simulations matching real TEF Canada oral expression format.
 * Each simulation has 3 tasks with prep time + speaking time, a sample
 * answer in FR + EN, a 4-part structure guide, and key phrases.
 */

export const SIMULATIONS = [
  // ─────────────────────────────────────────────────────────────────
  // SIMULATION A — Intermediate (CLB 5–8)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sim-a',
    title: 'Simulation A',
    subtitle: 'Intermediate · CLB 5–8',
    level: 'CLB 5–8',
    icon: '🎙️',
    color: '#0891B2',
    bg: '#E0F2FE',
    totalMinutes: 5,
    tasks: [
      {
        id: 'sim-a-t1',
        number: 1,
        type: 'Ask for Information',
        typeFr: 'Demander des informations',
        icon: '❓',
        clbLevel: 'CLB 5–6',
        prepTime: 45,
        speakTime: 60,
        instructions:
          'You just moved to Montréal and need to find a family doctor. Call a medical clinic to ask for the information you need to register as a new patient.',
        instructionsFr:
          "Vous venez d'emménager à Montréal et vous devez trouver un médecin de famille. Appelez une clinique médicale pour demander les informations nécessaires pour vous inscrire comme nouveau patient.",
        context: '📞 You are calling a medical clinic.',
        sampleAnswer: {
          fr: "Bonjour, je m'appelle Harjot Singh et je viens tout juste d'arriver à Montréal. Je cherche un médecin de famille. Est-ce que votre clinique accepte de nouveaux patients ? Si oui, quels documents dois-je apporter pour m'inscrire ? Est-ce que j'ai besoin d'une carte d'assurance maladie du Québec ? J'ai aussi une question sur les délais — combien de temps dois-je attendre pour un premier rendez-vous ? Et quelles sont vos heures d'ouverture ? Merci beaucoup pour votre aide.",
          en: "Hello, my name is Harjot Singh and I just arrived in Montréal. I am looking for a family doctor. Does your clinic accept new patients? If so, what documents do I need to bring to register? Do I need a Québec health insurance card? I also have a question about wait times — how long do I need to wait for a first appointment? And what are your opening hours? Thank you very much for your help.",
        },
        structure: {
          introduction: 'Greet politely and state who you are and why you are calling.',
          mainIdea: 'Ask the key questions: Does the clinic accept new patients? What documents are needed?',
          example: 'Add a specific question: "Est-ce que j\'ai besoin d\'une carte d\'assurance maladie du Québec ?"',
          conclusion: 'Ask about wait times or next steps. Thank them and close politely.',
        },
        keyPhrases: [
          { fr: 'Je cherche un médecin de famille.', en: 'I am looking for a family doctor.' },
          { fr: 'Est-ce que vous acceptez de nouveaux patients ?', en: 'Do you accept new patients?' },
          { fr: 'Quels documents dois-je apporter ?', en: 'What documents do I need to bring?' },
          { fr: 'Quels sont les délais d\'attente ?', en: 'What are the wait times?' },
        ],
      },
      {
        id: 'sim-a-t2',
        number: 2,
        type: 'Describe and Compare',
        typeFr: 'Décrire et comparer',
        icon: '🏠',
        clbLevel: 'CLB 6–7',
        prepTime: 45,
        speakTime: 90,
        instructions:
          'You are choosing between two apartments. The first is a small studio downtown — close to the metro but noisy. The second is a larger 3½ in the suburbs — spacious with a backyard but a long commute. Describe both options and explain which one you would choose and why.',
        instructionsFr:
          "Vous choisissez entre deux appartements. Le premier est un petit studio au centre-ville — près du métro mais bruyant. Le deuxième est un grand 3½ en banlieue — spacieux avec une cour mais un long trajet. Décrivez les deux options et expliquez lequel vous choisiriez et pourquoi.",
        context: '🗣️ You are explaining your choice to a friend.',
        sampleAnswer: {
          fr: "Je dois choisir entre deux appartements et c'est une décision difficile. D'un côté, j'ai un studio au centre-ville. Il est petit, mais il est très bien situé, juste à côté du métro, ce qui me permettrait d'économiser du temps et de l'argent sur les transports. L'inconvénient, c'est qu'il est bruyant la nuit, ce qui pourrait nuire à mon sommeil. De l'autre côté, il y a un 3½ en banlieue. Il est beaucoup plus spacieux et il y a une belle cour pour se détendre l'été. Mais le trajet jusqu'au centre-ville prendrait au moins une heure. Après réflexion, je choisirais le studio au centre-ville. Pour moi, la proximité des transports et du travail est prioritaire. Le bruit, je peux le gérer avec des bouchons d'oreilles — mais je ne peux pas récupérer deux heures de trajet par jour.",
          en: "I have to choose between two apartments and it's a difficult decision. On one hand, I have a studio downtown. It is small, but it is very well located, right next to the metro, which would save me time and money on transportation. The downside is that it is noisy at night, which could affect my sleep. On the other hand, there is a 3½ in the suburbs. It is much more spacious and has a lovely backyard to relax in during summer. But the commute to downtown would take at least an hour. After reflection, I would choose the studio downtown. For me, proximity to transport and work is the priority. I can manage the noise with earplugs — but I cannot get back two hours of commuting per day.",
        },
        structure: {
          introduction: 'Frame the choice: "Je dois choisir entre deux appartements…"',
          mainIdea: 'Describe Option A (pros & cons) then Option B (pros & cons) using "D\'un côté… de l\'autre…"',
          example: 'Give a concrete reason: "Le métro me ferait économiser une heure par jour."',
          conclusion: 'State your final choice with a decisive reason. Be clear and confident.',
        },
        keyPhrases: [
          { fr: 'D\'un côté… de l\'autre côté…', en: 'On one hand… on the other hand…' },
          { fr: 'L\'avantage principal, c\'est…', en: 'The main advantage is…' },
          { fr: 'L\'inconvénient, c\'est que…', en: 'The downside is that…' },
          { fr: 'Après réflexion, je choisirais…', en: 'After reflection, I would choose…' },
        ],
      },
      {
        id: 'sim-a-t3',
        number: 3,
        type: 'Express an Opinion',
        typeFr: 'Exprimer une opinion',
        icon: '💭',
        clbLevel: 'CLB 7–8',
        prepTime: 60,
        speakTime: 120,
        instructions:
          'Some people believe that learning French is essential for successful integration into Canadian society. Others think it should be a personal choice. What is your opinion? Defend your point of view with concrete examples.',
        instructionsFr:
          "Certaines personnes pensent que l'apprentissage du français est essentiel pour réussir son intégration au Canada. D'autres estiment que cela devrait être un choix personnel. Quelle est votre opinion ? Défendez votre point de vue avec des exemples concrets.",
        context: '🎓 You are speaking to a group of newcomers.',
        sampleAnswer: {
          fr: "À mon avis, apprendre le français est fondamental pour réussir son intégration au Canada, surtout au Québec. Je vais défendre cette position avec trois arguments. Premièrement, la langue est le principal vecteur de communication avec la société d'accueil. Sans le français, on reste isolé et on rate des opportunités professionnelles importantes. Deuxièmement, maîtriser le français facilite l'accès aux services publics — les hôpitaux, les écoles, les services gouvernementaux. Enfin, apprendre la langue d'un pays, c'est aussi respecter et comprendre sa culture et son histoire. Je comprends que l'apprentissage prend du temps et des efforts, surtout pour les adultes. Mais des ressources comme les cours MIDI au Québec sont gratuites et accessibles à tous. En conclusion, je suis convaincu que le français est une clé indispensable pour s'épanouir pleinement au Canada.",
          en: "In my opinion, learning French is fundamental to successful integration in Canada, especially in Québec. I will defend this position with three arguments. First, language is the main vehicle of communication with the host society. Without French, one remains isolated and misses important professional opportunities. Second, mastering French facilitates access to public services — hospitals, schools, government services. Finally, learning a country's language also means respecting and understanding its culture and history. I understand that learning takes time and effort, especially for adults. But resources like the MIDI courses in Québec are free and accessible to everyone. In conclusion, I am convinced that French is an indispensable key to thriving fully in Canada.",
        },
        structure: {
          introduction: 'State your position clearly: "À mon avis… Je vais défendre cette position avec X arguments."',
          mainIdea: 'Give 2–3 arguments. Use "Premièrement / Deuxièmement / Enfin" to structure them.',
          example: 'Illustrate with a personal or concrete example to make it real and credible.',
          conclusion: 'Restate your view firmly: "En conclusion, je suis convaincu(e) que…"',
        },
        keyPhrases: [
          { fr: 'À mon avis, il est essentiel de…', en: 'In my opinion, it is essential to…' },
          { fr: 'Premièrement… Deuxièmement… Enfin…', en: 'First… Second… Finally…' },
          { fr: 'Pour illustrer, prenons l\'exemple de…', en: 'To illustrate, let\'s take the example of…' },
          { fr: 'En conclusion, je suis convaincu(e) que…', en: 'In conclusion, I am convinced that…' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SIMULATION B — Advanced (CLB 8–12)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sim-b',
    title: 'Simulation B',
    subtitle: 'Advanced · CLB 8–12',
    level: 'CLB 8–12',
    icon: '🏆',
    color: '#7C3AED',
    bg: '#F5F3FF',
    totalMinutes: 8,
    tasks: [
      {
        id: 'sim-b-t1',
        number: 1,
        type: 'Make a Request / Complaint',
        typeFr: 'Faire une demande / une réclamation',
        icon: '📦',
        clbLevel: 'CLB 8–9',
        prepTime: 45,
        speakTime: 75,
        instructions:
          'You ordered a laptop online two weeks ago. It arrived with a cracked screen and a missing charger. Call the customer service line to report the problem and request a solution.',
        instructionsFr:
          "Vous avez commandé un ordinateur portable en ligne il y a deux semaines. Il est arrivé avec un écran fissuré et un chargeur manquant. Appelez le service clientèle pour signaler le problème et demander une solution.",
        context: '📞 You are calling customer service.',
        sampleAnswer: {
          fr: "Bonjour, je vous appelle au sujet d'une commande que j'ai passée il y a deux semaines, numéro de commande A-4821. J'ai reçu mon ordinateur portable hier, mais malheureusement il y a deux problèmes sérieux. D'abord, l'écran est fissuré — il était comme ça à l'ouverture de la boîte, donc c'est clairement un problème d'emballage ou de transport. Ensuite, le chargeur n'était pas inclus dans la boîte. Ce sont des problèmes inacceptables pour un produit à ce prix. Je voudrais qu'on me propose deux options : soit un remplacement immédiat du produit, soit un remboursement complet. J'aimerais également que vous preniez en charge les frais de retour. Pourriez-vous me dire quelle est la procédure à suivre ? Et dans quel délai puis-je espérer une solution ?",
          en: "Hello, I am calling about an order I placed two weeks ago, order number A-4821. I received my laptop yesterday, but unfortunately there are two serious problems. First, the screen is cracked — it was like that when I opened the box, so it is clearly a packaging or transport problem. Second, the charger was not included in the box. These are unacceptable problems for a product at this price. I would like you to offer me two options: either an immediate replacement of the product, or a full refund. I would also like you to cover the return shipping costs. Could you tell me what procedure to follow? And within what timeframe can I expect a solution?",
        },
        structure: {
          introduction: 'Identify yourself and reference your order. State you are calling about a problem.',
          mainIdea: 'Describe each issue clearly and specifically. Use "D\'abord… Ensuite…"',
          example: 'Explain why it is unacceptable: "C\'est inacceptable pour un produit à ce prix."',
          conclusion: 'State what you want (replacement or refund). Ask about next steps and timelines.',
        },
        keyPhrases: [
          { fr: 'Je vous appelle au sujet de ma commande numéro…', en: 'I am calling about my order number…' },
          { fr: 'Il y a un problème sérieux avec…', en: 'There is a serious problem with…' },
          { fr: 'C\'est inacceptable car…', en: 'This is unacceptable because…' },
          { fr: 'Je voudrais un remboursement / remplacement.', en: 'I would like a refund / replacement.' },
        ],
      },
      {
        id: 'sim-b-t2',
        number: 2,
        type: 'Present Options and Recommend',
        typeFr: 'Présenter des options et recommander',
        icon: '⚖️',
        clbLevel: 'CLB 9–10',
        prepTime: 60,
        speakTime: 120,
        instructions:
          'Your city must decide between two urban projects: building a new highway to reduce traffic congestion, or expanding the public transit network. Present both options with their advantages and disadvantages, then make a clear recommendation.',
        instructionsFr:
          "Votre ville doit choisir entre deux projets urbains : construire une nouvelle autoroute pour réduire la congestion, ou développer le réseau de transport en commun. Présentez les deux options avec leurs avantages et inconvénients, puis faites une recommandation claire.",
        context: '🏛️ You are presenting at a public consultation.',
        sampleAnswer: {
          fr: "La ville est confrontée à un choix crucial qui aura des répercussions pour les décennies à venir. Je vais présenter les deux options de façon équilibrée avant de formuler ma recommandation. La première option — construire une nouvelle autoroute — offre une solution rapide à la congestion actuelle et est relativement facile à financer via des partenariats privés. Cependant, cette approche est contreproductive à long terme : de nouvelles autoroutes génèrent davantage de trafic, augmentent les émissions de CO₂ et renforcent la dépendance à l'automobile. La deuxième option — développer le transport en commun — est plus coûteuse à court terme et demande plusieurs années de mise en œuvre. Toutefois, ses bénéfices sont durables : réduction des émissions, accessibilité pour tous les citoyens, revitalisation des quartiers. Ma recommandation est claire : investir dans le transport en commun. C'est la seule solution alignée avec les impératifs environnementaux et les besoins à long terme de notre population.",
          en: "The city faces a crucial choice that will have repercussions for decades to come. I will present both options in a balanced way before making my recommendation. The first option — building a new highway — offers a quick solution to current congestion and is relatively easy to finance through private partnerships. However, this approach is counterproductive in the long term: new highways generate more traffic, increase CO₂ emissions, and reinforce car dependency. The second option — developing public transit — is more costly in the short term and requires several years to implement. However, its benefits are lasting: reduction in emissions, accessibility for all citizens, revitalization of neighbourhoods. My recommendation is clear: invest in public transit. It is the only solution aligned with environmental imperatives and the long-term needs of our population.",
        },
        structure: {
          introduction: 'Frame the decision and announce your plan: "Je vais présenter les deux options avant de recommander…"',
          mainIdea: 'Option A: present pros then cons. Option B: present pros then cons. Use parallel structure.',
          example: 'Use a statistic or fact: "Les nouvelles autoroutes génèrent en moyenne 30% de trafic supplémentaire."',
          conclusion: 'Make a decisive recommendation. Justify it in one strong sentence.',
        },
        keyPhrases: [
          { fr: 'La première option présente l\'avantage de…, mais l\'inconvénient de…', en: 'The first option has the advantage of…, but the disadvantage of…' },
          { fr: 'À court terme… à long terme…', en: 'In the short term… in the long term…' },
          { fr: 'Ma recommandation est claire :…', en: 'My recommendation is clear:…' },
          { fr: 'C\'est la seule solution qui permette de…', en: 'It is the only solution that allows…' },
        ],
      },
      {
        id: 'sim-b-t3',
        number: 3,
        type: 'Defend a Position',
        typeFr: 'Défendre une position',
        icon: '🤖',
        clbLevel: 'CLB 10–12',
        prepTime: 60,
        speakTime: 150,
        instructions:
          '"Artificial intelligence poses more risks than benefits for society." Do you agree or disagree with this statement? Defend your position rigorously, anticipate counter-arguments, and conclude with your vision for the future.',
        instructionsFr:
          '« L\'intelligence artificielle présente plus de risques que d\'avantages pour la société. » Êtes-vous d\'accord ou non avec cette affirmation ? Défendez votre position de façon rigoureuse, anticipez les contre-arguments et concluez avec votre vision pour l\'avenir.',
        context: '🎤 You are speaking at a public debate.',
        sampleAnswer: {
          fr: "Cette affirmation soulève une question fondamentale pour notre époque, et je choisis de la contester, tout en reconnaissant sa part de vérité. En effet, l'IA comporte des risques réels : déplacement de certains emplois, risques liés à la vie privée, potentiel de désinformation à grande échelle. Ces préoccupations sont légitimes et ne doivent pas être minimisées. Cependant, je soutiens que les avantages de l'IA surpassent ses risques, à condition qu'elle soit gouvernée de façon responsable. Premièrement, l'IA transforme la médecine : elle détecte des cancers avec une précision supérieure aux médecins dans certains contextes. Deuxièmement, elle accélère la recherche climatique, permettant de modéliser des solutions en quelques heures plutôt qu'en années. Troisièmement, elle démocratise l'accès au savoir et à des outils professionnels pour des millions de personnes dans les pays en développement. La vraie question n'est pas si l'IA est bonne ou mauvaise, mais comment nous choisissons de la réguler et de la déployer. Avec un cadre éthique solide et une gouvernance internationale, l'IA peut être la plus grande accélération du progrès humain depuis la révolution industrielle.",
          en: "This statement raises a fundamental question for our time, and I choose to challenge it, while acknowledging its grain of truth. Indeed, AI carries real risks: displacement of certain jobs, privacy risks, potential for large-scale disinformation. These concerns are legitimate and should not be minimized. However, I argue that the benefits of AI outweigh its risks, provided it is governed responsibly. First, AI is transforming medicine: it detects cancers with precision superior to doctors in certain contexts. Second, it accelerates climate research, allowing solutions to be modelled in hours rather than years. Third, it democratizes access to knowledge and professional tools for millions of people in developing countries. The real question is not whether AI is good or bad, but how we choose to regulate and deploy it. With a solid ethical framework and international governance, AI can be the greatest acceleration of human progress since the industrial revolution.",
        },
        structure: {
          introduction: 'State your position AND concede the opposing view briefly: "Certes… Cependant, je soutiens que…"',
          mainIdea: 'Give 3 strong arguments with "Premièrement / Deuxièmement / Troisièmement". Be specific.',
          example: 'Cite a concrete example or statistic for at least one argument to add credibility.',
          conclusion: 'Reframe the debate on your terms and state a forward-looking vision.',
        },
        keyPhrases: [
          { fr: 'Certes, on peut reconnaître que… Cependant…', en: 'Admittedly, one can recognize that… However…' },
          { fr: 'À condition que… soit gouverné(e) de façon responsable…', en: 'Provided that… is governed responsibly…' },
          { fr: 'La vraie question n\'est pas… mais…', en: 'The real question is not… but…' },
          { fr: 'Avec un cadre éthique solide,…', en: 'With a solid ethical framework,…' },
        ],
      },
    ],
  },
];
