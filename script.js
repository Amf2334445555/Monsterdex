
"use strict";

/* =========================================================
   MONSTERDEX — CONFIGURAÇÃO
========================================================= */

const API_POKEMON = "https://pokeapi.co/api/v2";
const API_DIGIMON = "https://digi-api.com/api/v1";

const STORAGE_KEY = "monsterdex-custom-v2";
const POKEMON_LIMIT = 151;
const PAGE_SIZE = 24;

const state = {
  screen: "presentationScreen",
  universe: "pokemon",
  language: "pt",
  search: "",
  visibleCount: PAGE_SIZE,
  pokemon: [],
  digimon: [],
  custom: readCustomMonsters(),
  loading: false,
  loadingPokemon: false,
  loadingDigimon: false,
  pokemonError: false,
  digimonError: false,
  digimonPage: 0,
  digimonHasMore: true
};

/* =========================================================
   IDIOMAS
========================================================= */

const translations = {
  pt: {
    navHome: "Início",
    navCatalog: "Catálogo",
    navAdd: "Criar monstro",
    heroEyebrow: "SUA ENCICLOPÉDIA FANTÁSTICA",
    heroTitle: 'Explore um mundo de <span>monstros</span>',
    heroDescription: "Descubra criaturas, habilidades, níveis, estatísticas e evoluções.",
    exploreCatalog: "Explorar catálogo",
    createMonster: "Criar monstro",
    aboutEyebrow: "SOBRE O PROJETO",
    aboutTitle: "Mais do que um catálogo",
    aboutDescription: "Um espaço para descobrir, aprender e criar.",
    missionLabel: "NOSSA MISSÃO",
    missionTitle: "Descobrir",
    missionText: "Reunir informações sobre monstros em um só lugar.",
    visionLabel: "NOSSA VISÃO",
    visionTitle: "Conectar",
    visionText: "Facilitar a descoberta de criaturas e seus universos.",
    valuesLabel: "NOSSOS VALORES",
    valuesTitle: "Criatividade",
    valuesText: "Valorizar a curiosidade, a organização e a imaginação.",
    readyLabel: "VAMOS COMEÇAR?",
    readyTitle: "Sua próxima descoberta está aqui.",
    readyText: "Explore o catálogo e encontre sua próxima criatura favorita.",
    catalogEyebrow: "BANCO DE CRIATURAS",
    catalogTitle: "Catálogo de monstros",
    catalogDescription: "Pesquise criaturas e abra seus perfis para conhecer os detalhes.",
    custom: "Personalizados",
    searchPlaceholder: "Pesquisar por nome...",
    loading: "Carregando criaturas...",
    noResults: "Nenhum monstro encontrado.",
    loadMore: "Carregar mais",
    dataNote: "As informações são fornecidas por APIs públicas. A disponibilidade varia conforme a criatura.",
    createEyebrow: "LABORATÓRIO DE CRIATURAS",
    addPageTitle: "Crie seu próprio monstro",
    addPageDescription: "Invente uma criatura e adicione-a ao seu catálogo pessoal.",
    basicInfo: "Informações básicas",
    basicInfoDescription: "Dê um nome e uma identidade à criatura.",
    nameLabel: "Nome *",
    typeLabel: "Tipos",
    typeHint: "Separe vários tipos com vírgulas.",
    levelLabel: "Nível / estágio",
    descriptionLabel: "Descrição",
    imageLabel: "URL da imagem",
    imageHint: "Use um endereço de imagem pública HTTPS.",
    statsTitle: "Estatísticas",
    statsDescription: "Defina os atributos da sua criatura.",
    attackLabel: "Ataque",
    defenseLabel: "Defesa",
    speedLabel: "Velocidade",
    heightLabel: "Altura (m)",
    weightLabel: "Peso (kg)",
    saveMonster: "Salvar monstro",
    cancelButton: "Limpar formulário",
    requiredFields: "Preencha o nome do monstro.",
    savedSuccess: "Monstro salvo no seu catálogo!",
    profileTitle: "Perfil do monstro",
    height: "Altura",
    weight: "Peso",
    types: "Tipos",
    level: "Nível",
    attribute: "Atributo",
    abilities: "Habilidades",
    stats: "Estatísticas",
    moves: "Movimentos",
    evolutions: "Cadeia de evolução",
    previousEvolutions: "Evoluções anteriores",
    nextEvolutions: "Próximas evoluções",
    close: "Fechar",
    noData: "Não informado pela API.",
    errorLoading: "Não foi possível carregar os dados.",
    retry: "Tentar novamente",
    officialStats: "Estatísticas disponíveis",
    estimatedStats: "Perfil estimado por estágio — não são dados oficiais",
    noStats: "A API não fornece estatísticas numéricas para este Digimon.",
    officialLevel: "Estágio informado pela API",
    officialTypes: "Tipos",
    officialAttributes: "Atributos",
    officialFields: "Famílias",
    id: "ID",
    unknown: "Desconhecido",
    noDescription: "Nenhuma descrição disponível.",
    noEvolutions: "A API não informou evoluções para esta criatura.",
    pokemonError: "Não foi possível carregar Pokémon.",
    digimonError: "Não foi possível carregar Digimon.",
    savedLocal: "Salvo neste navegador.",
    footerText: "Feito para explorar mundos e descobrir criaturas.",
    stageBaby: "Bebê",
    stageTraining: "Em Treinamento",
    stageRookie: "Criança",
    stageChampion: "Adulto",
    stageUltimate: "Perfeito",
    stageMega: "Definitivo",
    stageArmor: "Armadura",
    stageHybrid: "Híbrido",
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    specialAttack: "Ataque especial",
    specialDefense: "Defesa especial",
    speedStat: "Velocidade"
  },

  en: {
    navHome: "Home",
    navCatalog: "Catalog",
    navAdd: "Create monster",
    heroEyebrow: "YOUR FANTASY ENCYCLOPEDIA",
    heroTitle: 'Explore a world of <span>monsters</span>',
    heroDescription: "Discover creatures, abilities, levels, stats, and evolutions.",
    exploreCatalog: "Explore catalog",
    createMonster: "Create monster",
    aboutEyebrow: "ABOUT THE PROJECT",
    aboutTitle: "More than a catalog",
    aboutDescription: "A place to discover, learn, and create.",
    missionLabel: "OUR MISSION",
    missionTitle: "Discover",
    missionText: "Bring monster information together in one place.",
    visionLabel: "OUR VISION",
    visionTitle: "Connect",
    visionText: "Make it easier to discover creatures and their universes.",
    valuesLabel: "OUR VALUES",
    valuesTitle: "Creativity",
    valuesText: "Value curiosity, organization, and imagination.",
    readyLabel: "LET'S BEGIN",
    readyTitle: "Your next discovery is here.",
    readyText: "Explore the catalog and find your next favorite creature.",
    catalogEyebrow: "CREATURE DATABASE",
    catalogTitle: "Monster catalog",
    catalogDescription: "Search creatures and open their profiles for details.",
    custom: "Custom",
    searchPlaceholder: "Search by name...",
    loading: "Loading creatures...",
    noResults: "No monsters found.",
    loadMore: "Load more",
    dataNote: "Information comes from public APIs. Availability varies by creature.",
    createEyebrow: "CREATURE LAB",
    addPageTitle: "Create your own monster",
    addPageDescription: "Invent a creature and add it to your personal catalog.",
    basicInfo: "Basic information",
    basicInfoDescription: "Give your creature a name and identity.",
    nameLabel: "Name *",
    typeLabel: "Types",
    typeHint: "Separate multiple types with commas.",
    levelLabel: "Level / stage",
    descriptionLabel: "Description",
    imageLabel: "Image URL",
    imageHint: "Use a public HTTPS image URL.",
    statsTitle: "Statistics",
    statsDescription: "Set your creature's attributes.",
    attackLabel: "Attack",
    defenseLabel: "Defense",
    speedLabel: "Speed",
    heightLabel: "Height (m)",
    weightLabel: "Weight (kg)",
    saveMonster: "Save monster",
    cancelButton: "Clear form",
    requiredFields: "Enter the monster's name.",
    savedSuccess: "Monster saved to your catalog!",
    profileTitle: "Monster profile",
    height: "Height",
    weight: "Weight",
    types: "Types",
    level: "Level",
    attribute: "Attribute",
    abilities: "Abilities",
    stats: "Statistics",
    moves: "Moves",
    evolutions: "Evolution chain",
    previousEvolutions: "Previous evolutions",
    nextEvolutions: "Next evolutions",
    close: "Close",
    noData: "Not provided by the API.",
    errorLoading: "Could not load the data.",
    retry: "Try again",
    officialStats: "Available statistics",
    estimatedStats: "Stage-based estimated profile — not official data",
    noStats: "The API does not provide numeric stats for this Digimon.",
    officialLevel: "Stage reported by the API",
    officialTypes: "Types",
    officialAttributes: "Attributes",
    officialFields: "Families",
    id: "ID",
    unknown: "Unknown",
    noDescription: "No description available.",
    noEvolutions: "No evolutions were provided by the API.",
    pokemonError: "Could not load Pokémon.",
    digimonError: "Could not load Digimon.",
    savedLocal: "Saved in this browser.",
    footerText: "Made for exploring worlds and discovering creatures.",
    stageBaby: "Baby",
    stageTraining: "In Training",
    stageRookie: "Rookie",
    stageChampion: "Champion",
    stageUltimate: "Ultimate",
    stageMega: "Mega",
    stageArmor: "Armor",
    stageHybrid: "Hybrid",
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    specialAttack: "Special attack",
    specialDefense: "Special defense",
    speedStat: "Speed"
  },

  es: {
    navHome: "Inicio",
    navCatalog: "Catálogo",
    navAdd: "Crear monstruo",
    heroEyebrow: "TU ENCICLOPEDIA FANTÁSTICA",
    heroTitle: 'Explora un mundo de <span>monstruos</span>',
    heroDescription: "Descubre criaturas, habilidades, niveles, estadísticas y evoluciones.",
    exploreCatalog: "Explorar catálogo",
    createMonster: "Crear monstruo",
    aboutEyebrow: "SOBRE EL PROYECTO",
    aboutTitle: "Más que un catálogo",
    aboutDescription: "Un espacio para descubrir, aprender y crear.",
    missionLabel: "NUESTRA MISIÓN",
    missionTitle: "Descubrir",
    missionText: "Reunir información sobre monstruos en un solo lugar.",
    visionLabel: "NUESTRA VISIÓN",
    visionTitle: "Conectar",
    visionText: "Facilitar el descubrimiento de criaturas y sus universos.",
    valuesLabel: "NUESTROS VALORES",
    valuesTitle: "Creatividad",
    valuesText: "Valorar la curiosidad, la organización y la imaginación.",
    readyLabel: "¿EMPEZAMOS?",
    readyTitle: "Tu próximo descubrimiento está aquí.",
    readyText: "Explora el catálogo y encuentra tu próxima criatura favorita.",
    catalogEyebrow: "BASE DE CRIATURAS",
    catalogTitle: "Catálogo de monstruos",
    catalogDescription: "Busca criaturas y abre sus perfiles.",
    custom: "Personalizados",
    searchPlaceholder: "Buscar por nombre...",
    loading: "Cargando criaturas...",
    noResults: "No se encontraron monstruos.",
    loadMore: "Cargar más",
    dataNote: "La información procede de API públicas.",
    createEyebrow: "LABORATORIO DE CRIATURAS",
    addPageTitle: "Crea tu propio monstruo",
    addPageDescription: "Inventa una criatura y añádela a tu catálogo.",
    basicInfo: "Información básica",
    basicInfoDescription: "Dale un nombre e identidad a tu criatura.",
    nameLabel: "Nombre *",
    typeLabel: "Tipos",
    typeHint: "Separa los tipos con comas.",
    levelLabel: "Nivel / etapa",
    descriptionLabel: "Descripción",
    imageLabel: "URL de la imagen",
    imageHint: "Usa una URL pública HTTPS.",
    statsTitle: "Estadísticas",
    statsDescription: "Define los atributos de tu criatura.",
    attackLabel: "Ataque",
    defenseLabel: "Defensa",
    speedLabel: "Velocidad",
    heightLabel: "Altura (m)",
    weightLabel: "Peso (kg)",
    saveMonster: "Guardar monstruo",
    cancelButton: "Limpiar formulario",
    requiredFields: "Introduce el nombre del monstruo.",
    savedSuccess: "¡Monstruo guardado!",
    profileTitle: "Perfil del monstruo",
    height: "Altura",
    weight: "Peso",
    types: "Tipos",
    level: "Nivel",
    attribute: "Atributo",
    abilities: "Habilidades",
    stats: "Estadísticas",
    moves: "Movimientos",
    evolutions: "Cadena evolutiva",
    previousEvolutions: "Evoluciones anteriores",
    nextEvolutions: "Próximas evoluciones",
    close: "Cerrar",
    noData: "No proporcionado por la API.",
    errorLoading: "No se pudieron cargar los datos.",
    retry: "Reintentar",
    officialStats: "Estadísticas disponibles",
    estimatedStats: "Perfil estimado por etapa; no son datos oficiales",
    noStats: "La API no proporciona estadísticas numéricas.",
    officialLevel: "Etapa indicada por la API",
    officialTypes: "Tipos",
    officialAttributes: "Atributos",
    officialFields: "Familias",
    id: "ID",
    unknown: "Desconocido",
    noDescription: "No hay descripción disponible.",
    noEvolutions: "La API no indicó evoluciones.",
    pokemonError: "No se pudieron cargar Pokémon.",
    digimonError: "No se pudieron cargar Digimon.",
    savedLocal: "Guardado en este navegador.",
    footerText: "Hecho para explorar mundos y descubrir criaturas.",
    stageBaby: "Bebé",
    stageTraining: "En entrenamiento",
    stageRookie: "Niño",
    stageChampion: "Adulto",
    stageUltimate: "Perfecto",
    stageMega: "Definitivo",
    stageArmor: "Armadura",
    stageHybrid: "Híbrido",
    hp: "PS",
    attack: "Ataque",
    defense: "Defensa",
    specialAttack: "Ataque especial",
    specialDefense: "Defensa especial",
    speedStat: "Velocidad"
  },

  fr: {
    navHome: "Accueil",
    navCatalog: "Catalogue",
    navAdd: "Créer un monstre",
    heroEyebrow: "VOTRE ENCYCLOPÉDIE FANTASTIQUE",
    heroTitle: 'Explorez un monde de <span>monstres</span>',
    heroDescription: "Découvrez des créatures, capacités, niveaux, statistiques et évolutions.",
    exploreCatalog: "Explorer le catalogue",
    createMonster: "Créer un monstre",
    aboutEyebrow: "À PROPOS",
    aboutTitle: "Plus qu'un catalogue",
    aboutDescription: "Un espace pour découvrir, apprendre et créer.",
    missionLabel: "NOTRE MISSION",
    missionTitle: "Découvrir",
    missionText: "Rassembler les informations sur les monstres.",
    visionLabel: "NOTRE VISION",
    visionTitle: "Connecter",
    visionText: "Faciliter la découverte des créatures et de leurs univers.",
    valuesLabel: "NOS VALEURS",
    valuesTitle: "Créativité",
    valuesText: "Valoriser la curiosité, l'organisation et l'imagination.",
    readyLabel: "COMMENÇONS",
    readyTitle: "Votre prochaine découverte est ici.",
    readyText: "Explorez le catalogue.",
    catalogEyebrow: "BASE DE CRÉATURES",
    catalogTitle: "Catalogue de monstres",
    catalogDescription: "Recherchez des créatures et ouvrez leurs profils.",
    custom: "Personnalisés",
    searchPlaceholder: "Rechercher par nom...",
    loading: "Chargement des créatures...",
    noResults: "Aucun monstre trouvé.",
    loadMore: "Afficher plus",
    dataNote: "Les informations proviennent d'API publiques.",
    createEyebrow: "LABORATOIRE DE CRÉATURES",
    addPageTitle: "Créez votre monstre",
    addPageDescription: "Inventez une créature pour votre catalogue.",
    basicInfo: "Informations de base",
    basicInfoDescription: "Donnez un nom et une identité à votre créature.",
    nameLabel: "Nom *",
    typeLabel: "Types",
    typeHint: "Séparez les types par des virgules.",
    levelLabel: "Niveau / stade",
    descriptionLabel: "Description",
    imageLabel: "URL de l'image",
    imageHint: "Utilisez une URL publique HTTPS.",
    statsTitle: "Statistiques",
    statsDescription: "Définissez les attributs de la créature.",
    attackLabel: "Attaque",
    defenseLabel: "Défense",
    speedLabel: "Vitesse",
    heightLabel: "Taille (m)",
    weightLabel: "Poids (kg)",
    saveMonster: "Enregistrer",
    cancelButton: "Effacer le formulaire",
    requiredFields: "Saisissez le nom du monstre.",
    savedSuccess: "Monstre enregistré !",
    profileTitle: "Profil du monstre",
    height: "Taille",
    weight: "Poids",
    types: "Types",
    level: "Niveau",
    attribute: "Attribut",
    abilities: "Capacités",
    stats: "Statistiques",
    moves: "Attaques",
    evolutions: "Chaîne d'évolution",
    previousEvolutions: "Évolutions précédentes",
    nextEvolutions: "Évolutions suivantes",
    close: "Fermer",
    noData: "Non fourni par l'API.",
    errorLoading: "Impossible de charger les données.",
    retry: "Réessayer",
    officialStats: "Statistiques disponibles",
    estimatedStats: "Profil estimé par stade — non officiel",
    noStats: "L'API ne fournit pas de statistiques numériques.",
    officialLevel: "Stade indiqué par l'API",
    officialTypes: "Types",
    officialAttributes: "Attributs",
    officialFields: "Familles",
    id: "ID",
    unknown: "Inconnu",
    noDescription: "Aucune description disponible.",
    noEvolutions: "Aucune évolution fournie par l'API.",
    pokemonError: "Impossible de charger les Pokémon.",
    digimonError: "Impossible de charger les Digimon.",
    savedLocal: "Enregistré dans ce navigateur.",
    footerText: "Fait pour explorer des mondes et découvrir des créatures.",
    stageBaby: "Bébé",
    stageTraining: "En entraînement",
    stageRookie: "Enfant",
    stageChampion: "Adulte",
    stageUltimate: "Parfait",
    stageMega: "Ultime",
    stageArmor: "Armure",
    stageHybrid: "Hybride",
    hp: "PV",
    attack: "Attaque",
    defense: "Défense",
    specialAttack: "Attaque spéciale",
    specialDefense: "Défense spéciale",
    speedStat: "Vitesse"
  },

  ja: {
    navHome: "ホーム",
    navCatalog: "図鑑",
    navAdd: "モンスター作成",
    heroEyebrow: "ファンタジー図鑑",
    heroTitle: '<span>モンスター</span>の世界を探検しよう',
    heroDescription: "モンスターの能力、レベル、ステータス、進化を発見しよう。",
    exploreCatalog: "図鑑を見る",
    createMonster: "モンスター作成",
    aboutEyebrow: "プロジェクトについて",
    aboutTitle: "ただの図鑑ではない",
    aboutDescription: "発見し、学び、創造する場所。",
    missionLabel: "ミッション",
    missionTitle: "発見",
    missionText: "モンスターの情報をひとつの場所に集めます。",
    visionLabel: "ビジョン",
    visionTitle: "つながり",
    visionText: "さまざまなモンスターの世界を発見できます。",
    valuesLabel: "価値観",
    valuesTitle: "創造性",
    valuesText: "好奇心、整理、想像力を大切にします。",
    readyLabel: "始めよう",
    readyTitle: "次の発見が待っています。",
    readyText: "図鑑を探索しましょう。",
    catalogEyebrow: "クリーチャーデータベース",
    catalogTitle: "モンスター図鑑",
    catalogDescription: "モンスターを検索してプロフィールを確認できます。",
    custom: "オリジナル",
    searchPlaceholder: "名前で検索...",
    loading: "読み込み中...",
    noResults: "モンスターが見つかりません。",
    loadMore: "もっと見る",
    dataNote: "公開APIのデータを使用しています。",
    createEyebrow: "クリーチャーラボ",
    addPageTitle: "モンスターを作成",
    addPageDescription: "オリジナルのモンスターを図鑑に追加しましょう。",
    basicInfo: "基本情報",
    basicInfoDescription: "名前と特徴を決めましょう。",
    nameLabel: "名前 *",
    typeLabel: "タイプ",
    typeHint: "複数のタイプはカンマで区切ります。",
    levelLabel: "レベル / 段階",
    descriptionLabel: "説明",
    imageLabel: "画像URL",
    imageHint: "公開HTTPS画像URLを使用してください。",
    statsTitle: "ステータス",
    statsDescription: "モンスターの能力を設定します。",
    attackLabel: "攻撃",
    defenseLabel: "防御",
    speedLabel: "素早さ",
    heightLabel: "高さ (m)",
    weightLabel: "重さ (kg)",
    saveMonster: "保存",
    cancelButton: "フォームをクリア",
    requiredFields: "名前を入力してください。",
    savedSuccess: "モンスターを保存しました！",
    profileTitle: "モンスタープロフィール",
    height: "高さ",
    weight: "重さ",
    types: "タイプ",
    level: "レベル",
    attribute: "属性",
    abilities: "能力",
    stats: "ステータス",
    moves: "技",
    evolutions: "進化チェーン",
    previousEvolutions: "前の進化",
    nextEvolutions: "次の進化",
    close: "閉じる",
    noData: "APIに情報がありません。",
    errorLoading: "データを読み込めませんでした。",
    retry: "再試行",
    officialStats: "利用可能なステータス",
    estimatedStats: "段階に基づく推定値 — 公式データではありません",
    noStats: "このデジモンの数値ステータスはAPIにありません。",
    officialLevel: "APIが示す段階",
    officialTypes: "タイプ",
    officialAttributes: "属性",
    officialFields: "ファミリー",
    id: "ID",
    unknown: "不明",
    noDescription: "説明がありません。",
    noEvolutions: "進化情報がありません。",
    pokemonError: "ポケモンを読み込めませんでした。",
    digimonError: "デジモンを読み込めませんでした。",
    savedLocal: "このブラウザーに保存しました。",
    footerText: "世界を探検し、モンスターを発見しよう。",
    stageBaby: "幼年期",
    stageTraining: "幼年期",
    stageRookie: "成長期",
    stageChampion: "成熟期",
    stageUltimate: "完全体",
    stageMega: "究極体",
    stageArmor: "アーマー体",
    stageHybrid: "ハイブリッド体",
    hp: "HP",
    attack: "攻撃",
    defense: "防御",
    specialAttack: "特殊攻撃",
    specialDefense: "特殊防御",
    speedStat: "素早さ"
  }
};

