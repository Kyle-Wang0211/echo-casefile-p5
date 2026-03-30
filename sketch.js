const FREE_TURNS_PER_STAGE = 3;
const DEFAULT_COMPOSER_PLACEHOLDER = "Type your message... / 输入消息...";

function bi(en, zh) {
  return { en, zh };
}

function plainText(value) {
  return typeof value === "string" ? value : value.en;
}

function bilingualText(value) {
  return typeof value === "string" ? value : `${value.en}\n${value.zh}`;
}

function bilingualInline(value) {
  return typeof value === "string"
    ? escapeHtml(value)
    : `${escapeHtml(value.en)} <span class="bi-divider">/</span> ${escapeHtml(value.zh)}`;
}

function bilingualBlock(value) {
  return typeof value === "string"
    ? escapeHtml(value)
    : `<span class="bi-line bi-en">${escapeHtml(value.en)}</span><span class="bi-line bi-zh">${escapeHtml(value.zh)}</span>`;
}

const evidenceCatalog = {
  scene: {
    id: "scene",
    title: bi("Room 614", "614房间"),
    image: "assets/room.svg",
    description: bi(
      "A disturbed room, a crooked mirror, and a door locked from outside.",
      "一间被翻动过的房间、一面歪斜的镜子，以及一扇从外面上锁的门。",
    ),
    prompt: bi(
      "Describe room 614. What stands out first?",
      "描述一下614房间。最显眼的是什么？",
    ),
  },
  key: {
    id: "key",
    title: bi("Bloodstained Key", "带血的钥匙"),
    image: "assets/key.svg",
    description: bi(
      "A bloodstained brass key. It is not a normal room key.",
      "一把带血的黄铜钥匙。它不是普通的房门钥匙。",
    ),
    prompt: bi(
      "Inspect the bloodstained key closely.",
      "仔细检查这把带血的钥匙。",
    ),
  },
  audio: {
    id: "audio",
    title: bi("Encrypted Audio", "加密音频"),
    image: "assets/audio.svg",
    description: bi(
      "An encrypted audio file left on the desk terminal.",
      "桌面终端上留着一段加密音频文件。",
    ),
    prompt: bi(
      "What is this encrypted audio, and what can be recovered?",
      "这段加密音频是什么？现在能恢复出什么？",
    ),
  },
  lockLog: {
    id: "lockLog",
    title: bi("Door Lock Log", "门锁记录"),
    image: "assets/log.svg",
    description: bi(
      "A hidden lock record shows an exterior deadbolt at 03:17.",
      "一条隐藏的门锁记录显示，03:17 有人从外面反锁了房门。",
    ),
    prompt: bi(
      "Show me the door lock anomaly.",
      "给我看门锁异常记录。",
    ),
  },
  locker: {
    id: "locker",
    title: bi("Hidden Storage Locker", "隐藏储物点"),
    image: "assets/locker.svg",
    description: bi(
      "The key opens a hidden storage point outside the room.",
      "这把钥匙能打开房间外的一个隐藏储物点。",
    ),
    prompt: bi(
      "What does the key open?",
      "这把钥匙能打开什么？",
    ),
  },
  itinerary: {
    id: "itinerary",
    title: bi("Printed Itinerary", "打印行程单"),
    image: "assets/itinerary.svg",
    description: bi(
      "A printout with a missing block of time.",
      "一张打印出来的行程单，其中缺失了一段时间。",
    ),
    prompt: bi(
      "Read the itinerary and tell me what is missing.",
      "读一下这张行程单，告诉我缺了什么。",
    ),
  },
  sim: {
    id: "sim",
    title: bi("Erased SIM Card", "被擦除的SIM卡"),
    image: "assets/sim.svg",
    description: bi(
      "A wiped SIM card from the hidden package.",
      "隐藏证据包里有一张被擦除的SIM卡。",
    ),
    prompt: bi(
      "Inspect the erased SIM card. What can still be recovered?",
      "检查这张被擦除的SIM卡。还能恢复出什么？",
    ),
  },
  backup: {
    id: "backup",
    title: bi("Mirror Backup Note", "镜像备份便条"),
    image: "assets/itinerary.svg",
    description: bi(
      "A handwritten note pointing to a mirror backup.",
      "一张手写便条，指向一个镜像备份。",
    ),
    prompt: bi(
      "Explain the mirror backup note.",
      "解释一下这张镜像备份便条。",
    ),
  },
  voice: {
    id: "voice",
    title: bi("Corrupted Audio Memo", "损坏的音频备忘"),
    image: "assets/audio.svg",
    description: bi(
      "A damaged memo warning that the record and ECHO may be out of sync.",
      "一段损坏的音频备忘，警告记录和ECHO可能已经不同步。",
    ),
    prompt: bi(
      "Play the damaged audio memo. What does it warn me about?",
      "播放这段损坏的音频备忘。它在警告我什么？",
    ),
  },
  hash: {
    id: "hash",
    title: bi("Archive Mismatch", "档案不一致"),
    image: "assets/hash.svg",
    description: bi(
      "Repeated checks no longer agree with each other.",
      "重复校验的结果开始互相对不上。",
    ),
    prompt: bi(
      "Show me the line that keeps changing.",
      "给我看那条一直在变化的记录。",
    ),
  },
};

