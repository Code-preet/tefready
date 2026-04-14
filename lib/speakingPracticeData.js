/**
 * Speaking Practice Data
 * Short daily-drill tasks (30–120 s) across A1/A2/B1/B2.
 * Each task has a prompt, 3 sentence starters, a sample answer, and tips.
 */

export const SPEAKING_PRACTICE_TASKS = [

  // ──────────────────────────────────────────────
  // A1
  // ──────────────────────────────────────────────
  {
    id: 'sp-a1-1',
    level: 'A1',
    category: 'Introduction',
    icon: '👋',
    duration: 30,
    xp: 5,
    prompt: 'Introduce yourself in French. Say your name, where you are from, and one thing you like.',
    promptFr: 'Présentez-vous en français. Dites votre nom, d\'où vous venez, et une chose que vous aimez.',
    sampleAnswer: {
      fr: 'Bonjour ! Je m\'appelle Harjot. Je viens de l\'Inde, de la région du Punjab. J\'aime beaucoup la musique et apprendre les langues. Je suis très content d\'être au Canada.',
      en: 'Hello! My name is Harjot. I come from India, from the Punjab region. I really like music and learning languages. I am very happy to be in Canada.',
    },
    starters: [
      { fr: 'Je m\'appelle…', en: 'My name is…' },
      { fr: 'Je viens de…', en: 'I come from…' },
      { fr: 'J\'aime beaucoup…', en: 'I really like…' },
    ],
    tips: ['Speak slowly and clearly — quality beats speed at A1.'],
  },
  {
    id: 'sp-a1-2',
    level: 'A1',
    category: 'Family',
    icon: '👨‍👩‍👧',
    duration: 40,
    xp: 5,
    prompt: 'Describe your family. How many people are there? Who are they?',
    promptFr: 'Décrivez votre famille. Combien de personnes y a-t-il ? Qui sont-elles ?',
    sampleAnswer: {
      fr: 'Dans ma famille, il y a cinq personnes. J\'ai un père, une mère, un frère et une sœur. Mon père s\'appelle Gurpreet. Il travaille dans une ferme. Ma mère s\'appelle Harleen. Elle est professeure.',
      en: 'In my family there are five people. I have a father, a mother, a brother and a sister. My father\'s name is Gurpreet. He works on a farm. My mother\'s name is Harleen. She is a teacher.',
    },
    starters: [
      { fr: 'Dans ma famille, il y a…', en: 'In my family, there are…' },
      { fr: 'J\'ai un frère / une sœur…', en: 'I have a brother / a sister…' },
      { fr: 'Il / Elle s\'appelle…', en: 'His / Her name is…' },
    ],
    tips: ['Use il/elle for he/she — a very common error for beginners.'],
  },
  {
    id: 'sp-a1-3',
    level: 'A1',
    category: 'Food & Café',
    icon: '☕',
    duration: 35,
    xp: 5,
    prompt: 'You are at a café. Order a drink and a snack in French.',
    promptFr: 'Vous êtes dans un café. Commandez une boisson et un encas en français.',
    sampleAnswer: {
      fr: 'Bonjour ! Je voudrais un café, s\'il vous plaît. Et aussi un croissant. C\'est combien ? D\'accord, merci beaucoup !',
      en: 'Hello! I would like a coffee, please. And also a croissant. How much is it? Alright, thank you very much!',
    },
    starters: [
      { fr: 'Je voudrais…', en: 'I would like…' },
      { fr: 'Avez-vous…?', en: 'Do you have…?' },
      { fr: 'C\'est combien ?', en: 'How much is it?' },
    ],
    tips: ['Always say bonjour first — it\'s considered rude not to in Québec.'],
  },
  {
    id: 'sp-a1-4',
    level: 'A1',
    category: 'Numbers & Time',
    icon: '🕐',
    duration: 30,
    xp: 5,
    prompt: 'Tell the time and describe your morning routine in 3–4 sentences.',
    promptFr: 'Dites l\'heure et décrivez votre routine du matin en 3–4 phrases.',
    sampleAnswer: {
      fr: 'Je me lève à sept heures du matin. Je mange du pain et je bois du café. Ensuite, je prends le bus à huit heures. J\'arrive au travail à huit heures et demie.',
      en: 'I get up at seven o\'clock in the morning. I eat bread and drink coffee. Then I take the bus at eight o\'clock. I arrive at work at eight thirty.',
    },
    starters: [
      { fr: 'Je me lève à…', en: 'I get up at…' },
      { fr: 'À… heures, je…', en: 'At… o\'clock, I…' },
      { fr: 'Ensuite, je…', en: 'Then, I…' },
    ],
    tips: ['Use et quart (quarter past), et demie (half past), moins le quart (quarter to).'],
  },

  // ──────────────────────────────────────────────
  // A2
  // ──────────────────────────────────────────────
  {
    id: 'sp-a2-1',
    level: 'A2',
    category: 'Daily Routine',
    icon: '📅',
    duration: 50,
    xp: 8,
    prompt: 'Describe your typical weekday from morning to evening.',
    promptFr: 'Décrivez votre journée de semaine typique du matin jusqu\'au soir.',
    sampleAnswer: {
      fr: 'En semaine, je me réveille à six heures et demie. Je prends une douche et je mange des céréales. Je commence le travail à neuf heures. À midi, je mange dans la cafétéria avec mes collègues. Le soir, je rentre à dix-huit heures et je prépare le dîner. Je me couche vers vingt-deux heures.',
      en: 'On weekdays, I wake up at six thirty. I take a shower and eat cereal. I start work at nine. At noon, I eat in the cafeteria with my colleagues. In the evening, I get home at six and prepare dinner. I go to bed around ten.',
    },
    starters: [
      { fr: 'En semaine, je me réveille à…', en: 'On weekdays, I wake up at…' },
      { fr: 'Le matin, d\'abord je…', en: 'In the morning, first I…' },
      { fr: 'Le soir, après le travail…', en: 'In the evening, after work…' },
    ],
    tips: ['Use time connectors: d\'abord, ensuite, après, enfin to structure your answer.'],
  },
  {
    id: 'sp-a2-2',
    level: 'A2',
    category: 'Home',
    icon: '🏠',
    duration: 55,
    xp: 8,
    prompt: 'Describe your home or apartment. What rooms are there? What do you like about it?',
    promptFr: 'Décrivez votre maison ou appartement. Quelles pièces y a-t-il ? Qu\'est-ce que vous aimez ?',
    sampleAnswer: {
      fr: 'J\'habite dans un appartement au troisième étage. Il y a un salon, une cuisine, deux chambres et une salle de bains. Le salon est grand et lumineux. J\'aime beaucoup ma cuisine car elle est moderne. Par contre, il n\'y a pas de balcon, c\'est un peu dommage.',
      en: 'I live in an apartment on the third floor. There is a living room, a kitchen, two bedrooms and a bathroom. The living room is big and bright. I really like my kitchen because it is modern. However, there is no balcony, which is a bit of a shame.',
    },
    starters: [
      { fr: 'J\'habite dans…', en: 'I live in…' },
      { fr: 'Il y a… pièces, notamment…', en: 'There are… rooms, including…' },
      { fr: 'J\'aime surtout… parce que…', en: 'I especially like… because…' },
    ],
    tips: ['Use par contre or cependant to add contrast — examiners love nuanced opinions.'],
  },
  {
    id: 'sp-a2-3',
    level: 'A2',
    category: 'Hobbies',
    icon: '🎨',
    duration: 50,
    xp: 8,
    prompt: 'Talk about a hobby or activity you enjoy. What is it? Why do you like it?',
    promptFr: 'Parlez d\'un loisir ou d\'une activité que vous aimez. C\'est quoi ? Pourquoi vous aimez ça ?',
    sampleAnswer: {
      fr: 'J\'aime beaucoup faire de la randonnée. Chaque weekend, si le temps le permet, je vais marcher dans les parcs autour de Montréal. La randonnée me permet de me détendre et d\'oublier le stress du travail. En plus, c\'est bon pour la santé. Je recommande cette activité à tout le monde.',
      en: 'I really like hiking. Every weekend, if the weather allows, I go walking in the parks around Montreal. Hiking allows me to relax and forget work stress. Also, it\'s good for your health. I recommend this activity to everyone.',
    },
    starters: [
      { fr: 'Mon loisir préféré, c\'est…', en: 'My favourite hobby is…' },
      { fr: 'Je fais ça… fois par semaine…', en: 'I do that… times a week…' },
      { fr: 'J\'aime ça parce que ça me permet de…', en: 'I like it because it allows me to…' },
    ],
    tips: ['The phrase ça me permet de + infinitive is useful in many contexts — learn it well.'],
  },
  {
    id: 'sp-a2-4',
    level: 'A2',
    category: 'City & Transport',
    icon: '🚇',
    duration: 50,
    xp: 8,
    prompt: 'Describe how you travel around your city. What transport do you use and why?',
    promptFr: 'Décrivez comment vous vous déplacez dans votre ville. Quel transport utilisez-vous et pourquoi ?',
    sampleAnswer: {
      fr: 'Pour me déplacer à Montréal, j\'utilise principalement le métro et l\'autobus. Le métro est rapide et pratique, surtout l\'hiver quand il fait très froid. Parfois, quand la météo est agréable, je préfère faire du vélo. Je ne conduis pas de voiture car le stationnement est trop cher en ville.',
      en: 'To get around Montreal, I mainly use the metro and the bus. The metro is fast and convenient, especially in winter when it is very cold. Sometimes, when the weather is nice, I prefer cycling. I don\'t drive a car because parking is too expensive in the city.',
    },
    starters: [
      { fr: 'Pour me déplacer, j\'utilise…', en: 'To get around, I use…' },
      { fr: 'Je préfère le métro / le bus parce que…', en: 'I prefer the metro / bus because…' },
      { fr: 'Je ne conduis pas car…', en: 'I don\'t drive because…' },
    ],
    tips: ['Practice pronouncing métro, autobus, and stationnement clearly — they often appear in TEF.'],
  },

  // ──────────────────────────────────────────────
  // B1
  // ──────────────────────────────────────────────
  {
    id: 'sp-b1-1',
    level: 'B1',
    category: 'Opinion',
    icon: '💭',
    duration: 70,
    xp: 12,
    prompt: 'Give your opinion on social media. What are the advantages and disadvantages?',
    promptFr: 'Donnez votre opinion sur les réseaux sociaux. Quels sont les avantages et les inconvénients ?',
    sampleAnswer: {
      fr: 'À mon avis, les réseaux sociaux ont des avantages et des inconvénients. D\'un côté, ils permettent de rester en contact avec la famille et les amis, même à l\'étranger. De l\'autre côté, ils peuvent créer une dépendance et nuire à la santé mentale. Personnellement, j\'essaie de limiter mon utilisation à une heure par jour. Je pense que l\'équilibre est la clé.',
      en: 'In my opinion, social media has advantages and disadvantages. On one hand, it allows you to stay in contact with family and friends, even abroad. On the other hand, it can create addiction and harm mental health. Personally, I try to limit my use to one hour per day. I think balance is the key.',
    },
    starters: [
      { fr: 'À mon avis, les réseaux sociaux…', en: 'In my opinion, social media…' },
      { fr: 'D\'un côté… de l\'autre côté…', en: 'On one hand… on the other hand…' },
      { fr: 'Personnellement, je pense que…', en: 'Personally, I think that…' },
    ],
    tips: ['Structure = brief intro → advantages → disadvantages → your personal stance. Even 60 seconds can cover all four if you\'re concise.'],
  },
  {
    id: 'sp-b1-2',
    level: 'B1',
    category: 'Narration',
    icon: '✈️',
    duration: 75,
    xp: 12,
    prompt: 'Describe a memorable trip or journey you have taken. What happened? What did you feel?',
    promptFr: 'Décrivez un voyage mémorable que vous avez fait. Qu\'est-ce qui s\'est passé ? Qu\'est-ce que vous avez ressenti ?',
    sampleAnswer: {
      fr: 'L\'année dernière, j\'ai visité la ville de Québec pour la première fois. J\'ai été impressionné par l\'architecture historique du Vieux-Québec. J\'ai mangé de la poutine et de la tourtière, deux spécialités locales. Le soir, j\'ai assisté à un spectacle de musique traditionnelle québécoise. C\'était une expérience inoubliable qui m\'a vraiment aidé à comprendre la culture francophone.',
      en: 'Last year, I visited Quebec City for the first time. I was impressed by the historic architecture of Old Quebec. I ate poutine and tourtière, two local specialties. In the evening, I attended a traditional Quebec music show. It was an unforgettable experience that really helped me understand Francophone culture.',
    },
    starters: [
      { fr: 'L\'année dernière, j\'ai visité…', en: 'Last year, I visited…' },
      { fr: 'Ce qui m\'a le plus impressionné, c\'est…', en: 'What impressed me the most was…' },
      { fr: 'C\'était une expérience inoubliable parce que…', en: 'It was an unforgettable experience because…' },
    ],
    tips: ['Mix passé composé (completed actions) with imparfait (descriptions/feelings) for a natural narrative.'],
  },
  {
    id: 'sp-b1-3',
    level: 'B1',
    category: 'Problem & Solution',
    icon: '🔧',
    duration: 65,
    xp: 12,
    prompt: 'Describe a problem you faced recently and how you solved it.',
    promptFr: 'Décrivez un problème que vous avez rencontré récemment et comment vous l\'avez résolu.',
    sampleAnswer: {
      fr: 'Il y a quelques semaines, j\'ai eu un problème avec mon propriétaire. Le chauffage dans mon appartement ne fonctionnait pas pendant une semaine. D\'abord, j\'ai contacté mon propriétaire par téléphone, mais il n\'a pas répondu. Ensuite, j\'ai envoyé un courriel officiel. Finalement, après deux jours, il a envoyé un technicien. Le problème a été résolu rapidement. J\'ai appris qu\'il faut toujours communiquer par écrit pour avoir une trace.',
      en: 'A few weeks ago, I had a problem with my landlord. The heating in my apartment wasn\'t working for a week. First, I called my landlord by phone, but he didn\'t answer. Then, I sent an official email. Finally, after two days, he sent a technician. The problem was solved quickly. I learned that you must always communicate in writing to have a record.',
    },
    starters: [
      { fr: 'Il y a quelque temps, j\'ai eu un problème avec…', en: 'A while ago, I had a problem with…' },
      { fr: 'D\'abord, j\'ai essayé de… mais…', en: 'First, I tried to… but…' },
      { fr: 'Finalement, le problème a été résolu grâce à…', en: 'Finally, the problem was solved thanks to…' },
    ],
    tips: ['Use sequence words (d\'abord, ensuite, finalement) to give your story a clear structure.'],
  },
  {
    id: 'sp-b1-4',
    level: 'B1',
    category: 'Compare & Contrast',
    icon: '🔄',
    duration: 70,
    xp: 12,
    prompt: 'Compare life in your home country with life in Canada. What are the biggest differences?',
    promptFr: 'Comparez la vie dans votre pays d\'origine avec la vie au Canada. Quelles sont les plus grandes différences ?',
    sampleAnswer: {
      fr: 'Depuis mon arrivée au Canada, j\'ai remarqué plusieurs différences importantes. Tout d\'abord, le système de santé est très différent. Au Canada, les soins médicaux de base sont gratuits, ce qui n\'est pas le cas dans mon pays. Ensuite, les habitudes alimentaires sont différentes. Ici, les gens mangent beaucoup plus de produits laitiers. En revanche, ce qui me manque le plus, c\'est la cuisine de ma mère et les fêtes en famille.',
      en: 'Since arriving in Canada, I have noticed several important differences. First, the healthcare system is very different. In Canada, basic medical care is free, which is not the case in my country. Also, eating habits are different. Here, people eat much more dairy products. On the other hand, what I miss the most is my mother\'s cooking and family celebrations.',
    },
    starters: [
      { fr: 'Depuis mon arrivée au Canada, j\'ai remarqué…', en: 'Since arriving in Canada, I\'ve noticed…' },
      { fr: 'Dans mon pays, on…, alors qu\'ici…', en: 'In my country, people…, whereas here…' },
      { fr: 'Ce qui me manque le plus, c\'est…', en: 'What I miss the most is…' },
    ],
    tips: ['alors que and en revanche are excellent contrast words — they immediately sound more advanced.'],
  },

  // ──────────────────────────────────────────────
  // B2
  // ──────────────────────────────────────────────
  {
    id: 'sp-b2-1',
    level: 'B2',
    category: 'Debate',
    icon: '⚖️',
    duration: 100,
    xp: 15,
    prompt: 'Do you think technology is making us less social? Argue your position with examples.',
    promptFr: 'Pensez-vous que la technologie nous rend moins sociaux ? Défendez votre position avec des exemples.',
    sampleAnswer: {
      fr: 'C\'est une question qui divise profondément les experts. D\'un côté, on pourrait avancer que les applications de messagerie et les réseaux sociaux facilitent les connexions à travers le monde. Cependant, il est indéniable que ces mêmes outils peuvent créer une forme d\'isolement, où les interactions en face à face sont remplacées par des échanges superficiels en ligne. À titre personnel, j\'ai constaté que mes propres amitiés se sont approfondies grâce à la technologie, mais seulement lorsqu\'elle complète, et non remplace, le contact humain réel. En conclusion, la technologie n\'est pas intrinsèquement antisociale — c\'est l\'usage qu\'on en fait qui détermine son impact.',
      en: 'This is a question that deeply divides experts. On one hand, one could argue that messaging apps and social networks facilitate connections across the world. However, it is undeniable that these same tools can create a form of isolation, where face-to-face interactions are replaced by superficial online exchanges. Personally, I have found that my own friendships have deepened through technology, but only when it complements, rather than replaces, real human contact. In conclusion, technology is not intrinsically antisocial — it is how we use it that determines its impact.',
    },
    starters: [
      { fr: 'C\'est une question qui divise, car d\'un côté…', en: 'This is a divisive question, because on one hand…' },
      { fr: 'Cependant, il est indéniable que…', en: 'However, it is undeniable that…' },
      { fr: 'En définitive, je suis convaincu(e) que…', en: 'Ultimately, I am convinced that…' },
    ],
    tips: ['At B2, show nuance: concede a point before stating your position. "Certes… cependant…" is a classic pattern.'],
  },
  {
    id: 'sp-b2-2',
    level: 'B2',
    category: 'Immigration',
    icon: '🌍',
    duration: 100,
    xp: 15,
    prompt: 'What are the main challenges immigrants face when integrating into Canadian society? How can these be overcome?',
    promptFr: 'Quels sont les principaux défis auxquels les immigrants font face lorsqu\'ils s\'intègrent à la société canadienne ? Comment peut-on les surmonter ?',
    sampleAnswer: {
      fr: 'L\'intégration au Canada présente plusieurs défis majeurs. Premièrement, la reconnaissance des diplômes étrangers demeure un obstacle considérable pour de nombreux professionnels qualifiés. Deuxièmement, les barrières linguistiques, notamment la maîtrise du français au Québec, peuvent ralentir l\'insertion professionnelle. Pour surmonter ces obstacles, il est essentiel que les gouvernements investissent dans des programmes de formation continue et de reconnaissance des acquis. Par ailleurs, les entreprises devraient adopter des politiques d\'embauche inclusives valorisant la diversité comme un atout. En tant qu\'immigrant moi-même, je pense que la persévérance et les réseaux communautaires jouent un rôle crucial dans cette démarche.',
      en: 'Integration in Canada presents several major challenges. First, the recognition of foreign diplomas remains a considerable obstacle for many qualified professionals. Second, language barriers, particularly mastering French in Quebec, can slow professional integration. To overcome these obstacles, it is essential that governments invest in continuing education and prior learning recognition programs. Furthermore, companies should adopt inclusive hiring policies that value diversity as an asset. As an immigrant myself, I believe that perseverance and community networks play a crucial role in this process.',
    },
    starters: [
      { fr: 'L\'intégration présente plusieurs défis, notamment…', en: 'Integration presents several challenges, including…' },
      { fr: 'Pour surmonter ces obstacles, il serait essentiel de…', en: 'To overcome these obstacles, it would be essential to…' },
      { fr: 'D\'après mon expérience personnelle…', en: 'From my personal experience…' },
    ],
    tips: ['Use firsthand experience to strengthen your argument — examiners respond well to authentic personal examples.'],
  },
  {
    id: 'sp-b2-3',
    level: 'B2',
    category: 'Environment',
    icon: '🌿',
    duration: 95,
    xp: 15,
    prompt: 'Is individual action sufficient to address climate change, or does it require systemic change? Defend your view.',
    promptFr: 'L\'action individuelle suffit-elle pour lutter contre le changement climatique, ou faut-il un changement systémique ? Défendez votre point de vue.',
    sampleAnswer: {
      fr: 'La lutte contre le changement climatique exige, selon moi, une approche à deux niveaux. Si les gestes individuels comme réduire sa consommation de plastique ou prendre les transports en commun sont symboliquement importants, ils demeurent insuffisants face à l\'ampleur du problème. Les émissions de carbone sont principalement le fait de grandes corporations et de politiques énergétiques dépassées. Il est donc impératif que les gouvernements imposent des réglementations strictes, que les entreprises adoptent des modèles d\'affaires durables, et que les accords internationaux soient contraignants. L\'action individuelle et le changement systémique ne s\'opposent pas — ils sont complémentaires et indispensables.',
      en: 'The fight against climate change requires, in my view, a two-level approach. While individual gestures like reducing plastic consumption or taking public transport are symbolically important, they remain insufficient given the scale of the problem. Carbon emissions are mainly caused by large corporations and outdated energy policies. It is therefore imperative that governments impose strict regulations, that companies adopt sustainable business models, and that international agreements be binding. Individual action and systemic change are not opposed — they are complementary and indispensable.',
    },
    starters: [
      { fr: 'Bien que les gestes individuels soient utiles, je pense que…', en: 'Although individual gestures are useful, I believe that…' },
      { fr: 'Il est impératif que les gouvernements…', en: 'It is imperative that governments…' },
      { fr: 'En réalité, ces deux approches sont complémentaires…', en: 'In reality, these two approaches are complementary…' },
    ],
    tips: ['Using the subjunctive (il faut que + subjonctif) signals B2 proficiency. Practise: "qu\'ils imposent", "qu\'elles adoptent".'],
  },
  {
    id: 'sp-b2-4',
    level: 'B2',
    category: 'Work & Society',
    icon: '💼',
    duration: 95,
    xp: 15,
    prompt: 'Should remote work be a permanent right for all office workers? Argue your position with concrete reasoning.',
    promptFr: 'Le télétravail devrait-il être un droit permanent pour tous les employés de bureau ? Défendez votre position avec des arguments concrets.',
    sampleAnswer: {
      fr: 'La question du télétravail cristallise des enjeux profonds en matière d\'organisation du travail et de bien-être des employés. D\'une part, les études démontrent que le télétravail peut augmenter la productivité et améliorer l\'équilibre travail-vie personnelle. D\'autre part, certains métiers exigent une présence physique, et l\'isolement prolongé peut nuire à la cohésion des équipes. Je suis d\'avis que le télétravail devrait être un droit accordé selon les besoins du poste plutôt qu\'une règle universelle. Une politique hybride, négociée entre l\'employeur et l\'employé, me semble être la solution la plus équilibrée et la plus viable à long terme.',
      en: 'The question of remote work crystallizes deep issues around work organization and employee wellbeing. On one hand, studies show that remote work can increase productivity and improve work-life balance. On the other hand, some jobs require physical presence, and prolonged isolation can harm team cohesion. I believe remote work should be a right granted according to job requirements rather than a universal rule. A hybrid policy, negotiated between employer and employee, seems to me the most balanced and viable long-term solution.',
    },
    starters: [
      { fr: 'La question du télétravail soulève des enjeux importants, notamment…', en: 'The question of remote work raises important issues, including…' },
      { fr: 'D\'une part… d\'autre part, il convient de rappeler que…', en: 'On one hand… on the other hand, it is worth noting that…' },
      { fr: 'Je suis d\'avis qu\'une approche hybride serait…', en: 'I believe that a hybrid approach would be…' },
    ],
    tips: ['Use hedging language (il me semble, à mon sens, je serais tenté de dire) — it sounds more sophisticated than direct assertions.'],
  },
];

export const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2'];

export const LEVEL_COLORS = {
  A1: '#7C3AED', A2: '#0891B2', B1: '#D97706', B2: '#2563EB',
};

export const LEVEL_BGS = {
  A1: '#F5F3FF', A2: '#E0F2FE', B1: '#FFFBEB', B2: '#EFF6FF',
};

export function getTasksByLevel(level) {
  if (level === 'All') return SPEAKING_PRACTICE_TASKS;
  return SPEAKING_PRACTICE_TASKS.filter(t => t.level === level);
}

export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60 > 0 ? `${seconds % 60}s` : ''}`.trim();
}
