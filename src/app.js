/* eslint-disable no-use-before-define */

const LS_KEY = "cbi_screening_dialog_v5";
const ENTRY_CHECK_LS_KEY = "cbi_entry_check_v1_state";
const TG_USERNAME = "CENTR_BIZNES_INVEST";
const REQUIRED_KEYS = ["goal", "budget", "type", "typeDetail", "term", "docs", "mainQuestion"];

const els = {
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  quickWrap: document.querySelector(".composer__quick"),
  chatConsent: document.getElementById("chatConsent"),
  chatSubmitBtn: document.getElementById("chatSubmitBtn"),
  chatReadyBadge: document.getElementById("chatReadyBadge"),
  chatConsentHint: document.getElementById("chatConsentHint"),
  chatProgress: document.getElementById("chatProgress"),
  btnNewChat: document.getElementById("btnNewChat"),
  checklist: document.getElementById("checklist"),
  entryCheckRoot: document.getElementById("entryCheckModule"),
  entryCheckStep: document.getElementById("entryCheckStep"),
  entryCheckResult: document.getElementById("entryCheckResult"),
  entryCheckBack: document.getElementById("entryCheckBack"),
  entryCheckNext: document.getElementById("entryCheckNext"),
  entryCheckSecondary: document.getElementById("entryCheckSecondary"),
  entryCheckReset: document.getElementById("entryCheckReset"),
  entryCheckProgressLabel: document.getElementById("entryCheckProgressLabel"),
  entryCheckProgressText: document.getElementById("entryCheckProgressText"),
  entryCheckProgressBar: document.getElementById("entryCheckProgressBar"),
};

const ENTRY_CHECK_TEXT = {
  start: {
    title: "Выдержит ли ваш вход?",
    hint: "Короткая предварительная диагностика объекта или проекта. Сначала факты, ограничения и логика входа. Потом решение о капитале.",
  },
  assetType: {
    title: "Что вы хотите оценить?",
    options: [
      "Новостройка",
      "Коммерческая недвижимость",
      "Земельный участок",
      "Строительство дома",
      "Коттеджный проект",
      "Кемпинг / глэмпинг",
      "Реконструкция",
      "Проект развития",
      "Сравниваю несколько вариантов",
    ],
  },
  goal: {
    title: "Для какой задачи рассматриваете актив?",
    options: [
      "Проверка перед входом",
      "Сравнение вариантов",
      "Вложение капитала",
      "Развитие проекта",
      "Реконструкция",
      "Подготовка к переговорам",
      "Пока изучаю направление",
    ],
  },
  stageAndTime: {
    title: "Стадия и горизонт решения",
    stageOptions: ["Только изучаю", "Есть конкретный объект", "Идут переговоры", "Нужно срочное решение"],
    timeOptions: ["В течение недели", "В течение месяца", "Есть время на проверку", "Пока без срока"],
  },
  budgetAndCapital: {
    title: "Бюджет и структура капитала",
    budgetPlaceholder: "Например: до 30 млн ₽",
    capitalOptions: ["Собственные средства", "Кредит", "Смешанная структура", "Пока не определено"],
  },
  materials: {
    title: "Что уже есть по объекту или проекту?",
    hint: "Если данных мало, вывод будет только предварительным.",
    options: ["Ссылка или адрес", "Презентация", "Цена входа", "Документы", "Финмодель", "Только идея", "Пока ничего нет"],
  },
  mainQuestion: {
    title: "Что для вас сейчас главное?",
    options: [
      "Понять, стоит ли идти дальше",
      "Найти скрытый риск",
      "Проверить логику дохода",
      "Понять сценарий выхода",
      "Оценить ограничения",
      "Получить письменную позицию",
    ],
  },
};

const ENTRY_CHECK_ASSET_BRANCH = {
  "Земельный участок": ["Есть ВРИ", "Есть выписка ЕГРН", "Есть ПЗЗ / ГПЗУ", "Есть схема границ", "Понятен сценарий использования"],
  "Коммерческая недвижимость": [
    "Есть арендатор",
    "Есть договор аренды",
    "Понятна ставка",
    "Понятен срок договора",
    "Есть данные по вакансии",
  ],
  Новостройка: [
    "Понятна цена входа",
    "Понятна стадия проекта",
    "Понятен сценарий выхода",
    "Понятен тип лота",
    "Есть понимание конкурентов",
  ],
  Реконструкция: [
    "Понятен текущий объект",
    "Есть концепция после реконструкции",
    "Есть ориентир по CAPEX",
    "Понятны ограничения",
    "Понятны сроки",
  ],
  "Проект развития": [
    "Есть концепция",
    "Понятна стадия",
    "Понятна этапность",
    "Понятна ключевая гипотеза",
    "Понятны ограничения",
    "Понятна форма участия",
  ],
};

const ENTRY_CHECK_RESULTS = {
  strong: {
    title: "Вход выглядит собранным",
    text: "По текущим вводным уже есть основание для предметной проверки. Следующий сильный шаг — скрининг или первичная оценка с пакетом материалов.",
    actions: ["Запустить скрининг", "Передать материалы"],
  },
  medium: {
    title: "Нужна дооценка",
    text: "Логика есть, но оснований пока недостаточно. Сейчас лучше собрать недостающие данные, чем ускорять решение без опоры на факты.",
    actions: ["Получить список, что прислать", "Перейти к первичной оценке"],
  },
  highRisk: {
    title: "Высокая цена ошибки",
    text: "На текущих вводных вход выглядит преждевременным. Слишком многое держится на предположениях, а не на проверенных данных.",
    actions: ["Получить чек-лист", "Обсудить задачу"],
  },
};

const ENTRY_CHECK_RULES = {
  thresholds: { strong: 7, mediumMin: 4 },
};

