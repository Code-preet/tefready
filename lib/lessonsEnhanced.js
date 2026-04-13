// lib/lessonsEnhanced.js
// Situation-based lesson content overlaid on top of base data.js lessons.
// Each entry here EXTENDS the matching lesson from LESSONS in data.js.
// Fields: situation, dialogue, breakdown, keyPhrases
// Enhanced vocab: adds exampleEn field
// Enhanced grammar: adds punjabi/hindi explanation
// Enhanced exercises: adds fill / type / translate-en-fr / translate-fr-en types

export const ENHANCED = {

  // ══════════════════════════════════════════════════════════════════════════
  // A1-1 — Greetings & Introductions
  // ══════════════════════════════════════════════════════════════════════════
  'a1-1': {
    situation: {
      title: 'First Day at a Canadian Office',
      context: 'You have just arrived at your new workplace in Montréal. It is 9 am. You meet your manager and a colleague in the hallway. You must introduce yourself politely using formal French.',
      difficulty: 'Beginner',
      icon: '🏢',
    },
    dialogue: [
      { speaker: 'Vous',      fr: 'Bonjour, je m\'appelle Harjot Singh.',            en: 'Good morning, my name is Harjot Singh.' },
      { speaker: 'Directrice',fr: 'Bonjour Monsieur Singh ! Je m\'appelle Isabelle Tremblay. Enchanté !', en: 'Good morning Mr. Singh! My name is Isabelle Tremblay. Nice to meet you!' },
      { speaker: 'Vous',      fr: 'Enchanté, madame. Comment allez-vous ?',           en: 'Nice to meet you, ma\'am. How are you?' },
      { speaker: 'Directrice',fr: 'Très bien, merci ! Et vous ?',                    en: 'Very well, thank you! And you?' },
      { speaker: 'Vous',      fr: 'Je vais bien, merci. J\'habite à Montréal maintenant.', en: 'I am well, thank you. I live in Montréal now.' },
      { speaker: 'Collègue',  fr: 'Salut ! Moi c\'est Lucas. Bienvenue dans l\'équipe !', en: 'Hi! I\'m Lucas. Welcome to the team!' },
      { speaker: 'Vous',      fr: 'Merci beaucoup, Lucas. À bientôt !',              en: 'Thank you very much, Lucas. See you soon!' },
    ],
    breakdown: [
      { fr: 'Je m\'appelle Harjot Singh.', en: 'My name is Harjot Singh.', note: '"Je m\'appelle" literally means "I call myself." Always use this to introduce your name.' },
      { fr: 'Enchanté(e)', en: 'Nice to meet you', note: 'Add -e at the end if you are a woman: Enchantée.' },
      { fr: 'Comment allez-vous ?', en: 'How are you?', note: 'This is FORMAL. Use it with managers, teachers, and strangers. With friends, say: "Ça va ?"' },
      { fr: 'Je vais bien, merci.', en: 'I am well, thank you.', note: '"Je vais" comes from the verb "aller" (to go). French uses "going well" not "being well."' },
      { fr: 'J\'habite à Montréal.', en: 'I live in Montréal.', note: '"Habiter à" = to live in. Always use "à" before a city name.' },
      { fr: 'Bienvenue dans l\'équipe !', en: 'Welcome to the team!', note: '"Équipe" = team. "Dans" = in/on.' },
    ],
    keyPhrases: [
      { phrase: 'Je m\'appelle ___.',          meaning: 'My name is ___.', usage: 'Use this EVERY time you introduce yourself.' },
      { phrase: 'Comment vous appelez-vous ?', meaning: 'What is your name? (formal)', usage: 'Ask a manager or stranger their name.' },
      { phrase: 'Enchanté(e) de vous rencontrer.', meaning: 'Nice to meet you.', usage: 'Always say this when meeting someone for the first time professionally.' },
      { phrase: 'J\'habite à ___ depuis ___ mois.', meaning: 'I have lived in ___ for ___ months.', usage: 'Very useful for immigration contexts.' },
      { phrase: 'Je viens de l\'Inde.', meaning: 'I come from India.', usage: 'Replace l\'Inde with your country.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ, ਹਰ ਕਿਰਿਆ ਵਿਸ਼ੇ ਨਾਲ ਬਦਲਦੀ ਹੈ। "Être" (ਹੋਣਾ) ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਕਿਰਿਆ ਹੈ। Je suis = ਮੈਂ ਹਾਂ, Tu es = ਤੂੰ ਹੈਂ, Il/Elle est = ਉਹ ਹੈ। ਅਧਿਕਾਰਤ ਭਾਸ਼ਾ ਵਿੱਚ "vous" ਵਰਤੋ - ਜਿਵੇਂ ਹਿੰਦੀ ਵਿੱਚ "ਆਪ"।',
      hindi: 'फ्रेंच में हर क्रिया कर्ता के अनुसार बदलती है। "Être" (होना) सबसे जरूरी क्रिया है। Je suis = मैं हूं, Tu es = तुम हो, Il/Elle est = वह है। औपचारिक भाषा में "vous" प्रयोग करें — जैसे हिंदी में "आप"। अजनबियों और बॉस के साथ हमेशा "vous" बोलें।',
    },
    vocabExtra: {
      'Bonjour': { exampleEn: 'Good morning, my name is Marie.' },
      'Bonsoir': { exampleEn: 'Good evening ma\'am, how are you?' },
      'Je m\'appelle': { exampleEn: 'My name is Jean-Pierre.' },
      'Enchanté(e)': { exampleEn: 'Nice to meet you.' },
      'Comment allez-vous ?': { exampleEn: 'Good morning sir, how are you?' },
      'Je suis': { exampleEn: 'I am Canadian. I am a student.' },
      'J\'habite à': { exampleEn: 'I live in Montréal.' },
    },
    exercises: [
      { type: 'mcq', question: 'How do you say "Good evening" in French?', options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'], answer: 1 },
      { type: 'mcq', question: 'Which is the FORMAL way to say "How are you?"', options: ['Ça va ?', 'Comment vas-tu ?', 'Comment allez-vous ?', 'T\'as le moral ?'], answer: 2 },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: '___ m\'appelle Marie.', blanks: ['Je'], hints: ['Subject pronoun for "I"'] },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'Je ___ très bien, merci.', blanks: ['vais'], hints: ['Verb "aller" for "I go/am"'] },
      { type: 'translate-en-fr', english: 'My name is Harjot.', answer: 'Je m\'appelle Harjot.', alternates: ['Je m\'appelle Harjot', "Je m'appelle Harjot."] },
      { type: 'translate-en-fr', english: 'Nice to meet you.', answer: 'Enchanté.', alternates: ['Enchantée.', 'Enchanté de vous rencontrer.', 'Enchantée de vous rencontrer.'] },
      { type: 'translate-fr-en', french: 'J\'habite à Montréal.', answer: 'I live in Montreal.', alternates: ['I live in Montréal.', 'I am living in Montreal.'] },
      { type: 'type', question: 'How do you say "I am a student" in French?', answer: 'Je suis étudiant.', alternates: ['Je suis étudiante.', 'Je suis étudiant', 'Je suis étudiante'], hint: 'Je suis + profession' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A1-2 — Numbers
  // ══════════════════════════════════════════════════════════════════════════
  'a1-2': {
    situation: {
      title: 'At the Grocery Store in Montréal',
      context: 'You are shopping at a grocery store (épicerie) in Montréal. You ask the cashier about prices and pay for your items. Numbers are essential for daily life in Canada.',
      difficulty: 'Beginner',
      icon: '🛒',
    },
    dialogue: [
      { speaker: 'Vous',      fr: 'Bonjour, combien coûte ce pain ?',         en: 'Hello, how much does this bread cost?' },
      { speaker: 'Caissière', fr: 'Bonjour ! Il coûte trois dollars cinquante.', en: 'Hello! It costs three dollars fifty.' },
      { speaker: 'Vous',      fr: 'Et le lait, c\'est combien ?',              en: 'And the milk, how much is it?' },
      { speaker: 'Caissière', fr: 'Le lait coûte quatre dollars quatre-vingt-dix-neuf.',  en: 'The milk costs four dollars ninety-nine.' },
      { speaker: 'Vous',      fr: 'D\'accord. Mon numéro de téléphone, c\'est le zéro-cinq-quinze-vingt-trois.',  en: 'Okay. My phone number is 05-15-23.' },
      { speaker: 'Caissière', fr: 'Votre total est seize dollars quarante-neuf.',  en: 'Your total is sixteen dollars forty-nine.' },
      { speaker: 'Vous',      fr: 'Voici vingt dollars.',                      en: 'Here is twenty dollars.' },
      { speaker: 'Caissière', fr: 'Et voici votre monnaie — trois dollars cinquante et un.', en: 'And here is your change — three dollars fifty-one.' },
    ],
    breakdown: [
      { fr: 'Combien coûte ___?', en: 'How much does ___ cost?', note: '"Combien" = how much/many. Essential for shopping.' },
      { fr: 'Il coûte / Ça coûte', en: 'It costs', note: 'Both are correct. "Ça coûte" is more casual.' },
      { fr: 'quatre-vingt-dix-neuf', en: 'ninety-nine (4×20 + 19)', note: 'French 90s are unusual: 4×20+10, 4×20+11... This is unique to France/Canada (Belgium says "nonante").' },
      { fr: 'Votre total est ___', en: 'Your total is ___', note: '"Votre" = your (formal). The cashier uses this to be polite.' },
      { fr: 'Voici ___', en: 'Here is ___', note: 'A very useful word for handing things to people.' },
    ],
    keyPhrases: [
      { phrase: 'Combien ça coûte ?', meaning: 'How much does it cost?', usage: 'Use in any shop, market, or restaurant.' },
      { phrase: 'C\'est combien ?',   meaning: 'How much is it?', usage: 'Shorter, casual version.' },
      { phrase: 'Voici ___ dollars.', meaning: 'Here is ___ dollars.', usage: 'When paying.' },
      { phrase: 'Avez-vous la monnaie ?', meaning: 'Do you have change?', usage: 'When you need smaller bills.' },
      { phrase: 'Mon numéro de téléphone est le ___', meaning: 'My phone number is ___', usage: 'Important for forms and registrations in Canada.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਨੰਬਰ 70-99 ਵਿਲੱਖਣ ਹਨ। 70 = soixante-dix (60+10), 80 = quatre-vingts (4×20), 90 = quatre-vingt-dix (4×20+10)। ਕੀਮਤਾਂ ਅਤੇ ਫ਼ੋਨ ਨੰਬਰਾਂ ਲਈ ਇਹ ਜਾਣਨਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਯਾਦ ਰੱਖੋ: "et" ਸਿਰਫ਼ 21, 31, 41, 51, 61 ਵਿੱਚ ਆਉਂਦਾ ਹੈ — 81 ਅਤੇ 91 ਵਿੱਚ ਨਹੀਂ।',
      hindi: 'फ्रेंच में 70-99 अनोखे हैं। 70 = soixante-dix (60+10), 80 = quatre-vingts (4×20), 90 = quatre-vingt-dix (4×20+10)। दुकान में कीमत और फोन नंबर के लिए ये जरूरी हैं। याद रखें: "et" सिर्फ 21, 31, 41, 51, 61 में आता है — 81 और 91 में नहीं।',
    },
    vocabExtra: {
      'zéro': { exampleEn: 'My number starts with zero.' },
      'vingt': { exampleEn: 'Twenty minutes of walking.' },
      'soixante-dix': { exampleEn: 'Seventy years old — a great age!' },
      'quatre-vingts': { exampleEn: 'Eighty kilometres.' },
      'cent': { exampleEn: 'One hundred Canadian dollars.' },
    },
    exercises: [
      { type: 'mcq', question: 'How do you say 70 in French?', options: ['septante', 'soixante-dix', 'soixante-dixième', 'sept-dix'], answer: 1 },
      { type: 'mcq', question: 'How do you say 80 in French?', options: ['huitante', 'octante', 'quatre-vingts', 'quatre-vingt'], answer: 2 },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: '70 en français : soixante-___', blanks: ['dix'], hints: ['60 + ?'] },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: '80 en français : quatre-___', blanks: ['vingts'], hints: ['4 × 20'] },
      { type: 'translate-en-fr', english: 'How much does it cost?', answer: 'Combien ça coûte ?', alternates: ['Combien coûte-il ?', 'C\'est combien ?', "C'est combien ?"] },
      { type: 'type', question: 'Write the number 99 in French.', answer: 'quatre-vingt-dix-neuf', alternates: [], hint: 'quatre-vingt + dix + neuf' },
      { type: 'translate-fr-en', french: 'Voici vingt dollars.', answer: 'Here is twenty dollars.', alternates: ['Here are twenty dollars.'] },
      { type: 'mcq', question: 'What is "quatre-vingt-dix-neuf"?', options: ['89', '99', '79', '90'], answer: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A1-3 — Colors, Descriptions & Adjectives
  // ══════════════════════════════════════════════════════════════════════════
  'a1-3': {
    situation: {
      title: 'Describing Your Apartment to a Friend',
      context: 'You just found a new apartment in Montréal and you are describing it to your friend over the phone. You use colors and adjectives to describe rooms, furniture, and the neighborhood.',
      difficulty: 'Beginner',
      icon: '🏠',
    },
    dialogue: [
      { speaker: 'Ami',   fr: 'Alors, comment est ton nouvel appartement ?', en: 'So, what is your new apartment like?' },
      { speaker: 'Vous',  fr: 'Il est grand et lumineux ! Le salon est blanc avec des meubles gris.', en: 'It is big and bright! The living room is white with grey furniture.' },
      { speaker: 'Ami',   fr: 'Et ta chambre ?',                             en: 'And your bedroom?' },
      { speaker: 'Vous',  fr: 'Ma chambre est petite mais confortable. Les murs sont bleus.',  en: 'My bedroom is small but comfortable. The walls are blue.' },
      { speaker: 'Ami',   fr: 'C\'est beau ! Le quartier est comment ?',     en: 'That\'s nice! What is the neighborhood like?' },
      { speaker: 'Vous',  fr: 'Le quartier est calme et vert. Il y a un grand parc à côté.',   en: 'The neighborhood is quiet and green. There is a big park nearby.' },
      { speaker: 'Ami',   fr: 'Super ! Tu es content(e) là-bas ?',           en: 'Great! Are you happy there?' },
      { speaker: 'Vous',  fr: 'Oui, très content(e) ! C\'est une belle ville.',  en: 'Yes, very happy! It is a beautiful city.' },
    ],
    breakdown: [
      { fr: 'Comment est ___?', en: 'What is ___ like?', note: '"Comment est" is used to ask for a description. Very useful for TEF oral tasks.' },
      { fr: 'grand et lumineux', en: 'big and bright', note: 'Adjectives come AFTER the noun in French (usually). "Un appartement grand" = a big apartment.' },
      { fr: 'Les murs sont bleus.', en: 'The walls are blue.', note: 'Adjective agrees with noun: mur (m) → bleu, murs (pl) → bleus, porte (f) → bleue.' },
      { fr: 'Il y a un grand parc.', en: 'There is a big park.', note: '"Il y a" = there is / there are. One of the most used French phrases.' },
      { fr: 'petit(e) mais confortable', en: 'small but comfortable', note: '"Confortable" is the same in both genders — no change needed.' },
    ],
    keyPhrases: [
      { phrase: 'Comment est ___ ?',     meaning: 'What is ___ like?', usage: 'Essential for TEF speaking — describing places, people, situations.' },
      { phrase: 'Il y a ___.',           meaning: 'There is / There are ___', usage: 'Use constantly in descriptions and writing.' },
      { phrase: 'C\'est ___ (adj).',     meaning: 'It is ___ (adjective)', usage: 'The simplest way to give an opinion.' },
      { phrase: '___ est/sont + color.', meaning: '___ is/are + color', usage: 'Remember to match the adjective to the noun gender and number.' },
      { phrase: 'Je suis content(e) de ___', meaning: 'I am happy to ___', usage: 'Useful for expressing satisfaction in writing tasks.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਨਾਲ ਬਦਲਦੇ ਹਨ। ਜੇ ਨਾਂਵ ਇਸਤਰੀ ਲਿੰਗ ਹੈ, ਤਾਂ -e ਜੋੜੋ (un mur bleu → une porte bleue)। ਜੇ ਬਹੁਵਚਨ ਹੈ, ਤਾਂ -s ਜੋੜੋ (des murs bleus)। ਬਹੁਤੇ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਤੋਂ ਬਾਅਦ ਆਉਂਦੇ ਹਨ: un appartement grand, pas "un grand appartement" (ਪਰ ਕੁਝ ਅਪਵਾਦ ਹਨ: grand, petit, beau, vieux)।',
      hindi: 'फ्रेंच में विशेषण संज्ञा के साथ बदलते हैं। अगर संज्ञा स्त्रीलिंग है तो -e जोड़ें (un mur bleu → une porte bleue)। बहुवचन में -s जोड़ें (des murs bleus)। अधिकांश विशेषण संज्ञा के बाद आते हैं — लेकिन grand, petit, beau, vieux पहले आते हैं।',
    },
    vocabExtra: {
      'blanc / blanche': { exampleEn: 'The white wall is clean.' },
      'rouge': { exampleEn: 'A red apple, please.' },
      'bleu / bleue': { exampleEn: 'The blue sky of Canada.' },
      'grand(e)': { exampleEn: 'A big apartment in downtown.' },
      'petit(e)': { exampleEn: 'A small but comfortable room.' },
    },
    exercises: [
      { type: 'mcq', question: 'Une porte ___. Which color agrees correctly?', options: ['bleu', 'bleue', 'bleues', 'bleus'], answer: 1 },
      { type: 'mcq', question: 'What does "Il y a" mean?', options: ['He is', 'It is', 'There is / There are', 'Here is'], answer: 2 },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'Les murs sont ___s. (blue)', blanks: ['bleu'], hints: ['bleu + plural ending'] },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'Il y ___ une belle maison ici.', blanks: ['a'], hints: ['il y ___ = there is'] },
      { type: 'translate-en-fr', english: 'The apartment is big and bright.', answer: 'L\'appartement est grand et lumineux.', alternates: ["L'appartement est grand et lumineux"] },
      { type: 'translate-en-fr', english: 'There is a big park nearby.', answer: 'Il y a un grand parc à côté.', alternates: ['Il y a un grand parc près d\'ici.'] },
      { type: 'translate-fr-en', french: 'Ma chambre est petite mais confortable.', answer: 'My bedroom is small but comfortable.', alternates: ['My room is small but comfortable.'] },
      { type: 'type', question: 'How do you ask "What is the apartment like?" in French?', answer: 'Comment est l\'appartement ?', alternates: ["Comment est l'appartement ?", 'Comment est l\'appartement'], hint: 'Comment est + noun?' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A1-4 — Family & Relationships
  // ══════════════════════════════════════════════════════════════════════════
  'a1-4': {
    situation: {
      title: 'Talking About Your Family at a Community Event',
      context: 'You are at a community welcome event for new immigrants in Toronto. Someone asks about your family. You describe your family members, where they live, and your relationships.',
      difficulty: 'Beginner',
      icon: '👨‍👩‍👧‍👦',
    },
    dialogue: [
      { speaker: 'Bénévole', fr: 'Bonsoir ! Votre famille est ici à Toronto ?',    en: 'Good evening! Is your family here in Toronto?' },
      { speaker: 'Vous',     fr: 'Bonsoir ! Non, ma famille est en Inde. Mais mon frère habite à Vancouver.', en: 'Good evening! No, my family is in India. But my brother lives in Vancouver.' },
      { speaker: 'Bénévole', fr: 'Ah, vous avez des enfants ?',                    en: 'Ah, do you have children?' },
      { speaker: 'Vous',     fr: 'Oui, j\'ai deux enfants — une fille de six ans et un fils de neuf ans.', en: 'Yes, I have two children — a six-year-old daughter and a nine-year-old son.' },
      { speaker: 'Bénévole', fr: 'Ils sont avec vous ici ?',                       en: 'Are they here with you?' },
      { speaker: 'Vous',     fr: 'Oui, ma femme et mes enfants sont arrivés le mois dernier.', en: 'Yes, my wife and children arrived last month.' },
      { speaker: 'Bénévole', fr: 'Magnifique ! Votre mère et votre père sont toujours en Inde ?', en: 'Wonderful! Are your mother and father still in India?' },
      { speaker: 'Vous',     fr: 'Oui, mes parents habitent à Amritsar.',          en: 'Yes, my parents live in Amritsar.' },
    ],
    breakdown: [
      { fr: 'ma famille', en: 'my family', note: '"Ma" is feminine possessive (famille is feminine). "Mon" is masculine.' },
      { fr: 'mon frère / ma sœur', en: 'my brother / my sister', note: 'Mon = my (masculine noun), Ma = my (feminine noun).' },
      { fr: 'J\'ai deux enfants.', en: 'I have two children.', note: '"Avoir" (to have) is essential. J\'ai = I have. Très important.' },
      { fr: 'une fille de six ans', en: 'a six-year-old girl', note: 'Age in French: "de + number + ans" — not "who is six years old".' },
      { fr: 'mes parents', en: 'my parents', note: '"Mes" = my (plural). Mon→Mes, Ma→Mes when plural.' },
    ],
    keyPhrases: [
      { phrase: 'J\'ai ___ frère(s) et ___ sœur(s).', meaning: 'I have ___ brother(s) and ___ sister(s).', usage: 'TEF speaking task: talking about yourself.' },
      { phrase: 'Mon/Ma ___ habite à ___.', meaning: 'My ___ lives in ___.', usage: 'Describing where family members live.' },
      { phrase: 'Nous sommes ___ dans la famille.', meaning: 'There are ___ of us in the family.', usage: 'Common in oral exams.' },
      { phrase: 'Mes parents sont ___.',  meaning: 'My parents are ___.', usage: 'Introducing parents.' },
      { phrase: 'J\'ai ___ ans.',        meaning: 'I am ___ years old.', usage: 'Essential for all forms and introductions.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ "ਮੇਰਾ/ਮੇਰੀ" ਲਈ mon (ਪੁਲਿੰਗ) ਅਤੇ ma (ਇਸਤਰੀ ਲਿੰਗ) ਵਰਤੋ। ਬਹੁਵਚਨ ਵਿੱਚ ਦੋਵੇਂ mes ਬਣ ਜਾਂਦੇ ਹਨ। mon frère (ਮੇਰਾ ਭਰਾ), ma sœur (ਮੇਰੀ ਭੈਣ), mes parents (ਮੇਰੇ ਮਾਪੇ)। "ਉਮਰ" ਲਈ ਹਮੇਸ਼ਾ avoir ਵਰਤੋ: J\'ai 30 ans (ਮੇਰੀ ਉਮਰ 30 ਸਾਲ ਹੈ) — être (ਹੋਣਾ) ਨਹੀਂ!',
      hindi: 'फ्रेंच में "मेरा/मेरी" के लिए mon (पुल्लिंग) और ma (स्त्रीलिंग) का प्रयोग होता है। बहुवचन में दोनों mes बन जाते हैं। mon frère (मेरा भाई), ma sœur (मेरी बहन), mes parents (मेरे माता-पिता)। उम्र बताने के लिए avoir (होना नहीं!) प्रयोग करें: J\'ai 30 ans = मेरी उम्र 30 साल है।',
    },
    exercises: [
      { type: 'mcq', question: 'How do you say "my sister" in French?', options: ['mon sœur', 'ma sœur', 'mes sœur', 'mes sœurs'], answer: 1 },
      { type: 'mcq', question: 'What does "J\'ai deux enfants" mean?', options: ['I want two children', 'I have two children', 'My two children', 'Two children'], answer: 1 },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'J\'___ deux frères et une sœur.', blanks: ['ai'], hints: ['verb avoir, 1st person'] },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: '___ parents habitent à Montréal.', blanks: ['Mes'], hints: ['my (plural)'] },
      { type: 'translate-en-fr', english: 'I have two children.', answer: 'J\'ai deux enfants.', alternates: ["J'ai deux enfants."] },
      { type: 'translate-en-fr', english: 'My mother lives in India.', answer: 'Ma mère habite en Inde.', alternates: ['Ma mère vit en Inde.'] },
      { type: 'translate-fr-en', french: 'Mon frère habite à Vancouver.', answer: 'My brother lives in Vancouver.', alternates: ['My brother is living in Vancouver.'] },
      { type: 'type', question: 'Say "I am 32 years old" in French.', answer: 'J\'ai trente-deux ans.', alternates: ["J'ai trente-deux ans.", "J'ai 32 ans.", "J'ai 32 ans"], hint: 'Use avoir + number + ans' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A1-5 — Days, Months & Seasons
  // ══════════════════════════════════════════════════════════════════════════
  'a1-5': {
    situation: {
      title: 'Scheduling a Doctor\'s Appointment',
      context: 'You are calling a doctor\'s office (cabinet médical) in Québec to book an appointment. The receptionist asks for your availability. You need to give days, dates, and times clearly.',
      difficulty: 'Beginner',
      icon: '🏥',
    },
    dialogue: [
      { speaker: 'Réceptionniste', fr: 'Cabinet du docteur Leblanc, bonjour !', en: 'Dr. Leblanc\'s office, good morning!' },
      { speaker: 'Vous',           fr: 'Bonjour, je voudrais prendre un rendez-vous, s\'il vous plaît.', en: 'Good morning, I would like to make an appointment, please.' },
      { speaker: 'Réceptionniste', fr: 'Bien sûr. Vous êtes disponible quel jour ?', en: 'Of course. Which day are you available?' },
      { speaker: 'Vous',           fr: 'Je préfère le lundi ou le mercredi matin.', en: 'I prefer Monday or Wednesday morning.' },
      { speaker: 'Réceptionniste', fr: 'Lundi le douze mars, à dix heures trente ?', en: 'Monday the twelfth of March, at ten thirty?' },
      { speaker: 'Vous',           fr: 'Oui, parfait ! C\'est en quel mois ?',      en: 'Yes, perfect! Which month is that?' },
      { speaker: 'Réceptionniste', fr: 'En mars. La saison du printemps commence bientôt !', en: 'In March. The spring season is starting soon!' },
      { speaker: 'Vous',           fr: 'Très bien. Merci beaucoup !',               en: 'Very good. Thank you very much!' },
    ],
    breakdown: [
      { fr: 'je voudrais prendre un rendez-vous', en: 'I would like to make an appointment', note: '"Je voudrais" is the polite way to make requests. Much better than "je veux" in formal situations.' },
      { fr: 'Vous êtes disponible quel jour ?', en: 'Which day are you available?', note: '"Quel" = which/what. "Quel jour" = which day. Very common question structure.' },
      { fr: 'le douze mars', en: 'the twelfth of March', note: 'French dates: le + number + month (no "of"). Exception: le premier (1st), not le un.' },
      { fr: 'à dix heures trente', en: 'at ten thirty', note: '"À" + time = "at" (a time). Heures = o\'clock. "Trente" = :30.' },
      { fr: 'En mars', en: 'In March', note: '"En" is used before months: en janvier, en mars, en décembre.' },
    ],
    keyPhrases: [
      { phrase: 'Je voudrais prendre un rendez-vous.', meaning: 'I would like to make an appointment.', usage: 'Essential for doctor, bank, immigration offices.' },
      { phrase: 'Je suis disponible le ___ à ___ heures.', meaning: 'I am available on ___ at ___ o\'clock.', usage: 'Scheduling meetings and appointments.' },
      { phrase: 'C\'est quand ?', meaning: 'When is it?', usage: 'Asking for date/time confirmation.' },
      { phrase: 'Quel est votre jour de congé ?', meaning: 'What is your day off?', usage: 'Useful for scheduling.' },
      { phrase: 'En hiver / Au printemps / En été / En automne', meaning: 'In winter / In spring / In summer / In autumn', usage: 'Talking about seasons — note "au" for printemps.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ ਤਾਰੀਖਾਂ: le + ਨੰਬਰ + ਮਹੀਨਾ। ਪਹਿਲੀ ਤਾਰੀਖ ਲਈ "le premier" ਵਰਤੋ। ਮਹੀਨਿਆਂ ਨਾਲ "en" ਵਰਤੋ: en janvier, en mars। ਮੌਸਮਾਂ ਲਈ: en été, en hiver, en automne — ਪਰ ਬਸੰਤ ਲਈ au printemps। "Je voudrais" = ਮੈਂ ਚਾਹੁੰਦਾ ਹਾਂ (ਨਿਮਰ ਰੂਪ) — ਦਫ਼ਤਰਾਂ ਵਿੱਚ ਹਮੇਸ਼ਾ ਇਸ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      hindi: 'फ्रेंच में तारीखें: le + संख्या + महीना। पहली तारीख के लिए "le premier" प्रयोग करें। महीनों के साथ "en" लगाएं: en janvier, en mars। मौसम के साथ: en été, en hiver, en automne — लेकिन वसंत के लिए au printemps। "Je voudrais" = मैं चाहूंगा/चाहूंगी (विनम्र रूप) — सरकारी दफ्तरों में हमेशा यही कहें।',
    },
    exercises: [
      { type: 'mcq', question: 'How do you say "In March" in French?', options: ['à mars', 'le mars', 'en mars', 'de mars'], answer: 2 },
      { type: 'mcq', question: 'How do you say "the first of January" in French?', options: ['le un janvier', 'le premier janvier', 'le première janvier', 'un janvier'], answer: 1 },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'Je voudrais prendre ___ rendez-vous.', blanks: ['un'], hints: ['article for masculine noun'] },
      { type: 'fill', instruction: 'Fill in the blank:', sentence: 'Le rendez-vous est ___ lundi.', blanks: ['le'], hints: ['on Monday = ___ lundi'] },
      { type: 'translate-en-fr', english: 'I would like to make an appointment.', answer: 'Je voudrais prendre un rendez-vous.', alternates: ['Je voudrais un rendez-vous.'] },
      { type: 'translate-en-fr', english: 'I am available on Wednesday morning.', answer: 'Je suis disponible le mercredi matin.', alternates: ['Je suis disponible mercredi matin.'] },
      { type: 'translate-fr-en', french: 'En automne, il fait froid à Montréal.', answer: 'In autumn, it is cold in Montreal.', alternates: ['In autumn, it is cold in Montréal.', 'In fall, it is cold in Montreal.'] },
      { type: 'type', question: 'Say "Monday the fifteenth of April" in French.', answer: 'le lundi quinze avril', alternates: ['lundi quinze avril', 'le quinze avril'], hint: 'le + day + number + month' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A1-6 — Food, Drinks & Ordering
  // ══════════════════════════════════════════════════════════════════════════
  'a1-6': {
    situation: {
      title: 'Ordering at a Café in Québec City',
      context: 'You are at a café in Québec City for lunch. You look at the menu and order food and drinks for yourself and a friend. This is a very common real-life situation you will face in Canada.',
      difficulty: 'Beginner',
      icon: '☕',
    },
    dialogue: [
      { speaker: 'Serveur',  fr: 'Bonjour ! Vous avez choisi ?',                   en: 'Hello! Have you chosen?' },
      { speaker: 'Vous',     fr: 'Oui. Je voudrais un café au lait et une soupe, s\'il vous plaît.', en: 'Yes. I would like a coffee with milk and a soup, please.' },
      { speaker: 'Serveur',  fr: 'Très bien. Et pour la soupe, vous voulez du pain avec ?', en: 'Very good. And for the soup, do you want bread with it?' },
      { speaker: 'Vous',     fr: 'Oui, du pain, s\'il vous plaît. Et mon ami veut de la salade.', en: 'Yes, some bread, please. And my friend wants some salad.' },
      { speaker: 'Serveur',  fr: 'Avec plaisir. Vous voulez du fromage également ?', en: 'With pleasure. Do you also want some cheese?' },
      { speaker: 'Vous',     fr: 'Non merci, pas de fromage. Mais de l\'eau minérale, oui.', en: 'No thank you, no cheese. But some mineral water, yes.' },
      { speaker: 'Serveur',  fr: 'Très bien. C\'est tout ?',                       en: 'Very good. Is that all?' },
      { speaker: 'Vous',     fr: 'Oui, c\'est tout. L\'addition, s\'il vous plaît.', en: 'Yes, that\'s all. The bill, please.' },
    ],
    breakdown: [
      { fr: 'Je voudrais ___, s\'il vous plaît.', en: 'I would like ___, please.', note: 'The most polite way to order. Always use "je voudrais" not "je veux" in restaurants.' },
      { fr: 'du pain / de la salade / de l\'eau', en: 'some bread / some salad / some water', note: 'Partitive articles: du (m) = some, de la (f) = some, de l\' (before vowel) = some.' },
      { fr: 'pas de fromage', en: 'no cheese', note: 'Negation of partitive: du/de la/des → pas de (not pas du). Important rule!' },
      { fr: 'L\'addition, s\'il vous plaît.', en: 'The bill, please.', note: '"L\'addition" = the bill/check. Very important phrase to know!' },
      { fr: 'C\'est tout.', en: 'That\'s all.', note: 'Simple, polite way to end an order.' },
    ],
    keyPhrases: [
      { phrase: 'Je voudrais ___, s\'il vous plaît.', meaning: 'I would like ___, please.', usage: 'Ordering food, drinks, anything in shops.' },
      { phrase: 'Qu\'est-ce que vous recommandez ?', meaning: 'What do you recommend?', usage: 'Asking for recommendations in a restaurant.' },
      { phrase: 'L\'addition, s\'il vous plaît.', meaning: 'The bill, please.', usage: 'Asking for the check — essential!' },
      { phrase: 'C\'est inclus dans le menu ?', meaning: 'Is it included in the menu?', usage: 'Checking what is included.' },
      { phrase: 'Je suis végétarien(ne).', meaning: 'I am vegetarian.', usage: 'Very useful for many Indian learners!' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ "ਕੁਝ" ਕਹਿਣ ਲਈ: du (ਪੁਲਿੰਗ), de la (ਇਸਤਰੀ ਲਿੰਗ), de l\' (ਸਵਰ ਤੋਂ ਪਹਿਲਾਂ), des (ਬਹੁਵਚਨ)। Je mange du pain (ਮੈਂ ਰੋਟੀ ਖਾਂਦਾ ਹਾਂ), Je bois de la soupe (ਮੈਂ ਸੂਪ ਪੀਂਦਾ ਹਾਂ)। ਪਰ ਨਾਂਹ ਵਿੱਚ: "pas de" ਵਰਤੋ — Je ne mange pas de pain (ਮੈਂ ਰੋਟੀ ਨਹੀਂ ਖਾਂਦਾ)।',
      hindi: 'फ्रेंच में "कुछ" कहने के लिए: du (पुल्लिंग), de la (स्त्रीलिंग), de l\' (स्वर से पहले), des (बहुवचन)। Je mange du pain (मैं रोटी खाता हूं), Je bois de la soupe (मैं सूप पीता हूं)। लेकिन नकारात्मक में: "pas de" प्रयोग करें — Je ne mange pas de pain (मैं रोटी नहीं खाता)।',
    },
    exercises: [
      { type: 'mcq', question: 'What is the polite way to order in French?', options: ['Je veux un café.', 'Donnez-moi un café.', 'Je voudrais un café.', 'Un café !'], answer: 2 },
      { type: 'mcq', question: 'Complete: "Je mange ___ pain." (some bread)', options: ['de', 'du', 'des', 'de la'], answer: 1 },
      { type: 'fill', instruction: 'Fill in the blank (partitive article):', sentence: 'Je bois ___ la soupe.', blanks: ['de'], hints: ['partitive for feminine noun'] },
      { type: 'fill', instruction: 'Fill in the blank (negation):', sentence: 'Je ne mange pas ___ fromage.', blanks: ['de'], hints: ['negation of partitive: pas ___'] },
      { type: 'translate-en-fr', english: 'I would like a coffee, please.', answer: 'Je voudrais un café, s\'il vous plaît.', alternates: ["Je voudrais un café, s'il vous plaît."] },
      { type: 'translate-en-fr', english: 'The bill, please.', answer: 'L\'addition, s\'il vous plaît.', alternates: ["L'addition, s'il vous plaît."] },
      { type: 'translate-fr-en', french: 'Je suis végétarien.', answer: 'I am vegetarian.', alternates: ['I am a vegetarian.'] },
      { type: 'type', question: 'How do you ask for some water? (feminine noun)', answer: 'Je voudrais de l\'eau.', alternates: ["Je voudrais de l'eau.", 'De l\'eau, s\'il vous plaît.', "De l'eau, s'il vous plaît."], hint: 'de l\' before vowel (eau starts with e)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A2-1 — Present Tense Regular Verbs
  // ══════════════════════════════════════════════════════════════════════════
  'a2-1': {
    situation: {
      title: 'Talking About Your Daily Job at Work',
      context: 'Your Canadian colleague asks what you do at work every day. You describe your daily tasks and routine using present tense regular verbs. This is essential for workplace integration.',
      difficulty: 'Elementary',
      icon: '💼',
    },
    dialogue: [
      { speaker: 'Collègue',  fr: 'Qu\'est-ce que tu fais au travail exactement ?', en: 'What exactly do you do at work?' },
      { speaker: 'Vous',      fr: 'Je travaille dans le service informatique. Je répare les ordinateurs et j\'installe des logiciels.', en: 'I work in the IT department. I repair computers and install software.' },
      { speaker: 'Collègue',  fr: 'Et tu parles français au bureau ?',              en: 'And do you speak French at the office?' },
      { speaker: 'Vous',      fr: 'J\'essaie ! Je parle français avec mes collègues. Je comprends bien, mais je parle encore lentement.', en: 'I try! I speak French with my colleagues. I understand well, but I still speak slowly.' },
      { speaker: 'Collègue',  fr: 'C\'est normal au début. Tu apprends vite !',     en: 'That\'s normal at the beginning. You learn fast!' },
      { speaker: 'Vous',      fr: 'Merci. Je finisse bientôt une formation en ligne aussi.', en: 'Thank you. I am also finishing an online training soon.' },
    ],
    breakdown: [
      { fr: 'Je travaille dans ___', en: 'I work in ___', note: '"Travailler" is a regular -ER verb. Je travaille, tu travailles, il travaille, nous travaillons, vous travaillez, ils travaillent.' },
      { fr: 'Je parle / Tu parles / Il parle', en: 'I speak / You speak / He speaks', note: '-ER verbs: add -e, -es, -e, -ons, -ez, -ent to the stem.' },
      { fr: 'Je comprends bien', en: 'I understand well', note: '"Comprendre" is irregular but very important. Je comprends, tu comprends, il comprend.' },
      { fr: 'Je parle encore lentement.', en: 'I still speak slowly.', note: '"Encore" = still/yet. "Lentement" = slowly (adverb from lent).' },
      { fr: 'Je finis / Je réponds', en: 'I finish / I respond', note: '-IR verbs: finir → je finis. -RE verbs: répondre → je réponds.' },
    ],
    keyPhrases: [
      { phrase: 'Je travaille comme ___.', meaning: 'I work as a ___.',          usage: 'Introducing your profession.' },
      { phrase: 'Je comprends mais je parle mal.', meaning: 'I understand but I speak poorly.', usage: 'Honest self-assessment — TEF examiners appreciate honesty.' },
      { phrase: 'J\'apprends le français depuis ___ mois.', meaning: 'I have been learning French for ___ months.', usage: 'Very useful in interviews and introductions.' },
      { phrase: 'Je travaille ___ heures par semaine.', meaning: 'I work ___ hours per week.', usage: 'Common in job discussions.' },
      { phrase: 'Je cherche du travail dans ___.', meaning: 'I am looking for work in ___.', usage: 'Job searching vocabulary.' },
    ],
    grammarExtra: {
      punjabi: 'ਫਰਾਂਸੀਸੀ ਵਿੱਚ ਤਿੰਨ ਕਿਸਮ ਦੀਆਂ ਨਿਯਮਿਤ ਕਿਰਿਆਵਾਂ ਹਨ: -ER (parler, travailler), -IR (finir, choisir), -RE (répondre, attendre)। -ER ਲਈ: je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent। -IR ਲਈ: je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent। -RE ਲਈ: je réponds, tu réponds, il répond, nous répondons, vous répondez, ils répondent।',
      hindi: 'फ्रेंच में तीन प्रकार की नियमित क्रियाएं हैं: -ER (parler, travailler), -IR (finir, choisir), -RE (répondre, attendre)। -ER के लिए: je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent। -IR के लिए: je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent। -RE के लिए: je réponds, tu réponds, il répond, nous répondons, vous répondez, ils répondent।',
    },
    exercises: [
      { type: 'mcq', question: 'Complete: "Nous ___ le français." (parler)', options: ['parle', 'parles', 'parlons', 'parlez'], answer: 2 },
      { type: 'mcq', question: 'Which ending for "vous" with -ER verbs?', options: ['-e', '-es', '-ez', '-ons'], answer: 2 },
      { type: 'fill', instruction: 'Conjugate the verb:', sentence: 'Elle ___ (travailler) dans un hôpital.', blanks: ['travaille'], hints: ['-ER verb, 3rd person singular'] },
      { type: 'fill', instruction: 'Conjugate the verb:', sentence: 'Nous ___ (finir) le projet demain.', blanks: ['finissons'], hints: ['-IR verb, nous form'] },
      { type: 'translate-en-fr', english: 'I work in the IT department.', answer: 'Je travaille dans le service informatique.', alternates: ['Je travaille dans l\'informatique.'] },
      { type: 'translate-en-fr', english: 'She speaks French very well.', answer: 'Elle parle très bien français.', alternates: ['Elle parle français très bien.'] },
      { type: 'translate-fr-en', french: 'Tu comprends le français ?', answer: 'Do you understand French?', alternates: ['You understand French?'] },
      { type: 'type', question: 'Conjugate "répondre" for "ils" (they respond)', answer: 'ils répondent', alternates: ['Ils répondent'], hint: '-RE verb: ils + stem + ent' },
    ],
  },
};
