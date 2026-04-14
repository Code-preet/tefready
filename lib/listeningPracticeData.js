// lib/listeningPracticeData.js
// Listening practice question bank for TEF Canada preparation.
// Each question has a French audio script (spoken via TTS), MCQ, transcript, and explanation.
// Types: 'single' (one speaker), 'conversation' (2 speakers)

export const LISTENING_QUESTIONS = [

  // ══════════════════════════════════════════════════════════════════════════
  // A1 — Beginner (clear, slow, everyday topics)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'lp-a1-1', level: 'A1', type: 'single', xp: 5,
    title: 'Se présenter',
    script: 'Bonjour. Je m\'appelle Sophie Dupont. J\'ai trente ans. Je suis infirmière et j\'habite à Montréal depuis deux ans.',
    scriptEn: 'Hello. My name is Sophie Dupont. I am thirty years old. I am a nurse and I have lived in Montréal for two years.',
    question: 'Quelle est la profession de Sophie ?',
    questionEn: 'What is Sophie\'s profession?',
    options: ['Médecin', 'Infirmière', 'Professeure', 'Avocate'],
    answer: 1,
    explanation: 'Sophie says "Je suis infirmière" — I am a nurse.',
  },
  {
    id: 'lp-a1-2', level: 'A1', type: 'conversation', xp: 5,
    title: 'À la caisse',
    script: 'Bonjour madame, vous avez trouvé tout ce qu\'il vous faut ? Oui merci. C\'est combien en tout ? Votre total est de vingt-trois dollars cinquante. Je paye par carte, s\'il vous plaît. Bien sûr, voici le terminal.',
    scriptEn: 'Hello ma\'am, did you find everything you needed? Yes thank you. How much is the total? Your total is twenty-three dollars fifty. I\'ll pay by card, please. Of course, here is the terminal.',
    question: 'Comment la cliente paie-t-elle ?',
    questionEn: 'How does the customer pay?',
    options: ['En espèces', 'Par chèque', 'Par carte', 'Par virement'],
    answer: 2,
    explanation: 'The customer says "Je paye par carte" — I\'ll pay by card.',
  },
  {
    id: 'lp-a1-3', level: 'A1', type: 'single', xp: 5,
    title: 'La météo',
    script: 'Aujourd\'hui à Montréal, il fait froid et il neige. La température est de moins dix degrés. Prenez votre manteau et vos bottes d\'hiver !',
    scriptEn: 'Today in Montréal, it is cold and it is snowing. The temperature is minus ten degrees. Take your coat and winter boots!',
    question: 'Quel temps fait-il aujourd\'hui ?',
    questionEn: 'What is the weather like today?',
    options: ['Il fait chaud et ensoleillé', 'Il pleut et il fait doux', 'Il fait froid et il neige', 'Il y a du vent et du brouillard'],
    answer: 2,
    explanation: '"Il fait froid et il neige" — it is cold and snowing. Minus ten degrees.',
  },
  {
    id: 'lp-a1-4', level: 'A1', type: 'conversation', xp: 5,
    title: 'Au café',
    script: 'Bonjour, qu\'est-ce que vous désirez ? Je voudrais un café au lait et un croissant, s\'il vous plaît. Bien sûr. Vous mangez ici ou c\'est à emporter ? Je mange ici. Très bien, je vous apporte ça tout de suite.',
    scriptEn: 'Hello, what would you like? I would like a coffee with milk and a croissant, please. Of course. Are you eating here or is it to go? I am eating here. Very good, I\'ll bring that right away.',
    question: 'Où la cliente mange-t-elle son croissant ?',
    questionEn: 'Where does the customer eat her croissant?',
    options: ['À emporter', 'Au café, sur place', 'Dans la rue', 'Au bureau'],
    answer: 1,
    explanation: 'She says "Je mange ici" — I am eating here (on the spot).',
  },
  {
    id: 'lp-a1-5', level: 'A1', type: 'single', xp: 5,
    title: 'La famille',
    script: 'Je m\'appelle Ranjit. J\'ai une grande famille. J\'ai deux frères et une sœur. Mes parents habitent en Inde, mais mon frère aîné vit à Toronto avec sa femme et ses trois enfants.',
    scriptEn: 'My name is Ranjit. I have a big family. I have two brothers and one sister. My parents live in India, but my eldest brother lives in Toronto with his wife and three children.',
    question: 'Où habitent les parents de Ranjit ?',
    questionEn: 'Where do Ranjit\'s parents live?',
    options: ['À Toronto', 'En Inde', 'À Montréal', 'À Vancouver'],
    answer: 1,
    explanation: '"Mes parents habitent en Inde" — My parents live in India.',
  },
  {
    id: 'lp-a1-6', level: 'A1', type: 'conversation', xp: 5,
    title: 'Prendre un rendez-vous',
    script: 'Cabinet du docteur Martin, bonjour. Bonjour, je voudrais prendre un rendez-vous, s\'il vous plaît. Bien sûr. Vous êtes disponible quel jour ? Je préfère le vendredi matin si possible. Vendredi prochain à dix heures, ça vous convient ? Oui, parfait. Merci beaucoup.',
    scriptEn: 'Dr. Martin\'s office, hello. Hello, I would like to make an appointment, please. Of course. Which day are you available? I prefer Friday morning if possible. Next Friday at ten o\'clock, does that suit you? Yes, perfect. Thank you very much.',
    question: 'Quand est le rendez-vous ?',
    questionEn: 'When is the appointment?',
    options: ['Lundi matin', 'Mercredi à midi', 'Vendredi à dix heures', 'Jeudi après-midi'],
    answer: 2,
    explanation: 'The receptionist offers "vendredi prochain à dix heures" and the caller accepts.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // A2 — Elementary (natural pace, daily life situations)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'lp-a2-1', level: 'A2', type: 'conversation', xp: 8,
    title: 'Chercher un appartement',
    script: 'Bonjour, je vous appelle au sujet de l\'annonce pour l\'appartement dans le Plateau. Oui, il est toujours disponible. Il fait soixante-dix mètres carrés, deux chambres, avec un balcon. Le loyer est de mille quatre cents dollars par mois, charges comprises. Est-ce que les animaux sont acceptés ? Oui, un petit animal est toléré. Parfait, est-ce que je pourrais le visiter ce weekend ? Bien sûr, samedi après-midi vous convient ?',
    scriptEn: 'Hello, I\'m calling about the ad for the apartment in Plateau. Yes, it is still available. It is seventy square metres, two bedrooms, with a balcony. The rent is fourteen hundred dollars per month, utilities included. Are pets allowed? Yes, a small animal is tolerated. Perfect, could I visit it this weekend? Of course, does Saturday afternoon work for you?',
    question: 'Qu\'est-ce qui est inclus dans le loyer ?',
    questionEn: 'What is included in the rent?',
    options: ['Seulement l\'électricité', 'Les charges (utilities)', 'Le stationnement', 'L\'internet'],
    answer: 1,
    explanation: '"mille quatre cents dollars par mois, charges comprises" — rent is $1,400/month, utilities included.',
  },
  {
    id: 'lp-a2-2', level: 'A2', type: 'single', xp: 8,
    title: 'Annonce de transport',
    script: 'Mesdames et messieurs, votre attention s\'il vous plaît. En raison de travaux de maintenance, la ligne orange est interrompue entre les stations Berri et Jean-Talon. Des autobus de remplacement sont disponibles à la sortie principale. Nous vous remercions de votre compréhension.',
    scriptEn: 'Ladies and gentlemen, your attention please. Due to maintenance work, the orange line is interrupted between Berri and Jean-Talon stations. Replacement buses are available at the main exit. Thank you for your understanding.',
    question: 'Pourquoi le service est-il interrompu ?',
    questionEn: 'Why is the service interrupted?',
    options: ['À cause d\'un accident', 'En raison de travaux de maintenance', 'À cause d\'une grève', 'En raison du mauvais temps'],
    answer: 1,
    explanation: '"En raison de travaux de maintenance" — due to maintenance work.',
  },
  {
    id: 'lp-a2-3', level: 'A2', type: 'conversation', xp: 8,
    title: 'À la pharmacie',
    script: 'Bonjour, je peux vous aider ? Oui, j\'ai mal à la gorge depuis hier et j\'ai un peu de fièvre. Avez-vous une ordonnance ? Non, pas encore. Je voulais d\'abord essayer quelque chose sans ordonnance. Je vous recommande ce sirop pour la gorge et du paracétamol pour la fièvre. Si ça ne va pas mieux dans deux jours, consultez un médecin. D\'accord, je prends les deux. Ça fait seize dollars cinquante.',
    scriptEn: 'Hello, can I help you? Yes, I have had a sore throat since yesterday and a slight fever. Do you have a prescription? No, not yet. I wanted to first try something without a prescription. I recommend this throat syrup and paracetamol for the fever. If it doesn\'t get better in two days, see a doctor. Okay, I\'ll take both. That\'s sixteen dollars fifty.',
    question: 'Quels médicaments la pharmacienne recommande-t-elle ?',
    questionEn: 'What medications does the pharmacist recommend?',
    options: ['Des antibiotiques seulement', 'Un sirop et du paracétamol', 'Des vitamines et de l\'ibuprofène', 'Rien — elle envoie voir un médecin'],
    answer: 1,
    explanation: 'The pharmacist recommends "ce sirop pour la gorge et du paracétamol" — throat syrup and paracetamol.',
  },
  {
    id: 'lp-a2-4', level: 'A2', type: 'single', xp: 8,
    title: 'Message vocal',
    script: 'Bonjour Laure, c\'est Mathieu. Je t\'appelle pour te dire que je serai en retard à notre réunion de jeudi. J\'ai un autre engagement jusqu\'à quatorze heures trente. Est-ce qu\'on peut décaler à quinze heures ? Rappelle-moi pour confirmer. À bientôt.',
    scriptEn: 'Hello Laure, it\'s Mathieu. I\'m calling to tell you that I will be late for our Thursday meeting. I have another commitment until 2:30 PM. Can we move it to 3 PM? Call me back to confirm. Talk soon.',
    question: 'Pourquoi Mathieu sera-t-il en retard ?',
    questionEn: 'Why will Mathieu be late?',
    options: ['Il est malade', 'Il a un autre engagement', 'Il a raté son bus', 'Il a oublié la réunion'],
    answer: 1,
    explanation: '"J\'ai un autre engagement jusqu\'à quatorze heures trente" — he has another commitment until 2:30 PM.',
  },
  {
    id: 'lp-a2-5', level: 'A2', type: 'conversation', xp: 8,
    title: 'À la banque',
    script: 'Bonjour, je voudrais ouvrir un compte chèques, s\'il vous plaît. Bien sûr. Vous avez une pièce d\'identité et une preuve d\'adresse ? Oui, j\'ai mon passeport et une facture d\'électricité. Très bien. Est-ce que vous souhaitez aussi une carte de débit ? Oui, s\'il vous plaît. Il y a des frais mensuels ? Non, le compte est gratuit si vous maintenez un solde minimum de cinq cents dollars.',
    scriptEn: 'Hello, I would like to open a chequing account, please. Of course. Do you have ID and proof of address? Yes, I have my passport and an electricity bill. Very good. Would you also like a debit card? Yes, please. Are there monthly fees? No, the account is free if you maintain a minimum balance of five hundred dollars.',
    question: 'Quand le compte est-il gratuit ?',
    questionEn: 'When is the account free?',
    options: ['Toujours, sans condition', 'Si le solde minimum de 500 $ est maintenu', 'Uniquement la première année', 'Si vous avez un emploi'],
    answer: 1,
    explanation: '"le compte est gratuit si vous maintenez un solde minimum de cinq cents dollars" — free with $500 minimum balance.',
  },
  {
    id: 'lp-a2-6', level: 'A2', type: 'single', xp: 8,
    title: 'Annonce au supermarché',
    script: 'Chers clients, bienvenue chez Maxi. Ce vendredi et samedi seulement, profitez de cinquante pour cent de réduction sur tous les produits laitiers. De plus, avec tout achat de plus de cinquante dollars, vous recevez un coupon de cinq dollars pour votre prochaine visite. Bonne journée et bon shopping !',
    scriptEn: 'Dear customers, welcome to Maxi. This Friday and Saturday only, enjoy fifty percent off all dairy products. Additionally, with any purchase over fifty dollars, you receive a five-dollar coupon for your next visit. Have a good day and happy shopping!',
    question: 'Quelle promotion est offerte ce weekend ?',
    questionEn: 'What promotion is offered this weekend?',
    options: ['20% de réduction sur tout le magasin', '50% sur les produits laitiers', 'Des produits gratuits avec tout achat', '10% sur les fruits et légumes'],
    answer: 1,
    explanation: '"cinquante pour cent de réduction sur tous les produits laitiers" — 50% off all dairy products.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // B1 — Intermediate (natural pace, complex situations)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'lp-b1-1', level: 'B1', type: 'conversation', xp: 12,
    title: 'Entretien d\'embauche',
    script: 'Bonjour monsieur Patel, je suis Christine Beaumont, responsable RH. Merci de me recevoir. Pouvez-vous me parler de votre expérience dans le domaine informatique ? Bien sûr. J\'ai travaillé cinq ans comme développeur logiciel en Inde, principalement sur des applications mobiles. Pourquoi avez-vous choisi d\'immigrer au Canada ? Je cherchais de nouvelles opportunités professionnelles et un meilleur équilibre travail-vie personnelle. Mon épouse est aussi ingénieure et nous voulions élever nos enfants dans un environnement bilingue. C\'est intéressant. Êtes-vous à l\'aise de travailler en français au quotidien ? Je m\'améliore constamment. Je suis des cours du soir et je me sens confiant pour les communications écrites.',
    scriptEn: 'Hello Mr. Patel, I\'m Christine Beaumont, HR manager. Thank you for receiving me. Can you tell me about your experience in IT? Of course. I worked five years as a software developer in India, mainly on mobile applications. Why did you choose to immigrate to Canada? I was looking for new professional opportunities and a better work-life balance. My wife is also an engineer and we wanted to raise our children in a bilingual environment. Interesting. Are you comfortable working in French daily? I am constantly improving. I take evening classes and feel confident about written communications.',
    question: 'Quelle raison personnelle M. Patel donne-t-il pour son immigration ?',
    questionEn: 'What personal reason does Mr. Patel give for his immigration?',
    options: ['Il voulait fuir la chaleur en Inde', 'Il voulait élever ses enfants dans un environnement bilingue', 'Il avait déjà un emploi au Canada', 'Sa famille vivait déjà ici'],
    answer: 1,
    explanation: 'He says "nous voulions élever nos enfants dans un environnement bilingue" — they wanted to raise children bilingually.',
  },
  {
    id: 'lp-b1-2', level: 'B1', type: 'single', xp: 12,
    title: 'Bulletin météo',
    script: 'Bonjour à tous. Voici les prévisions pour la semaine. Lundi et mardi seront pluvieux avec des températures autour de huit degrés. Une légère amélioration est attendue mercredi avec des éclaircies en après-midi. Attention cependant : un front froid arrive jeudi soir et les températures vont chuter à moins cinq pendant le weekend. Les automobilistes devront être prudents sur les routes verglacées.',
    scriptEn: 'Good morning everyone. Here are the forecasts for the week. Monday and Tuesday will be rainy with temperatures around eight degrees. A slight improvement is expected Wednesday with some sunny spells in the afternoon. However, beware: a cold front arrives Thursday evening and temperatures will drop to minus five over the weekend. Motorists should be careful on icy roads.',
    question: 'Quand les conditions routières seront-elles dangereuses ?',
    questionEn: 'When will road conditions be dangerous?',
    options: ['Lundi et mardi à cause de la pluie', 'Mercredi après-midi', 'Le weekend à cause du verglas', 'Toute la semaine'],
    answer: 2,
    explanation: 'A cold front Thursday evening causes temperatures to drop to -5°, creating icy roads over the weekend.',
  },
  {
    id: 'lp-b1-3', level: 'B1', type: 'conversation', xp: 12,
    title: 'Problème de voisinage',
    script: 'Bonjour madame, je suis votre nouveau voisin du dessus. Ah oui bonjour. Je voulais m\'excuser pour le bruit la semaine dernière. J\'aidais des amis à déménager des meubles. Je comprends que ça a pu être gênant. Oui effectivement, surtout le soir après vingt-deux heures. C\'est le règlement de l\'immeuble. Je suis vraiment désolé. Ça ne se reproduira plus. Je préfère qu\'on ait de bonnes relations de voisinage. Tout à fait. Si vous avez d\'autres projets comme ça, prévenez-moi à l\'avance et on trouvera un moment convenable.',
    scriptEn: 'Hello ma\'am, I\'m your new upstairs neighbour. Oh yes, hello. I wanted to apologise for the noise last week. I was helping friends move furniture. I understand it may have been annoying. Yes indeed, especially in the evening after 10 PM. That\'s the building rule. I\'m truly sorry. It won\'t happen again. I prefer we have good neighbourly relations. Absolutely. If you have other projects like that, let me know in advance and we\'ll find a suitable time.',
    question: 'Quelle solution la voisine propose-t-elle pour éviter ce problème à l\'avenir ?',
    questionEn: 'What solution does the neighbour propose to avoid this problem in the future?',
    options: ['Appeler le gestionnaire de l\'immeuble', 'Prévenir à l\'avance pour trouver un moment convenable', 'Déménager dans un autre appartement', 'Interdire tout bruit après 20h'],
    answer: 1,
    explanation: '"Si vous avez d\'autres projets, prévenez-moi à l\'avance" — let me know in advance and we\'ll find a suitable time.',
  },
  {
    id: 'lp-b1-4', level: 'B1', type: 'single', xp: 12,
    title: 'Émission radio — santé',
    script: 'Selon une étude récente publiée par l\'Université de Montréal, marcher trente minutes par jour réduirait de vingt pour cent le risque de maladies cardiovasculaires. Les chercheurs soulignent qu\'il n\'est pas nécessaire de faire du sport intensif. Une promenade quotidienne, même divisée en plusieurs courtes périodes, apporte des bénéfices significatifs pour la santé. Cette découverte devrait encourager des millions de personnes à adopter des habitudes plus actives.',
    scriptEn: 'According to a recent study published by the University of Montréal, walking thirty minutes a day would reduce the risk of cardiovascular disease by twenty percent. Researchers emphasize that intensive sport is not necessary. A daily walk, even divided into several short periods, provides significant health benefits. This discovery should encourage millions of people to adopt more active habits.',
    question: 'Quel est le bénéfice principal de marcher 30 minutes par jour ?',
    questionEn: 'What is the main benefit of walking 30 minutes a day?',
    options: ['Perdre du poids rapidement', 'Réduire de 20% le risque cardiovasculaire', 'Améliorer la mémoire', 'Diminuer le stress de 50%'],
    answer: 1,
    explanation: '"marcher trente minutes par jour réduirait de vingt pour cent le risque de maladies cardiovasculaires"',
  },
  {
    id: 'lp-b1-5', level: 'B1', type: 'conversation', xp: 12,
    title: 'Service client — réclamation',
    script: 'Bonjour, service clientèle, que puis-je faire pour vous ? Bonjour, j\'ai commandé un colis il y a deux semaines et je ne l\'ai toujours pas reçu. Le numéro de suivi indique qu\'il est en transit depuis dix jours. Pouvez-vous me donner votre numéro de commande ? Oui, c\'est le quatre-vingt-sept zéro zéro quinze. Un instant. Je vois que votre colis est bloqué au centre de tri de Laval. Il devrait vous parvenir d\'ici deux jours ouvrables. Si ce n\'est pas le cas, n\'hésitez pas à nous recontacter et nous initierons une enquête. Très bien, merci pour l\'information.',
    scriptEn: 'Hello, customer service, how can I help you? Hello, I ordered a package two weeks ago and have still not received it. The tracking number indicates it has been in transit for ten days. Can you give me your order number? Yes, it\'s eighty-seven zero zero fifteen. One moment. I see your package is stuck at the Laval sorting centre. It should reach you within two business days. If not, do not hesitate to contact us again and we will initiate an investigation. Very good, thank you for the information.',
    question: 'Où se trouve le colis du client ?',
    questionEn: 'Where is the customer\'s package?',
    options: ['Il a été livré à la mauvaise adresse', 'Au centre de tri de Laval', 'Il a été perdu en transit', 'À la douane canadienne'],
    answer: 1,
    explanation: '"votre colis est bloqué au centre de tri de Laval" — the package is stuck at the Laval sorting centre.',
  },
  {
    id: 'lp-b1-6', level: 'B1', type: 'single', xp: 12,
    title: 'Conseils d\'intégration',
    script: 'Bienvenue au Centre d\'intégration des nouveaux arrivants. Pour faciliter votre installation au Québec, nous vous conseillons d\'abord de vous inscrire à des cours de français certifiés MIFI, qui sont gratuits pour les immigrants. Ensuite, faites évaluer vos diplômes étrangers par un ordre professionnel si vous exercez une profession réglementée. Enfin, rejoignez des associations de votre communauté et des groupes de conversation pour pratiquer le français dans un contexte naturel. Notre équipe reste disponible du lundi au vendredi.',
    scriptEn: 'Welcome to the Centre for New Arrivals Integration. To facilitate your settlement in Québec, we first advise you to register for MIFI-certified French courses, which are free for immigrants. Then, have your foreign diplomas evaluated by a professional order if you practise a regulated profession. Finally, join associations in your community and conversation groups to practise French in a natural context. Our team remains available Monday to Friday.',
    question: 'Que conseille-t-on aux immigrants ayant une profession réglementée ?',
    questionEn: 'What do they advise immigrants with a regulated profession?',
    options: ['De reprendre leurs études depuis le début', 'De faire évaluer leurs diplômes par un ordre professionnel', 'De travailler bénévolement pendant un an', 'De passer un examen de français avancé'],
    answer: 1,
    explanation: '"faites évaluer vos diplômes étrangers par un ordre professionnel" — have your foreign diplomas evaluated by a professional order.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // B2 — Upper Intermediate (TEF-level, authentic, fast)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'lp-b2-1', level: 'B2', type: 'conversation', xp: 15,
    title: 'Débat sur le télétravail',
    script: 'Dans notre sondage de cette semaine, nous avons demandé à nos auditeurs leur opinion sur le télétravail obligatoire. Cinquante-huit pour cent y sont favorables, invoquant une meilleure conciliation travail-famille et des économies sur les transports. Cependant, quarante-deux pour cent s\'y opposent, estimant que le travail en présentiel favorise la créativité collective et renforce la culture d\'entreprise. Une auditrice nous a écrit : "Depuis que je télétravaille, je gagne deux heures par jour sur les trajets, mais je me sens plus isolée professionnellement." Ce débat illustre bien la complexité de la question.',
    scriptEn: 'In our survey this week, we asked our listeners their opinion on mandatory remote work. Fifty-eight percent are in favour, citing better work-family balance and savings on transport. However, forty-two percent are against it, feeling that in-person work promotes collective creativity and strengthens company culture. A listener wrote: "Since I\'ve been working remotely, I gain two hours a day on commutes, but I feel more professionally isolated." This debate well illustrates the complexity of the issue.',
    question: 'Quel avantage principal les partisans du télétravail mentionnent-ils ?',
    questionEn: 'What main advantage do telework supporters mention?',
    options: ['Une meilleure productivité individuelle', 'Une meilleure conciliation travail-famille et des économies', 'Un meilleur accès aux technologies', 'Une hausse des salaires'],
    answer: 1,
    explanation: '"meilleure conciliation travail-famille et des économies sur les transports" — better work-family balance and savings on transport.',
  },
  {
    id: 'lp-b2-2', level: 'B2', type: 'single', xp: 15,
    title: 'Émission sur l\'immigration',
    script: 'Le Québec a récemment révisé ses critères d\'immigration permanente dans le cadre du Programme de l\'expérience québécoise. Désormais, les candidats doivent démontrer un niveau de français équivalent au CLB sept pour la compréhension orale et à l\'écrit, et CLB cinq pour l\'expression orale. Cette décision vise à mieux intégrer les immigrants dans le marché du travail francophone. Plusieurs associations d\'immigrants ont toutefois exprimé des réserves, craignant que ces exigences n\'excluent des candidats qualifiés mais encore en apprentissage.',
    scriptEn: 'Québec has recently revised its permanent immigration criteria under the Québec Experience Program. Henceforth, candidates must demonstrate a French level equivalent to CLB seven for oral comprehension and written, and CLB five for oral expression. This decision aims to better integrate immigrants into the French-speaking labour market. However, several immigrant associations have expressed reservations, fearing these requirements might exclude qualified candidates still learning.',
    question: 'Pourquoi certaines associations expriment-elles des réserves ?',
    questionEn: 'Why do some associations express reservations?',
    options: ['Elles trouvent les niveaux trop bas', 'Elles craignent l\'exclusion de candidats qualifiés encore en apprentissage', 'Elles préfèrent un système de points', 'Elles veulent des critères plus stricts'],
    answer: 1,
    explanation: '"craignant que ces exigences n\'excluent des candidats qualifiés mais encore en apprentissage" — fearing exclusion of qualified candidates still learning.',
  },
  {
    id: 'lp-b2-3', level: 'B2', type: 'conversation', xp: 15,
    title: 'Négociation au travail',
    script: 'Madame Chen, j\'aimerais discuter de ma rémunération. Cela fait maintenant dix-huit mois que je suis dans l\'entreprise et j\'estime avoir dépassé les objectifs fixés lors de mon embauche. Vous soulevez un point légitime. Vos performances sont effectivement au-dessus de la moyenne. Quelle augmentation aviez-vous en tête ? Je pensais à une augmentation de douze pour cent, ce qui porterait mon salaire à soixante-deux mille dollars. C\'est un peu plus que ce que nous avions prévu en budget, mais compte tenu de votre contribution, nous pourrions envisager dix pour cent. Je suis ouvert à cette proposition si elle s\'accompagne d\'une révision de mes responsabilités. Nous pouvons certainement explorer ça ensemble.',
    scriptEn: 'Ms. Chen, I would like to discuss my salary. It has now been eighteen months since I joined the company and I feel I have exceeded the objectives set at hiring. You raise a legitimate point. Your performance is indeed above average. What increase did you have in mind? I was thinking of a twelve percent increase, which would bring my salary to sixty-two thousand dollars. That\'s a bit more than we had budgeted, but given your contribution, we could consider ten percent. I am open to this proposal if it comes with a review of my responsibilities. We can certainly explore that together.',
    question: 'Quelle est la contre-proposition de l\'employeur ?',
    questionEn: 'What is the employer\'s counter-proposal?',
    options: ['Aucune augmentation cette année', 'Une augmentation de 8%', 'Une augmentation de 10%', 'Une augmentation de 12% comme demandé'],
    answer: 2,
    explanation: '"nous pourrions envisager dix pour cent" — the employer proposes a 10% increase (vs. the 12% requested).',
  },
  {
    id: 'lp-b2-4', level: 'B2', type: 'single', xp: 15,
    title: 'Conférence sur le climat',
    script: 'Lors du Forum Économique de Québec, la ministre de l\'Environnement a annoncé un plan ambitieux visant à réduire les émissions de gaz à effet de serre de quarante pour cent d\'ici deux mille trente. Ce plan comprend la conversion de la flotte de véhicules gouvernementaux à l\'électrique, des subventions renforcées pour les rénovations écoénergétiques résidentielles, et l\'obligation pour les entreprises de plus de cinquante employés de présenter un bilan carbone annuel. Des milieux d\'affaires ont accueilli favorablement ces mesures tout en appelant à des délais de transition réalistes.',
    scriptEn: 'At the Québec Economic Forum, the Minister of the Environment announced an ambitious plan aimed at reducing greenhouse gas emissions by forty percent by two thousand thirty. This plan includes converting the government vehicle fleet to electric, enhanced subsidies for residential energy-efficient renovations, and requiring companies with more than fifty employees to present an annual carbon report. Business circles welcomed these measures while calling for realistic transition deadlines.',
    question: 'Quelle obligation est imposée aux grandes entreprises ?',
    questionEn: 'What obligation is imposed on large companies?',
    options: ['Convertir leur flotte à l\'électrique', 'Payer une taxe carbone annuelle', 'Présenter un bilan carbone annuel', 'Réduire leur personnel de 10%'],
    answer: 2,
    explanation: '"l\'obligation pour les entreprises de plus de cinquante employés de présenter un bilan carbone annuel"',
  },
  {
    id: 'lp-b2-5', level: 'B2', type: 'conversation', xp: 15,
    title: 'Réunion de copropriété',
    script: 'La réunion de copropriété est ouverte. Le premier point à l\'ordre du jour concerne la réfection du toit. Nous avons reçu trois devis. Le moins cher s\'élève à quarante-deux mille dollars, mais l\'entreprise n\'a que deux ans d\'existence. Le deuxième, à cinquante-huit mille, vient d\'une entreprise établie depuis vingt ans. Et le troisième à soixante et onze mille semble excessif pour la plupart d\'entre nous. Je propose de voter pour le deuxième devis, qui offre le meilleur équilibre entre prix et garanties. Est-ce que vous avez des questions avant le vote ? Oui, est-ce que le financement peut être étalé sur deux ans ?',
    scriptEn: 'The co-ownership meeting is open. The first item on the agenda concerns the roof renovation. We have received three quotes. The cheapest is forty-two thousand dollars, but the company is only two years old. The second, at fifty-eight thousand, comes from a company established twenty years ago. And the third at seventy-one thousand seems excessive to most of us. I propose voting for the second quote, which offers the best balance between price and guarantees. Do you have any questions before the vote? Yes, can the financing be spread over two years?',
    question: 'Pourquoi le président suggère-t-il le deuxième devis ?',
    questionEn: 'Why does the chairman suggest the second quote?',
    options: ['C\'est le moins cher', 'Il offre le meilleur équilibre prix/garanties et vient d\'une entreprise établie', 'L\'entreprise est la plus proche géographiquement', 'Il inclut une garantie de 10 ans'],
    answer: 1,
    explanation: '"offre le meilleur équilibre entre prix et garanties" + the company has 20 years of experience.',
  },
  {
    id: 'lp-b2-6', level: 'B2', type: 'single', xp: 15,
    title: 'Podcast — intelligence artificielle',
    script: 'L\'intelligence artificielle générative transforme profondément le marché du travail au Québec. Selon une étude de l\'Institut du Québec, trente-cinq pour cent des emplois actuels comportent des tâches hautement automatisables d\'ici dix ans. Toutefois, les experts s\'accordent à dire que ce phénomène créera également de nouveaux métiers, notamment dans la gestion de l\'IA, l\'éthique numérique et l\'analyse de données. La clé réside dans la capacité des travailleurs à développer des compétences complémentaires à celles des machines. Les gouvernements sont invités à investir massivement dans la formation continue.',
    scriptEn: 'Generative artificial intelligence is profoundly transforming the labour market in Québec. According to a study by the Institut du Québec, thirty-five percent of current jobs involve highly automatable tasks within ten years. However, experts agree that this phenomenon will also create new professions, particularly in AI management, digital ethics, and data analysis. The key lies in the ability of workers to develop skills complementary to those of machines. Governments are invited to invest massively in continuing education.',
    question: 'Quelle est la solution principale suggérée pour s\'adapter à l\'IA ?',
    questionEn: 'What is the main solution suggested to adapt to AI?',
    options: ['Interdire certaines technologies', 'Développer des compétences complémentaires aux machines', 'Réduire la semaine de travail', 'Taxer les entreprises technologiques'],
    answer: 1,
    explanation: '"La clé réside dans la capacité des travailleurs à développer des compétences complémentaires à celles des machines."',
  },
];

// Helpers
export const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2'];

export function getQuestionsByLevel(level) {
  if (level === 'All') return [...LISTENING_QUESTIONS];
  return LISTENING_QUESTIONS.filter(q => q.level === level);
}

export function shuffleQuestions(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LEVEL_COLORS = {
  A1: '#7C3AED', A2: '#0891B2', B1: '#D97706', B2: '#2563EB',
};
export const LEVEL_BGS = {
  A1: '#F5F3FF', A2: '#E0F2FE', B1: '#FFFBEB', B2: '#EFF6FF',
};