const ENTRY_CHECK_INITIAL = {
  started: false,
  stepIndex: 0,
  isResult: false,
  answers: {
    assetType: "",
    assetChecks: [],
    goal: "",
    stage: "",
    decisionTime: "",
    budget: "",
    capitalStructure: "",
    materials: [],
    mainQuestion: "",
    writtenResult: false,
    contact: { name: "", telegram: "", phone: "", email: "" },
    consent: false,
  },
  score: 0,
  resultType: "",
  createdAt: "",
};

let entryState = { ...ENTRY_CHECK_INITIAL, answers: { ...ENTRY_CHECK_INITIAL.answers, contact: { ...ENTRY_CHECK_INITIAL.answers.contact } } };

const initialBotText =
  "Укажите объект или проект, цель вложения, бюджет, горизонт и что требуется оценить до решения. Пройдём по шагам и после этого отправим заявку в Telegram.";
const initialState = { stepIndex: 0, answers: {}, objectType: null, readyToSend: false, messages: [{ role: "bot", text: initialBotText }] };
let state = { ...initialState };

const FLOW_STEPS = [
  { key: "goal", stage: "Рамка задачи", question: "Какая цель вложения в приоритете?", options: ["Арендный доход", "Перепродажа", "Сохранение капитала", "Развитие проекта / девелопмент"] },
  { key: "budget", stage: "Рамка задачи", question: "Какой ориентир по бюджету и источнику средств?", options: ["До 10 млн, собственные средства", "10–30 млн, смешанный источник", "30+ млн, собственные средства", "Планирую кредитное плечо / ипотеку"] },
  { key: "type", stage: "Конструкция объекта", question: "Что рассматриваете сейчас?", options: ["Новостройка", "Коммерческая недвижимость", "Земля / строительство", "Проект развития / реконструкция"] },
  { key: "typeDetail", stage: "Конструкция объекта", question: "Что критично проверить по выбранному типу объекта?", options: [] },
  { key: "term", stage: "Сценарная проверка", question: "Какой горизонт решения или входа в сделку?", options: ["1–3 месяца", "3–6 месяцев", "6–12 месяцев", "12+ месяцев"] },
  { key: "docs", stage: "Основание для рассмотрения", question: "Что уже есть из документов и исходных данных?", options: ["Есть базовый пакет документов", "Есть адрес, цена и исходные вводные", "Есть только презентация / описание", "Документов пока нет"] },
  { key: "mainQuestion", stage: "Основание для рассмотрения", question: "Какой главный вопрос нужно закрыть до решения?", options: ["Есть ли основание входить сейчас", "Где ключевые ограничения и риски", "Насколько устойчива модель в сценариях", "Что критично уточнить перед сделкой"] },
];

const TYPE_DETAIL_OPTIONS = {
  newbuild: { options: ["Надежность застройщика и сроки ввода", "Ликвидность и сценарий выхода", "Рост цены и конкуренция", "Юридическая чистота и ограничения"] },
  commercial: { options: ["Качество арендатора и ставка аренды", "Риск простоя и расходы", "Локация и трафик", "Потенциал дохода при смене арендатора"] },
  land: { options: ["Правовой статус и ограничения", "Сценарии использования участка", "Инфраструктура и логистика", "Инвестиционная емкость проекта"] },
  development: { options: ["Структура и этапность проекта", "Ограничения и уязвимости", "Сценарий реализации и сроки", "Устойчивость инвестиционной модели"] },
};

