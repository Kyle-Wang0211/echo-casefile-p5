const KEY_STORAGE = "echo_demo_openai_key";
const MODEL_STORAGE = "echo_demo_openai_model";
const DEFAULT_MODEL = "gpt-5-mini";
const FREE_TURNS_PER_STAGE = 2;
const DEFAULT_COMPOSER_PLACEHOLDER =
  "Ask what you can inspect, examine an item, or push for the next clue...";

const evidenceCatalog = {
  scene: {
    id: "scene",
    title: "Room 614",
    image: "assets/room.svg",
    description:
      "The hotel room itself: disturbed bed, crooked mirror, desk terminal, and a door you did not lock from inside.",
    prompt: "Describe room 614 in detail. What stands out immediately?",
  },
  key: {
    id: "key",
    title: "Bloodstained Key",
    image: "assets/key.svg",
    description:
      "A bloodstained brass key. It looks like utility hardware, not a guest-room key.",
    prompt: "Inspect the bloodstained key closely.",
  },
  audio: {
    id: "audio",
    title: "Encrypted Audio",
    image: "assets/audio.svg",
    description:
      "An encrypted audio file left on the desk terminal. The timestamp suggests it matters.",
    prompt: "Tell me what the encrypted audio is and what can be recovered from it.",
  },
  lockLog: {
    id: "lockLog",
    title: "Door Lock Log",
    image: "assets/log.svg",
    description:
      "A hidden lock record showing an exterior deadbolt action at 03:17 that the hotel export tries to hide.",
    prompt: "Show me the door lock anomaly and explain what it means.",
  },
  locker: {
    id: "locker",
    title: "Hidden Storage Locker",
    image: "assets/locker.svg",
    description:
      "The key maps to a hidden storage point outside the room, turning the mystery into a wider evidence chain.",
    prompt: "What does the key open, and what is waiting there?",
  },
  itinerary: {
    id: "itinerary",
    title: "Printed Itinerary",
    image: "assets/itinerary.svg",
    description:
      "A folded printout with a missing block of time and a warning against clean records.",
    prompt: "Read the printed itinerary and tell me what is missing.",
  },
  sim: {
    id: "sim",
    title: "Erased SIM Card",
    image: "assets/sim.svg",
    description:
      "A wiped SIM card recovered from the hidden evidence package. It may connect the user to the case directly.",
    prompt: "Inspect the erased SIM card and tell me what can still be recovered.",
  },
  backup: {
    id: "backup",
    title: "Mirror Backup Note",
    image: "assets/itinerary.svg",
    description:
      "A handwritten cloud backup link that appears to point to a mirror copy instead of an original account.",
    prompt: "Explain the mirror backup note and why it matters.",
  },
  voice: {
    id: "voice",
    title: "Corrupted Audio Memo",
    image: "assets/audio.svg",
    description:
      "A damaged audio memo that warns the hotel record and ECHO's memory may already be out of sync.",
    prompt: "Play the damaged audio memo and tell me what it warns me about.",
  },
  hash: {
    id: "hash",
    title: "ECHO Memory Drift",
    image: "assets/hash.svg",
    description:
      "Repeated checks do not match. ECHO's own archive appears partially overwritten or stitched together.",
    prompt: "Show me where your archive stops matching itself.",
  },
};

