// lib/lessonsRecap.js
// Recap section for each lesson — appended at end of lesson flow.
// keyPhrases: string[] — phrases to remember
// grammarPoints: string[] — 2-3 core grammar rules
// mustRemember: { fr, en }[] — 3-5 sentences to memorize

export const RECAP = {

  'a1-1': {
    keyPhrases: [
      'Je m\'appelle ___.  →  My name is ___.',
      'Comment vous appelez-vous ?  →  What is your name? (formal)',
      'Enchanté(e) de vous rencontrer.  →  Nice to meet you.',
      'Comment allez-vous ?  →  How are you? (formal)',
      'J\'habite à ___.  →  I live in ___.',
    ],
    grammarPoints: [
      'Être (to be): Je suis · Tu es · Il/Elle est · Nous sommes · Vous êtes · Ils sont',
      'Use VOUS with strangers, bosses, officials. Use TU with friends and family.',
      'Je m\'appelle = "I call myself" — always use this, not "Je suis ___" for names.',
    ],
    mustRemember: [
      { fr: 'Bonjour, je m\'appelle Harjot.',       en: 'Hello, my name is Harjot.' },
      { fr: 'Enchanté de vous rencontrer.',          en: 'Nice to meet you.' },
      { fr: 'Comment allez-vous ? — Très bien, merci !', en: 'How are you? — Very well, thank you!' },
      { fr: 'Je suis étudiant. J\'habite à Montréal.', en: 'I am a student. I live in Montréal.' },
      { fr: 'Au revoir, à bientôt !',               en: 'Goodbye, see you soon!' },
    ],
  },

  'a1-2': {
    keyPhrases: [
      'Combien ça coûte ?  →  How much does it cost?',
      'C\'est combien ?  →  How much is it?',
      'Voici ___ dollars.  →  Here is ___ dollars.',
      'Mon numéro de téléphone est le ___.  →  My phone number is ___.',
      'Votre monnaie  →  Your change',
    ],
    grammarPoints: [
      '70 = soixante-dix (60+10) · 80 = quatre-vingts (4×20) · 90 = quatre-vingt-dix (4×20+10)',
      'Use "et" only for 21, 31, 41, 51, 61 — NOT for 81, 91.',
      'Quatre-vingts gets an "s" only when it stands alone: deux cents BUT deux cent cinq.',
    ],
    mustRemember: [
      { fr: 'Combien ça coûte, s\'il vous plaît ?', en: 'How much does it cost, please?' },
      { fr: 'Il coûte quatre-vingt-dix-neuf dollars.', en: 'It costs ninety-nine dollars.' },
      { fr: 'Voici vingt dollars.',                  en: 'Here is twenty dollars.' },
      { fr: 'Votre total est seize dollars.',        en: 'Your total is sixteen dollars.' },
      { fr: 'Mille mercis !',                        en: 'A thousand thanks!' },
    ],
  },

  'a1-3': {
    keyPhrases: [
      'Comment est ___ ?  →  What is ___ like?',
      'Il y a ___.  →  There is / There are ___.',
      'C\'est + adjective.  →  It is ___.',
      'grand(e) / petit(e) / beau/belle / vieux/vieille  →  Come BEFORE the noun',
      'Les murs sont bleus.  →  Agree adjective with noun (gender + number)',
    ],
    grammarPoints: [
      'Adjective agreement: add -e for feminine (bleu → bleue), -s for plural (bleu → bleus).',
      'Most adjectives go AFTER the noun: un appartement lumineux.',
      'Exception — BAGS adjectives (Beauty, Age, Goodness, Size) go BEFORE: un grand appartement.',
    ],
    mustRemember: [
      { fr: 'Comment est votre appartement ?',       en: 'What is your apartment like?' },
      { fr: 'Il est grand et lumineux.',             en: 'It is big and bright.' },
      { fr: 'Les murs sont blancs.',                 en: 'The walls are white.' },
      { fr: 'Il y a un grand parc à côté.',          en: 'There is a big park nearby.' },
      { fr: 'C\'est une belle ville.',               en: 'It is a beautiful city.' },
    ],
  },

  'a1-4': {
    keyPhrases: [
      'J\'ai ___ frère(s) et ___ sœur(s).  →  I have ___ brother(s) and ___ sister(s).',
      'Mon/Ma ___ habite à ___.  →  My ___ lives in ___.',
      'J\'ai ___ ans.  →  I am ___ years old.',
      'Nous sommes ___ dans la famille.  →  There are ___ of us in the family.',
      'Mes parents sont ___.  →  My parents are ___.',
    ],
    grammarPoints: [
      'Possessives: mon (m) · ma (f) · mes (pl) — agree with the object, NOT the owner.',
      'Age uses AVOIR (to have), not être: J\'ai 30 ans — NEVER "Je suis 30 ans."',
      'Ma becomes MON before a vowel sound: mon amie (not ma amie).',
    ],
    mustRemember: [
      { fr: 'J\'ai deux enfants — un fils et une fille.', en: 'I have two children — a son and a daughter.' },
      { fr: 'Ma mère habite en Inde.',               en: 'My mother lives in India.' },
      { fr: 'Mon frère habite à Vancouver.',         en: 'My brother lives in Vancouver.' },
      { fr: 'J\'ai trente-deux ans.',                en: 'I am thirty-two years old.' },
      { fr: 'Mes parents habitent à Amritsar.',      en: 'My parents live in Amritsar.' },
    ],
  },

  'a1-5': {
    keyPhrases: [
      'Je voudrais prendre un rendez-vous.  →  I would like to make an appointment.',
      'Je suis disponible le ___ à ___ heures.  →  I am available on ___ at ___ o\'clock.',
      'le + number + month  →  the date (e.g., le quinze mars)',
      'En + month  →  in (month) (e.g., en mars, en décembre)',
      'Au printemps / en été / en automne / en hiver  →  in spring/summer/autumn/winter',
    ],
    grammarPoints: [
      'Dates: le + cardinal number + month. Exception: le PREMIER (not le un) for the 1st.',
      '"Je voudrais" = polite conditional of vouloir. Always use this in formal settings.',
      'Months and days are NOT capitalized in French: lundi, mars (not Lundi, Mars).',
    ],
    mustRemember: [
      { fr: 'Je voudrais prendre un rendez-vous.',   en: 'I would like to make an appointment.' },
      { fr: 'Je suis disponible le lundi matin.',    en: 'I am available on Monday morning.' },
      { fr: 'Le rendez-vous est le douze mars.',     en: 'The appointment is on the twelfth of March.' },
      { fr: 'En hiver, il fait froid au Canada.',   en: 'In winter, it is cold in Canada.' },
      { fr: 'Nous sommes le premier avril.',         en: 'Today is the first of April.' },
    ],
  },

  'a1-6': {
    keyPhrases: [
      'Je voudrais ___, s\'il vous plaît.  →  I would like ___, please.',
      'du (m) / de la (f) / de l\' (vowel) / des (pl)  →  some (partitive)',
      'pas de ___  →  no / not any ___ (negation of partitive)',
      'L\'addition, s\'il vous plaît.  →  The bill, please.',
      'Qu\'est-ce que vous recommandez ?  →  What do you recommend?',
    ],
    grammarPoints: [
      'Partitive articles: du pain, de la soupe, de l\'eau, des légumes — meaning "some".',
      'After NEGATION, all partitives become "de": Je ne veux pas DE fromage.',
      '"Je voudrais" is always more polite than "Je veux" when ordering or requesting.',
    ],
    mustRemember: [
      { fr: 'Je voudrais un café au lait, s\'il vous plaît.', en: 'I would like a coffee with milk, please.' },
      { fr: 'Avez-vous du pain avec la soupe ?',     en: 'Do you have some bread with the soup?' },
      { fr: 'Non merci, pas de fromage.',            en: 'No thank you, no cheese.' },
      { fr: 'Je suis végétarien(ne).',               en: 'I am vegetarian.' },
      { fr: 'L\'addition, s\'il vous plaît.',        en: 'The bill, please.' },
    ],
  },

  'a2-1': {
    keyPhrases: [
      'Je travaille comme ___.  →  I work as a ___.',
      'Je travaille dans ___.  →  I work in ___.',
      'Je parle français depuis ___ mois.  →  I have been speaking French for ___ months.',
      'Je comprends mais je parle encore lentement.  →  I understand but I still speak slowly.',
      'Je cherche du travail dans ___.  →  I am looking for work in ___.',
    ],
    grammarPoints: [
      '-ER verbs (parler): je parle · tu parles · il parle · nous parlons · vous parlez · ils parlent',
      '-IR verbs (finir): je finis · tu finis · il finit · nous finissons · vous finissez · ils finissent',
      '-RE verbs (répondre): je réponds · tu réponds · il répond · nous répondons · vous répondez · ils répondent',
    ],
    mustRemember: [
      { fr: 'Je travaille dans le service informatique.', en: 'I work in the IT department.' },
      { fr: 'Elle parle très bien français.',        en: 'She speaks French very well.' },
      { fr: 'Nous finissons le projet demain.',      en: 'We are finishing the project tomorrow.' },
      { fr: 'Tu comprends le français ?',           en: 'Do you understand French?' },
      { fr: 'Ils répondent aux questions.',         en: 'They answer the questions.' },
    ],
  },
};