function saveToStorage(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function scrollChatToBottom() {
  if (!els.chatLog) return;
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function scrollToScreening() {
  const el = document.getElementById("screening");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getChecklistCheckboxes() {
  if (!els.checklist) return [];
  return Array.from(els.checklist.querySelectorAll('input[type="checkbox"]'));
}

function setChecklistState(current) {
  const boxes = getChecklistCheckboxes();
  ["goal", "budget", "type", "term", "docs"].forEach((key, idx) => {
    const box = boxes[idx];
    if (box) box.checked = Boolean(current.answers[key]);
  });
  updateChatProgress(current);
}

function getCollectedCount(currentState) {
  return REQUIRED_KEYS.reduce((acc, key) => acc + (currentState.answers[key] ? 1 : 0), 0);
}

function updateChatProgress(currentState) {
  if (!els.chatProgress) return;
  const count = getCollectedCount(currentState);
  els.chatProgress.textContent = `Собрано ${count}/${REQUIRED_KEYS.length} параметров`;
  els.chatProgress.classList.remove("chatProgress--low", "chatProgress--mid", "chatProgress--ready");
  els.chatProgress.classList.add(count >= REQUIRED_KEYS.length ? "chatProgress--ready" : count >= 3 ? "chatProgress--mid" : "chatProgress--low");
}

function detectTypeCategory(text) {
  const t = String(text || "").toLowerCase();
  if (/(новостро|жк|переуступ|застройщик|эскроу)/i.test(t)) return "newbuild";
  if (/(коммерц|офис|ритейл|арендатор|склад|стрит)/i.test(t)) return "commercial";
  if (/(земл|участок|ижс|строительств|коттедж)/i.test(t)) return "land";
  if (/(развит|реконструкц|апарт|гостиниц|многофункцион)/i.test(t)) return "development";
  return null;
}

function getTypeDetailOptions(typeCategory) {
  return (TYPE_DETAIL_OPTIONS[typeCategory] || TYPE_DETAIL_OPTIONS.newbuild).options;
}

function getTypeLabel(typeCategory) {
  if (typeCategory === "newbuild") return "новостройка";
  if (typeCategory === "commercial") return "коммерческая недвижимость";
  if (typeCategory === "land") return "земля и строительство";
  if (typeCategory === "development") return "проект развития или реконструкция";
  return "объект или проект";
}

function getFinalTypeSummary(typeCategory) {
  if (typeCategory === "newbuild") return "Фокус по новостройке: надежность застройщика, сроки ввода, ликвидность и реалистичный сценарий выхода.";
  if (typeCategory === "commercial") return "Фокус по коммерции: устойчивость аренды, риск простоя, операционные расходы и качество локации.";
  if (typeCategory === "land") return "Фокус по земле/строительству: правовой статус, ограничения, сценарий использования и инвестиционная емкость.";
  if (typeCategory === "development") return "Фокус по развитию/реконструкции: этапность, ключевые ограничения, уязвимости и устойчивость модели реализации.";
  return "Фокус первичной оценки: качество входа, ограничения, сценарии и основание для следующего шага.";
}

function buildStructuredSummary() {
  const a = state.answers || {};
  return [`1) Цель вложения: ${a.goal || "—"}`, `2) Бюджет / источник: ${a.budget || "—"}`, `3) Формат объекта: ${a.type || "—"}`, `4) Критичный параметр: ${a.typeDetail || "—"}`, `5) Горизонт: ${a.term || "—"}`, `6) Документы / исходные данные: ${a.docs || "—"}`, `7) Главный вопрос: ${a.mainQuestion || "—"}`].join("\n");
}

function getCurrentStep() {
  return FLOW_STEPS[state.stepIndex] || null;
}

function renderQuickOptions() {
  if (!els.quickWrap) return;
  const step = getCurrentStep();
  let options = step?.options || [];
  if (step?.key === "typeDetail") options = getTypeDetailOptions(state.objectType);
  els.quickWrap.innerHTML = "";
  if (!step) return;
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "quick";
    btn.type = "button";
    btn.textContent = option;
    btn.addEventListener("click", () => {
      if (!els.chatInput) return;
      els.chatInput.value = option;
      els.chatInput.focus();
    });
    els.quickWrap.appendChild(btn);
  });
}

function createMsg(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role === "user" ? "msg--user" : "msg--bot"}`;
  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.textContent = text;
  wrap.appendChild(bubble);
  return wrap;
}

function showTyping() {
  const wrap = createMsg("bot", "Формирую ответ…");
  if (els.chatLog) {
    els.chatLog.appendChild(wrap);
    scrollChatToBottom();
  }
  return wrap;
}

function normalizeStateShape(rawState) {
  const base = { ...initialState, ...rawState };
  const answers = typeof base.answers === "object" && base.answers ? { ...base.answers } : {};
  ["goal", "budget", "type", "typeDetail", "term", "docs", "mainQuestion"].forEach((key) => {
    if (!answers[key] && typeof base[key] === "string" && base[key].trim()) answers[key] = base[key].trim();
  });
  const normalized = { ...initialState, ...base, answers, stepIndex: Number.isInteger(base.stepIndex) ? base.stepIndex : 0, readyToSend: Boolean(base.readyToSend), objectType: base.objectType || detectTypeCategory(answers.type || "") || null };
  while (normalized.stepIndex < FLOW_STEPS.length && normalized.answers[FLOW_STEPS[normalized.stepIndex].key]) normalized.stepIndex += 1;
  if (normalized.stepIndex >= FLOW_STEPS.length) normalized.readyToSend = true;
  return normalized;
}

function resetChat() {
  state = normalizeStateShape({ ...initialState });
  if (els.chatConsentHint) {
    els.chatConsentHint.hidden = true;
    els.chatConsentHint.textContent = "";
  }
  if (!els.chatLog) return;
  els.chatLog.innerHTML = "";
  state.messages.forEach((m) => els.chatLog.appendChild(createMsg(m.role, m.text)));
  setChecklistState(state);
  renderQuickOptions();
  syncChatSubmitBtn();
  scrollChatToBottom();
  saveToStorage(LS_KEY, state);
}

function isAllCollected() {
  return REQUIRED_KEYS.every((key) => Boolean(state.answers[key]));
}

function getCurrentFlowQuestion() {
  const step = getCurrentStep();
  if (!step) return null;
  if (step.key !== "typeDetail") return step;
  return { ...step, options: getTypeDetailOptions(state.objectType) };
}

function setAnswerForCurrentStep(text) {
  const step = getCurrentStep();
  if (!step) return null;
  const value = String(text || "").trim();
  if (!value) return null;
  state.answers[step.key] = value;
  if (step.key === "type") {
    const detectedType = detectTypeCategory(value);
    state.objectType = detectedType || state.objectType || "newbuild";
    delete state.answers.typeDetail;
  }
  state.stepIndex += 1;
  return { step, value };
}

function getStepLabel(stepKey) {
  if (stepKey === "goal") return "цель вложения";
  if (stepKey === "budget") return "бюджет и источник";
  if (stepKey === "type") return "тип объекта";
  if (stepKey === "typeDetail") return "критичный параметр";
  if (stepKey === "term") return "горизонт";
  if (stepKey === "docs") return "документы и исходные данные";
  if (stepKey === "mainQuestion") return "главный вопрос";
  return "параметр";
}

function generateBotReply(userText) {
  const answered = setAnswerForCurrentStep(String(userText || "").trim());
  setChecklistState(state);
  const reply = [];
  if (answered?.step?.key) reply.push(`Принято: ${getStepLabel(answered.step.key)} — ${answered.value}.`);
  if (!isAllCollected()) {
    const flow = getCurrentFlowQuestion();
    state.readyToSend = false;
    reply.push("Двигаемся дальше по шагам, чтобы собрать рабочую рамку решения.");
    if (flow) reply.push(`${flow.stage}: ${flow.question}`);
    reply.push("Можно выбрать вариант кнопкой ниже или написать свой ответ.");
    return reply.join("\n\n");
  }
  state.readyToSend = true;
  reply.push("Готово. Я собрала сообщение для первичной оценки.");
  reply.push(`Тип запроса: ${getTypeLabel(state.objectType)}.`);
  reply.push(getFinalTypeSummary(state.objectType));
  reply.push(`Собранные вводные:\n${buildStructuredSummary()}`);
  reply.push("Если всё верно, нажмите «Отправить в Telegram» — сообщение будет передано в личный чат.");
  reply.push("Спасибо за обращение. С вами свяжутся в течение дня.");
  return reply.join("\n\n");
}

function addAndPersistMessage(role, text) {
  state.messages.push({ role, text });
  if (els.chatLog) els.chatLog.appendChild(createMsg(role, text));
  scrollChatToBottom();
  renderQuickOptions();
  syncChatSubmitBtn();
  saveToStorage(LS_KEY, state);
}

async function handleUserMessage(text) {
  if (!text.trim()) return;
  addAndPersistMessage("user", text.trim());
  const typingEl = showTyping();
  await new Promise((r) => setTimeout(r, 420));
  typingEl.remove();
  addAndPersistMessage("bot", generateBotReply(text));
}

function openTelegramWithMessage(userText) {
  const payload = String(userText || "").trim();
  const intro = `Здравствуйте. Запрос на первичную оценку.\nТип запроса: ${getTypeLabel(state.objectType)}.\n\n`;
  const fullText = `${intro}Приоритет первичного этапа: ${getFinalTypeSummary(state.objectType)}\n\nСобранные вводные:\n${buildStructuredSummary()}${payload ? `\n\nДополнение клиента:\n${payload}` : ""}`.trim();
  const confirmText = "Заявка подготовлена: текст скопирован, открываю Telegram. Если сообщение не вставилось автоматически, вставьте его из буфера обмена.";
  if (els.chatLog) {
    els.chatLog.appendChild(createMsg("bot", confirmText));
    scrollChatToBottom();
  }
  state.messages.push({ role: "bot", text: confirmText });
  saveToStorage(LS_KEY, state);
  try {
    navigator?.clipboard?.writeText?.(fullText).catch(() => {});
  } catch {
    // ignore
  }
  const chatUrl = `https://t.me/${TG_USERNAME}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(chatUrl)}&text=${encodeURIComponent(fullText)}`;
  const popup = window.open(shareUrl, "_blank", "noopener,noreferrer");
  if (!popup) window.location.href = shareUrl;
}