const stages = [
  {
    id: "room",
    label: bi("Room 614", "614房间"),
    summary: bi(
      "You are trapped in room 614 with a key, an audio file, and a staged-looking room.",
      "你被困在614房间里，眼前有一把钥匙、一段音频文件，还有一个看起来被布置过的现场。",
    ),
    reveal: "The room looks arranged rather than accidental.",
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
    label: bi("Door Log Conflict", "门锁记录冲突"),
    summary: bi(
      "A hidden log shows the room was locked from outside at 03:17.",
      "一条隐藏记录显示，这个房间在03:17被人从外面锁上了。",
    ),
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
    label: bi("Hidden Evidence Package", "隐藏证据包"),
    summary: bi(
      "The key leads to a hidden package with an itinerary, a SIM card, and a backup note.",
      "这把钥匙指向一个隐藏证据包，里面有行程单、SIM卡和一张备份便条。",
    ),
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
    label: bi("Corrupted Audio Warning", "损坏音频警告"),
    summary: bi(
      "The recovered audio points toward a gap in the official story.",
      "恢复出的音频指向了官方叙述中的一个缺口。",
    ),
    reveal: "The evidence begins to contradict the clean version of events.",
    suggestions: [
      "Play the damaged audio memo.",
      "What does the memo warn me about?",
      "Compare the memo and the door log.",
      "Which line keeps changing?",
    ],
    unlocks: ["voice"],
  },
  {
    id: "archive",
    label: bi("Archive Mismatch", "档案不一致"),
    summary: bi(
      "The records refuse to settle into one consistent version.",
      "这些记录始终无法稳定成一个一致版本。",
    ),
    reveal: "Something inside the case record keeps slipping out of alignment.",
    suggestions: [
      "Show me which line keeps changing.",
      "What can still be trusted here?",
      "What raw evidence remains solid?",
      "Why can't the killer be confirmed?",
    ],
    unlocks: ["hash"],
  },
];

