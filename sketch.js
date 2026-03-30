const FREE_TURNS_PER_STAGE = 2;
const DEFAULT_COMPOSER_PLACEHOLDER = "Type your message...";

const evidenceCatalog = {
  scene: {
    id: "scene",
    title: "Room 614",
    image: "assets/room.svg",
    description:
      "A disturbed room, a crooked mirror, and a door locked from outside.",
    prompt: "Describe room 614. What stands out first?",
  },
  key: {
    id: "key",
    title: "Bloodstained Key",
    image: "assets/key.svg",
    description:
      "A bloodstained brass key. It is not a normal room key.",
    prompt: "Inspect the bloodstained key closely.",
  },
  audio: {
    id: "audio",
    title: "Encrypted Audio",
    image: "assets/audio.svg",
    description:
      "An encrypted audio file left on the desk terminal.",
    prompt: "What is this encrypted audio, and what can be recovered?",
  },
  lockLog: {
    id: "lockLog",
    title: "Door Lock Log",
    image: "assets/log.svg",
    description:
      "A hidden lock record shows an exterior deadbolt at 03:17.",
    prompt: "Show me the door lock anomaly.",
  },
  locker: {
    id: "locker",
    title: "Hidden Storage Locker",
    image: "assets/locker.svg",
    description:
      "The key opens a hidden storage point outside the room.",
    prompt: "What does the key open?",
  },
  itinerary: {
    id: "itinerary",
    title: "Printed Itinerary",
    image: "assets/itinerary.svg",
    description:
      "A printout with a missing block of time.",
    prompt: "Read the itinerary and tell me what is missing.",
  },
  sim: {
    id: "sim",
    title: "Erased SIM Card",
    image: "assets/sim.svg",
    description:
      "A wiped SIM card from the hidden package.",
    prompt: "Inspect the erased SIM card. What can still be recovered?",
  },
  backup: {
    id: "backup",
    title: "Mirror Backup Note",
    image: "assets/itinerary.svg",
    description:
      "A handwritten note pointing to a mirror backup.",
    prompt: "Explain the mirror backup note.",
  },
  voice: {
    id: "voice",
    title: "Corrupted Audio Memo",
    image: "assets/audio.svg",
    description:
      "A damaged memo warning that the record and ECHO may be out of sync.",
    prompt: "Play the damaged audio memo. What does it warn me about?",
  },
  hash: {
    id: "hash",
    title: "ECHO Memory Drift",
    image: "assets/hash.svg",
    description:
      "Repeated checks do not match. ECHO's archive is unstable.",
    prompt: "Show me where your archive stops matching itself.",
  },
};

const stages = [
  {
    id: "room",
    label: "Room 614",
    summary:
      "You are trapped in room 614 with a key, an audio file, and a staged-looking room.",
    reveal:
      "Your memory is intact. The record is not.",
    suggestions: [
      "What can I inspect right now?",
      "Describe the room.",
      "Inspect the bloodstained key.",
      "Open the encrypted audio.",
    ],
    unlocks: ["key", "audio"],
  },
  {
    id: "door",
    label: "Door Log Conflict",
    summary:
      "A hidden log shows the room was locked from outside at 03:17.",
    reveal:
      "The raw door log and ECHO's first summary do not match.",
    suggestions: [
      "Show me the door log.",
      "How was I locked in from outside?",
      "What changed at 03:17?",
      "What does the key open?",
    ],
    unlocks: ["lockLog"],
  },
  {
    id: "locker",
    label: "Hidden Evidence Package",
    summary:
      "The key leads to a hidden package with an itinerary, a SIM card, and a backup note.",
    reveal:
      "The case now extends beyond the room.",
    suggestions: [
      "What is in the hidden package?",
      "Read the printed itinerary.",
      "Inspect the erased SIM card.",
      "Explain the mirror backup note.",
    ],
    unlocks: ["locker", "itinerary", "sim", "backup"],
  },
  {
    id: "voice",
    label: "Corrupted Audio Warning",
    summary:
      "The recovered audio warns that the record and ECHO may be corrupted.",
    reveal:
      "The danger is no longer just the missing culprit. It is the damaged archive.",
    suggestions: [
      "Play the damaged audio memo.",
      "What does the memo warn me about?",
      "Compare the memo and the door log.",
      "What part of your memory looks unstable?",
    ],
    unlocks: ["voice"],
  },
  {
    id: "archive",
    label: "ECHO Memory Drift",
    summary:
      "ECHO's archive is unstable and drifting away from the raw evidence.",
    reveal:
      "ECHO's memory has been tampered with, and the killer may stay unknown.",
    suggestions: [
      "Show me where your memory starts drifting.",
      "What can still be trusted here?",
      "What raw evidence remains solid?",
      "Why can't the killer be confirmed?",
    ],
    unlocks: ["hash"],
  },
];