function wireQuickButtons() {
  document.querySelectorAll(".chip[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!els.chatInput) return;
      els.chatInput.value = btn.getAttribute("data-chip") || "";
      els.chatInput.focus();
      scrollToScreening();
    });
  });
  renderQuickOptions();
}

function syncChatSubmitBtn() {
  const btn = els.chatSubmitBtn || els.chatForm?.querySelector("button[type='submit']");
  if (!btn) return;
  btn.disabled = !els.chatConsent?.checked;
  btn.textContent = state.readyToSend ? "Отправить в Telegram" : "Продолжить";
  if (els.chatReadyBadge) els.chatReadyBadge.classList.toggle("is-hidden", !state.readyToSend);
}

function wireForm() {
  if (!els.chatForm) return;
  els.chatConsent?.addEventListener("change", syncChatSubmitBtn);
  syncChatSubmitBtn();
  els.chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!els.chatConsent?.checked) {
      if (els.chatConsentHint) {
        els.chatConsentHint.hidden = false;
        els.chatConsentHint.textContent = "Отметьте согласие с политикой конфиденциальности и офертой, чтобы отправить сообщение.";
      }
      els.chatConsent?.focus();
      return;
    }
    if (els.chatConsentHint) {
      els.chatConsentHint.hidden = true;
      els.chatConsentHint.textContent = "";
    }
    const trimmed = (els.chatInput?.value || "").trim();
    if (!trimmed && !state.readyToSend) return;

    if (state.readyToSend) {
      if (els.chatInput) els.chatInput.value = "";
      openTelegramWithMessage(trimmed);
      syncChatSubmitBtn();
      els.chatInput?.focus();
      return;
    }

    if (els.chatInput) els.chatInput.value = "";
    if (els.chatInput) els.chatInput.disabled = true;
    if (els.chatSubmitBtn) els.chatSubmitBtn.disabled = true;
    try {
      await handleUserMessage(trimmed);
    } finally {
      if (els.chatInput) els.chatInput.disabled = false;
      syncChatSubmitBtn();
      els.chatInput?.focus();
    }
  });
}

function hydrateFromStorageOrReset() {
  if (!els.chatLog) return;
  const saved = loadFromStorage(LS_KEY);
  if (!saved?.messages || !Array.isArray(saved.messages)) return resetChat();
  state = normalizeStateShape(saved);
  els.chatLog.innerHTML = "";
  state.messages.forEach((m) => els.chatLog.appendChild(createMsg(m.role === "user" ? "user" : "bot", m.text || "")));
  setChecklistState(state);
  renderQuickOptions();
  syncChatSubmitBtn();
  scrollChatToBottom();
}

function wireNewChat() {
  if (els.btnNewChat) els.btnNewChat.addEventListener("click", resetChat);
}

function getEntryFlow() {
  const flow = ["start", "assetType"];
  if (ENTRY_CHECK_ASSET_BRANCH[entryState.answers.assetType]) flow.push("assetChecks");
  flow.push("goal", "stageAndTime", "budgetAndCapital", "materials", "mainQuestion", "contacts");
  return flow;
}