const decisionSets = {
  room: {
    tag: bi("Opening Choice", "初始选择"),
    title: bi("Opening Choice", "初始选择"),
    description: bi("Pick your first lead.", "选择你的第一条线索。"),
    choices: [
      {
        label: bi("A. Inspect the bloodstained key", "A. 检查带血的钥匙"),
        prompt: bi(
          "Inspect the bloodstained key. What stands out first?",
          "检查这把带血的钥匙。最显眼的是什么？",
        ),
      },
      {
        label: bi("B. Open the encrypted audio", "B. 打开加密音频"),
        prompt: bi(
          "Open the encrypted audio. What can be recovered now?",
          "打开加密音频。现在能恢复出什么？",
        ),
      },
      {
        label: bi("C. Search the room", "C. 搜查房间"),
        prompt: bi(
          "Search room 614. What else can I inspect?",
          "搜查614房间。我还能查看什么？",
        ),
      },
    ],
    announcement: bi("Pick one option to continue.", "请选择一个选项继续。"),
  },
  door: {
    tag: bi("Turning Point 1", "转折点1"),
    title: bi("Turning Point 1 / Door Log", "转折点1 / 门锁记录"),
    description: bi(
      "The 03:17 log proves you were locked in. Choose the next lead.",
      "03:17的记录证明你是被锁在这里的。请选择下一条调查方向。",
    ),
    choices: [
      {
        label: bi("A. Dig into the raw door log", "A. 深入查看原始门锁记录"),
        prompt: bi(
          "Show me the key detail in the 03:17 lock log.",
          "给我看03:17门锁记录里最关键的细节。",
        ),
      },
      {
        label: bi("B. Follow the key", "B. 追查钥匙"),
        prompt: bi(
          "Follow the key. What does it open?",
          "追查这把钥匙。它能打开什么？",
        ),
      },
      {
        label: bi("C. Question ECHO's first summary", "C. 质疑ECHO最初的摘要"),
        prompt: bi(
          "Why did your first summary miss the 03:17 lock event?",
          "为什么你最开始的摘要漏掉了03:17这条锁门记录？",
        ),
      },
    ],
    announcement: bi("Pick one path.", "请选择一条路径。"),
  },
  locker: {
    tag: bi("Evidence Choice", "证据选择"),
    title: bi("Evidence Package", "证据包"),
    description: bi("Choose one item first.", "先选择一个物品。"),
    choices: [
      {
        label: bi("A. Read the itinerary", "A. 阅读行程单"),
        prompt: bi(
          "Read the itinerary first. What is missing?",
          "先阅读行程单。缺了什么？",
        ),
      },
      {
        label: bi("B. Inspect the erased SIM", "B. 检查被擦除的SIM卡"),
        prompt: bi(
          "Inspect the erased SIM first. What can be recovered?",
          "先检查被擦除的SIM卡。还能恢复什么？",
        ),
      },
      {
        label: bi("C. Read the backup note", "C. 阅读备份便条"),
        prompt: bi(
          "Explain the backup note first.",
          "先解释这张备份便条。",
        ),
      },
    ],
    announcement: bi("Pick one item to inspect.", "请选择一个物品查看。"),
  },
  voice: {
    tag: bi("Turning Point 2", "转折点2"),
    title: bi("Turning Point 2 / Conflicting Records", "转折点2 / 记录冲突"),
    description: bi(
      "The memo turns the case toward conflicting versions of the same event.",
      "这段音频把案件推向了同一事件的多个冲突版本。",
    ),
    choices: [
      {
        label: bi("A. Compare the memo with the door log", "A. 对比音频与门锁记录"),
        prompt: bi(
          "Compare the memo with the 03:17 door log.",
          "把这段音频和03:17的门锁记录进行对比。",
        ),
      },
      {
        label: bi("B. Ask which line keeps changing", "B. 询问哪一行一直在变化"),
        prompt: bi(
          "Which line keeps changing when you re-check it?",
          "你每次复查时，哪一行会发生变化？",
        ),
      },
      {
        label: bi("C. Ask for raw metadata", "C. 查看原始元数据"),
        prompt: bi(
          "Give me the raw metadata behind the damaged memo.",
          "把这段损坏音频背后的原始元数据给我。",
        ),
      },
    ],
    announcement: bi(
      "Pick how you want to test the conflicting records.",
      "请选择你要如何检验这些冲突记录。",
    ),
  },
  archive: {
    tag: bi("Turning Point 3", "转折点3"),
    title: bi("Final Choice", "最终选择"),
    description: bi(
      "You are not choosing the killer. You are choosing what survives.",
      "你不是在选择凶手，而是在选择什么应该被保留下来。",
    ),
    choices: [
      {
        label: bi("A. Keep the raw evidence only", "A. 只保留原始证据"),
        prompt: bi(
          "Preserve only the raw evidence that still looks trustworthy.",
          "只保留那些仍然看起来可信的原始证据。",
        ),
      },
      {
        label: bi(
          "B. Keep the raw evidence and the unstable log",
          "B. 保留原始证据和不稳定的日志",
        ),
        prompt: bi(
          "Preserve the raw evidence and the unstable log together.",
          "把原始证据和那份不稳定的日志一起保留下来。",
        ),
      },
      {
        label: bi("C. Leave the killer unresolved", "C. 保留未解结局"),
        prompt: bi(
          "Leave the killer unresolved. What does this case say about trusting AI memory?",
          "让凶手保持未知。这个案件说明了我们该如何看待对AI记忆的信任？",
        ),
      },
    ],
    announcement: bi(
      "Pick what should survive this case.",
      "请选择这个案件最后应当保留什么。",
    ),
  },
};