const stages = [
  {
    id: "room",
    label: "Hotel Room Wake-Up",
    summary:
      "You are trapped in room 614 with three immediate leads: the room itself, a bloodstained key, and an encrypted audio file.",
    reveal:
      "The investigation starts inside room 614. You are not missing your memory, but the room and the record around it do not line up.",
    suggestions: [
      "What can I inspect right now?",
      "Describe the room in detail.",
      "Inspect the bloodstained key.",
      "Open the encrypted audio.",
    ],
    unlocks: ["scene", "key", "audio"],
  },
  {
    id: "door",
    label: "Door Record Conflict",
    summary:
      "A hidden lock record shows the room was deadbolted from outside at 03:17, even though the version ECHO first pulled omits it.",
    reveal:
      "The first contradiction is clear: the raw door log shows you were locked in from outside at 03:17, but ECHO's earlier summary missed it.",
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
      "The bloodstained key leads to a hidden storage package containing a printed itinerary, an erased SIM card, and a mirror backup note.",
    reveal:
      "The key now points beyond the room: it opens a hidden package with an itinerary, a SIM card, and a backup clue.",
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
      "The recovered audio does not accuse you. It warns that the official record and ECHO's memory may already be corrupted.",
    reveal:
      "The audio shifts the case: the danger is no longer only the missing culprit, but the possibility that ECHO itself is reading a damaged archive.",
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
      "ECHO's archive is no longer stable. Its summaries begin to hesitate, correct themselves, and drift away from the raw evidence.",
    reveal:
      "The last turn of the case is not a confession. It is the realization that ECHO's own memory has been tampered with and the killer may stay unknown.",
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
      "Start simple. The player should immediately see three clear ways to begin the investigation.",
    choices: [
      {
        label: "A. Inspect the bloodstained key",
        prompt: "Inspect the bloodstained key closely. What stands out first?",
      },
      {
        label: "B. Open the encrypted audio",
        prompt: "Open the encrypted audio and tell me what can be recovered right now.",
      },
      {
        label: "C. Search the room",
        prompt: "Search room 614 carefully. What can I inspect besides the key and the audio file?",
      },
    ],
    announcement:
      "You have enough of the room to choose your first lead. To keep the story moving, pick one option now.",
  },
  door: {
    tag: "Turning Point 1",
    title: "Turning Point 1 / Door Record Conflict",
    description:
      "You now know the room was locked from outside at 03:17, and ECHO missed that fact at first. Pick the next direction clearly.",
    choices: [
      {
        label: "A. Keep digging into the raw door log",
        prompt:
          "I want to focus on the lock log. Show me the strongest detail in the 03:17 anomaly.",
      },
      {
        label: "B. Follow the key immediately",
        prompt:
          "Let's stop on the door and follow the key. What does the key open?",
      },
      {
        label: "C. Challenge ECHO's first summary",
        prompt:
          "Explain why your first summary missed the 03:17 lock event when the raw record shows it.",
      },
    ],
    announcement:
      "The first contradiction is clear enough that the case needs a direction. Choose one path before we continue.",
  },
  locker: {
    tag: "Evidence Choice",
    title: "Evidence Package / Hidden Locker Contents",
    description:
      "The hidden package is open. The player should choose which clue to inspect first instead of getting flooded with text.",
    choices: [
      {
        label: "A. Read the itinerary first",
        prompt:
          "Read the printed itinerary first and tell me what the missing time block implies.",
      },
      {
        label: "B. Inspect the erased SIM",
        prompt:
          "Inspect the erased SIM card first. What can still be recovered?",
      },
      {
        label: "C. Open the backup clue",
        prompt:
          "Explain the mirror backup note first and tell me why it matters.",
      },
    ],
    announcement:
      "The hidden package is open. Pick which piece of evidence you want ECHO to prioritize next.",
  },
  voice: {
    tag: "Turning Point 2",
    title: "Turning Point 2 / The Audio Warns You About ECHO",
    description:
      "The recovered memo shifts the mystery away from your guilt and toward ECHO's damaged memory. Make that reversal explicit.",
    choices: [
      {
        label: "A. Compare the memo with the door log",
        prompt:
          "Compare the damaged audio memo with the 03:17 door log and tell me what matches.",
      },
      {
        label: "B. Tell me what part of your memory feels wrong",
        prompt:
          "Stop summarizing the case and tell me what part of your own memory feels altered.",
      },
      {
        label: "C. Give me the raw metadata",
        prompt:
          "Give me the raw metadata behind the damaged memo without smoothing it into a clean explanation.",
      },
    ],
    announcement:
      "The case has changed shape. Before the plot moves again, choose how you want to test ECHO's memory against the evidence.",
  },
  archive: {
    tag: "Turning Point 3",
    title: "Final Choice / What Do You Keep?",
    description:
      "You are not choosing the killer. You are choosing what survives when the record is damaged and ECHO can no longer guarantee its own memory.",
    choices: [
      {
        label: "A. Keep the raw evidence only",
        prompt:
          "Help me preserve only the raw evidence that still looks trustworthy.",
      },
      {
        label: "B. Keep the raw evidence and your damaged log",
        prompt:
          "Preserve the raw evidence and your damaged archive together, even if they conflict.",
      },
      {
        label: "C. Leave the killer unresolved",
        prompt:
          "Leave the killer unresolved and tell me what this case says about trusting AI memory.",
      },
    ],
    announcement:
      "ECHO's memory is drifting now. Choose what should survive this case before the record collapses further.",
  },
};