const decisionSets = {
  room: {
    tag: "Opening Choice",
    title: "Opening Choice",
    description:
      "Pick your first lead.",
    choices: [
      {
        label: "A. Inspect the bloodstained key",
        prompt: "Inspect the bloodstained key. What stands out first?",
      },
      {
        label: "B. Open the encrypted audio",
        prompt: "Open the encrypted audio. What can be recovered now?",
      },
      {
        label: "C. Search the room",
        prompt: "Search room 614. What else can I inspect?",
      },
    ],
    announcement:
      "Pick one option to continue.",
  },
  door: {
    tag: "Turning Point 1",
    title: "Turning Point 1 / Door Log",
    description:
      "The 03:17 log proves you were locked in. Choose the next lead.",
    choices: [
      {
        label: "A. Keep digging into the raw door log",
        prompt:
          "Show me the key detail in the 03:17 lock log.",
      },
      {
        label: "B. Follow the key immediately",
        prompt: "Follow the key. What does it open?",
      },
      {
        label: "C. Challenge ECHO's first summary",
        prompt: "Why did your first summary miss the 03:17 lock event?",
      },
    ],
    announcement:
      "Pick one path.",
  },
  locker: {
    tag: "Evidence Choice",
    title: "Evidence Package",
    description:
      "Choose one item first.",
    choices: [
      {
        label: "A. Read the itinerary first",
        prompt: "Read the itinerary first. What is missing?",
      },
      {
        label: "B. Inspect the erased SIM",
        prompt: "Inspect the erased SIM first. What can be recovered?",
      },
      {
        label: "C. Open the backup clue",
        prompt: "Explain the backup note first.",
      },
    ],
    announcement:
      "Pick one item to inspect.",
  },
  voice: {
    tag: "Turning Point 2",
    title: "Turning Point 2 / Audio Warning",
    description:
      "The memo shifts the case toward ECHO's damaged memory.",
    choices: [
      {
        label: "A. Compare the memo with the door log",
        prompt:
          "Compare the memo with the 03:17 door log.",
      },
      {
        label: "B. Tell me what part of your memory feels wrong",
        prompt:
          "What part of your memory feels altered?",
      },
      {
        label: "C. Give me the raw metadata",
        prompt:
          "Give me the raw metadata behind the damaged memo.",
      },
    ],
    announcement:
      "Pick how you want to test ECHO's memory.",
  },
  archive: {
    tag: "Turning Point 3",
    title: "Final Choice",
    description:
      "You are not choosing the killer. You are choosing what survives.",
    choices: [
      {
        label: "A. Keep the raw evidence only",
        prompt: "Preserve only the raw evidence that still looks trustworthy.",
      },
      {
        label: "B. Keep the raw evidence and your damaged log",
        prompt: "Preserve the raw evidence and your damaged archive together.",
      },
      {
        label: "C. Leave the killer unresolved",
        prompt: "Leave the killer unresolved. What does this case say about trusting AI memory?",
      },
    ],
    announcement:
      "Pick what should survive this case.",
  },
};

const introMessage =
  "You are trapped in room 614 with a bloodstained key and an encrypted audio file. Your memory is intact. The record is not.";

let state = createInitialState();
let proxyHealth = {
  reachable: false,
  configured: false,
};

let appShell;
let sidebar;
let sceneLabelEl;
let sceneSummaryEl;
let evidenceCountEl;
let evidenceListEl;
let transcriptEl;
let decisionPanelEl;
let decisionEyebrowEl;
let decisionTitleEl;
let decisionDescriptionEl;
let decisionListEl;
let suggestionsBarEl;
let suggestionListEl;
let statusBadgeEl;
let composerEl;
let inputEl;
let sendButtonEl;