function t(key) {
  return translations[state.language]?.[key]
    ?? translations.pt[key]
    ?? key;
}

/* =========================================================
   UTILITÁRIOS E SEGURANÇA
========================================================= */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeImageURL(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    return "";
  }

  return "";
}

function capitalize(value) {
  return String(value || "")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLabel(value) {
  return capitalize(String(value || "").replaceAll("-", " "));
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json();
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function showStatus(message, isError = false) {
  const status = document.querySelector("#catalogStatus");
  if (!status) return;

  status.textContent = message;
  status.classList.toggle("error", isError);
}

/* =========================================================
   ARMAZENAMENTO DE MONSTROS PERSONALIZADOS
========================================================= */

function readCustomMonsters() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Não foi possível ler os monstros salvos.", error);
    return [];
  }
}

function persistCustomMonsters() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.custom));
    return true;
  } catch (error) {
    console.warn("Não foi possível salvar no navegador.", error);
    return false;
  }
}

/* =========================================================
   NAVEGAÇÃO E IDIOMAS
========================================================= */

function showScreen(screenId) {
  const target = document.getElementById(screenId);
  if (!target) return;

  document.querySelectorAll(".app-screen").forEach(screen => {
    const active = screen.id === screenId;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });

  document.querySelectorAll(".main-nav [data-screen]").forEach(button => {
    const active = button.dataset.screen === screenId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  state.screen = screenId;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (screenId === "catalogScreen") {
    if (state.universe === "pokemon" && !state.pokemon.length) {
      loadPokemon();
    } else if (state.universe === "digimon" && !state.digimon.length) {
      loadDigimon();
    }
  }
}

function applyLanguage() {
  document.documentElement.lang = ({
    pt: "pt-BR",
    en: "en",
    es: "es",
    fr: "fr",
    ja: "ja"
  })[state.language] || "pt-BR";

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach(element => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  const search = document.querySelector("#searchInput");
  if (search) search.placeholder = t("searchPlaceholder");

  const languageSelect = document.querySelector("#languageSelect");
  if (languageSelect) languageSelect.value = state.language;

  renderCatalog();
}

/* =========================================================
   CATÁLOGO E PESQUISA
========================================================= */

function setUniverse(universe) {
  if (!["pokemon", "digimon", "custom"].includes(universe)) return;

  state.universe = universe;
  state.visibleCount = PAGE_SIZE;

  document.querySelectorAll("[data-universe]").forEach(button => {
    const active = button.dataset.universe === universe;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  showStatus("");
  renderCatalog();

  if (universe === "pokemon" && !state.pokemon.length) {
    loadPokemon();
  } else if (universe === "digimon" && !state.digimon.length) {
    loadDigimon();
  }
}

function getCurrentMonsters() {
  if (state.universe === "pokemon") return state.pokemon;
  if (state.universe === "digimon") return state.digimon;
  return state.custom;
}

function renderCatalog() {
  const grid = document.querySelector("#monsterGrid");
  if (!grid) return;

  const monsters = getCurrentMonsters();
  const query = normalizeKey(state.search);

  const filtered = monsters.filter(monster => {
    const searchable = normalizeKey([
      monster.name,
      monster.displayName,
      ...(monster.types || []),
      monster.level,
      monster.description
    ].join(" "));

    return searchable.includes(query);
  });

  const visible = filtered.slice(0, state.visibleCount);

  if (visible.length === 0) {
    const isLoading =
      (state.universe === "pokemon" && state.loadingPokemon) ||
      (state.universe === "digimon" && state.loadingDigimon);

    let message = t("noResults");
    if (isLoading) message = t("loading");

    if (state.universe === "pokemon" && state.pokemonError) {
      message = t("pokemonError");
    }

    if (state.universe === "digimon" && state.digimonError) {
      message = t("digimonError");
    }

    grid.innerHTML = `<p class="empty-message">${escapeHTML(message)}</p>`;
  } else {
    grid.innerHTML = visible.map(createMonsterCard).join("");
  }

  const loadMoreButton = document.querySelector("#loadMoreButton");
  if (loadMoreButton) {
    loadMoreButton.hidden = visible.length >= filtered.length;
    loadMoreButton.textContent = t("loadMore");
  }

  if (filtered.length > 0) {
    showStatus(`${filtered.length} ${state.language === "en" ? "results" : "resultados"}`);
  } else {
    showStatus("");
  }
}

function createMonsterCard(monster) {
  const image = safeImageURL(monster.image);
  const label = monster.displayName || monster.name || t("unknown");

  const types = (monster.types || []).slice(0, 3).map(type =>
    `<span class="type-tag">${escapeHTML(formatLabel(type))}</span>`
  ).join("");

  const level = monster.level
    ? `<span class="type-tag level-tag">${escapeHTML(localizeStage(monster.level))}</span>`
    : "";

  return `
    <article
      class="monster-card"
      role="button"
      tabindex="0"
      data-monster-id="${escapeHTML(monster.id)}"
      data-monster-name="${escapeHTML(monster.name)}"
      aria-label="${escapeHTML(label)}"
    >
      <div class="monster-image">
        ${
          image
            ? `<img src="${escapeHTML(image)}"
                alt="${escapeHTML(label)}"
                loading="lazy">`
            : `<div class="image-placeholder">?</div>`
        }
      </div>
      <div class="monster-info">
        <p class="monster-id">#${escapeHTML(monster.id)}</p>
        <h3>${escapeHTML(label)}</h3>
        <div class="monster-types">${types}${level}</div>
      </div>
    </article>
  `;
}

/* =========================================================
   CARREGAMENTO DE POKÉMON
========================================================= */

async function loadPokemon() {
  if (state.loadingPokemon) return;

  state.loadingPokemon = true;
  state.pokemonError = false;
  renderCatalog();

  try {
    const list = await fetchJSON(
      `${API_POKEMON}/pokemon?limit=${POKEMON_LIMIT}&offset=0`
    );

    const results = await Promise.all(
      list.results.map(async (item, index) => {
        try {
          const data = await fetchJSON(item.url);
          return normalizePokemon(data, index + 1);
        } catch (error) {
          console.warn("Erro em um Pokémon:", item.name, error);
          return {
            id: index + 1,
            name: item.name,
            displayName: capitalize(item.name.replaceAll("-", " ")),
            image: "",
            types: [],
            stats: [],
            abilities: [],
            moves: [],
            height: null,
            weight: null,
            universe: "pokemon",
            apiUrl: item.url,
            speciesUrl: null
          };
        }
      })
    );

    state.pokemon = results;
  } catch (error) {
    console.error("Erro ao carregar Pokémon:", error);
    state.pokemonError = true;
  } finally {
    state.loadingPokemon = false;
    renderCatalog();
  }
}

function normalizePokemon(data, fallbackId) {
  const artwork =
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.other?.home?.front_default ||
    data.sprites?.front_default ||
    "";

  return {
    id: data.id ?? fallbackId,
    name: data.name,
    displayName: capitalize(data.name.replaceAll("-", " ")),
    image: artwork,
    types: (data.types || []).map(item => item.type.name),
    stats: (data.stats || []).map(item => ({
      name: item.stat.name,
      value: item.base_stat
    })),
    abilities: (data.abilities || []).map(item => ({
      name: item.ability.name,
      hidden: item.is_hidden
    })),
    moves: (data.moves || [])
      .slice(0, 20)
      .map(item => item.move.name),
    height: data.height == null ? null : data.height / 10,
    weight: data.weight == null ? null : data.weight / 10,
    level: "",
    description: "",
    universe: "pokemon",
    apiUrl: `${API_POKEMON}/pokemon/${data.id}`,
    speciesUrl: data.species?.url || null
  };
}

/* =========================================================
   CARREGAMENTO DE DIGIMON
========================================================= */

async function loadDigimon() {
  if (state.loadingDigimon || !state.digimonHasMore) return;

  state.loadingDigimon = true;
  state.digimonError = false;
  renderCatalog();

  try {
    const page = state.digimonPage;
    const data = await fetchJSON(
      `${API_DIGIMON}/digimon?pageSize=100&page=${page}`
    );

    const entries = Array.isArray(data.content) ? data.content : [];

    const mapped = entries.map(item => {
      const image =
        item.image ||
        item.images?.[0]?.href ||
        "";

      const rawLevels = Array.isArray(item.levels) ? item.levels : [];
      const level = rawLevels.map(entry =>
        typeof entry === "string" ? entry : entry.level
      ).filter(Boolean)[0] || item.level || "";

      return {
        id: item.id,
        name: item.name,
        displayName: item.name,
        image,
        types: [],
        level,
        levels: rawLevels,
        attributes: [],
        fields: [],
        stats: [],
        abilities: [],
        moves: [],
        evolutions: [],
        previousEvolutions: [],
        nextEvolutions: [],
        height: null,
        weight: null,
        description: "",
        universe: "digimon",
        apiUrl: item.href || `${API_DIGIMON}/digimon/${item.id}`
      };
    });

    const existing = new Set(state.digimon.map(item => String(item.id)));

    mapped.forEach(item => {
      if (!existing.has(String(item.id))) {
        state.digimon.push(item);
        existing.add(String(item.id));
      }
    });

    state.digimonPage += 1;

    const totalPages = Number(data.pageable?.totalPages);
    if (Number.isFinite(totalPages)) {
      state.digimonHasMore = state.digimonPage < totalPages;
    } else {
      state.digimonHasMore = entries.length > 0;
    }

    if (entries.length === 0) state.digimonHasMore = false;
  } catch (error) {
    console.error("Erro ao carregar Digimon:", error);
    state.digimonError = true;
  } finally {
    state.loadingDigimon = false;
    renderCatalog();
  }
}

function normalizeDigimonDetails(data, original) {
  const content = data.content || data;

  const levels = Array.isArray(content.levels) ? content.levels : [];
  const types = Array.isArray(content.types) ? content.types : [];
  const attributes = Array.isArray(content.attributes) ? content.attributes : [];
  const fields = Array.isArray(content.fields) ? content.fields : [];
  const images = Array.isArray(content.images) ? content.images : [];

  const skills = Array.isArray(content.skills) ? content.skills : [];
  const descriptions = Array.isArray(content.descriptions)
    ? content.descriptions
    : [];

  const description =
    descriptions.find(item =>
      /en/i.test(item.language?.language || item.language || "")
    )?.description ||
    descriptions.find(item =>
      /pt/i.test(item.language?.language || item.language || "")
    )?.description ||
    descriptions[0]?.description ||
    "";

  const previous = Array.isArray(content.priorEvolutions)
    ? content.priorEvolutions.map(item => ({
        id: item.id,
        name: item.digimon || item.name || "Digimon",
        image: item.image || "",
        level: item.level || ""
      }))
    : [];

  const next = Array.isArray(content.nextEvolutions)
    ? content.nextEvolutions.map(item => ({
        id: item.id,
        name: item.digimon || item.name || "Digimon",
        image: item.image || "",
        level: item.level || ""
      }))
    : [];

  const apiStats = extractDigimonStats(content);

  return {
    ...original,
    id: content.id ?? original.id,
    name: content.name ?? original.name,
    displayName: content.name ?? original.displayName,
    image: images[0]?.href || content.image || original.image,
    level: levels.map(item =>
      typeof item === "string" ? item : item.level
    ).filter(Boolean)[0] || original.level || "",
    levels: levels,
    types: types.map(item =>
      typeof item === "string" ? item : item.type
    ).filter(Boolean),
    attributes: attributes.map(item =>
      typeof item === "string" ? item : item.attribute
    ).filter(Boolean),
    fields: fields.map(item =>
      typeof item === "string" ? item : item.field
    ).filter(Boolean),
    description,
    abilities: skills.map(item => ({
      name: item.skill || item.name || String(item),
      description: item.description || ""
    })),
    moves: skills.map(item => item.skill || item.name || String(item)),
    stats: apiStats,
    previousEvolutions: previous,
    nextEvolutions: next,
    evolutions: [...previous, ...next],
    universe: "digimon",
    apiUrl: original.apiUrl
  };
}

/*
  Só são aceitos números realmente presentes no objeto retornado.
  Se a API não fornecer estatísticas de combate, a lista fica vazia.
*/
function extractDigimonStats(data) {
  const possibleContainers = [
    data.stats,
    data.baseStats,
    data.statistics,
    data.attributes?.stats
  ];

  for (const container of possibleContainers) {
    if (Array.isArray(container)) {
      const stats = container.map(item => ({
        name: item.name || item.stat || item.label || "",
        value: Number(item.value ?? item.base_stat ?? item.amount)
      })).filter(item => item.name && Number.isFinite(item.value));

      if (stats.length) return stats;
    }

    if (container && typeof container === "object") {
      const stats = Object.entries(container)
        .filter(([, value]) => typeof value === "number" && Number.isFinite(value))
        .map(([name, value]) => ({ name, value }));

      if (stats.length) return stats;
    }
  }

  return [];
}

/* =========================================================
   PERFIS E EVOLUÇÕES
========================================================= */

async function openMonsterProfile(monster) {
  const dialog = document.querySelector("#profileDialog");
  if (!dialog) return;

  dialog.innerHTML = `
    <div class="profile-content">
      <button class="profile-close" type="button" data-close-profile
        aria-label="${escapeHTML(t("close"))}">×</button>
      <p>${escapeHTML(t("loading"))}</p>
    </div>
  `;

  openDialog(dialog);

  try {
    let details = { ...monster };

    if (monster.universe === "pokemon") {
      const data = await fetchJSON(monster.apiUrl);
      details = normalizePokemon(data, monster.id);

      const speciesUrl = data.species?.url || monster.speciesUrl;
      if (speciesUrl) {
        details.description = await loadPokemonDescription(speciesUrl);
        details.evolutions = await loadPokemonEvolutions(speciesUrl);
      }
    }

    if (monster.universe === "digimon") {
      const data = await fetchJSON(monster.apiUrl);
      details = normalizeDigimonDetails(data, monster);
    }

    renderProfile(details);
  } catch (error) {
    console.error("Erro ao abrir perfil:", error);
    renderProfile({
      ...monster,
      profileError: true
    });
  }
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

async function loadPokemonDescription(speciesUrl) {
  try {
    const data = await fetchJSON(speciesUrl);
    const entries = data.flavor_text_entries || [];

    const preferredLanguage = {
      pt: "pt-BR",
      en: "en",
      es: "es",
      fr: "fr",
      ja: "ja"
    }[state.language];

    const entry =
      entries.find(item => item.language.name === preferredLanguage) ||
      entries.find(item => item.language.name === "en") ||
      entries[0];

    return entry
      ? entry.flavor_text.replace(/[\n\f]/g, " ")
      : "";
  } catch {
    return "";
  }
}

async function loadPokemonEvolutions(speciesUrl) {
  try {
    const species = await fetchJSON(speciesUrl);
    if (!species.evolution_chain?.url) return [];

    const chainData = await fetchJSON(species.evolution_chain.url);
    const nodes = [];

    function walk(node, depth = 0) {
      if (!node) return;

      nodes.push({
        name: node.species.name,
        displayName: capitalize(node.species.name.replaceAll("-", " ")),
        depth,
        image: "",
        level: ""
      });

      (node.evolves_to || []).forEach(next => walk(next, depth + 1));
    }

    walk(chainData.chain);

    /*
      Busca as imagens usando os nomes originais da cadeia.
      Isso preserva os nomes e imagens das evoluções reais.
    */
    const completed = await Promise.all(nodes.map(async node => {
      try {
        const pokemon = await fetchJSON(
          `${API_POKEMON}/pokemon/${encodeURIComponent(node.name)}`
        );

        return {
          ...node,
          id: pokemon.id,
          image:
            pokemon.sprites?.other?.["official-artwork"]?.front_default ||
            pokemon.sprites?.front_default ||
            ""
        };
      } catch {
        return node;
      }
    }));

    return completed;
  } catch (error) {
    console.warn("Erro ao buscar cadeia de evolução:", error);
    return [];
  }
}

function renderProfile(monster) {
  const dialog = document.querySelector("#profileDialog");
  if (!dialog) return;

  const image = safeImageURL(monster.image);
  const name = monster.displayName || monster.name || t("unknown");

  const typesHTML = (monster.types || []).length
    ? monster.types.map(type =>
        `<span class="type-tag">${escapeHTML(formatLabel(type))}</span>`
      ).join("")
    : `<span class="type-tag">${escapeHTML(t("noData"))}</span>`;

  const measurements = `
    <div class="profile-measurements">
      <div>
        <span>${escapeHTML(t("height"))}</span>
        <strong>${monster.height == null
          ? escapeHTML(t("noData"))
          : `${escapeHTML(monster.height)} m`}</strong>
      </div>
      <div>
        <span>${escapeHTML(t("weight"))}</span>
        <strong>${monster.weight == null
          ? escapeHTML(t("noData"))
          : `${escapeHTML(monster.weight)} kg`}</strong>
      </div>
    </div>
  `;

  const stats = Array.isArray(monster.stats) ? monster.stats : [];
  const statsHTML = stats.length
    ? stats.map(stat => {
        const value = Number(stat.value);
        const percentage = Math.max(0, Math.min(100, value / 2));

        return `
          <div class="stat-row">
            <span>${escapeHTML(localizeStat(stat.name))}</span>
            <strong>${escapeHTML(value)}</strong>
            <div class="stat-bar">
              <span style="width:${percentage}%"></span>
            </div>
          </div>
        `;
      }).join("")
    : `<p>${escapeHTML(
        monster.universe === "digimon" ? t("noStats") : t("noData")
      )}</p>`;

  const statsTitle = monster.universe === "digimon"
    ? t("officialStats")
    : t("stats");

  const stageHTML = monster.level
    ? `
      <section class="profile-section">
        <h3>${escapeHTML(t("officialLevel"))}</h3>
        <div class="monster-types">
          <span class="type-tag level-tag">${escapeHTML(localizeStage(monster.level))}</span>
        </div>
      </section>
    `
    : "";

  const attributesHTML = `
    ${renderChipSection(t("types"), monster.types)}
    ${renderChipSection(t("officialAttributes"), monster.attributes)}
    ${renderChipSection(t("officialFields"), monster.fields)}
  `;

  const abilities = Array.isArray(monster.abilities) ? monster.abilities : [];

  const abilitiesHTML = abilities.length
    ? `<ul>${abilities.map(ability => {
        const abilityName = typeof ability === "string"
          ? ability
          : ability.name || "";

        const description = typeof ability === "object"
          ? ability.description
          : "";

        return `
          <li>
            <strong>${escapeHTML(formatLabel(abilityName))}</strong>
            ${description
              ? `<p>${escapeHTML(description)}</p>`
              : ""}
          </li>
        `;
      }).join("")}</ul>`
    : `<p>${escapeHTML(t("noData"))}</p>`;

  const moves = Array.isArray(monster.moves) ? monster.moves : [];

  const movesHTML = moves.length
    ? `<div class="profile-chip-list">${moves.slice(0, 30).map(move => {
        const moveName = typeof move === "string"
          ? move
          : move.name || "";

        return `<span class="type-tag">${escapeHTML(formatLabel(moveName))}</span>`;
      }).join("")}</div>`
    : `<p>${escapeHTML(t("noData"))}</p>`;

  const evolutionHTML = monster.universe === "pokemon"
    ? renderPokemonEvolutionChain(monster.evolutions || [], monster.name)
    : renderDigimonEvolutions(
        monster.previousEvolutions || [],
        monster.nextEvolutions || []
      );

  const profileNote = monster.universe === "digimon" && !stats.length
    ? `<p class="profile-note">${escapeHTML(t("noStats"))}</p>`
    : "";

  dialog.innerHTML = `
    <div class="profile-content">
      <button class="profile-close" type="button" data-close-profile
        aria-label="${escapeHTML(t("close"))}">×</button>

      <div class="profile-header">
        <div class="profile-image">
          ${image
            ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(name)}">`
            : `<div class="image-placeholder">?</div>`}
        </div>

        <div>
          <p class="monster-id">#${escapeHTML(monster.id ?? "?")}</p>
          <h2>${escapeHTML(name)}</h2>
          <div class="monster-types">${typesHTML}</div>
          <p>${escapeHTML(monster.description || t("noDescription"))}</p>
        </div>
      </div>

      ${measurements}
      ${stageHTML}
      ${attributesHTML}

      <section class="profile-section">
        <h3>${escapeHTML(statsTitle)}</h3>
        <div class="stats-list">${statsHTML}</div>
        ${profileNote}
      </section>

      <section class="profile-section">
        <h3>${escapeHTML(t("abilities"))}</h3>
        ${abilitiesHTML}
      </section>

      <section class="profile-section">
        <h3>${escapeHTML(t("moves"))}</h3>
        ${movesHTML}
      </section>

      <section class="profile-section">
        <h3>${escapeHTML(t("evolutions"))}</h3>
        ${evolutionHTML}
      </section>
    </div>
  `;

  dialog.querySelector("[data-close-profile]")?.addEventListener("click", () => {
    closeDialog(dialog);
  });

  dialog.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });
}

function renderChipSection(title, values) {
  if (!Array.isArray(values) || !values.length) return "";

  return `
    <section class="profile-section">
      <h3>${escapeHTML(title)}</h3>
      <div class="profile-chip-list">
        ${values.map(value =>
          `<span class="type-tag">${escapeHTML(formatLabel(value))}</span>`
        ).join("")}
      </div>
    </section>
  `;
}

function renderPokemonEvolutionChain(evolutions, currentName) {
  if (!evolutions.length) {
    return `<p>${escapeHTML(t("noEvolutions"))}</p>`;
  }

  const cards = evolutions.map((evolution, index) => {
    const isCurrent = evolution.name === currentName;
    const image = safeImageURL(evolution.image);

    return `
      ${index ? `<span class="evolution-arrow" aria-hidden="true">→</span>` : ""}
      <article class="evolution-card ${isCurrent ? "current-evolution" : ""}">
        ${image
          ? `<img src="${escapeHTML(image)}"
              alt="${escapeHTML(evolution.displayName || evolution.name)}"
              loading="lazy">`
          : `<div class="image-placeholder">?</div>`}
        <strong>${escapeHTML(evolution.displayName || evolution.name)}</strong>
        ${isCurrent
          ? `<span class="evolution-stage">${escapeHTML(t("profileTitle"))}</span>`
          : ""}
      </article>
    `;
  }).join("");

  return `<div class="evolution-chain">${cards}</div>`;
}

function renderDigimonEvolutions(previous, next) {
  const previousHTML = previous.length
    ? `
      <section class="profile-section">
        <h3>${escapeHTML(t("previousEvolutions"))}</h3>
        <div class="evolution-chain">
          ${previous.map(item => createDigimonEvolutionCard(item)).join("")}
        </div>
      </section>
    `
    : "";

  const nextHTML = next.length
    ? `
      <section class="profile-section">
        <h3>${escapeHTML(t("nextEvolutions"))}</h3>
        <div class="evolution-chain">
          ${next.map(item => createDigimonEvolutionCard(item)).join("")}
        </div>
      </section>
    `
    : "";

  if (!previousHTML && !nextHTML) {
    return `<p>${escapeHTML(t("noEvolutions"))}</p>`;
  }

  return previousHTML + nextHTML;
}

function createDigimonEvolutionCard(item) {
  const image = safeImageURL(item.image);
  const name = item.name || "Digimon";

  return `
    <article class="evolution-card">
      ${image
        ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(name)}" loading="lazy">`
        : `<div class="image-placeholder">?</div>`}
      <strong>${escapeHTML(name)}</strong>
      ${item.level
        ? `<span class="evolution-stage">${escapeHTML(localizeStage(item.level))}</span>`
        : ""}
    </article>
  `;
}

/* =========================================================
   NÍVEIS E ESTATÍSTICAS DOS DIGIMON
========================================================= */

function normalizeStage(stage) {
  return normalizeKey(stage).replace(/[_-]/g, " ").trim();
}

function localizeStage(stage) {
  const normalized = normalizeStage(stage);

  const map = {
    "baby": "stageBaby",
    "in training": "stageTraining",
    "training": "stageTraining",
    "rookie": "stageRookie",
    "champion": "stageChampion",
    "ultimate": "stageUltimate",
    "mega": "stageMega",
    "armor": "stageArmor",
    "hybrid": "stageHybrid",

    "fresh": "stageBaby",
    "in training ii": "stageTraining",
    "child": "stageRookie",
    "adult": "stageChampion",
    "perfect": "stageUltimate",
    "ultimate level": "stageMega",

    "bebê": "stageBaby",
    "bebe": "stageBaby",
    "em treinamento": "stageTraining",
    "criança": "stageRookie",
    "crianca": "stageRookie",
    "adulto": "stageChampion",
    "perfeito": "stageUltimate",
    "definitivo": "stageMega",
    "armadura": "stageArmor",
    "híbrido": "stageHybrid",
    "hibrido": "stageHybrid",

    "幼年期": "stageBaby",
    "成長期": "stageRookie",
    "成熟期": "stageChampion",
    "完全体": "stageUltimate",
    "究極体": "stageMega"
  };

  const key = map[normalized];
  return key ? t(key) : (stage || t("unknown"));
}

function localizeStat(statName) {
  const normalized = normalizeKey(statName).replace(/[_-]/g, " ");

  const map = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special attack": "specialAttack",
    "special defense": "specialDefense",
    speed: "speedStat",
    atk: "attack",
    def: "defense",
    spattack: "specialAttack",
    spdefense: "specialDefense",
    spd: "speedStat"
  };

  return map[normalized] ? t(map[normalized]) : formatLabel(statName);
}

/*
  Alguns Digimon não têm números de combate na API.
  Este perfil estimado é apenas uma visualização opcional, derivada
  do estágio. Não é apresentado como estatística oficial.
*/
function getEstimatedDigimonProfile(stage) {
  const normalized = normalizeStage(stage);

  let base = 30;

  if (["baby", "fresh", "bebê", "bebe", "幼年期"].includes(normalized)) {
    base = 15;
  } else if (["in training", "training", "em treinamento"].includes(normalized)) {
    base = 25;
  } else if (["rookie", "child", "criança", "crianca", "成長期"].includes(normalized)) {
    base = 40;
  } else if (["champion", "adult", "adulto", "成熟期"].includes(normalized)) {
    base = 60;
  } else if (["ultimate", "perfect", "perfeito", "完全体"].includes(normalized)) {
    base = 78;
  } else if (["mega", "definitivo", "究極体"].includes(normalized)) {
    base = 95;
  }

  return [
    { name: "HP", value: base + 10 },
    { name: "Attack", value: base },
    { name: "Defense", value: Math.max(10, base - 5) },
    { name: "Speed", value: base + 5 }
  ];
}

/* =========================================================
   CRIAÇÃO DE MONSTROS PERSONALIZADOS
========================================================= */

function addCustomMonster(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = String(formData.get("monsterName") || "").trim();

  if (!name) {
    setFormStatus(t("requiredFields"), true);
    return;
  }

  const imageInput = String(formData.get("monsterImage") || "").trim();
  const image = safeImageURL(imageInput);

  const monster = {
    id: `custom-${Date.now()}`,
    name: name.toLocaleLowerCase(),
    displayName: name,
    image,
    types: String(formData.get("monsterType") || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean),
    level: String(formData.get("monsterLevel") || ""),
    description: String(formData.get("monsterDescription") || "").trim(),
    height: numberOrNull(formData.get("monsterHeight")),
    weight: numberOrNull(formData.get("monsterWeight")),
    stats: [
      { name: "hp", value: numberOrNull(formData.get("monsterHP")) },
      { name: "attack", value: numberOrNull(formData.get("monsterAttack")) },
      { name: "defense", value: numberOrNull(formData.get("monsterDefense")) },
      { name: "speed", value: numberOrNull(formData.get("monsterSpeed")) }
    ].filter(stat => stat.value !== null),
    abilities: [],
    moves: [],
    evolutions: [],
    previousEvolutions: [],
    nextEvolutions: [],
    universe: "custom"
  };

  state.custom.unshift(monster);
  persistCustomMonsters();

  state.search = "";
  state.visibleCount = PAGE_SIZE;

  const search = document.querySelector("#searchInput");
  if (search) search.value = "";

  form.reset();
  setFormStatus(t("savedSuccess"), false);

  setUniverse("custom");
  renderCatalog();
  showScreen("catalogScreen");
}

function setFormStatus(message, isError = false) {
  const status = document.querySelector("#formStatus");
  if (!status) return;

  status.textContent = message;
  status.classList.toggle("error", isError);
  status.classList.toggle("success", Boolean(message) && !isError);
}

/* =========================================================
   EVENTOS
========================================================= */

function initialize() {
  document.querySelectorAll("[data-screen]").forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  document.querySelectorAll("[data-screen-link]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showScreen(link.dataset.screenLink);
    });
  });

  document.querySelectorAll("[data-universe]").forEach(button => {
    button.addEventListener("click", () => {
      setUniverse(button.dataset.universe);
    });
  });

  const grid = document.querySelector("#monsterGrid");

  if (grid) {
    grid.addEventListener("click", event => {
      const card = event.target.closest("[data-monster-id]");
      if (!card) return;

      const monster = getCurrentMonsters().find(item =>
        String(item.id) === card.dataset.monsterId
      );

      if (monster) openMonsterProfile(monster);
    });

    grid.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const card = event.target.closest("[data-monster-id]");
      if (!card) return;

      event.preventDefault();

      const monster = getCurrentMonsters().find(item =>
        String(item.id) === card.dataset.monsterId
      );

      if (monster) openMonsterProfile(monster);
    });
  }

  const searchInput = document.querySelector("#searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", event => {
      state.search = event.target.value;
      state.visibleCount = PAGE_SIZE;
      renderCatalog();
    });
  }

  const loadMoreButton = document.querySelector("#loadMoreButton");

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async () => {
      state.visibleCount += PAGE_SIZE;

      if (
        state.universe === "digimon" &&
        state.visibleCount > state.digimon.length &&
        state.digimonHasMore &&
        !state.loadingDigimon
      ) {
        await loadDigimon();
      }

      renderCatalog();
    });
  }

  const languageSelect = document.querySelector("#languageSelect");

  if (languageSelect) {
    languageSelect.addEventListener("change", event => {
      const selected = event.target.value;

      if (translations[selected]) {
        state.language = selected;
        applyLanguage();
      }
    });
  }

  const form = document.querySelector("#addMonsterForm");

  if (form) {
    form.addEventListener("submit", addCustomMonster);
  }

  const clearButton = document.querySelector("#clearFormButton");

  if (clearButton && form) {
    clearButton.addEventListener("click", () => {
      form.reset();
      setFormStatus("", false);
    });
  }

  const dialog = document.querySelector("#profileDialog");

  if (dialog) {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    });

    dialog.addEventListener("click", event => {
      const closeButton = event.target.closest("[data-close-profile]");
      if (closeButton) closeDialog(dialog);
    });

    dialog.addEventListener("cancel", () => {
      // O navegador fecha o diálogo com Escape.
    });
  }

  /*
    Atalho "/" para focar a pesquisa sem interferir
    quando a pessoa já está digitando em um campo.
  */
  document.addEventListener("keydown", event => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;

    if (event.key === "/" && !typing) {
      const search = document.querySelector("#searchInput");
      if (search) {
        event.preventDefault();
        showScreen("catalogScreen");
        search.focus();
      }
    }
  });

  applyLanguage();
  showScreen("presentationScreen");
  setUniverse("pokemon");
}

document.addEventListener("DOMContentLoaded", initialize);
