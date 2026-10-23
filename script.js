
"use strict";

/* =========================================
   CONFIGURAÇÕES E ESTADO GLOBAL
========================================= */

const API = {
  pokemon: "https://pokeapi.co/api/v2/pokemon/",
  pokemonSpecies: "https://pokeapi.co/api/v2/pokemon-species/",
  digimon: "https://digi-api.com/api/v1/digimon"
};

const PAGE_SIZE = 12;

const state = {
  universe: "pokemon",
  monsters: {
    pokemon: [],
    digimon: []
  },
  customMonsters: [],
  offsets: {
    pokemon: 0,
    digimon: 0
  },
  hasMore: {
    pokemon: true,
    digimon: true
  },
  loading: false,
  requestId: 0,
  search: "",
  activeProfileRequest: 0,
  lastFocusedElement: null
};

/* =========================================
   ELEMENTOS DO HTML
========================================= */

const monsterGrid = document.querySelector("#monsterGrid");
const searchInput = document.querySelector("#searchInput");
const catalogStatus = document.querySelector("#catalogStatus");
const catalogCount = document.querySelector("#catalogCount");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

const monsterForm = document.querySelector("#monsterForm");
const formMessage = document.querySelector("#formMessage");

const profileOverlay = document.querySelector("#monsterProfile");
const profileLoading = document.querySelector("#profileLoading");
const profileContent = document.querySelector("#profileContent");
const closeProfileBtn = document.querySelector("#closeProfile");

/* =========================================
   FUNÇÕES UTILITÁRIAS
========================================= */

function capitalize(value = "") {
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function normalizeName(value = "") {
  return String(value).trim().toLowerCase();
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
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
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function getOfficialDescription(monster) {
  if (monster.universe === "pokemon") {
    return "Explore os tipos, as habilidades, os golpes e a linha evolutiva deste Pokémon.";
  }

  return "Descubra os atributos, as habilidades e as possíveis evoluções deste Digimon.";
}

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha na consulta: HTTP ${response.status}`);
  }

  return response.json();
}

/* =========================================
   NAVEGAÇÃO SPA
========================================= */

function showPage(pageId) {
  const target = document.getElementById(pageId);

  if (!target || !target.classList.contains("page")) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page === target);
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageId);
  });

  if (pageId === "catalogo") {
    renderCatalog();
    if (
      state.monsters[state.universe].length === 0 &&
      !state.loading
    ) {
      loadMonsters();
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", event => {
  const navLink = event.target.closest(".nav-link, .logo[href^='#']");

  if (navLink) {
    const pageId = navLink.dataset.page ||
      navLink.getAttribute("href")?.slice(1);

    if (pageId && document.getElementById(pageId)?.classList.contains("page")) {
      event.preventDefault();
      history.replaceState(null, "", `#${pageId}`);
      showPage(pageId);
      return;
    }
  }

  const universeButton = event.target.closest(".universe-button");

  if (universeButton) {
    changeUniverse(universeButton.dataset.universe);
    history.replaceState(null, "", "#catalogo");
    showPage("catalogo");
  }
});

window.addEventListener("hashchange", () => {
  const pageId = location.hash.slice(1);
  if (document.getElementById(pageId)?.classList.contains("page")) {
    showPage(pageId);
  }
});

/* =========================================
   SELEÇÃO DO UNIVERSO
========================================= */

function changeUniverse(universe) {
  if (!["pokemon", "digimon"].includes(universe)) return;

  state.universe = universe;
  state.search = "";
  searchInput.value = "";

  document.querySelectorAll(".switch-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.universe === universe
    );
  });

  renderCatalog();

  if (
    state.monsters[universe].length === 0 &&
    state.hasMore[universe] &&
    !state.loading
  ) {
    loadMonsters();
  }
}

document.querySelectorAll(".switch-button").forEach(button => {
  button.addEventListener("click", () => {
    changeUniverse(button.dataset.universe);
  });
});

/* =========================================
   BUSCAR DADOS DAS APIS
========================================= */