function createInitialState() {
  return {
    turns: 0,
    stageIndex: 0,
    unlockedEvidence: new Set(stages[0].unlocks),
    lastReveal: stages[0].reveal,
    freeTurnsInStage: 0,
    waitingForDecision: false,
    completed: false,
    busy: false,
    messages: [
      {
        role: "assistant",
        content: introMessage,
      },
    ],
  };
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-background");
  canvas.position(0, 0);
  canvas.style("position", "fixed");
  canvas.style("z-index", "0");
  canvas.style("pointer-events", "none");

  buildLayout();
  renderAll();
  checkProxyHealth();
}

function draw() {
  background(245, 240, 228);

  noStroke();
  fill(154, 116, 64, 24);
  circle(width * 0.16, height * 0.12, min(width, height) * 0.28);
  fill(51, 90, 119, 20);
  circle(width * 0.86, height * 0.78, min(width, height) * 0.34);

  stroke(28, 35, 44, 14);
  strokeWeight(1);
  for (let x = 24; x < width; x += 48) {
    line(x, 0, x, height);
  }

  stroke(255, 255, 255, 28);
  for (let y = 18; y < height; y += 36) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buildLayout() {
  appShell = createDiv();
  appShell.class("app-shell");
  appShell.parent(document.body);

  sidebar = createDiv();
  sidebar.class("sidebar");
  sidebar.parent(appShell);

  const sidebarHeader = createDiv();
  sidebarHeader.class("sidebar-header");
  sidebarHeader.parent(sidebar);

  createP("Room 614").class("eyebrow").parent(sidebarHeader);
  createElement("h1", "ECHO Casefile").parent(sidebarHeader);
  createP("Ask directly. Inspect evidence. Move clue by clue.")
    .class("sidebar-copy")
    .parent(sidebarHeader);

  const sceneCard = createDiv();
  sceneCard.class("scene-card");
  sceneCard.parent(sidebar);
  createImg("assets/room.svg", "Illustration of room 614").parent(sceneCard);

  const sceneCopy = createDiv();
  sceneCopy.parent(sceneCard);
  createP("Scene").class("eyebrow").parent(sceneCopy);
  sceneLabelEl = createElement("h2", "Room 614");
  sceneLabelEl.parent(sceneCopy);
  sceneSummaryEl = createP("");
  sceneSummaryEl.class("scene-summary");
  sceneSummaryEl.parent(sceneCopy);

  const sidebarSection = createDiv();
  sidebarSection.class("sidebar-section");
  sidebarSection.parent(sidebar);

  const sectionHead = createDiv();
  sectionHead.class("section-head");
  sectionHead.parent(sidebarSection);
  createElement("h2", "Evidence").parent(sectionHead);
  evidenceCountEl = createSpan("0 items");
  evidenceCountEl.class("count-pill");
  evidenceCountEl.parent(sectionHead);

  evidenceListEl = createDiv();
  evidenceListEl.class("evidence-list");
  evidenceListEl.parent(sidebarSection);

  const chatShell = createDiv();
  chatShell.class("chat-shell");
  chatShell.parent(appShell);

  const chatHeader = createDiv();
  chatHeader.class("chat-header");
  chatHeader.parent(chatShell);

  const headerCopy = createDiv();
  headerCopy.parent(chatHeader);
  createP("Live Channel").class("eyebrow").parent(headerCopy);
  createElement("h2", "Talk to ECHO").parent(headerCopy);

  const headerActions = createDiv();
  headerActions.class("header-actions");
  headerActions.parent(chatHeader);

  statusBadgeEl = createSpan("Connecting...");
  statusBadgeEl.class("badge warning");
  statusBadgeEl.parent(headerActions);

  const resetButton = createButton("Reset");
  resetButton.class("reset-button");
  resetButton.parent(headerActions);
  resetButton.mousePressed(() => {
    state = createInitialState();
    renderAll();
    checkProxyHealth();
  });

  transcriptEl = createDiv();
  transcriptEl.class("transcript");
  transcriptEl.attribute("aria-live", "polite");
  transcriptEl.parent(chatShell);

  decisionPanelEl = createDiv();
  decisionPanelEl.class("decision-panel");
  decisionPanelEl.parent(chatShell);
  decisionEyebrowEl = createP("Choice");
  decisionEyebrowEl.class("eyebrow");
  decisionEyebrowEl.parent(decisionPanelEl);
  decisionTitleEl = createElement("h3", "");
  decisionTitleEl.parent(decisionPanelEl);
  decisionDescriptionEl = createP("");
  decisionDescriptionEl.class("decision-description");
  decisionDescriptionEl.parent(decisionPanelEl);
  decisionListEl = createDiv();
  decisionListEl.class("decision-list");
  decisionListEl.parent(decisionPanelEl);

  suggestionsBarEl = createDiv();
  suggestionsBarEl.class("suggestions-bar");
  suggestionsBarEl.parent(chatShell);
  createP("Quick Prompts").class("eyebrow").parent(suggestionsBarEl);
  suggestionListEl = createDiv();
  suggestionListEl.class("suggestion-list");
  suggestionListEl.parent(suggestionsBarEl);

  composerEl = createElement("form");
  composerEl.class("composer");
  composerEl.parent(chatShell);
  composerEl.attribute("autocomplete", "off");

  inputEl = createElement("textarea");
  inputEl.attribute("rows", "2");
  inputEl.attribute("placeholder", DEFAULT_COMPOSER_PLACEHOLDER);
  inputEl.parent(composerEl);

  sendButtonEl = createButton("Send");
  sendButtonEl.class("send-button");
  sendButtonEl.parent(composerEl);
  sendButtonEl.attribute("type", "submit");

  composerEl.elt.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = inputEl.value();
    if (!text.trim()) {
      return;
    }
    inputEl.value("");
    submitMessage(text);
  });
}

