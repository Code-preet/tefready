export const listeningTest = {
  id: 'tef-listening-01',
  title: "TEF Canada — Compréhension de l'oral",
  totalTime: 40 * 60,
  instructions: 'You will hear a series of audio documents. For each one, choose the best answer from the options provided.',

  parts: [
    {
      id: 'part1',
      number: 1,
      title: 'Partie 1 — Dialogues courts',
      description: 'Short dialogues in everyday situations. Choose the best answer.',
      clbLevel: 'CLB 5–7',
      items: [
        {
          id: 'p1q1',
          script: `Bonjour, je voudrais prendre rendez-vous avec le docteur Leblanc, s'il vous plaît. Bien sûr. Vous êtes disponible quand ? J'aurais besoin d'un rendez-vous assez urgent, si possible demain matin. Demain matin, j'ai une place à neuf heures quinze. Ça vous convient ? Oui, parfait. C'est pour un renouvellement d'ordonnance. D'accord. Votre nom, s'il vous plaît ? Martin, Sophie Martin.`,
          question: 'Pourquoi Sophie appelle-t-elle la clinique ?',
          options: ["Pour annuler un rendez-vous existant", "Pour obtenir un renouvellement d'ordonnance", "Pour demander les résultats d'une analyse"],
          answer: 1,
          explanation: "Sophie says C'est pour un renouvellement d'ordonnance — she needs a prescription renewal."
        },
        {
          id: 'p1q2',
          script: `Alors, comment s'est passé ton entretien d'embauche ? Pas trop mal, je crois. Ils ont l'air intéressés par mon profil. Tu commences quand si ça marche ? La semaine prochaine si tout va bien. Mais je dois encore passer une deuxième entrevue avec le directeur. Ah, c'est une bonne nouvelle quand même. Tu mérites vraiment ce poste. Merci. J'espère que ça va se confirmer bientôt.`,
          question: "Quelle est la situation de la personne qui parle de l'entretien ?",
          options: ["Elle a obtenu le poste définitivement", "Elle attend une deuxième entrevue avant la décision finale", "Elle a refusé l'offre d'emploi"],
          answer: 1,
          explanation: 'She still needs a second interview with the director before a final decision.'
        },
        {
          id: 'p1q3',
          script: `Excusez-moi, est-ce que ce bus va bien jusqu'à la station Berri-UQAM ? Non, celui-là va seulement jusqu'à Papineau. Il faut prendre le 24 pour aller à Berri. Et où est l'arrêt du 24 ? Traversez la rue, c'est de l'autre côté. Il passe toutes les dix minutes environ. Merci beaucoup, vous êtes très gentil. De rien, bonne journée !`,
          question: 'Que doit faire la personne pour aller à Berri-UQAM ?',
          options: ["Continuer sur le même bus", "Traverser la rue et prendre le bus numéro 24", "Prendre le métro à la station Papineau"],
          answer: 1,
          explanation: 'The person is told to cross the street and take bus 24.'
        },
        {
          id: 'p1q4',
          script: `Bonjour, je vous appelle au sujet de l'appartement à louer dans le Plateau. Oui, bien sûr. Il fait quatre-vingt mètres carrés, deux chambres, et il est disponible le premier du mois prochain. Est-ce que les animaux sont acceptés ? Malheureusement non, le propriétaire ne souhaite pas d'animaux de compagnie. C'est dommage, j'ai un petit chien. Merci quand même. De rien, bonne chance dans vos recherches.`,
          question: "Pourquoi la personne ne peut-elle pas louer cet appartement ?",
          options: ["L'appartement est trop petit", "Le loyer est trop élevé", "Les animaux de compagnie ne sont pas acceptés"],
          answer: 2,
          explanation: 'The landlord does not accept pets, and the caller has a small dog.'
        },
        {
          id: 'p1q5',
          script: `Tu as vu les nouvelles ce matin ? Il paraît qu'il va neiger toute la semaine. Oui, j'ai entendu ça aussi. On annonce jusqu'à quarante centimètres d'ici vendredi. C'est beaucoup. Je vais devoir sortir mes bottes d'hiver finalement. Et penser à partir plus tôt le matin. Les routes vont être vraiment difficiles. Tu as raison. Je préfère prendre le métro de toute façon. Sage décision.`,
          question: 'Quelle décision la première personne prend-elle face aux conditions météo ?',
          options: ["Elle va utiliser sa voiture mais partir plus tôt", "Elle va prendre le métro pour éviter les routes difficiles", "Elle va rester chez elle toute la semaine"],
          answer: 1,
          explanation: 'She decides to take the metro to avoid difficult road conditions.'
        },
        {
          id: 'p1q6',
          script: `Je cherche un cadeau pour l'anniversaire de ma mère. Elle a soixante ans. Vous avez un budget en tête ? Environ cent dollars, peut-être un peu plus si c'est vraiment beau. On vient de recevoir une nouvelle collection de foulards en soie. C'est très élégant et ça fait toujours plaisir. Oh oui, elle adore les accessoires. Je peux voir les modèles disponibles ? Bien sûr, suivez-moi.`,
          question: 'Quel type de cadeau la cliente va-t-elle probablement choisir ?',
          options: ["Un livre de cuisine", "Un foulard en soie", "Un bijou en or"],
          answer: 1,
          explanation: 'The salesperson suggests silk scarves and the customer asks to see the models.'
        }
      ]
    },
    {
      id: 'part2',
      number: 2,
      title: 'Partie 2 — Documents sonores de moyenne durée',
      description: 'Medium-length audio documents on general topics.',
      clbLevel: 'CLB 7–9',
      items: [
        {
          id: 'p2q1',
          script: `Bonjour à tous et bienvenue dans cette nouvelle émission de Santé Pratique. Aujourd'hui, nous allons parler de la santé mentale au travail. Selon une récente étude de l'Institut canadien d'information sur la santé, près d'un travailleur sur cinq souffre de problèmes de santé mentale liés au stress professionnel. Le surmenage, les longues heures, et le manque de reconnaissance sont les facteurs les plus souvent cités. Pour améliorer la situation, les experts recommandent plusieurs mesures : que les employeurs mettent en place des programmes d'aide aux employés, qu'on encourage les pauses régulières, et que les gestionnaires reçoivent une formation pour reconnaître les signes d'épuisement professionnel.`,
          question: "Selon l'émission, quelle proportion de travailleurs canadiens souffre de problèmes de santé mentale liés au travail ?",
          options: ["Un travailleur sur dix", "Un travailleur sur cinq", "Un travailleur sur trois"],
          answer: 1,
          explanation: "The broadcast states près d'un travailleur sur cinq — nearly one in five workers."
        },
        {
          id: 'p2q2',
          script: `Mesdames et messieurs, bonjour. Je suis Rémi Thibault, directeur du programme d'immigration économique de la ville de Moncton. Nous sommes très heureux de vous accueillir dans notre communauté francophone. Moncton est la ville à croissance la plus rapide des Maritimes, et nous avons un urgent besoin de travailleurs qualifiés dans plusieurs secteurs : la santé, la construction, la technologie de l'information, et la restauration. Notre bureau d'accueil peut vous aider à faire reconnaître vos diplômes étrangers, à améliorer votre français ou votre anglais, et à trouver un logement abordable. Nous organisons également des séances d'information tous les mercredis à dix-huit heures.`,
          question: "Quel est l'objectif principal de cette présentation ?",
          options: ["Présenter les attraits touristiques de Moncton", "Informer les nouveaux arrivants des ressources disponibles pour s'intégrer", "Expliquer les règles d'immigration canadienne"],
          answer: 1,
          explanation: 'The speaker explains services for newcomers: diploma recognition, language training, housing, and weekly info sessions.'
        },
        {
          id: 'p2q3',
          script: `Et maintenant, notre chronique environnement. Le gouvernement fédéral a annoncé cette semaine un investissement de deux milliards de dollars pour accélérer la transition vers les énergies renouvelables. Cet argent sera distribué sur cinq ans et servira principalement à financer des projets éoliens et solaires dans les provinces atlantiques et en Ontario. Le ministre de l'Environnement a déclaré que cet investissement permettra de créer environ vingt mille emplois verts d'ici 2030, tout en réduisant les émissions de gaz à effet de serre de douze pour cent. Cependant, certains groupes environnementaux estiment que ces mesures ne sont pas suffisantes pour atteindre les objectifs climatiques fixés par l'Accord de Paris.`,
          question: "Quelle est la principale critique formulée contre l'annonce du gouvernement ?",
          options: ["L'investissement est trop concentré dans une seule région", "Les mesures annoncées sont insuffisantes pour atteindre les objectifs climatiques", "Le projet va détruire des emplois dans le secteur pétrolier"],
          answer: 1,
          explanation: "Environmental groups say the measures are not enough to meet the Paris Agreement climate targets."
        },
        {
          id: 'p2q4',
          script: `Bonjour, je m'appelle Amina Diallo et je suis nutritionniste. Aujourd'hui, je vais vous parler de l'alimentation des enfants à l'école. De nombreuses études ont démontré qu'un enfant qui mange bien le matin obtient de meilleurs résultats scolaires et se concentre plus facilement. Malheureusement, au Canada, environ un enfant sur sept arrive à l'école le ventre vide. C'est pourquoi plusieurs provinces ont mis en place des programmes de petit-déjeuner gratuit dans les écoles publiques. Ces programmes ont montré des résultats très positifs : meilleure assiduité, moins de comportements difficiles, et de meilleures notes.`,
          question: "Selon la nutritionniste, quel est l'effet d'un bon petit-déjeuner sur les enfants ?",
          options: ["Il améliore les résultats scolaires et la concentration", "Il réduit le besoin de faire du sport", "Il diminue les conflits entre enfants à l'école"],
          answer: 0,
          explanation: 'Children who eat well in the morning achieve better academic results and concentrate more easily.'
        }
      ]
    },
    {
      id: 'part3',
      number: 3,
      title: 'Partie 3 — Documents longs et complexes',
      description: 'Longer, more complex audio documents requiring detailed understanding.',
      clbLevel: 'CLB 9–12',
      items: [
        {
          id: 'p3q1',
          script: `Bonsoir et bienvenue au débat de ce soir consacré à la place du français en milieu de travail au Canada. Madame Tremblay, vous pensez que les entreprises devraient être obligées de fonctionner en français dans les régions francophones. Absolument. La Loi sur les langues officielles garantit aux Canadiens le droit de travailler dans la langue officielle de leur choix. Pourtant, beaucoup de travailleurs francophones se voient forcés d'utiliser l'anglais uniquement, même au Québec. C'est une injustice sociale. Monsieur Park, vous n'êtes pas du même avis ? Je respecte totalement la langue française. Cependant, imposer des règles linguistiques trop strictes risque de nuire à la compétitivité internationale des entreprises. Dans un monde globalisé, l'anglais est souvent la langue des affaires. Forcer les entreprises à fonctionner uniquement en français pourrait les pousser à quitter le Québec.`,
          question: "Quel est l'argument principal de Monsieur Park contre des règles linguistiques strictes ?",
          options: ["Il pense que le français n'est pas une langue internationale", "Il craint que des règles trop strictes nuisent à la compétitivité des entreprises", "Il estime que les travailleurs francophones préfèrent travailler en anglais"],
          answer: 1,
          explanation: "Mr. Park argues that strict French-only rules could harm companies' international competitiveness."
        },
        {
          id: 'p3q2',
          script: `Bienvenue dans Carrefour Sciences. Aujourd'hui, nous recevons la professeure Isabelle Côté, chercheuse en intelligence artificielle à l'Université de Montréal. Professeure Côté, l'intelligence artificielle va-t-elle transformer le marché du travail ? Oui, et cette transformation est déjà en cours. Les systèmes d'IA peuvent accomplir des tâches qui nécessitaient autrefois des années de formation humaine. En radiologie, des algorithmes détectent certains cancers avec plus de précision que certains médecins. Les études du Forum économique mondial estiment qu'environ 85 millions de postes seront déplacés par l'automatisation d'ici 2025, mais que 97 millions de nouveaux rôles vont également émerger. Les métiers qui exigent de l'empathie, de la créativité, ou une présence physique comme les soins infirmiers, l'enseignement, les métiers de l'art, sont beaucoup plus difficiles à automatiser.`,
          question: "Selon la professeure Côté, quels types d'emplois sont les moins menacés par l'intelligence artificielle ?",
          options: ["Les emplois de logistique et de saisie de données", "Les emplois exigeant de l'empathie, de la créativité ou une présence physique", "Les emplois dans le secteur technologique uniquement"],
          answer: 1,
          explanation: "Jobs requiring empathy, creativity, or physical presence are much harder to automate."
        },
        {
          id: 'p3q3',
          script: `Aujourd'hui dans notre émission sur le logement, nous examinons la crise du logement abordable au Canada. À Vancouver et Toronto, les prix ont atteint des niveaux qui rendent l'accession à la propriété pratiquement impossible pour les ménages à revenus moyens. Selon la Société canadienne d'hypothèques et de logement, il faudrait construire 3,5 millions de logements supplémentaires d'ici 2030. Plusieurs causes expliquent cette crise : une forte immigration qui augmente la demande, un manque de terrains disponibles, et des règlements de zonage qui limitent la construction d'immeubles à densité élevée. Certaines municipalités ont commencé à assouplir leurs règles de zonage pour permettre la construction de duplex et de triplex dans des zones autrefois réservées aux maisons unifamiliales.`,
          question: "Quelle est l'une des solutions mentionnées pour résoudre la crise du logement ?",
          options: ["Limiter l'immigration pour réduire la demande", "Assouplir les règles de zonage pour permettre plus de logements denses", "Interdire l'achat de propriétés par des investisseurs étrangers"],
          answer: 1,
          explanation: 'Some municipalities are relaxing zoning rules to allow duplexes and triplexes.'
        }
      ]
    }
  ]
}