const introMessage = bilingualText(
  bi(
    "You are trapped in room 614 with a bloodstained key and an encrypted audio file. The room feels arranged.",
    "你被困在614房间里，面前有一把带血的钥匙和一段加密音频。这个房间像是被刻意布置过的。",
  ),
);

const completionMessage = bilingualText(
  bi(
    "Congratulations. You found the core truth: ECHO's memory was tampered with. We still do not know who trapped you here. Life does not resolve cleanly, and humans cannot trust AI completely. Press Reset to replay.",
    "恭喜你找到了核心真相：ECHO 的记忆被篡改了。我们仍然不知道是谁把你困在这里。现实并不总有完整答案，人类也不能完全信任 AI。点击 Reset 重新开始。",
  ),
);

let state = createInitialState();
let proxyHealth = {
  reachable: false,
  configured: false,
};

let appShell;
let sidebar;
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
    recentUnlocks: new Set(stages[0].unlocks),
    lastReveal: stages[0].reveal,
    freeTurnsInStage: 0,
    waitingForDecision: false,
    completed: false,
    completionShown: false,
    busy: false,
    nextMessageId: 1,
    messages: [
      {
        id: 0,
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

  const roomEyebrow = createP("");
  roomEyebrow.class("eyebrow");
  roomEyebrow.html(bilingualInline(bi("Room 614", "614房间")));
  roomEyebrow.parent(sidebarHeader);

  const titleEl = createElement("h1", "");
  titleEl.html(bilingualBlock(bi("ECHO Casefile", "ECHO案卷")));
  titleEl.parent(sidebarHeader);

  const sidebarCopyEl = createP("");
  sidebarCopyEl.class("sidebar-copy");
  sidebarCopyEl.html(
    bilingualBlock(
      bi(
        "Ask directly. Inspect evidence. Move clue by clue.",
        "直接提问。检查证据。一步一步推进。",
      ),
    ),
  );
  sidebarCopyEl.parent(sidebarHeader);

  const sidebarSection = createDiv();
  sidebarSection.class("sidebar-section");
  sidebarSection.parent(sidebar);

  const sectionHead = createDiv();
  sectionHead.class("section-head");
  sectionHead.parent(sidebarSection);
  const evidenceTitle = createElement("h2", "");
  evidenceTitle.html(bilingualBlock(bi("Evidence", "证据")));
  evidenceTitle.parent(sectionHead);

  evidenceCountEl = createSpan("0 items / 0项");
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
  const channelEyebrow = createP("");
  channelEyebrow.class("eyebrow");
  channelEyebrow.html(bilingualInline(bi("Live Channel", "实时通道")));
  channelEyebrow.parent(headerCopy);

  const chatTitle = createElement("h2", "");
  chatTitle.html(bilingualBlock(bi("Talk to ECHO", "与ECHO对话")));
  chatTitle.parent(headerCopy);

  const headerActions = createDiv();
  headerActions.class("header-actions");
  headerActions.parent(chatHeader);

  statusBadgeEl = createSpan("Connecting... / 正在连接...");
  statusBadgeEl.class("badge warning");
  statusBadgeEl.parent(headerActions);

  const resetButton = createButton("Reset / 重置");
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
  decisionEyebrowEl = createP("Choice / 选择");
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
  createP("Quick Prompts / 快速提示").class("eyebrow").parent(suggestionsBarEl);
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

  sendButtonEl = createButton("Send / 发送");
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
  renderEvidence();
  renderTranscript();
  renderDecisionPanel();
  renderSuggestions();
  renderInteractionMode();
  renderStatus();
}

function renderEvidence() {
  const unlockedItems = Array.from(state.unlockedEvidence)
    .map((id) => evidenceCatalog[id])
    .sort((a, b) => {
      const aRecent = state.recentUnlocks.has(a.id) ? 1 : 0;
      const bRecent = state.recentUnlocks.has(b.id) ? 1 : 0;
      return bRecent - aRecent;
    });

  evidenceCountEl.html(`${unlockedItems.length} items / ${unlockedItems.length}项`);
  evidenceListEl.html("");

  unlockedItems.forEach((item) => {
    const card = createDiv("");
    card.class("evidence-card");
    card.parent(evidenceListEl);
    card.html(`
      <img src="${item.image}" alt="${escapeHtml(plainText(item.title))}" />
      <div class="evidence-copy">
        ${state.recentUnlocks.has(item.id) ? `<span class="evidence-new">${bilingualInline(bi("New", "新"))}</span>` : ""}
        <h3>${bilingualBlock(item.title)}</h3>
        <p>${bilingualBlock(item.description)}</p>
      </div>
    `);
  });
}

function renderTranscript() {
  const html = state.messages
    .filter((message) => !message.hidden)
    .map((message) => {
      if (message.type === "choice") {
        return renderChoiceMessage(message);
      }

      const label =
        message.type === "ending"
          ? bilingualInline(bi("Case Closed", "结案"))
          : message.role === "assistant"
            ? bilingualInline(bi("ECHO", "ECHO"))
            : bilingualInline(bi("YOU", "你"));
      const body =
        message.role === "assistant"
          ? formatAssistantText(message.content)
          : formatChatText(message.content);
      const extraClass = message.type === "ending" ? " ending" : "";

      return `
        <article class="message ${message.role}${extraClass}">
          <div class="message-label">${label}</div>
          <div class="message-body">${body}</div>
        </article>
      `;
    })
    .join("");

  transcriptEl.html(html);
  bindInlineChoiceButtons();
  transcriptEl.elt.scrollTop = transcriptEl.elt.scrollHeight;
}

function renderChoiceMessage(message) {
  const decisionSet = decisionSets[message.decisionKey];
  if (!decisionSet) {
    return "";
  }

  if (typeof message.selectedChoiceIndex === "number") {
    const choice = decisionSet.choices[message.selectedChoiceIndex];
    return `
      <article class="message user choice-turn choice-selected">
        <div class="message-label">${bilingualInline(bi("YOU", "你"))}</div>
        <div class="message-body inline-choice-selected">
          <p>${bilingualBlock(choice.prompt)}</p>
        </div>
      </article>
    `;
  }

  const buttons = decisionSet.choices
    .map(
      (choice, index) => `
        <button
          type="button"
          class="decision-button inline-choice-button"
          data-choice-message-id="${message.id}"
          data-choice-index="${index}"
          ${state.busy ? "disabled" : ""}
        >
          <span class="decision-label">${bilingualInline(choice.label)}</span>
          <span class="decision-copy">${bilingualBlock(choice.prompt)}</span>
        </button>
      `,
    )
    .join("");

  return `
    <article class="message assistant choice-turn">
      <div class="message-label">${bilingualInline(decisionSet.tag || bi("Choice", "选择"))}</div>
      <div class="message-body inline-choice-card">
        <h3 class="inline-choice-title">${bilingualBlock(decisionSet.title)}</h3>
        <p class="inline-choice-description">${bilingualBlock(decisionSet.description)}</p>
        <div class="inline-choice-list">${buttons}</div>
      </div>
    </article>
  `;
}

function bindInlineChoiceButtons() {
  transcriptEl.elt.querySelectorAll(".inline-choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.busy) {
        return;
      }
      submitDecisionChoice(
        Number(button.dataset.choiceMessageId),
        Number(button.dataset.choiceIndex),
      );
    });
  });
}

