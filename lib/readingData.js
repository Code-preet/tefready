// lib/readingData.js — TEF Canada Reading Comprehension (Compréhension de l'écrit)
// Three passages at B1–B2 level, authentic Canadian context

export const readingTest = {
  id: 'tef-reading-01',
  title: "TEF Canada — Compréhension de l'écrit",
  totalTime: 50 * 60,   // 50 minutes
  instructions: "Lisez attentivement chaque texte puis répondez aux questions en choisissant la meilleure réponse parmi les options proposées.",
  totalQuestions: 13,

  passages: [

    // ── PASSAGE 1 — Immigration & Settlement ──────────────────────────────────
    {
      id: 'p1',
      number: 1,
      title: "L'intégration des nouveaux arrivants au Canada",
      clbLevel: 'CLB 5–7',
      readingTime: 15,  // suggested minutes
      text: `Chaque année, le Canada accueille plusieurs centaines de milliers d'immigrants venus des quatre coins du monde. Ces nouveaux arrivants apportent avec eux des compétences, des cultures et des perspectives qui enrichissent considérablement la société canadienne. Cependant, le processus d'intégration représente souvent un défi de taille, tant pour les immigrants eux-mêmes que pour les institutions qui les accompagnent.

L'un des premiers obstacles auxquels font face les nouveaux arrivants est la reconnaissance de leurs diplômes et de leur expérience professionnelle acquise à l'étranger. Un médecin formé en Inde ou un ingénieur diplômé du Maroc ne peut pas automatiquement exercer sa profession au Canada. Des démarches administratives longues et coûteuses sont souvent nécessaires pour faire évaluer et reconnaître leurs qualifications. Cette situation pousse de nombreux immigrants qualifiés à accepter des emplois bien en dessous de leur niveau de compétences, phénomène que les spécialistes appellent le « déclassement professionnel ».

Face à cette réalité, plusieurs provinces canadiennes ont mis en place des programmes d'aide à l'intégration. Le Québec, par exemple, offre gratuitement des cours de français aux nouveaux arrivants ainsi que des ateliers d'intégration professionnelle. Ces services visent à faciliter non seulement l'apprentissage de la langue, mais aussi la compréhension des codes culturels et professionnels propres au marché du travail québécois.

Les experts s'accordent à dire que l'intégration réussie d'un immigrant dépend de plusieurs facteurs : la maîtrise de la langue officielle, l'accès au réseau professionnel local, et le soutien de la communauté d'accueil. Des études récentes ont montré que les immigrants qui participent activement à des associations ou à des activités communautaires s'intègrent généralement plus rapidement et trouvent un emploi correspondant à leurs qualifications dans un délai plus court.`,

      questions: [
        {
          id: 'p1q1',
          question: "Selon le texte, quel est le principal défi lié aux diplômes étrangers au Canada ?",
          options: [
            "Les diplômes étrangers ne sont jamais acceptés au Canada",
            "La procédure de reconnaissance est longue et peut être coûteuse",
            "Seuls les diplômes européens sont reconnus",
            "Les immigrants doivent reprendre leurs études depuis le début"
          ],
          answer: 1,
          explanation: "Le texte mentionne des « démarches administratives longues et coûteuses » pour la reconnaissance des qualifications."
        },
        {
          id: 'p1q2',
          question: "Que signifie le terme « déclassement professionnel » dans ce texte ?",
          options: [
            "Perdre son emploi après l'immigration",
            "Travailler dans un domaine différent de sa formation",
            "Occuper un poste inférieur à ses qualifications réelles",
            "Ne pas pouvoir trouver d'emploi au Canada"
          ],
          answer: 2,
          explanation: "Le texte définit ce phénomène comme le fait d'«accepter des emplois bien en dessous de leur niveau de compétences»."
        },
        {
          id: 'p1q3',
          question: "Selon le texte, qu'offre le Québec aux nouveaux arrivants ?",
          options: [
            "Des logements gratuits et une aide financière",
            "Des cours de français gratuits et des ateliers d'intégration",
            "Une reconnaissance automatique des diplômes étrangers",
            "Des emplois réservés aux immigrants qualifiés"
          ],
          answer: 1,
          explanation: "Le texte indique que le Québec «offre gratuitement des cours de français aux nouveaux arrivants ainsi que des ateliers d'intégration professionnelle»."
        },
        {
          id: 'p1q4',
          question: "D'après les études citées, quelle stratégie aide les immigrants à s'intégrer plus rapidement ?",
          options: [
            "Éviter les associations pour mieux s'adapter seul",
            "Participer à des activités et associations communautaires",
            "Attendre que les employeurs les contactent",
            "Se concentrer uniquement sur l'apprentissage du français"
          ],
          answer: 1,
          explanation: "Le texte indique que les immigrants qui «participent activement à des associations ou à des activités communautaires s'intègrent généralement plus rapidement»."
        },
        {
          id: 'p1q5',
          question: "Quel est le ton général de ce texte ?",
          options: [
            "Critique et pessimiste envers l'immigration",
            "Informatif et nuancé, présentant défis et solutions",
            "Enthousiaste et sans réserves sur l'immigration",
            "Neutre et purement statistique"
          ],
          answer: 1,
          explanation: "Le texte présente les défis (reconnaissance des diplômes, déclassement) mais aussi les solutions (programmes d'aide, intégration communautaire)."
        },
      ]
    },

    // ── PASSAGE 2 — Environment & Society ────────────────────────────────────
    {
      id: 'p2',
      number: 2,
      title: "La transition énergétique au Québec",
      clbLevel: 'CLB 6–8',
      readingTime: 18,
      text: `Le Québec occupe une position enviable dans le domaine de l'énergie propre. Grâce à son immense potentiel hydroélectrique, la province tire plus de 94 % de son électricité de sources renouvelables, principalement l'hydroélectricité gérée par Hydro-Québec. Cette réalité place le Québec parmi les sociétés les moins carbonées d'Amérique du Nord en matière de production d'énergie.

Néanmoins, cette situation favorable ne signifie pas que la province est à l'abri des défis liés aux changements climatiques. Le secteur des transports demeure la principale source d'émissions de gaz à effet de serre, représentant environ 43 % du total provincial. La dépendance aux véhicules personnels, particulièrement dans les régions rurales et les banlieues mal desservies par les transports collectifs, constitue un obstacle majeur à la réduction des émissions.

Pour relever ce défi, le gouvernement du Québec a adopté une série de mesures incitatives visant à encourager l'électrification des transports. Des subventions à l'achat de véhicules électriques, le développement d'un réseau de bornes de recharge, et des investissements massifs dans les transports en commun font partie de cette stratégie globale. La province ambitionne d'interdire la vente de nouveaux véhicules à essence d'ici 2035.

Cependant, certains experts et groupes environnementaux estiment que ces mesures ne sont pas suffisantes. Ils soutiennent qu'une véritable transition écologique nécessite également des changements profonds dans les habitudes de consommation, l'aménagement du territoire et le modèle économique dominant. Pour eux, l'électrification des transports, bien qu'indispensable, ne résout pas à elle seule le problème de l'étalement urbain ni celui de la surconsommation de ressources naturelles.

La question de la transition énergétique illustre ainsi la complexité des enjeux environnementaux contemporains : si les solutions technologiques existent, leur mise en œuvre se heurte souvent à des réalités économiques, sociales et politiques qui ralentissent le rythme des changements nécessaires.`,

      questions: [
        {
          id: 'p2q1',
          question: "Quelle est la principale source d'électricité au Québec ?",
          options: [
            "Le nucléaire",
            "L'énergie solaire",
            "L'hydroélectricité",
            "Le gaz naturel"
          ],
          answer: 2,
          explanation: "Le texte indique que le Québec tire son électricité «principalement de l'hydroélectricité gérée par Hydro-Québec»."
        },
        {
          id: 'p2q2',
          question: "Quel secteur représente la plus grande source d'émissions de GES au Québec ?",
          options: [
            "L'industrie manufacturière",
            "Le secteur des transports",
            "L'agriculture",
            "La production d'énergie"
          ],
          answer: 1,
          explanation: "Le texte précise que «le secteur des transports demeure la principale source d'émissions de gaz à effet de serre, représentant environ 43 % du total provincial»."
        },
        {
          id: 'p2q3',
          question: "Quelle mesure le gouvernement québécois a-t-il adoptée pour réduire les émissions des transports ?",
          options: [
            "Une taxe sur les carburants fossiles",
            "L'interdiction immédiate des voitures à essence",
            "Des subventions pour l'achat de véhicules électriques",
            "La fermeture des routes aux véhicules polluants"
          ],
          answer: 2,
          explanation: "Le texte mentionne «des subventions à l'achat de véhicules électriques» parmi les mesures adoptées."
        },
        {
          id: 'p2q4',
          question: "Que reprochent certains experts aux politiques actuelles de transition énergétique ?",
          options: [
            "Elles sont trop coûteuses pour les citoyens",
            "Elles ne s'attaquent pas aux habitudes de consommation et à l'aménagement du territoire",
            "Elles favorisent trop les régions rurales",
            "Elles dépendent trop des subventions fédérales"
          ],
          answer: 1,
          explanation: "Les experts estiment que la transition nécessite «des changements profonds dans les habitudes de consommation, l'aménagement du territoire et le modèle économique dominant»."
        },
      ]
    },

    // ── PASSAGE 3 — Work & Technology ────────────────────────────────────────
    {
      id: 'p3',
      number: 3,
      title: "L'intelligence artificielle et l'avenir du travail",
      clbLevel: 'CLB 7–9',
      readingTime: 17,
      text: `L'avènement de l'intelligence artificielle (IA) soulève des questions fondamentales sur l'avenir du marché du travail. Si certains analystes prédisent une vague massive de destructions d'emplois, d'autres y voient avant tout une opportunité de transformation profonde des conditions de travail. Cette divergence d'opinions reflète la complexité d'un phénomène dont les contours restent difficiles à anticiper avec certitude.

D'après un rapport récent de l'Organisation de coopération et de développement économiques (OCDE), environ 14 % des emplois dans les pays membres sont fortement susceptibles d'être automatisés dans les prochaines décennies. Les métiers les plus exposés sont ceux qui impliquent des tâches répétitives et prévisibles : comptabilité de routine, traitement de données, certains aspects du service clientèle. En revanche, les professions nécessitant une forte capacité d'empathie, de créativité ou de jugement critique seraient moins menacées à court terme.

Au Canada, cette transformation touche déjà plusieurs secteurs. Dans le domaine de la santé, des algorithmes analysent des milliers de radiographies en quelques secondes avec une précision parfois supérieure à celle des médecins humains. Dans le secteur financier, les conseillers robotisés — ou « robo-advisors » — gèrent désormais des portefeuilles d'investissement de façon entièrement automatisée. Ces évolutions obligent les travailleurs à se former continuellement pour rester pertinents sur le marché de l'emploi.

Face à ces transformations, les gouvernements et les entreprises ont une responsabilité accrue en matière de formation continue. Des programmes de « requalification » permettant aux travailleurs déplacés d'acquérir de nouvelles compétences sont jugés indispensables par de nombreux spécialistes. Au Canada, plusieurs initiatives fédérales et provinciales ont été lancées pour préparer la main-d'œuvre aux métiers de demain, notamment dans les domaines de la programmation, de la cybersécurité et de l'analyse de données.

Néanmoins, des questions d'équité se posent avec acuité : les travailleurs moins qualifiés, souvent déjà en situation de précarité, risquent d'être les plus touchés par l'automatisation, sans nécessairement avoir accès aux ressources nécessaires pour se reconvertir. Une transition juste vers l'économie numérique exige donc non seulement des politiques d'emploi innovantes, mais aussi un filet de sécurité sociale renforcé pour les plus vulnérables.`,

      questions: [
        {
          id: 'p3q1',
          question: "Selon l'OCDE, quel pourcentage d'emplois risque d'être automatisé ?",
          options: [
            "Environ 4 %",
            "Environ 14 %",
            "Environ 40 %",
            "Environ 50 %"
          ],
          answer: 1,
          explanation: "Le texte cite «environ 14 % des emplois dans les pays membres» de l'OCDE comme fortement susceptibles d'être automatisés."
        },
        {
          id: 'p3q2',
          question: "Quels types d'emplois sont les moins menacés par l'IA selon le texte ?",
          options: [
            "Les emplois liés au traitement de données",
            "Les emplois nécessitant empathie, créativité et jugement critique",
            "Les emplois dans le secteur financier",
            "Les emplois dans la comptabilité"
          ],
          answer: 1,
          explanation: "Le texte indique que «les professions nécessitant une forte capacité d'empathie, de créativité ou de jugement critique seraient moins menacées»."
        },
        {
          id: 'p3q3',
          question: "Comment l'IA est-elle utilisée dans le domaine de la santé au Canada ?",
          options: [
            "Pour remplacer les médecins de famille",
            "Pour analyser des radiographies avec précision",
            "Pour gérer les dossiers administratifs des hôpitaux",
            "Pour programmer les interventions chirurgicales"
          ],
          answer: 1,
          explanation: "Le texte mentionne que «des algorithmes analysent des milliers de radiographies en quelques secondes avec une précision parfois supérieure à celle des médecins humains»."
        },
        {
          id: 'p3q4',
          question: "Selon le dernier paragraphe, quel groupe est le plus vulnérable face à l'automatisation ?",
          options: [
            "Les travailleurs hautement qualifiés",
            "Les jeunes diplômés",
            "Les travailleurs moins qualifiés déjà précaires",
            "Les travailleurs du secteur technologique"
          ],
          answer: 2,
          explanation: "Le texte précise que «les travailleurs moins qualifiés, souvent déjà en situation de précarité, risquent d'être les plus touchés par l'automatisation»."
        },
      ]
    },
  ]
};
