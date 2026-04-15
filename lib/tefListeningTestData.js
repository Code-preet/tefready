/**
 * TEF Listening Test Data
 * 10 questions across A1 → B2, mixing sentences, conversations, and announcements.
 * Each question has a French TTS script, English transcript, 4 MCQ options,
 * the correct answer index, and an explanation shown in the results screen.
 */

export const LISTENING_QUESTIONS = [
  // ── Q1 · A1 · Sentence ──────────────────────────────────────────
  {
    id: 'q1',
    number: 1,
    level: 'A1',
    type: 'sentence',
    typeLabel: 'Short Sentence',
    timerSeconds: 25,
    script:
      "Bonjour, je m'appelle Sophie. J'ai trente ans et je travaille comme institutrice dans une école primaire à Québec.",
    scriptEn:
      "Hello, my name is Sophie. I am thirty years old and I work as a primary school teacher in Québec.",
    question: "What is Sophie's job?",
    questionFr: "Quelle est la profession de Sophie ?",
    options: ['Nurse', 'Primary school teacher', 'University professor', 'Office assistant'],
    answer: 1,
    explanation: 'Sophie says "je travaille comme institutrice dans une école primaire" — she works as a primary school teacher.',
  },

  // ── Q2 · A1 · Announcement ──────────────────────────────────────
  {
    id: 'q2',
    number: 2,
    level: 'A1',
    type: 'announcement',
    typeLabel: 'Announcement',
    timerSeconds: 25,
    script:
      "Attention s'il vous plaît. Le prochain train à destination de Montréal partira à dix heures et demie, voie numéro quatre. Les voyageurs sont priés de se rendre au quai dix minutes avant le départ.",
    scriptEn:
      "Attention please. The next train to Montréal will depart at ten thirty, platform number four. Passengers are asked to go to the platform ten minutes before departure.",
    question: "Which platform does the Montréal train depart from?",
    questionFr: "De quelle voie part le train pour Montréal ?",
    options: ['Platform 2', 'Platform 3', 'Platform 4', 'Platform 5'],
    answer: 2,
    explanation: 'The announcement says "voie numéro quatre" — platform number four.',
  },

  // ── Q3 · A2 · Conversation ──────────────────────────────────────
  {
    id: 'q3',
    number: 3,
    level: 'A2',
    type: 'conversation',
    typeLabel: 'Short Conversation',
    timerSeconds: 35,
    script:
      "Excusez-moi, vous savez où se trouve la bibliothèque municipale ? Oui, bien sûr. Prenez la rue principale, continuez tout droit jusqu'au feu rouge, puis tournez à droite. La bibliothèque est juste après la poste, sur votre gauche. Merci beaucoup ! De rien, bonne journée !",
    scriptEn:
      "Excuse me, do you know where the municipal library is? — Yes, of course. Take the main street, go straight to the traffic light, then turn right. The library is just after the post office, on your left. — Thank you very much! — You're welcome, have a good day!",
    question: "Where is the library relative to the post office?",
    questionFr: "Où se trouve la bibliothèque par rapport à la poste ?",
    options: [
      'Before the post office, on the right',
      'Just after the post office, on the left',
      'Directly opposite the post office',
      'Next to the post office, on the right',
    ],
    answer: 1,
    explanation: '"La bibliothèque est juste après la poste, sur votre gauche" — it is just after the post office, on the left.',
  },

  // ── Q4 · A2 · Announcement ──────────────────────────────────────
  {
    id: 'q4',
    number: 4,
    level: 'A2',
    type: 'announcement',
    typeLabel: 'Announcement',
    timerSeconds: 30,
    script:
      "Votre attention s'il vous plaît. Le vol numéro deux cent cinq à destination de Vancouver est retardé de quarante-cinq minutes en raison de conditions météorologiques défavorables sur la côte ouest. Nous nous excusons pour ce désagrément. Les passagers sont priés de rester dans la salle d'embarquement.",
    scriptEn:
      "Your attention please. Flight number two hundred and five to Vancouver is delayed by forty-five minutes due to unfavourable weather conditions on the west coast. We apologize for this inconvenience. Passengers are asked to remain in the boarding area.",
    question: "Why is flight 205 delayed?",
    questionFr: "Pourquoi le vol 205 est-il retardé ?",
    options: [
      'Technical problems with the aircraft',
      'An employee strike',
      'Bad weather on the west coast',
      'Late arrival of the previous flight',
    ],
    answer: 2,
    explanation: '"en raison de conditions météorologiques défavorables sur la côte ouest" — due to unfavourable weather conditions on the west coast.',
  },

  // ── Q5 · A2 · Sentence ──────────────────────────────────────────
  {
    id: 'q5',
    number: 5,
    level: 'A2',
    type: 'sentence',
    typeLabel: 'Short Sentence',
    timerSeconds: 30,
    script:
      "Ma sœur est devenue végétarienne il y a trois ans. Elle ne mange ni viande ni poisson, mais elle consomme des produits laitiers et des œufs. Elle dit que ce changement a beaucoup amélioré sa santé.",
    scriptEn:
      "My sister became a vegetarian three years ago. She eats neither meat nor fish, but she does eat dairy products and eggs. She says that this change has greatly improved her health.",
    question: "What does the speaker's sister eat?",
    questionFr: "Qu'est-ce que la sœur du locuteur mange ?",
    options: [
      'Meat and vegetables',
      'Fish and fruit only',
      'Dairy products and eggs',
      'Only fruit and vegetables',
    ],
    answer: 2,
    explanation: 'She eats "produits laitiers et des œufs" (dairy products and eggs) — she avoids meat and fish ("ni viande ni poisson").',
  },

  // ── Q6 · B1 · Conversation ──────────────────────────────────────
  {
    id: 'q6',
    number: 6,
    level: 'B1',
    type: 'conversation',
    typeLabel: 'Conversation',
    timerSeconds: 40,
    script:
      "Bonjour madame Tremblay. Je vous appelle au sujet du poste de comptable que vous avez publié. Ah oui, bonjour. Vous avez de l'expérience en comptabilité ? Oui, j'ai travaillé pendant six ans dans une firme d'experts-comptables à Montréal. Très bien. Ce poste est à temps partiel, trois jours par semaine. Est-ce que ça vous conviendrait ? Tout à fait, c'est exactement ce que je cherche. Parfait. Pourriez-vous venir passer un entretien jeudi matin ?",
    scriptEn:
      "Hello Ms. Tremblay. I'm calling about the accountant position you posted. — Ah yes, hello. Do you have accounting experience? — Yes, I worked for six years at an accounting firm in Montréal. — Very good. This position is part-time, three days per week. Would that suit you? — Absolutely, that's exactly what I'm looking for. — Perfect. Could you come for an interview Thursday morning?",
    question: "How many days per week is the advertised job?",
    questionFr: "Combien de jours par semaine est ce poste ?",
    options: ['2 days per week', '3 days per week', '4 days per week', '5 days per week'],
    answer: 1,
    explanation: '"Ce poste est à temps partiel, trois jours par semaine" — the position is part-time, three days per week.',
  },

  // ── Q7 · B1 · Announcement ──────────────────────────────────────
  {
    id: 'q7',
    number: 7,
    level: 'B1',
    type: 'announcement',
    typeLabel: 'Radio Report',
    timerSeconds: 40,
    script:
      "Selon une récente étude publiée par l'Institut de la statistique du Québec, le nombre de personnes qui pratiquent le bénévolat dans la province a augmenté de vingt-deux pour cent au cours des cinq dernières années. Les chercheurs attribuent cette hausse à une prise de conscience accrue des enjeux sociaux et à la montée des plateformes numériques qui facilitent la mise en relation entre bénévoles et organismes.",
    scriptEn:
      "According to a recent study published by the Institut de la statistique du Québec, the number of people volunteering in the province has increased by twenty-two percent over the past five years. Researchers attribute this increase to greater awareness of social issues and the rise of digital platforms that connect volunteers with organizations.",
    question: "By how much has volunteering in Québec increased over the past 5 years?",
    questionFr: "De combien le bénévolat a-t-il augmenté au Québec ces 5 dernières années ?",
    options: ['12%', '18%', '22%', '28%'],
    answer: 2,
    explanation: '"a augmenté de vingt-deux pour cent" — has increased by twenty-two percent.',
  },

  // ── Q8 · B1 · Conversation ──────────────────────────────────────
  {
    id: 'q8',
    number: 8,
    level: 'B1',
    type: 'conversation',
    typeLabel: 'Conversation',
    timerSeconds: 40,
    script:
      "Tu as vu les nouvelles ? Ils vont fermer le centre communautaire du quartier pour construire des condos. C'est scandaleux ! Ce centre, c'est le seul endroit où les personnes âgées peuvent se retrouver. Exactement. On devrait signer la pétition et aller à la réunion du conseil municipal lundi soir. Tu as raison. Je vais en parler à ma voisine aussi, elle est très impliquée dans le comité de résidents. Bonne idée. Plus on sera nombreux, plus on aura de chances d'être entendus.",
    scriptEn:
      "Did you see the news? They're going to close the neighbourhood community centre to build condos. — That's outrageous! That centre is the only place where elderly people can meet. — Exactly. We should sign the petition and go to the city council meeting Monday evening. — You're right. I'll talk to my neighbour too, she's very involved in the residents' committee. — Good idea. The more of us there are, the better chance we'll have of being heard.",
    question: "What do the two speakers agree to do?",
    questionFr: "Que décident de faire les deux personnes ?",
    options: [
      'Write a letter to the mayor',
      'Sign the petition and attend the council meeting',
      'Organize a street protest',
      'Contact a journalist',
    ],
    answer: 1,
    explanation: '"On devrait signer la pétition et aller à la réunion du conseil municipal" — they decide to sign the petition and attend the council meeting.',
  },

  // ── Q9 · B2 · Sentence / Opinion ────────────────────────────────
  {
    id: 'q9',
    number: 9,
    level: 'B2',
    type: 'sentence',
    typeLabel: 'Opinion Statement',
    timerSeconds: 45,
    script:
      "Contrairement à ce qu'affirment certains économistes, la mondialisation n'a pas simplement créé des gagnants et des perdants selon les pays, mais a généré des inégalités profondes à l'intérieur même des sociétés développées. Les travailleurs peu qualifiés dans les pays riches ont vu leurs salaires stagner ou diminuer, tandis que les détenteurs de capital et les travailleurs hautement qualifiés ont largement profité de l'ouverture des marchés.",
    scriptEn:
      "Contrary to what some economists claim, globalization has not simply created winners and losers by country, but has generated deep inequalities within developed societies themselves. Low-skilled workers in wealthy countries have seen their wages stagnate or decline, while capital holders and highly skilled workers have largely benefited from open markets.",
    question: "What is the speaker's main argument about globalization?",
    questionFr: "Quel est l'argument principal du locuteur sur la mondialisation ?",
    options: [
      'It has been equally beneficial for all workers',
      'It has mainly harmed developing countries',
      'It has created deep inequalities within wealthy societies themselves',
      'It has had no significant impact on wages',
    ],
    answer: 2,
    explanation: 'The speaker says globalization has generated "inégalités profondes à l\'intérieur même des sociétés développées" — deep inequalities within developed societies themselves.',
  },

  // ── Q10 · B2 · Conversation / Debate ────────────────────────────
  {
    id: 'q10',
    number: 10,
    level: 'B2',
    type: 'conversation',
    typeLabel: 'Expert Opinion',
    timerSeconds: 45,
    script:
      "Le problème de la crise du logement ne se résoudra pas uniquement par la construction de nouveaux immeubles. Il faut une approche multidimensionnelle. Certes, augmenter l'offre est nécessaire, mais sans mesures de contrôle des loyers et sans protection accrue des locataires, les nouveaux logements seront simplement accaparés par les investisseurs et resteront inaccessibles pour les ménages à revenus modestes. La véritable solution passe par une régulation plus stricte du marché immobilier.",
    scriptEn:
      "The housing crisis cannot be solved solely by building more buildings. A multidimensional approach is needed. Certainly, increasing supply is necessary, but without rent control measures and stronger tenant protections, new housing will simply be captured by investors and remain inaccessible to low-income households. The real solution lies in stricter regulation of the real estate market.",
    question: "According to the speaker, what is the real solution to the housing crisis?",
    questionFr: "Selon le locuteur, quelle est la vraie solution à la crise du logement ?",
    options: [
      'Building more housing units as quickly as possible',
      'Stricter regulation of the real estate market',
      'Reducing property taxes to attract investors',
      'Increasing subsidies for first-time homebuyers',
    ],
    answer: 1,
    explanation: '"La véritable solution passe par une régulation plus stricte du marché immobilier" — the real solution lies in stricter regulation of the real estate market.',
  },
];

export const LEVEL_COLORS = {
  A1: '#16A34A',
  A2: '#0891B2',
  B1: '#D97706',
  B2: '#7C3AED',
};

export const LEVEL_BGS = {
  A1: '#F0FDF4',
  A2: '#E0F2FE',
  B1: '#FFFBEB',
  B2: '#F5F3FF',
};

export const TYPE_ICONS = {
  sentence: '🗣️',
  conversation: '💬',
  announcement: '📢',
};

export const TOTAL_QUESTIONS = LISTENING_QUESTIONS.length;