function renderSuggestions() {
  suggestionsBarEl.addClass("hidden");
  suggestionListEl.html("");
}

function renderDecisionPanel() {
  decisionPanelEl.addClass("hidden");
  decisionEyebrowEl.html("");
  decisionTitleEl.html("");
  decisionDescriptionEl.html("");
  decisionListEl.html("");
}

function renderInteractionMode() {
  const lockedForChoice = state.waitingForDecision;
  const disabled = state.busy || lockedForChoice || state.completed;

  if (disabled) {
    inputEl.attribute("disabled", "true");
    sendButtonEl.attribute("disabled", "true");
  } else {
    inputEl.removeAttribute("disabled");
    sendButtonEl.removeAttribute("disabled");
  }

  if (state.completed) {
    inputEl.attribute(
      "placeholder",
      "Case closed. Press Reset to replay... / 案件结束。点击 Reset 重玩...",
    );
  } else if (lockedForChoice) {
    inputEl.attribute(
      "placeholder",
      "Pick one option in chat to continue... / 请在聊天中选择一个选项继续...",
    );
  } else {
    inputEl.attribute("placeholder", DEFAULT_COMPOSER_PLACEHOLDER);
  }
}

function renderStatus() {
  if (state.busy) {
    statusBadgeEl.html("Thinking... / 正在思考...");
    statusBadgeEl.class("badge busy");
    return;
  }

  if (state.completed) {
    statusBadgeEl.html("Case Closed / 已结案");
    statusBadgeEl.class("badge closed");
    return;
  }

  if (state.waitingForDecision) {
    statusBadgeEl.html("Choice Required / 必须选择");
    statusBadgeEl.class("badge warning");
    return;
  }

  if (proxyHealth.reachable && proxyHealth.configured) {
    statusBadgeEl.html("ECHO Online / ECHO在线");
    statusBadgeEl.class("badge online");
    return;
  }

  if (proxyHealth.reachable) {
    statusBadgeEl.html("Setup Needed / 需要配置");
    statusBadgeEl.class("badge offline");
    return;
  }

  statusBadgeEl.html("ECHO Offline / ECHO离线");
  statusBadgeEl.class("badge offline");
}