function persistEntryState() {
  saveToStorage(ENTRY_CHECK_LS_KEY, { ...entryState, createdAt: entryState.createdAt || new Date().toISOString() });
}

function hydrateEntryState() {
  const saved = loadFromStorage(ENTRY_CHECK_LS_KEY);
  if (!saved || typeof saved !== "object") return;
  entryState = {
    ...ENTRY_CHECK_INITIAL,
    ...saved,
    answers: { ...ENTRY_CHECK_INITIAL.answers, ...(saved.answers || {}), contact: { ...ENTRY_CHECK_INITIAL.answers.contact, ...(saved.answers?.contact || {}) } },
  };
}

/** После CTA в Telegram с экрана результата: убираем персональные данные из памяти и localStorage. */
function resetEntryCheckContactsAfterTelegramSend() {
  entryState.answers.contact = { name: "", telegram: "", phone: "", email: "" };
  entryState.answers.writtenResult = false;
  entryState.answers.consent = false;
  persistEntryState();
}

/** Полный сброс модуля «Выдержит ли ваш вход?»: обнуляем все ответы, снимаем результат, возвращаемся на старт. */
function resetEntryCheckAll({ rerender = true } = {}) {
  entryState = {
    ...ENTRY_CHECK_INITIAL,
    answers: {
      ...ENTRY_CHECK_INITIAL.answers,
      assetChecks: [],
      materials: [],
      contact: { ...ENTRY_CHECK_INITIAL.answers.contact },
    },
  };
  try {
    localStorage.removeItem(ENTRY_CHECK_LS_KEY);
  } catch {
    // ignore
  }
  if (rerender) {
    if (els.entryCheckResult) {
      els.entryCheckResult.innerHTML = "";
      els.entryCheckResult.classList.add("is-hidden");
    }
    if (els.entryCheckStep) els.entryCheckStep.classList.remove("is-hidden");
    renderEntryStep();
  }
}

function setEntryProgress(flow) {
  const total = flow.length + 1;
  const current = entryState.isResult ? total : entryState.stepIndex + 1;
  const percent = Math.round((current / total) * 100);
  if (els.entryCheckProgressLabel) els.entryCheckProgressLabel.textContent = `Шаг ${current} из ${total}`;
  if (els.entryCheckProgressText) els.entryCheckProgressText.textContent = entryState.isResult ? "Результат" : "Диагностика";
  if (els.entryCheckProgressBar) els.entryCheckProgressBar.style.width = `${percent}%`;
  const track = els.entryCheckProgressBar?.parentElement;
  if (track) track.setAttribute("aria-valuenow", String(percent));
}

function renderSingleChoice(options, selected, onPick) {
  const wrap = document.createElement("div");
  wrap.className = "entryCheck__optionGrid";
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `entryCheck__option${selected === option ? " is-active" : ""}`;
    btn.textContent = option;
    btn.addEventListener("click", () => onPick(option));
    wrap.appendChild(btn);
  });
  return wrap;
}

function renderMultiChoice(options, selected, onToggle) {
  const set = new Set(selected || []);
  return renderSingleChoice(options, "", (value) => {
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onToggle(Array.from(set));
  });
}

function animateStepSwap(renderFn) {
  if (!els.entryCheckStep) return;
  els.entryCheckStep.classList.add("is-leaving");
  window.setTimeout(() => {
    renderFn();
    els.entryCheckStep.classList.remove("is-leaving");
  }, 180);
}

function validateCurrentEntryStep(stepKey) {
  const a = entryState.answers;
  if (stepKey === "start") return true;
  if (stepKey === "assetType") return Boolean(a.assetType);
  if (stepKey === "assetChecks") return a.assetChecks.length > 0;
  if (stepKey === "goal") return Boolean(a.goal);
  if (stepKey === "stageAndTime") return Boolean(a.stage) && Boolean(a.decisionTime);
  if (stepKey === "budgetAndCapital") return Boolean(a.capitalStructure);
  if (stepKey === "materials") return a.materials.length > 0;
  if (stepKey === "mainQuestion") return Boolean(a.mainQuestion);
  if (stepKey === "contacts") {
    const c = a.contact;
    const hasContact = Boolean((c.name || "").trim() || (c.telegram || "").trim() || (c.phone || "").trim() || (c.email || "").trim());
    return hasContact && a.consent;
  }
  return true;
}

function getResultTypeByScore(score) {
  if (score >= ENTRY_CHECK_RULES.thresholds.strong) return "strong";
  if (score >= ENTRY_CHECK_RULES.thresholds.mediumMin) return "medium";
  return "highRisk";
}