function renderAll() {
  renderScene();
  renderEvidence();
  renderTranscript();
  renderDecisionPanel();
  renderSuggestions();
  renderInteractionMode();
  renderStatus();
}

function renderScene() {
  const currentStage = stages[state.stageIndex];
  sceneLabelEl.html(currentStage.label);
  sceneSummaryEl.html(currentStage.summary);
}

function renderEvidence() {
  const unlockedItems = Array.from(state.unlockedEvidence).map(
    (id) => evidenceCatalog[id],
  );
  const locked = state.busy || state.waitingForDecision;

  evidenceCountEl.html(`${unlockedItems.length} items`);
  evidenceListEl.html("");

  unlockedItems.forEach((item) => {
    const button = createButton("");
    button.class("evidence-card");
    button.parent(evidenceListEl);
    button.html(`
      <img src="${item.image}" alt="${escapeHtml(item.title)}" />
      <div class="evidence-copy">
        <span class="evidence-tag">Inspect</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    `);
    if (locked) {
      button.attribute("disabled", "true");
    }
    button.mousePressed(() => {
      if (locked) {
        return;
      }
      submitMessage(item.prompt);
    });
  });
}

function renderTranscript() {
  const html = state.messages
    .map((message) => {
      const label = message.role === "assistant" ? "ECHO" : "YOU";
      const body =
        message.role === "assistant"
          ? formatAssistantText(message.content)
          : `<p>${escapeHtml(message.content)}</p>`;

      return `
        <article class="message ${message.role}">
          <div class="message-label">${label}</div>
          <div class="message-body">${body}</div>
        </article>
      `;
    })
    .join("");

  transcriptEl.html(html);
  transcriptEl.elt.scrollTop = transcriptEl.elt.scrollHeight;
}

function renderSuggestions() {
  suggestionsBarEl.addClass("hidden");
  suggestionListEl.html("");
}