const introMessage =
  "You are trapped in room 614 with a bloodstained key, an encrypted audio file, and a room that feels staged. You are not missing your memory. What feels wrong is the record around you, and I may not be reading it cleanly. Ask directly. If you want to know what you can inspect, I will tell you plainly.";

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
let modelBadgeEl;
let composerEl;
let inputEl;
let sendButtonEl;
let apiKeyInputEl;
let modelInputEl;

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
  createP("Ask directly, inspect evidence, and let the story move clue by clue.")
    .class("sidebar-copy")
    .parent(sidebarHeader);

  const sceneCard = createDiv();
  sceneCard.class("scene-card");
  sceneCard.parent(sidebar);
  createImg("assets/room.svg", "Illustration of room 614").parent(sceneCard);

  const sceneCopy = createDiv();
  sceneCopy.parent(sceneCard);
  createP("Current Scene").class("eyebrow").parent(sceneCopy);
  sceneLabelEl = createElement("h2", "Hotel Room Wake-Up");
  sceneLabelEl.parent(sceneCopy);
  sceneSummaryEl = createP("");
  sceneSummaryEl.class("scene-summary");
  sceneSummaryEl.parent(sceneCopy);

  const settingsCard = createDiv();
  settingsCard.class("settings-card");
  settingsCard.parent(sidebar);
  createP("p5.js Demo API").class("eyebrow").parent(settingsCard);
  createP("Paste a temporary OpenAI API key for classroom demo use.")
    .class("mini-note")
    .parent(settingsCard);

  const keyRow = createDiv();
  keyRow.class("key-row");
  keyRow.parent(settingsCard);
  apiKeyInputEl = createInput(loadStoredKey(), "password");
  apiKeyInputEl.class("key-input");
  apiKeyInputEl.attribute("placeholder", "Paste OpenAI API key");
  apiKeyInputEl.parent(keyRow);

  const useKeyButton = createButton("Use Key");
  useKeyButton.class("key-button");
  useKeyButton.parent(keyRow);
  useKeyButton.mousePressed(() => {
    storeKey(apiKeyInputEl.value());
    renderStatus();
  });

  const modelRow = createDiv();
  modelRow.class("key-row");
  modelRow.parent(settingsCard);
  modelInputEl = createInput(loadStoredModel() || DEFAULT_MODEL);
  modelInputEl.class("key-input");
  modelInputEl.attribute("placeholder", DEFAULT_MODEL);
  modelInputEl.parent(modelRow);

  const saveModelButton = createButton("Save Model");
  saveModelButton.class("key-button");
  saveModelButton.parent(modelRow);
  saveModelButton.mousePressed(() => {
    storeModel(modelInputEl.value());
    renderStatus();
  });

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

  statusBadgeEl = createSpan("Paste API Key");
  statusBadgeEl.class("badge warning");
  statusBadgeEl.parent(headerActions);

  modelBadgeEl = createSpan(loadStoredModel() || DEFAULT_MODEL);
  modelBadgeEl.class("badge subtle");
  modelBadgeEl.parent(headerActions);

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
  decisionEyebrowEl = createP("Turning Point");
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
  createP("Free Input Ideas").class("eyebrow").parent(suggestionsBarEl);
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
  if (state.waitingForDecision) {
    suggestionsBarEl.addClass("hidden");
    suggestionListEl.html("");
    return;
  }

  suggestionsBarEl.removeClass("hidden");
  suggestionListEl.html("");

  stages[state.stageIndex].suggestions.forEach((suggestion) => {
    const button = createButton(suggestion);
    button.class("suggestion-chip");
    button.parent(suggestionListEl);
    if (state.busy) {
      button.attribute("disabled", "true");
    }
    button.mousePressed(() => {
      if (state.busy) {
        return;
      }
      submitMessage(suggestion);
    });
  });
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
      "Choose one of the options above to continue the story...",
    );
  } else {
    inputEl.attribute("placeholder", DEFAULT_COMPOSER_PLACEHOLDER);
  }
}