function calculateEntryScore(current) {
  const a = current.answers;
  const materials = new Set(a.materials || []);
  let score = 0;
  const matchedRules = [];
  const hasDocs = materials.has("Документы");
  const hasPrice = materials.has("Цена входа");
  const hasLink = materials.has("Ссылка или адрес");
  const weakPack = materials.size < 2;

  if (a.stage === "Есть конкретный объект") { score += 2; matchedRules.push("+2 stage:concrete"); }
  if (hasDocs) { score += 2; matchedRules.push("+2 material:docs"); }
  if (hasPrice) { score += 2; matchedRules.push("+2 material:price"); }
  if (hasLink) { score += 2; matchedRules.push("+2 material:link"); }
  if (a.mainQuestion) { score += 2; matchedRules.push("+2 mainQuestion:selected"); }

  if ((a.budget || "").trim()) { score += 1; matchedRules.push("+1 budget:filled"); }
  if (a.capitalStructure && a.capitalStructure !== "Пока не определено") { score += 1; matchedRules.push("+1 capital:defined"); }
  if (a.stage === "Идут переговоры") { score += 1; matchedRules.push("+1 stage:negotiation"); }
  if (materials.has("Презентация")) { score += 1; matchedRules.push("+1 material:presentation"); }
  if (materials.has("Финмодель")) { score += 1; matchedRules.push("+1 material:finmodel"); }
  if (a.writtenResult) { score += 1; matchedRules.push("+1 writtenResult"); }

  if (materials.has("Только идея")) { score -= 2; matchedRules.push("-2 material:ideaOnly"); }
  if (materials.has("Пока ничего нет")) { score -= 2; matchedRules.push("-2 material:nothing"); }
  if (!(a.budget || "").trim()) { score -= 2; matchedRules.push("-2 budget:empty"); }
  if (a.stage === "Нужно срочное решение" && !hasDocs) { score -= 2; matchedRules.push("-2 urgent:noDocs"); }
  if (a.stage === "Нужно срочное решение" && !hasPrice) { score -= 2; matchedRules.push("-2 urgent:noPrice"); }

  if (a.decisionTime === "В течение недели" && weakPack) { score -= 1; matchedRules.push("-1 week:weakPack"); }
  if (a.capitalStructure === "Пока не определено") { score -= 1; matchedRules.push("-1 capital:undefined"); }
  if (a.goal === "Пока изучаю направление") { score -= 1; matchedRules.push("-1 goal:exploreOnly"); }
  if (!hasLink && !materials.has("Презентация") && !hasDocs) { score -= 1; matchedRules.push("-1 noCoreMaterials"); }

  return { score, matchedRules, resultType: getResultTypeByScore(score) };
}

function buildEntryPayload(current, calc) {
  return {
    quizId: "cbi-entry-check-v1",
    assetType: current.answers.assetType || "",
    goal: current.answers.goal || "",
    stage: current.answers.stage || "",
    decisionTime: current.answers.decisionTime || "",
    budget: current.answers.budget || "",
    capitalStructure: current.answers.capitalStructure || "",
    materials: current.answers.materials || [],
    mainQuestion: current.answers.mainQuestion || "",
    writtenResult: Boolean(current.answers.writtenResult),
    score: calc.score,
    resultType: calc.resultType,
    contact: { ...current.answers.contact },
    consent: Boolean(current.answers.consent),
    createdAt: current.createdAt || new Date().toISOString(),
    source: "instrumenty-page",
  };
}

function buildDeliveryPayload(payload) {
  const lines = [
    "Новая диагностика входа (CBI Entry Check v1)",
    `Результат: ${payload.resultType} (${payload.score})`,
    `Актив: ${payload.assetType || "—"}`,
    `Задача: ${payload.goal || "—"}`,
    `Стадия: ${payload.stage || "—"}`,
    `Срок решения: ${payload.decisionTime || "—"}`,
    `Бюджет: ${payload.budget || "—"}`,
    `Капитал: ${payload.capitalStructure || "—"}`,
    `Материалы: ${(payload.materials || []).join(", ") || "—"}`,
    `Фокус: ${payload.mainQuestion || "—"}`,
    `Письменный результат: ${payload.writtenResult ? "да" : "нет"}`,
    `Контакт: ${payload.contact.name || "—"}, tg ${payload.contact.telegram || "—"}, tel ${payload.contact.phone || "—"}, mail ${payload.contact.email || "—"}`,
  ];
  return {
    webhookPayload: payload,
    telegramText: lines.join("\n"),
    emailSubject: `CBI Entry Check: ${payload.resultType}`,
    emailBody: `${lines.join("\n")}\n\ncreatedAt: ${payload.createdAt}`,
  };
}

function showEntryResult() {
  const calc = calculateEntryScore(entryState);
  entryState.score = calc.score;
  entryState.resultType = calc.resultType;
  entryState.isResult = true;
  entryState.createdAt = new Date().toISOString();
  persistEntryState();
  const profile = ENTRY_CHECK_RESULTS[calc.resultType];
  if (!els.entryCheckResult || !els.entryCheckStep) return;
  els.entryCheckStep.classList.add("is-hidden");
  els.entryCheckResult.classList.remove("is-hidden");
  els.entryCheckResult.innerHTML = "";
  const title = document.createElement("h3");
  title.className = "entryCheck__resultTitle";
  title.textContent = profile.title;
  const text = document.createElement("p");
  text.className = "entryCheck__resultText";
  text.textContent = profile.text;
  const actions = document.createElement("div");
  actions.className = "entryCheck__resultActions";
  profile.actions.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      const payload = buildEntryPayload(entryState, calc);
      const delivery = buildDeliveryPayload(payload);
      try {
        navigator?.clipboard?.writeText?.(JSON.stringify(delivery.webhookPayload, null, 2)).catch(() => {});
      } catch {
        // ignore
      }
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/${TG_USERNAME}`)}&text=${encodeURIComponent(delivery.telegramText)}`;
      try {
        const a = document.createElement("a");
        a.href = shareUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        const popup = window.open(shareUrl, "_blank", "noopener,noreferrer");
        if (!popup) window.location.href = shareUrl;
      }
      resetEntryCheckAll();
    });
    actions.appendChild(btn);
  });

  const resetRow = document.createElement("div");
  resetRow.className = "entryCheck__resultReset";
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn btn--ghost";
  resetBtn.textContent = "Пройти заново";
  resetBtn.setAttribute("aria-label", "Очистить все ответы и начать диагностику заново");
  resetBtn.addEventListener("click", () => resetEntryCheckAll());
  resetRow.appendChild(resetBtn);

  els.entryCheckResult.append(title, text, actions, resetRow);
  setEntryProgress(getEntryFlow());
  if (els.entryCheckNext) els.entryCheckNext.classList.add("is-hidden");
  if (els.entryCheckSecondary) els.entryCheckSecondary.classList.add("is-hidden");
  if (els.entryCheckReset) els.entryCheckReset.classList.add("is-hidden");
}