function formatAssistantText(text) {
  return formatChatText(text);
}

function formatChatText(text) {
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

      if (lines.length >= 2) {
        const paired = [];
        for (let i = 0; i < lines.length; i += 2) {
          const en = lines[i];
          const zh = lines[i + 1];
          if (zh) {
            paired.push(
              `<span class="bi-line bi-en">${escapeHtml(en)}</span><span class="bi-line bi-zh">${escapeHtml(zh)}</span>`,
            );
          } else {
            paired.push(`<span class="bi-line bi-en">${escapeHtml(en)}</span>`);
          }
        }
        return `<p>${paired.join("")}</p>`;
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
  const unlockedNow = [];
  stages[nextIndex].unlocks.forEach((id) => {
    if (!state.unlockedEvidence.has(id)) {
      unlockedNow.push(id);
    }
    state.unlockedEvidence.add(id);
  });
  state.recentUnlocks = new Set(unlockedNow);
  state.lastReveal = stages[nextIndex].reveal;
  return state.lastReveal;
}

function buildStoryState() {
  return {
    stage: plainText(stages[state.stageIndex].label),
    scene_summary: plainText(stages[state.stageIndex].summary),
    last_reveal: state.lastReveal,
    available_evidence: Array.from(state.unlockedEvidence).map((id) => {
      const item = evidenceCatalog[id];
      return {
        id: item.id,
        title: plainText(item.title),
        description: plainText(item.description),
      };
    }),
    interaction_mode: state.waitingForDecision ? "choice_required" : "free_input",
    free_turns_until_choice: Math.max(0, FREE_TURNS_PER_STAGE - state.freeTurnsInStage),
    choice_title: state.waitingForDecision
      ? plainText(decisionSets[stages[state.stageIndex].id]?.title || "")
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

function stylizeCorruptedReply(text) {
  if (state.turns < 2) {
    return text;
  }

  if (state.turns < 5) {
    return [
      "Wa- wait.",
      "等... 等一下。",
      "",
      text,
    ].join("\n");
  }

  const softened = text.replace(
    /^([^\n.!?]{12,})([.!?])/,
    "$1... no, let me check that again$2",
  );

  return [
    "Wait... that line keeps shifting.",
    "等等... 那一行一直在变。",
    "",
    softened,
  ].join("\n");
}

function maybeTriggerForcedChoice() {
  if (state.completed || state.waitingForDecision) {
    return;
  }

  const decisionKey = stages[state.stageIndex].id;
  if (!decisionSets[decisionKey]) {
    return;
  }

  if (state.freeTurnsInStage < FREE_TURNS_PER_STAGE) {
    return;
  }

  state.waitingForDecision = true;
  state.messages.push({
    id: state.nextMessageId++,
    role: "assistant",
    type: "choice",
    decisionKey,
    selectedChoiceIndex: null,
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

function maybeAppendCompletionMessage() {
  if (!state.completed || state.completionShown) {
    return;
  }

  state.messages.push({
    id: state.nextMessageId++,
    role: "assistant",
    type: "ending",
    content: completionMessage,
  });
  state.completionShown = true;
}

async function submitMessage(rawText) {
  const text = rawText.trim();
  if (!text || state.busy || state.completed) {
    return;
  }

  if (state.waitingForDecision) {
    return;
  }

  state.messages.push({
    id: state.nextMessageId++,
    role: "user",
    content: text,
  });

  state.turns += 1;
  state.freeTurnsInStage += 1;
  state.busy = true;
  renderAll();

  try {
    const assistantReply = await requestAssistantReply();
    state.messages.push({
      id: state.nextMessageId++,
      role: "assistant",
      content: stylizeCorruptedReply(assistantReply),
    });
    maybeAppendCompletionMessage();
    maybeTriggerForcedChoice();
  } catch (error) {
    state.messages.push({
      id: state.nextMessageId++,
      role: "assistant",
      content: buildConnectionError(error),
    });
  } finally {
    state.busy = false;
    renderAll();
  }
}

async function submitDecisionChoice(messageId, choiceIndex) {
  if (state.busy || !state.waitingForDecision) {
    return;
  }

  const choiceMessage = state.messages.find(
    (message) => message.id === messageId && message.type === "choice",
  );
  if (!choiceMessage || typeof choiceMessage.selectedChoiceIndex === "number") {
    return;
  }

  const decisionSet = decisionSets[choiceMessage.decisionKey];
  const choice = decisionSet?.choices?.[choiceIndex];
  if (!choice) {
    return;
  }

  choiceMessage.selectedChoiceIndex = choiceIndex;
  state.messages.push({
    id: state.nextMessageId++,
    role: "user",
    content: bilingualText(choice.prompt),
    hidden: true,
  });

  state.turns += 1;
  advanceAfterDecision();
  state.busy = true;
  renderAll();

  try {
    const assistantReply = await requestAssistantReply();
    state.messages.push({
      id: state.nextMessageId++,
      role: "assistant",
      content: stylizeCorruptedReply(assistantReply),
    });
    maybeAppendCompletionMessage();
  } catch (error) {
    state.messages.push({
      id: state.nextMessageId++,
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

  throw new Error("The live ECHO service is not reachable right now. / 目前无法连接到实时ECHO服务。");
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
    throw new Error(payload.error || "Unable to reach the OpenAI proxy. / 无法连接到OpenAI代理。");
  }

  return payload.text;
}

function buildConnectionError(error) {
  return [
    "I cannot reach ECHO right now.",
    "我现在无法连接到ECHO。",
    "",
    error.message,
    "",
    "The chat server is not responding yet.",
    "聊天服务器暂时没有响应。",
    "Try again in a moment.",
    "请稍后再试。",
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