function renderStatus() {
  modelBadgeEl.html(loadStoredModel() || DEFAULT_MODEL);

  if (state.busy) {
    statusBadgeEl.html("Asking ECHO...");
    statusBadgeEl.class("badge busy");
    return;
  }

  if (state.waitingForDecision) {
    statusBadgeEl.html("Choice Required");
    statusBadgeEl.class("badge warning");
    return;
  }

  if (loadStoredKey()) {
    statusBadgeEl.html("Browser Key Ready");
    statusBadgeEl.class("badge online");
    return;
  }

  if (proxyHealth.reachable && proxyHealth.configured) {
    statusBadgeEl.html("Proxy Ready");
    statusBadgeEl.class("badge online");
    return;
  }

  if (proxyHealth.reachable) {
    statusBadgeEl.html("Paste API Key");
    statusBadgeEl.class("badge warning");
    return;
  }

  statusBadgeEl.html("Paste API Key");
  statusBadgeEl.class("badge warning");
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
    "Select one option to continue.",
  ].join("\n");
}

function stylizeCorruptedReply(text) {
  if (state.stageIndex < 3) {
    return text;
  }

  if (state.stageIndex === 3) {
    return [
      "I am re-checking this against the raw file... correcting myself. Some of my memory summaries may be out of sync.",
      "",
      text,
    ].join("\n");
  }

  const softened = text.replace(
    /^([^\n.!?]{12,})([.!?])/,
    "$1... no, let me say that more carefully$2",
  );

  return [
    "I... I am reading a damaged archive layer. I can still help, but parts of my memory are stuttering.",
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
  const browserKey = loadStoredKey();
  if (browserKey) {
    return requestAssistantDirect(browserKey);
  }

  if (proxyHealth.reachable) {
    return requestAssistantViaProxy();
  }

  throw new Error(
    "Paste an OpenAI API key in the sidebar first. This p5.js demo uses a browser key for class presentation.",
  );
}

async function requestAssistantDirect(apiKey) {
  const model = loadStoredModel() || DEFAULT_MODEL;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: await loadPromptText(),
      input: [
        {
          role: "developer",
          content: buildStateMessage(),
        },
        ...state.messages.slice(-12),
      ],
      reasoning: { effort: "minimal" },
      temperature: 0.8,
      max_output_tokens: 320,
      store: false,
    }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error?.message || payload.error || "OpenAI API request failed.");
  }

  const text = payload.output_text || extractOutputText(payload);
  if (!text) {
    throw new Error("The OpenAI API returned no text output.");
  }

  return text;
}

async function requestAssistantViaProxy() {
  const response = await fetch("/api/chat", {
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

function extractOutputText(payload) {
  const chunks = [];
  (payload.output || []).forEach((item) => {
    if (item.type !== "message") {
      return;
    }
    (item.content || []).forEach((content) => {
      if (content.type === "output_text" || content.type === "text") {
        if (content.text) {
          chunks.push(content.text);
        }
      }
    });
  });
  return chunks.join("\n").trim();
}

async function loadPromptText() {
  if (window.__echoPromptText) {
    return window.__echoPromptText;
  }

  const response = await fetch("prompts/echo_system_prompt.txt");
  if (!response.ok) {
    throw new Error("Could not load the system prompt file.");
  }

  window.__echoPromptText = await response.text();
  return window.__echoPromptText;
}

function buildConnectionError(error) {
  return [
    "I cannot reach the live OpenAI channel yet.",
    "",
    error.message,
    "",
    "For classroom demo use:",
    "1. Paste an OpenAI API key in the left panel",
    "2. Save the model if you want to change it",
    "3. Ask ECHO about the evidence directly",
  ].join("\n");
}

async function checkProxyHealth() {
  try {
    const response = await fetch("/api/health");
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

function storeKey(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    sessionStorage.removeItem(KEY_STORAGE);
    return;
  }
  sessionStorage.setItem(KEY_STORAGE, trimmed);
}

function loadStoredKey() {
  return sessionStorage.getItem(KEY_STORAGE) || "";
}

function storeModel(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    sessionStorage.removeItem(MODEL_STORAGE);
    return;
  }
  sessionStorage.setItem(MODEL_STORAGE, trimmed);
}

function loadStoredModel() {
  return sessionStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
}