function renderEntryStep() {
  if (!els.entryCheckStep || !els.entryCheckResult) return;
  const flow = getEntryFlow();
  const stepKey = flow[entryState.stepIndex] || "start";
  els.entryCheckResult.classList.add("is-hidden");
  els.entryCheckStep.classList.remove("is-hidden");
  els.entryCheckStep.innerHTML = "";

  const title = document.createElement("h3");
  title.className = "entryCheck__stepTitle";
  const hint = document.createElement("p");
  hint.className = "entryCheck__stepHint";

  if (stepKey === "start") {
    title.textContent = ENTRY_CHECK_TEXT.start.title;
    hint.textContent = ENTRY_CHECK_TEXT.start.hint;
  } else if (stepKey === "assetType") {
    title.textContent = ENTRY_CHECK_TEXT.assetType.title;
    hint.textContent = "Выберите один вариант.";
    els.entryCheckStep.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.assetType.options, entryState.answers.assetType, (value) => {
      entryState.answers.assetType = value;
      entryState.answers.assetChecks = [];
      persistEntryState();
      renderEntryStep();
    }));
  } else if (stepKey === "assetChecks") {
    title.textContent = "Профильные вводные по активу";
    hint.textContent = "Отметьте, что уже подтверждено.";
    const options = ENTRY_CHECK_ASSET_BRANCH[entryState.answers.assetType] || [];
    els.entryCheckStep.appendChild(renderMultiChoice(options, entryState.answers.assetChecks, (list) => {
      entryState.answers.assetChecks = list;
      persistEntryState();
      renderEntryStep();
    }));
  } else if (stepKey === "goal") {
    title.textContent = ENTRY_CHECK_TEXT.goal.title;
    hint.textContent = "Выберите один вариант.";
    els.entryCheckStep.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.goal.options, entryState.answers.goal, (value) => {
      entryState.answers.goal = value;
      persistEntryState();
      renderEntryStep();
    }));
  } else if (stepKey === "stageAndTime") {
    title.textContent = ENTRY_CHECK_TEXT.stageAndTime.title;
    hint.textContent = "Два параметра формируют приоритет проверки.";
    const dual = document.createElement("div");
    dual.className = "entryCheck__dual";
    const block1 = document.createElement("div");
    const block2 = document.createElement("div");
    block1.innerHTML = '<p class="entryCheck__blockTitle">На какой стадии вы сейчас?</p>';
    block2.innerHTML = '<p class="entryCheck__blockTitle">Когда нужно принять решение?</p>';
    block1.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.stageAndTime.stageOptions, entryState.answers.stage, (v) => {
      entryState.answers.stage = v;
      persistEntryState();
      renderEntryStep();
    }));
    block2.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.stageAndTime.timeOptions, entryState.answers.decisionTime, (v) => {
      entryState.answers.decisionTime = v;
      persistEntryState();
      renderEntryStep();
    }));
    dual.append(block1, block2);
    els.entryCheckStep.appendChild(dual);
  } else if (stepKey === "budgetAndCapital") {
    title.textContent = ENTRY_CHECK_TEXT.budgetAndCapital.title;
    hint.textContent = "Бюджет можно указать свободно.";
    const fields = document.createElement("div");
    fields.className = "entryCheck__fields";
    fields.innerHTML = `<label class="entryCheck__field"><span>Какой бюджет рассматривается?</span><input id="entryBudgetInput" type="text" placeholder="${ENTRY_CHECK_TEXT.budgetAndCapital.budgetPlaceholder}" value="${entryState.answers.budget || ""}" /></label>`;
    const capitalTitle = document.createElement("p");
    capitalTitle.className = "entryCheck__blockTitle";
    capitalTitle.textContent = "Как устроен капитал?";
    fields.appendChild(capitalTitle);
    fields.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.budgetAndCapital.capitalOptions, entryState.answers.capitalStructure, (v) => {
      entryState.answers.capitalStructure = v;
      persistEntryState();
      renderEntryStep();
    }));
    els.entryCheckStep.appendChild(fields);
    const budgetInput = fields.querySelector("#entryBudgetInput");
    budgetInput?.addEventListener("input", (e) => {
      entryState.answers.budget = e.target.value;
      persistEntryState();
    });
  } else if (stepKey === "materials") {
    title.textContent = ENTRY_CHECK_TEXT.materials.title;
    hint.textContent = ENTRY_CHECK_TEXT.materials.hint;
    els.entryCheckStep.appendChild(renderMultiChoice(ENTRY_CHECK_TEXT.materials.options, entryState.answers.materials, (list) => {
      entryState.answers.materials = list;
      persistEntryState();
      renderEntryStep();
    }));
  } else if (stepKey === "mainQuestion") {
    title.textContent = ENTRY_CHECK_TEXT.mainQuestion.title;
    hint.textContent = "Выберите один ключевой фокус.";
    els.entryCheckStep.appendChild(renderSingleChoice(ENTRY_CHECK_TEXT.mainQuestion.options, entryState.answers.mainQuestion, (v) => {
      entryState.answers.mainQuestion = v;
      persistEntryState();
      renderEntryStep();
    }));
  } else if (stepKey === "contacts") {
    title.textContent = "Контакты для результата";
    hint.textContent = "Укажите контактные данные и подтвердите условия.";
    const fields = document.createElement("div");
    fields.className = "entryCheck__fields";
    fields.innerHTML = `
      <label class="entryCheck__field"><span>Имя</span><input id="entryName" type="text" value="${entryState.answers.contact.name || ""}" /></label>
      <label class="entryCheck__field"><span>Telegram</span><input id="entryTelegram" type="text" value="${entryState.answers.contact.telegram || ""}" /></label>
      <label class="entryCheck__field"><span>Телефон</span><input id="entryPhone" type="text" value="${entryState.answers.contact.phone || ""}" /></label>
      <label class="entryCheck__field"><span>Email</span><input id="entryEmail" type="email" value="${entryState.answers.contact.email || ""}" /></label>
      <label class="consent__label" for="entryWritten"><input type="checkbox" id="entryWritten" ${entryState.answers.writtenResult ? "checked" : ""} /><span class="consent__text">Нужен письменный результат</span></label>
      <label class="consent__label" for="entryConsent"><input type="checkbox" id="entryConsent" ${entryState.answers.consent ? "checked" : ""} /><span class="consent__text">Согласен(на) с <a href="./privacy.html" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a> и <a href="./offer.html" target="_blank" rel="noopener noreferrer">офертой</a></span></label>
    `;
    els.entryCheckStep.appendChild(fields);
    [["entryName", "name"], ["entryTelegram", "telegram"], ["entryPhone", "phone"], ["entryEmail", "email"]].forEach(([id, key]) => {
      fields.querySelector(`#${id}`)?.addEventListener("input", (e) => {
        entryState.answers.contact[key] = e.target.value;
        persistEntryState();
      });
    });
    fields.querySelector("#entryWritten")?.addEventListener("change", (e) => {
      entryState.answers.writtenResult = e.target.checked;
      persistEntryState();
    });
    fields.querySelector("#entryConsent")?.addEventListener("change", (e) => {
      entryState.answers.consent = e.target.checked;
      persistEntryState();
    });
  }

  els.entryCheckStep.prepend(hint);
  els.entryCheckStep.prepend(title);

  setEntryProgress(flow);
  if (els.entryCheckBack) els.entryCheckBack.classList.toggle("is-hidden", entryState.stepIndex === 0 || entryState.isResult);
  if (els.entryCheckSecondary) els.entryCheckSecondary.classList.toggle("is-hidden", stepKey !== "start");
  if (els.entryCheckReset) els.entryCheckReset.classList.toggle("is-hidden", stepKey === "start" || entryState.isResult);
  if (els.entryCheckNext) {
    els.entryCheckNext.classList.remove("is-hidden");
    els.entryCheckNext.textContent = stepKey === "contacts" ? "Показать результат" : stepKey === "start" ? "Начать проверку" : "Далее";
  }
}