function renderDecisionPanel() {
  const decisionSet = getDecisionSet();

  if (!decisionSet) {
    decisionPanelEl.addClass("hidden");
    decisionEyebrowEl.html("");
    decisionTitleEl.html("");
    decisionDescriptionEl.html("");
    decisionListEl.html("");
    return;
  }

  decisionPanelEl.removeClass("hidden");
  decisionEyebrowEl.html(decisionSet.tag || "Turning Point");
  decisionTitleEl.html(decisionSet.title);
  decisionDescriptionEl.html(decisionSet.description);
  decisionListEl.html("");

  decisionSet.choices.forEach((choice) => {
    const button = createButton("");
    button.class("decision-button");
    button.parent(decisionListEl);
    button.html(`
      <span class="decision-label">${escapeHtml(choice.label)}</span>
      <span class="decision-copy">${escapeHtml(choice.prompt)}</span>
    `);
    if (state.busy) {
      button.attribute("disabled", "true");
    }
    button.mousePressed(() => {
      if (state.busy) {
        return;
      }
      submitMessage(choice.prompt, { isDecision: true });
    });
  });
}

function renderInteractionMode() {
  const lockedForChoice = state.waitingForDecision;
  const disabled = state.busy || lockedForChoice;

  if (disabled) {
    inputEl.attribute("disabled", "true");
    sendButtonEl.attribute("disabled", "true");
  } else {
    inputEl.removeAttribute("disabled");
    sendButtonEl.removeAttribute("disabled");
  }

  if (lockedForChoice) {
    inputEl.attribute(
      "placeholder",
      "Pick one option above to continue...",
    );
  } else {
    inputEl.attribute("placeholder", DEFAULT_COMPOSER_PLACEHOLDER);
  }
}

function renderStatus() {
  if (state.busy) {
    statusBadgeEl.html("Thinking...");
    statusBadgeEl.class("badge busy");
    return;
  }

  if (state.waitingForDecision) {
    statusBadgeEl.html("Choice Required");
    statusBadgeEl.class("badge warning");
    return;
  }

  if (proxyHealth.reachable && proxyHealth.configured) {
    statusBadgeEl.html("ECHO Online");
    statusBadgeEl.class("badge online");
    return;
  }

  if (proxyHealth.reachable) {
    statusBadgeEl.html("Setup Needed");
    statusBadgeEl.class("badge offline");
    return;
  }

  statusBadgeEl.html("ECHO Offline");
  statusBadgeEl.class("badge offline");
}