async function fetchPokemonPage(offset) {
  const data = await fetchJSON(
    `${API.pokemon}?limit=${PAGE_SIZE}&offset=${offset}`
  );

  const monsters = data.results.map((pokemon, index) => {
    const id = offset + index + 1;

    return {
      id,
      name: pokemon.name,
      universe: "pokemon",
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      types: [],
      description: getOfficialDescription({ universe: "pokemon" }),
      custom: false
    };
  });

  return {
    monsters,
    nextOffset: offset + data.results.length,
    hasMore: Boolean(data.next)
  };
}

function normalizeDigimon(item) {
  const id = item.id ?? item.digimonId ?? item.name;
  const image =
    item.image ||
    item.img ||
    item.images?.[0]?.href ||
    item.images?.[0]?.url ||
    "";

  return {
    id: String(id),
    name: item.name || "Digimon desconhecido",
    universe: "digimon",
    image: safeImageURL(image),
    types: [
      ...(Array.isArray(item.types) ? item.types.map(x =>
        typeof x === "string" ? x : x.type
      ) : []),
      ...(Array.isArray(item.attributes) ? item.attributes.map(x =>
        typeof x === "string" ? x : x.attribute
      ) : []),
      ...(Array.isArray(item.levels) ? item.levels.map(x =>
        typeof x === "string" ? x : x.level
      ) : [])
    ].filter(Boolean),
    description: getOfficialDescription({ universe: "digimon" }),
    custom: false
  };
}

async function fetchDigimonPage(page) {
  const data = await fetchJSON(
    `${API.digimon}?pageSize=${PAGE_SIZE}&page=${page}`
  );

  const items = Array.isArray(data.content)
    ? data.content
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  const monsters = items.map(normalizeDigimon);

  const totalPages = data.pageable?.totalPages ??
    data.totalPages ??
    data.totalPage ??
    null;

  const nextPage = page + 1;

  return {
    monsters,
    nextOffset: nextPage,
    hasMore: totalPages !== null
      ? nextPage < Number(totalPages)
      : monsters.length === PAGE_SIZE
  };
}

/* =========================================
   CARREGAMENTO COM ESTADO GLOBAL
========================================= */

async function loadMonsters() {
  const universe = state.universe;

  if (state.loading || !state.hasMore[universe]) return;

  state.loading = true;
  const requestId = ++state.requestId;

  catalogStatus.textContent = "Carregando criaturas...";
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = "CARREGANDO...";

  try {
    const result = universe === "pokemon"
      ? await fetchPokemonPage(state.offsets.pokemon)
      : await fetchDigimonPage(state.offsets.digimon);

    // Ignora a resposta se o usuário mudou de universo durante a consulta.
    if (requestId !== state.requestId || universe !== state.universe) {
      return;
    }

    const existingIds = new Set(
      state.monsters[universe].map(monster => String(monster.id))
    );

    const newMonsters = result.monsters.filter(monster =>
      !existingIds.has(String(monster.id))
    );

    state.monsters[universe].push(...newMonsters);
    state.offsets[universe] = result.nextOffset;
    state.hasMore[universe] = result.hasMore;

    renderCatalog();

    catalogStatus.textContent = state.monsters[universe].length
      ? `${capitalize(universe)} carregados com sucesso.`
      : "Nenhuma criatura foi encontrada.";
  } catch (error) {
    console.error(error);
    catalogStatus.textContent =
      "Não foi possível carregar os dados. Verifique sua conexão e tente novamente.";
  } finally {
    if (requestId === state.requestId) {
      state.loading = false;
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = "CARREGAR MAIS";
      renderCatalog();
    }
  }
}

loadMoreBtn.addEventListener("click", loadMonsters);

/* =========================================
   BUSCA E RENDERIZAÇÃO DO CATÁLOGO
========================================= */

searchInput.addEventListener("input", () => {
  state.search = normalizeName(searchInput.value);
  renderCatalog();
});

function getVisibleMonsters() {
  const official = state.monsters[state.universe];
  const custom = state.customMonsters.filter(monster =>
    monster.universe === state.universe
  );

  return [...official, ...custom].filter(monster => {
    const searchable = [
      monster.name,
      ...(monster.types || []),
      monster.description || ""
    ].join(" ").toLowerCase();

    return searchable.includes(state.search);
  });
}