function moveEntryNext() {
  const flow = getEntryFlow();
  const stepKey = flow[entryState.stepIndex];
  if (!validateCurrentEntryStep(stepKey)) return;
  if (stepKey === "contacts") {
    return showEntryResult();
  }
  entryState.started = true;
  entryState.stepIndex = Math.min(entryState.stepIndex + 1, flow.length - 1);
  persistEntryState();
  animateStepSwap(renderEntryStep);
}

function moveEntryBack() {
  if (entryState.isResult) {
    entryState.isResult = false;
    persistEntryState();
    return renderEntryStep();
  }
  entryState.stepIndex = Math.max(entryState.stepIndex - 1, 0);
  persistEntryState();
  animateStepSwap(renderEntryStep);
}

function initEntryCheck() {
  if (!els.entryCheckRoot || !els.entryCheckStep) return;
  hydrateEntryState();
  renderEntryStep();
  els.entryCheckNext?.addEventListener("click", moveEntryNext);
  els.entryCheckBack?.addEventListener("click", moveEntryBack);
  els.entryCheckReset?.addEventListener("click", () => {
    const ok = window.confirm("Очистить все ответы и начать диагностику заново?");
    if (!ok) return;
    resetEntryCheckAll();
  });
  els.entryCheckSecondary?.addEventListener("click", () => {
    if (!els.entryCheckStep) return;
    const note = document.createElement("p");
    note.className = "entryCheck__inlineHint";
    note.textContent = "Оцениваются: документы, ограничения, расчёт, сценарии, устойчивость логики входа и цена ошибки.";
    els.entryCheckStep.appendChild(note);
    els.entryCheckSecondary?.classList.add("is-hidden");
  });
  window.CBIEntryCheck = {
    getPayload: () => buildEntryPayload(entryState, calculateEntryScore(entryState)),
    buildDeliveryPayload: () => buildDeliveryPayload(buildEntryPayload(entryState, calculateEntryScore(entryState))),
  };
}

function initTestimonialsReveal() {
  const cards = document.querySelectorAll("[data-testimonial]");
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return cards.forEach((el) => el.classList.add("testimonial-card--visible"));
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("testimonial-card--visible");
    io.unobserve(entry.target);
  }), { rootMargin: "0px 0px -6% 0px", threshold: 0.12 });
  cards.forEach((el) => io.observe(el));
}

function initRevealOnScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const sel = [".about-grid > .feature", ".about-grid--tight > .feature", ".fit-grid > .feature", ".servicesGrid > .serviceCard", ".objectsGrid--cases > .objectCard", ".method-steps > .method-step", ".faq__item", ".section-duo__aside", ".entryCheck__shell", ".cta-band__inner", ".agent__side > .sideCard"].join(", ");
  const nodes = document.querySelectorAll(sel);
  if (!nodes.length) return;
  nodes.forEach((el) => el.classList.add("reveal-scroll"));
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("reveal-scroll--in");
    io.unobserve(entry.target);
  }), { rootMargin: "0px 0px -4% 0px", threshold: 0.1 });
  nodes.forEach((el) => io.observe(el));
}

function init() {
  initEntryCheck();
  wireQuickButtons();
  wireForm();
  wireNewChat();
  hydrateFromStorageOrReset();
  initTestimonialsReveal();
  initRevealOnScroll();
}

init();