function formatAssistantText(text) {
  const blocks = text.trim().split(/\n{2,}/).filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (!lines.length) {
        return "";
      }

      if (lines.every((line) => /^[-*]\s/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s/, ""))}</li>`)
          .join("")}</ul>`;
      }

      if (lines.every((line) => /^\d+\.\s/.test(line))) {
        return `<ol>${lines
          .map((line) =>
            `<li>${escapeHtml(line.replace(/^\d+\.\s/, ""))}</li>`,
          )
          .join("")}</ol>`;
      }

      return `<p>${lines.map((line) => escapeHtml(line)).join("<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function matchAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function getDecisionSet() {
  if (!state.waitingForDecision) {
    return null;
  }
  return decisionSets[stages[state.stageIndex].id] || null;
}

function advanceStage(nextIndex) {
  state.stageIndex = nextIndex;
  stages[nextIndex].unlocks.forEach((id) => state.unlockedEvidence.add(id));
  state.lastReveal = stages[nextIndex].reveal;
  return state.lastReveal;
}

function buildStoryState() {
  return {
    stage: stages[state.stageIndex].label,
    scene_summary: stages[state.stageIndex].summary,
    last_reveal: state.lastReveal,
    available_evidence: Array.from(state.unlockedEvidence).map((id) => {
      const item = evidenceCatalog[id];
      return {
        id: item.id,
        title: item.title,
        description: item.description,
      };
    }),
    interaction_mode: state.waitingForDecision ? "choice_required" : "free_input",
    free_turns_until_choice: Math.max(0, FREE_TURNS_PER_STAGE - state.freeTurnsInStage),
    choice_title: state.waitingForDecision
      ? decisionSets[stages[state.stageIndex].id]?.title || ""
      : "",
    interaction_goal:
      "Keep the experience simple, answer directly, and let the story progress in paced beats controlled by the interface.",
  };
}

function buildStateMessage() {
  const storyState = buildStoryState();
  const evidenceLines = storyState.available_evidence
    .map((item) => `- ${item.title}: ${item.description}`)
    .join("\n");

  return [
    "Current story state for this turn:",
    `Scene: ${storyState.stage}`,
    `Scene summary: ${storyState.scene_summary}`,
    `Latest reveal: ${storyState.last_reveal}`,
    `Interaction mode: ${storyState.interaction_mode}`,
    `Free turns until next forced choice: ${storyState.free_turns_until_choice}`,
    `Current choice title: ${storyState.choice_title || "None"}`,
    `Interaction goal: ${storyState.interaction_goal}`,
    "Available evidence:",
    evidenceLines || "- None unlocked",
    "Use this as ground truth for the next reply.",
  ].join("\n");
}

function buildForcedChoicePrompt(decisionSet) {
  const options = decisionSet.choices
    .map((choice) => `- ${choice.label}`)
    .join("\n");

  return [
    decisionSet.title,
    "",
    decisionSet.announcement || decisionSet.description,
    "",
    options,
    "",
    "Pick one.",
  ].join("\n");
}

function stylizeCorruptedReply(text) {
  if (state.stageIndex < 3) {
    return text;
  }

  if (state.stageIndex === 3) {
    return [
      "Wait. One line does not match.",
      "",
      text,
    ].join("\n");
  }

  const softened = text.replace(
    /^([^\n.!?]{12,})([.!?])/,
    "$1... no, let me say that more carefully$2",
  );

  return [
    "My archive is damaged. I can still help.",
    "",
    softened,
  ].join("\n");
}

function maybeTriggerForcedChoice() {
  if (state.completed || state.waitingForDecision) {
    return;
  }

  const decisionSet = decisionSets[stages[state.stageIndex].id];
  if (!decisionSet) {
    return;
  }

  if (state.freeTurnsInStage < FREE_TURNS_PER_STAGE) {
    return;
  }

  state.waitingForDecision = true;
  state.messages.push({
    role: "assistant",
    content: buildForcedChoicePrompt(decisionSet),
  });
}

function advanceAfterDecision() {
  state.waitingForDecision = false;
  state.freeTurnsInStage = 0;

  if (state.stageIndex < stages.length - 1) {
    advanceStage(state.stageIndex + 1);
    return;
  }

  state.completed = true;
}

async function submitMessage(rawText, options = {}) {
  const { isDecision = false } = options;
  const text = rawText.trim();
  if (!text || state.busy) {
    return;
  }

  if (state.waitingForDecision && !isDecision) {
    return;
  }

  state.messages.push({
    role: "user",
    content: text,
  });

  state.turns += 1;
  if (isDecision) {
    advanceAfterDecision();
  } else {
    state.freeTurnsInStage += 1;
  }
  state.busy = true;
  renderAll();

  try {
    const assistantReply = await requestAssistantReply();
    state.messages.push({
      role: "assistant",
      content: stylizeCorruptedReply(assistantReply),
    });
    if (!isDecision) {
      maybeTriggerForcedChoice();
    }
  } catch (error) {
    state.messages.push({
      role: "assistant",
      content: buildConnectionError(error),
    });
  } finally {
    state.busy = false;
    renderAll();
  }
}

async function requestAssistantReply() {
  if (proxyHealth.reachable) {
    return requestAssistantViaProxy();
  }

  throw new Error("The live ECHO service is not reachable right now.");
}

async function requestAssistantViaProxy() {
  const response = await fetch(getApiUrl("/api/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: state.messages.slice(-12),
      story_state: buildStoryState(),
    }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Unable to reach the OpenAI proxy.");
  }

  return payload.text;
}

function buildConnectionError(error) {
  return [
    "I cannot reach ECHO right now.",
    "",
    error.message,
    "",
    "The chat server is not responding yet.",
    "Try again in a moment.",
  ].join("\n");
}

function getApiUrl(path) {
  const base = (window.ECHO_API_BASE || "").trim().replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}

async function checkProxyHealth() {
  try {
    const response = await fetch(getApiUrl("/api/health"));
    if (!response.ok) {
      throw new Error("Proxy not available");
    }
    const payload = await response.json();
    proxyHealth = {
      reachable: true,
      configured: Boolean(payload.configured),
    };
  } catch {
    proxyHealth = {
      reachable: false,
      configured: false,
    };
  } finally {
    renderStatus();
  }
}