function renderCatalog() {
  const monsters = getVisibleMonsters();

  catalogCount.textContent = `${monsters.length} criatura(s) exibida(s)`;

  if (monsters.length === 0) {
    monsterGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nenhuma criatura encontrada</h3>
        <p>Experimente outro nome ou carregue mais resultados.</p>
      </div>
    `;
  } else {
    monsterGrid.innerHTML = monsters.map(createMonsterCard).join("");
  }

  loadMoreBtn.hidden =
    !state.hasMore[state.universe] ||
    Boolean(state.search) ||
    state.monsters[state.universe].length === 0;

  if (state.search) {
    catalogStatus.textContent = `Resultados para "${searchInput.value}"`;
  }
}

function createMonsterCard(monster) {
  const image = safeImageURL(monster.image);
  const types = (monster.types || []).slice(0, 3);
  const idLabel = monster.custom
    ? "PERSONALIZADO"
    : `ID ${String(monster.id).padStart(3, "0")}`;

  const typeTags = types.length
    ? types.map(type =>
        `<span class="monster-tag">${escapeHTML(capitalize(type))}</span>`
      ).join("")
    : `<span class="monster-tag">${monster.universe === "pokemon" ? "Pokémon" : "Digimon"}</span>`;

  return `
    <article
      class="monster-card"
      tabindex="0"
      role="button"
      aria-label="Abrir perfil de ${escapeHTML(monster.name)}"
      data-universe="${escapeHTML(monster.universe)}"
      data-id="${escapeHTML(monster.id)}"
      data-custom="${Boolean(monster.custom)}"
    >
      <div class="monster-image-wrap">
        <span class="monster-id">${escapeHTML(idLabel)}</span>
        ${
          image
            ? `<img class="monster-image" src="${escapeHTML(image)}" alt="${escapeHTML(monster.name)}" loading="lazy">`
            : `<span class="monster-placeholder">${monster.universe === "pokemon" ? "POKÉMON" : "DIGIMON"}</span>`
        }
      </div>
      <div class="monster-info">
        <h3>${escapeHTML(capitalize(monster.name))}</h3>
        <div class="monster-tags">${typeTags}</div>
        <p class="card-description">${escapeHTML(monster.description || getOfficialDescription(monster))}</p>
        <span class="card-open-label">VER PERFIL ↗</span>
      </div>
    </article>
  `;
}

/* =========================================
   CADASTRO E VALIDAÇÃO DO FORMULÁRIO
========================================= */

function setFieldError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearFormErrors() {
  ["nameError", "imageError", "descriptionError"].forEach(id => {
    setFieldError(id, "");
  });
  formMessage.textContent = "";
  formMessage.classList.remove("error");
}

monsterForm.addEventListener("reset", () => {
  clearFormErrors();
});

monsterForm.addEventListener("submit", event => {
  event.preventDefault();
  clearFormErrors();

  const name = document.querySelector("#monsterName").value.trim();
  const universe = document.querySelector("#monsterUniverse").value;
  const type = document.querySelector("#monsterType").value.trim();
  const rawImage = document.querySelector("#monsterImage").value.trim();
  const description = document.querySelector("#monsterDescription").value.trim();

  let valid = true;

  if (name.length < 2) {
    setFieldError("nameError", "Digite um nome com pelo menos 2 caracteres.");
    valid = false;
  }

  if (description.length < 5) {
    setFieldError("descriptionError", "Escreva uma descrição com pelo menos 5 caracteres.");
    valid = false;
  }

  let image = "";

  if (rawImage) {
    image = safeImageURL(rawImage);

    if (!image) {
      setFieldError("imageError", "Informe uma URL válida que use HTTPS.");
      valid = false;
    }
  }

  if (!valid) {
    formMessage.textContent = "Revise os campos destacados.";
    formMessage.classList.add("error");
    return;
  }

  const duplicate = [
    ...state.monsters[universe],
    ...state.customMonsters.filter(item => item.universe === universe)
  ].some(monster => normalizeName(monster.name) === normalizeName(name));

  if (duplicate) {
    setFieldError("nameError", "Já existe uma criatura com esse nome neste universo.");
    formMessage.textContent = "Altere o nome antes de cadastrar.";
    formMessage.classList.add("error");
    return;
  }

  const customMonster = {
    id: `custom-${Date.now()}`,
    name,
    universe,
    image,
    types: type ? type.split(",").map(item => item.trim()).filter(Boolean) : [],
    description,
    custom: true
  };

  state.customMonsters.unshift(customMonster);

  formMessage.textContent = `${name} foi cadastrada com sucesso!`;
  formMessage.classList.remove("error");

  monsterForm.reset();
  changeUniverse(universe);

  setTimeout(() => {
    history.replaceState(null, "", "#catalogo");
    showPage("catalogo");
  }, 500);
});

/* =========================================
   JANELA DE PERFIL
========================================= */

function openProfileWindow() {
  state.lastFocusedElement = document.activeElement;
  profileOverlay.hidden = false;
  document.body.classList.add("modal-open");
  profileLoading.hidden = false;
  profileContent.hidden = true;
  profileLoading.querySelector("p").textContent =
    "CARREGANDO PERFIL DA CRIATURA...";
  closeProfileBtn.focus();
}

function closeProfile() {
  profileOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  state.activeProfileRequest++;

  if (state.lastFocusedElement?.isConnected) {
    state.lastFocusedElement.focus();
  }
}

closeProfileBtn.addEventListener("click", closeProfile);

profileOverlay.addEventListener("click", event => {
  if (event.target === profileOverlay) closeProfile();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !profileOverlay.hidden) {
    closeProfile();
  }
});

monsterGrid.addEventListener("click", event => {
  const card = event.target.closest(".monster-card");
  if (!card) return;

  const monster = findMonster(card.dataset.universe, card.dataset.id, card.dataset.custom === "true");
  if (monster) openMonsterProfile(monster);
});

monsterGrid.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;

  const card = event.target.closest(".monster-card");
  if (!card) return;

  event.preventDefault();

  const monster = findMonster(card.dataset.universe, card.dataset.id, card.dataset.custom === "true");
  if (monster) openMonsterProfile(monster);
});

function findMonster(universe, id, isCustom) {
  if (isCustom) {
    return state.customMonsters.find(monster =>
      monster.universe === universe && String(monster.id) === String(id)
    );
  }

  return state.monsters[universe]?.find(monster =>
    String(monster.id) === String(id)
  );
}

function setText(id, value) {
  document.getElementById(id).textContent = value ?? "—";
}

function clearProfileSections() {
  [
    "profileTypes",
    "profileStats",
    "profileMoves",
    "profileEvolution"
  ].forEach(id => {
    document.getElementById(id).replaceChildren();
  });

  setText("profileError", "");
  setText("movesNote", "");
  setText("profileHeight", "—");
  setText("profileWeight", "—");
  setText("profileAbilities", "—");
}

function addProfileTag(value) {
  const tag = document.createElement("span");
  tag.className = "monster-tag";
  tag.textContent = capitalize(value);
  document.querySelector("#profileTypes").appendChild(tag);
}

function addProfileStat(name, value, max = 255) {
  const row = document.createElement("div");
  row.className = "stat-row";

  const label = document.createElement("span");
  label.className = "stat-name";
  label.textContent = capitalize(name);

  const track = document.createElement("div");
  track.className = "stat-track";

  const fill = document.createElement("div");
  fill.className = "stat-fill";
  fill.style.width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  track.appendChild(fill);

  const number = document.createElement("span");
  number.className = "stat-value";
  number.textContent = value;

  row.append(label, track, number);
  document.querySelector("#profileStats").appendChild(row);
}

function addProfileMove(name, detail = "") {
  const chip = document.createElement("span");
  chip.className = "move-chip";

  const title = document.createElement("span");
  title.textContent = capitalize(name);
  chip.appendChild(title);

  if (detail) {
    const small = document.createElement("small");
    small.textContent = detail;
    chip.appendChild(small);
  }

  document.querySelector("#profileMoves").appendChild(chip);
}

function addEvolution(name, image = "") {
  const chip = document.createElement("span");
  chip.className = "evolution-chip";
  chip.textContent = capitalize(name);

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.loading = "lazy";
    img.style.width = "48px";
    img.style.height = "48px";
    img.style.objectFit = "contain";
    img.style.display = "block";
    chip.prepend(img);
  }

  document.querySelector("#profileEvolution").appendChild(chip);
}

async function openMonsterProfile(monster) {
  openProfileWindow();
  clearProfileSections();

  const requestId = ++state.activeProfileRequest;

  try {
    if (monster.custom) {
      showCustomProfile(monster);
    } else if (monster.universe === "pokemon") {
      await loadPokemonProfile(monster);
    } else {
      await loadDigimonProfile(monster);
    }
  } catch (error) {
    console.error(error);

    if (requestId !== state.activeProfileRequest) return;

    setText(
      "profileError",
      "Não foi possível obter todas as informações. Alguns dados podem estar indisponíveis na API."
    );

    // Mostra pelo menos os dados básicos do catálogo.
    fillProfileBasics(monster);
  } finally {
    if (requestId === state.activeProfileRequest) {
      profileLoading.hidden = true;
      profileContent.hidden = false;
    }
  }
}

function fillProfileBasics(monster) {
  setText("profileId", monster.custom ? "CADASTRO PERSONALIZADO" : `ID ${monster.id}`);
  setText("profileName", capitalize(monster.name));
  setText("profileDescription", monster.description || getOfficialDescription(monster));

  const image = safeImageURL(monster.image);
  const imageElement = document.querySelector("#profileImage");

  imageElement.src = image;
  imageElement.alt = capitalize(monster.name);
  imageElement.hidden = !image;

  (monster.types || []).forEach(addProfileTag);
}

function showCustomProfile(monster) {
  fillProfileBasics(monster);
  setText("profileHeight", "Não informado");
  setText("profileWeight", "Não informado");
  setText("profileAbilities", "Não informado");
  setText("movesNote", "Criaturas personalizadas não possuem dados oficiais de golpes ou estatísticas.");
  setText("profileError", "Perfil personalizado: altura, peso, estatísticas, golpes e evoluções não foram cadastrados.");
}

/* =========================================
   PERFIL POKÉMON
========================================= */

async function loadPokemonProfile(monster) {
  const pokemon = await fetchJSON(`${API.pokemon}${encodeURIComponent(monster.id)}`);

  fillProfileBasics({
    ...monster,
    image: pokemon.sprites?.other?.["official-artwork"]?.front_default ||
      pokemon.sprites?.front_default ||
      monster.image,
    types: pokemon.types.map(item => item.type.name)
  });

  setText("profileId", `POKÉMON Nº ${String(pokemon.id).padStart(3, "0")}`);
  setText("profileHeight", `${(pokemon.height / 10).toFixed(1)} m`);
  setText("profileWeight", `${(pokemon.weight / 10).toFixed(1)} kg`);
  setText(
    "profileAbilities",
    pokemon.abilities.map(item => capitalize(item.ability.name)).join(", ") || "Não informado"
  );

  pokemon.stats.forEach(item => {
    addProfileStat(item.stat.name, item.base_stat);
  });

  const moves = pokemon.moves || [];
  setText(
    "movesNote",
    `A API lista ${moves.length} golpes possíveis. A lista abaixo mostra até 40; o método de aprendizado varia por jogo.`
  );

  moves.slice(0, 40).forEach(item => {
    const details = item.version_group_details?.[0];
    const method = details?.move_learn_method?.name;
    const level = details?.level_learned_at;

    let detail = method ? capitalize(method) : "";

    if (method === "level-up" && level !== undefined) {
      detail += ` · Nível ${level}`;
    }

    addProfileMove(item.move.name, detail);
  });

  try {
    const species = await fetchJSON(pokemon.species.url);
    const evolutionData = await fetchJSON(species.evolution_chain.url);
    const chainNames = [];

    function walkEvolution(node) {
      if (!node) return;
      chainNames.push(node.species.name);
      (node.evolves_to || []).forEach(walkEvolution);
    }

    walkEvolution(evolutionData.chain);

    if (chainNames.length) {
    
      for (const name of chainNames) {
        const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name === pokemon.name ? pokemon.id : ""}.png`;
        addEvolution(name, name === pokemon.name ? imageURL : "");
      }
    } else {
      addEvolution("Nenhuma evolução listada");
    }
  } catch (error) {
    console.warn("Não foi possível carregar a linha evolutiva.", error);
    addEvolution("Dados evolutivos indisponíveis");
  }
}

/* =========================================
   PERFIL DIGIMON
========================================= */

function readNames(value, keys = ["name", "level", "type", "attribute"]) {
  if (!Array.isArray(value)) return [];

  return value.map(item => {
    if (typeof item === "string") return item;

    for (const key of keys) {
      if (item?.[key]) return item[key];
    }

    return "";
  }).filter(Boolean);
}

function readEvolutionNames(value) {
  if (!Array.isArray(value)) return [];

  return value.map(item => {
    if (typeof item === "string") return item;

    return item.digimon || item.name || item.to ||
      item.target || item.digimonName || "";
  }).filter(Boolean);
}

async function loadDigimonProfile(monster) {
  const data = await fetchJSON(
    `${API.digimon}/${encodeURIComponent(monster.id)}`
  );

  const image =
    data.images?.[0]?.href ||
    data.images?.[0]?.url ||
    data.image ||
    monster.image;

  const types = [
    ...readNames(data.types),
    ...readNames(data.attributes),
    ...readNames(data.levels)
  ];

  fillProfileBasics({
    ...monster,
    image,
    types: [...new Set(types)]
  });

  setText("profileId", `DIGIMON ID ${data.id ?? monster.id}`);
  setText("profileHeight", data.xAntibody ? "X-Antibody" : "Não informado");
  setText("profileWeight", "Não informado");

  const levels = readNames(data.levels);
  const attributes = readNames(data.attributes);
  const fields = readNames(data.fields);
  const extraInfo = [
    levels.length ? `Nível: ${levels.join(", ")}` : "",
    attributes.length ? `Atributo: ${attributes.join(", ")}` : "",
    fields.length ? `Campos: ${fields.join(", ")}` : ""
  ].filter(Boolean);

  setText("profileAbilities", extraInfo.join(" | ") || "Não informado");

  const descriptions = data.descriptions || [];
  const englishDescription = descriptions.find(item =>
    item.language?.toLowerCase().includes("en")
  );
  const portugueseDescription = descriptions.find(item =>
    item.language?.toLowerCase().includes("pt")
  );

  const description = portugueseDescription?.description ||
    englishDescription?.description ||
    data.description ||
    monster.description;

  setText("profileDescription", description);

  const skills = data.skills || [];
  setText(
    "movesNote",
    skills.length
      ? `${skills.length} habilidade(s) encontrada(s) no registro da API.`
      : "A API não forneceu uma lista de habilidades para este registro."
  );

  skills.forEach(skill => {
    const name = typeof skill === "string"
      ? skill
      : skill.skill || skill.name || skill.description || "Habilidade";

    const detail = typeof skill === "object"
      ? skill.description || skill.translation || ""
      : "";

    addProfileMove(name, detail);
  });

  const prior = readEvolutionNames(data.priorEvolutions);
  const next = readEvolutionNames(data.nextEvolutions);

  if (prior.length || next.length) {
    if (prior.length) {
      addEvolution(`Evoluções anteriores: ${prior.join(", ")}`);
    }

    if (next.length) {
      addEvolution(`Próximas evoluções: ${next.join(", ")}`);
    }
  } else {
    addEvolution("A API não listou evoluções para este registro.");
  }

  // Aviso exibido no perfil Digimon
setText(
  "profileError",
  "A linha evolutiva mostra os nomes das espécies; condições especiais podem variar por jogo."
);

  // A Digi-API não fornece estatísticas numéricas padronizadas
  // para todos os Digimon. Não inventamos valores.
  const statsContainer = document.querySelector("#profileStats");
  const statsMessage = document.createElement("p");
  statsMessage.className = "profile-note";
  statsMessage.textContent =
    "Estatísticas numéricas padronizadas não estão disponíveis para todos os registros da API.";
  statsContainer.appendChild(statsMessage);
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

function initializeApp() {
  const pageId = location.hash.slice(1);
  const validPage = ["inicio", "catalogo", "cadastro"].includes(pageId)
    ? pageId
    : "inicio";

  showPage(validPage);

  if (validPage === "catalogo") {
    loadMonsters();
  }
}

initializeApp();
