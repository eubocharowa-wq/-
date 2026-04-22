/* eslint-disable no-use-before-define */

const LS_KEY = "cbi_screening_dialog_v5";
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
  mortgageConsent: document.getElementById("mortgageConsent"),
  mortgageCalcFields: document.getElementById("mortgageCalcFields"),
  mortgageProgramToggle: document.getElementById("mortgageProgramToggle"),
  mortgageProgramName: document.getElementById("mortgageProgramName"),
  mortgageProgramMeta: document.getElementById("mortgageProgramMeta"),
  mortgageProgramNote: document.getElementById("mortgageProgramNote"),
  mortgageAmount: document.getElementById("mortgageAmount"),
  mortgageDownPayment: document.getElementById("mortgageDownPayment"),
  mortgageRate: document.getElementById("mortgageRate"),
  mortgageYears: document.getElementById("mortgageYears"),
  mortgageMonthly: document.getElementById("mortgageMonthly"),
  mortgageOverpayment: document.getElementById("mortgageOverpayment"),
  mortgageTotal: document.getElementById("mortgageTotal"),
};

const FLOW_STEPS = [
  {
    key: "goal",
    stage: "Рамка задачи",
    question: "Какая цель вложения в приоритете?",
    options: ["Арендный доход", "Перепродажа", "Сохранение капитала", "Развитие проекта / девелопмент"],
  },
  {
    key: "budget",
    stage: "Рамка задачи",
    question: "Какой ориентир по бюджету и источнику средств?",
    options: [
      "До 10 млн, собственные средства",
      "10–30 млн, смешанный источник",
      "30+ млн, собственные средства",
      "Планирую кредитное плечо / ипотеку",
    ],
  },
  {
    key: "type",
    stage: "Конструкция объекта",
    question: "Что рассматриваете сейчас?",
    options: ["Новостройка", "Коммерческая недвижимость", "Земля / строительство", "Проект развития / реконструкция"],
  },
  {
    key: "typeDetail",
    stage: "Конструкция объекта",
    question: "Что критично проверить по выбранному типу объекта?",
    options: [],
  },
  {
    key: "term",
    stage: "Сценарная проверка",
    question: "Какой горизонт решения или входа в сделку?",
    options: ["1–3 месяца", "3–6 месяцев", "6–12 месяцев", "12+ месяцев"],
  },
  {
    key: "docs",
    stage: "Основание для рассмотрения",
    question: "Что уже есть из документов и исходных данных?",
    options: [
      "Есть базовый пакет документов",
      "Есть адрес, цена и исходные вводные",
      "Есть только презентация / описание",
      "Документов пока нет",
    ],
  },
  {
    key: "mainQuestion",
    stage: "Основание для рассмотрения",
    question: "Какой главный вопрос нужно закрыть до решения?",
    options: [
      "Есть ли основание входить сейчас",
      "Где ключевые ограничения и риски",
      "Насколько устойчива модель в сценариях",
      "Что критично уточнить перед сделкой",
    ],
  },
];

const TYPE_DETAIL_OPTIONS = {
  newbuild: {
    options: [
      "Надежность застройщика и сроки ввода",
      "Ликвидность и сценарий выхода",
      "Рост цены и конкуренция",
      "Юридическая чистота и ограничения",
    ],
  },
  commercial: {
    options: [
      "Качество арендатора и ставка аренды",
      "Риск простоя и расходы",
      "Локация и трафик",
      "Потенциал дохода при смене арендатора",
    ],
  },
  land: {
    options: [
      "Правовой статус и ограничения",
      "Сценарии использования участка",
      "Инфраструктура и логистика",
      "Инвестиционная емкость проекта",
    ],
  },
  development: {
    options: [
      "Структура и этапность проекта",
      "Ограничения и уязвимости",
      "Сценарий реализации и сроки",
      "Устойчивость инвестиционной модели",
    ],
  },
};

const mortgagePrograms = [
  {
    short: "Новостройка",
    name: "Ипотека на новостройку",
    meta: "Иллюстративный сценарий · параметры можно менять вручную",
    note: "Расчёт служит ориентиром. Фактические условия зависят от банка, программы и объекта.",
    rate: 11.8,
  },
  {
    short: "Вторичка",
    name: "Ипотека на вторичное жильё",
    meta: "Иллюстративный сценарий · параметры можно менять вручную",
    note: "Расчёт служит ориентиром. Фактические условия зависят от банка, программы и объекта.",
    rate: 13.4,
  },
  {
    short: "Семейная",
    name: "Семейная ипотека",
    meta: "Иллюстративный сценарий · параметры можно менять вручную",
    note: "Расчёт служит ориентиром. Фактические условия зависят от банка, программы и объекта.",
    rate: 6,
  },
];

let mortgageProgramIndex = 0;

function scrollChatToBottom() {
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

function setChecklistState(state) {
  const boxes = getChecklistCheckboxes();
  ["goal", "budget", "type", "term", "docs"].forEach((key, idx) => {
    const box = boxes[idx];
    if (!box) return;
    box.checked = Boolean(state.answers[key]);
  });
  updateChatProgress(state);
}

function getCollectedCount(currentState) {
  return REQUIRED_KEYS.reduce((acc, key) => acc + (currentState.answers[key] ? 1 : 0), 0);
}

function updateChatProgress(currentState) {
  if (!els.chatProgress) return;
  const count = getCollectedCount(currentState);
  els.chatProgress.textContent = `Собрано ${count}/${REQUIRED_KEYS.length} параметров`;
  els.chatProgress.classList.remove("chatProgress--low", "chatProgress--mid", "chatProgress--ready");
  if (count >= REQUIRED_KEYS.length) {
    els.chatProgress.classList.add("chatProgress--ready");
  } else if (count >= 3) {
    els.chatProgress.classList.add("chatProgress--mid");
  } else {
    els.chatProgress.classList.add("chatProgress--low");
  }
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
  if (typeCategory === "newbuild") {
    return "Фокус по новостройке: надежность застройщика, сроки ввода, ликвидность и реалистичный сценарий выхода.";
  }
  if (typeCategory === "commercial") {
    return "Фокус по коммерции: устойчивость аренды, риск простоя, операционные расходы и качество локации.";
  }
  if (typeCategory === "land") {
    return "Фокус по земле/строительству: правовой статус, ограничения, сценарий использования и инвестиционная емкость.";
  }
  if (typeCategory === "development") {
    return "Фокус по развитию/реконструкции: этапность, ключевые ограничения, уязвимости и устойчивость модели реализации.";
  }
  return "Фокус первичной оценки: качество входа, ограничения, сценарии и основание для следующего шага.";
}

function buildStructuredSummary() {
  const a = state.answers || {};
  return [
    `1) Цель вложения: ${a.goal || "—"}`,
    `2) Бюджет / источник: ${a.budget || "—"}`,
    `3) Формат объекта: ${a.type || "—"}`,
    `4) Критичный параметр: ${a.typeDetail || "—"}`,
    `5) Горизонт: ${a.term || "—"}`,
    `6) Документы / исходные данные: ${a.docs || "—"}`,
    `7) Главный вопрос: ${a.mainQuestion || "—"}`,
  ].join("\n");
}

function getCurrentStep() {
  return FLOW_STEPS[state.stepIndex] || null;
}

function renderQuickOptions() {
  if (!els.quickWrap) return;
  const step = getCurrentStep();
  let options = step?.options || [];
  if (step?.key === "typeDetail") {
    options = getTypeDetailOptions(state.objectType);
  }

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
  const wrap = document.createElement("div");
  wrap.className = "msg msg--bot";

  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.textContent = "Формирую ответ…";

  wrap.appendChild(bubble);
  if (!els.chatLog) return wrap;
  els.chatLog.appendChild(wrap);
  scrollChatToBottom();
  return wrap;
}

function saveToStorage(payload) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage issues
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function renderMortgageProgram() {
  const program = mortgagePrograms[mortgageProgramIndex];
  if (!program) return;

  if (els.mortgageProgramName) els.mortgageProgramName.textContent = program.name;
  if (els.mortgageProgramMeta) els.mortgageProgramMeta.textContent = program.meta;
  if (els.mortgageProgramNote) els.mortgageProgramNote.textContent = program.note;
  if (els.mortgageProgramToggle) {
    els.mortgageProgramToggle.textContent = `Сценарий: ${program.short}`;
  }
  if (els.mortgageRate) {
    els.mortgageRate.value = String(program.rate);
  }
  calcMortgage();
}

function wireMortgageProgramToggle() {
  renderMortgageProgram();
  if (!els.mortgageProgramToggle) return;

  els.mortgageProgramToggle.addEventListener("click", () => {
    mortgageProgramIndex = (mortgageProgramIndex + 1) % mortgagePrograms.length;
    renderMortgageProgram();
  });
}

function formatRub(value) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function getPositiveNumber(inputEl) {
  if (!inputEl) return 0;
  const num = Number(inputEl.value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

function setMortgageResultsDash() {
  if (!els.mortgageMonthly || !els.mortgageOverpayment || !els.mortgageTotal) return;
  els.mortgageMonthly.textContent = "—";
  els.mortgageOverpayment.textContent = "—";
  els.mortgageTotal.textContent = "—";
}

function isMortgageConsentOk() {
  return Boolean(els.mortgageConsent?.checked);
}

function calcMortgage() {
  if (!els.mortgageMonthly || !els.mortgageOverpayment || !els.mortgageTotal) return;

  if (!isMortgageConsentOk()) {
    setMortgageResultsDash();
    return;
  }

  const amount = getPositiveNumber(els.mortgageAmount);
  const downPayment = getPositiveNumber(els.mortgageDownPayment);
  const rateYear = getPositiveNumber(els.mortgageRate);
  const years = getPositiveNumber(els.mortgageYears);

  const principal = Math.max(0, amount - downPayment);
  const months = Math.round(years * 12);
  const monthlyRate = rateYear / 100 / 12;

  if (principal <= 0 || months <= 0) {
    els.mortgageMonthly.textContent = "0 ₽";
    els.mortgageOverpayment.textContent = "0 ₽";
    els.mortgageTotal.textContent = "0 ₽";
    return;
  }

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    const factor = (1 + monthlyRate) ** months;
    monthlyPayment = principal * ((monthlyRate * factor) / (factor - 1));
  }

  const totalPayment = monthlyPayment * months;
  const overpayment = Math.max(0, totalPayment - principal);

  els.mortgageMonthly.textContent = formatRub(monthlyPayment);
  els.mortgageOverpayment.textContent = formatRub(overpayment);
  els.mortgageTotal.textContent = formatRub(totalPayment);
}

function wireMortgageCalculator() {
  const fields = [els.mortgageAmount, els.mortgageDownPayment, els.mortgageRate, els.mortgageYears];
  fields.forEach((field) => {
    if (!field) return;
    field.addEventListener("input", calcMortgage);
  });

  if (els.mortgageConsent) {
    const syncMortgageFieldsDisabled = () => {
      if (els.mortgageCalcFields) els.mortgageCalcFields.disabled = !els.mortgageConsent.checked;
      if (els.mortgageConsent.checked) calcMortgage();
      else setMortgageResultsDash();
    };
    els.mortgageConsent.addEventListener("change", syncMortgageFieldsDisabled);
    syncMortgageFieldsDisabled();
  } else {
    calcMortgage();
  }
}

const initialBotText =
  "Укажите объект или проект, цель вложения, бюджет, горизонт и что требуется оценить до решения. Пройдём по шагам и после этого отправим заявку в Telegram.";

const initialState = {
  stepIndex: 0,
  answers: {},
  objectType: null,
  readyToSend: false,
  messages: [{ role: "bot", text: initialBotText }],
};

let state = { ...initialState };

function normalizeStateShape(rawState) {
  const base = { ...initialState, ...rawState };
  const answers = typeof base.answers === "object" && base.answers ? { ...base.answers } : {};
  const fallbackKeys = ["goal", "budget", "type", "typeDetail", "term", "docs", "mainQuestion"];
  fallbackKeys.forEach((key) => {
    if (!answers[key] && typeof base[key] === "string" && base[key].trim()) {
      answers[key] = base[key].trim();
    }
  });

  const normalized = {
    ...initialState,
    ...base,
    answers,
    stepIndex: Number.isInteger(base.stepIndex) ? base.stepIndex : 0,
    readyToSend: Boolean(base.readyToSend),
    objectType: base.objectType || detectTypeCategory(answers.type || "") || null,
  };

  while (normalized.stepIndex < FLOW_STEPS.length && normalized.answers[FLOW_STEPS[normalized.stepIndex].key]) {
    normalized.stepIndex += 1;
  }
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
  state.messages.forEach((m) => {
    els.chatLog.appendChild(createMsg(m.role, m.text));
  });

  setChecklistState(state);
  renderQuickOptions();
  syncChatSubmitBtn();
  scrollChatToBottom();
  saveToStorage(state);
}

function isAllCollected() {
  return REQUIRED_KEYS.every((key) => Boolean(state.answers[key]));
}

function getCurrentFlowQuestion() {
  const step = getCurrentStep();
  if (!step) return null;
  if (step.key !== "typeDetail") return step;
  return {
    ...step,
    options: getTypeDetailOptions(state.objectType),
  };
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
  const text = String(userText || "").trim();
  const answered = setAnswerForCurrentStep(text);
  setChecklistState(state);
  const reply = [];

  if (answered?.step?.key) {
    reply.push(`Принято: ${getStepLabel(answered.step.key)} — ${answered.value}.`);
  }

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
  els.chatLog.appendChild(createMsg(role, text));
  scrollChatToBottom();
  renderQuickOptions();
  syncChatSubmitBtn();
  saveToStorage(state);
}

async function handleUserMessage(text) {
  if (!text.trim()) return;

  addAndPersistMessage("user", text.trim());

  const typingEl = showTyping();
  await new Promise((r) => setTimeout(r, 420));
  typingEl.remove();

  const botText = generateBotReply(text);
  addAndPersistMessage("bot", botText);
}

function openTelegramWithMessage(userText) {
  const payload = String(userText || "").trim();
  const intro =
    `Здравствуйте. Запрос на первичную оценку.\nТип запроса: ${getTypeLabel(state.objectType)}.\n\n`;
  const typeSummary = `Приоритет первичного этапа: ${getFinalTypeSummary(state.objectType)}\n\n`;
  const structured = buildStructuredSummary();
  const payloadPart = payload ? `\n\nДополнение клиента:\n${payload}` : "";
  const fullText = `${intro}${typeSummary}Собранные вводные:\n${structured}${payloadPart}`.trim();
  const confirmText =
    "Заявка подготовлена: текст скопирован, открываю Telegram. Если сообщение не вставилось автоматически, вставьте его из буфера обмена.";
  if (els.chatLog) {
    els.chatLog.appendChild(createMsg("bot", confirmText));
    scrollChatToBottom();
  }
  state.messages.push({ role: "bot", text: confirmText });
  saveToStorage(state);

  try {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
  } catch {
    // ignore clipboard issues
  }

  // Открываем Telegram c предзаполненным текстом.
  const chatUrl = `https://t.me/${TG_USERNAME}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(chatUrl)}&text=${encodeURIComponent(fullText)}`;
  const popup = window.open(shareUrl, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.href = shareUrl;
  }
}

function wireQuickButtons() {
  document.querySelectorAll(".chip[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.getAttribute("data-chip") || "";
      els.chatInput.value = v;
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
  if (els.chatReadyBadge) {
    els.chatReadyBadge.classList.toggle("is-hidden", !state.readyToSend);
  }
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
        els.chatConsentHint.textContent =
          "Отметьте согласие с политикой конфиденциальности и офертой, чтобы отправить сообщение.";
      }
      els.chatConsent?.focus();
      return;
    }

    if (els.chatConsentHint) {
      els.chatConsentHint.hidden = true;
      els.chatConsentHint.textContent = "";
    }

    const value = els.chatInput.value || "";
    const trimmed = value.trim();

    if (!trimmed && !state.readyToSend) {
      els.chatInput.focus();
      return;
    }

    if (state.readyToSend && !trimmed) {
      openTelegramWithMessage("");
      return;
    }

    els.chatInput.value = "";

    const submitBtn = els.chatSubmitBtn || els.chatForm.querySelector("button[type='submit']");
    els.chatInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    try {
      await handleUserMessage(trimmed);
    } finally {
      els.chatInput.disabled = false;
      syncChatSubmitBtn();
      els.chatInput.focus();
    }
  });
}

function hydrateFromStorageOrReset() {
  if (!els.chatLog) return;

  const saved = loadFromStorage();
  if (!saved || !saved.messages || !Array.isArray(saved.messages)) {
    resetChat();
    return;
  }

  state = normalizeStateShape(saved);
  els.chatLog.innerHTML = "";
  state.messages.forEach((m) => {
    const role = m.role === "user" ? "user" : "bot";
    els.chatLog.appendChild(createMsg(role, m.text || ""));
  });
  setChecklistState(state);
  renderQuickOptions();
  syncChatSubmitBtn();
  scrollChatToBottom();
}

function wireNewChat() {
  if (!els.btnNewChat) return;
  els.btnNewChat.addEventListener("click", () => resetChat());
}

function initTestimonialsReveal() {
  const cards = document.querySelectorAll("[data-testimonial]");
  if (!cards.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach((el) => el.classList.add("testimonial-card--visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("testimonial-card--visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
  );

  cards.forEach((el) => io.observe(el));
}

function initRevealOnScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const sel = [
    ".about-grid > .feature",
    ".about-grid--tight > .feature",
    ".fit-grid > .feature",
    ".servicesGrid > .serviceCard",
    ".objectsGrid--cases > .objectCard",
    ".method-steps > .method-step",
    ".faq__item",
    ".section-duo__aside",
    ".mortgageCalc",
    "#mortgageProgramCard.mortgageProgramCard",
    ".cta-band__inner",
    ".agent__side > .sideCard",
  ].join(", ");

  const nodes = document.querySelectorAll(sel);
  if (!nodes.length) return;

  nodes.forEach((el) => el.classList.add("reveal-scroll"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-scroll--in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.1 }
  );

  nodes.forEach((el) => io.observe(el));

  requestAnimationFrame(() => {
    nodes.forEach((el) => {
      if (el.classList.contains("reveal-scroll--in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add("reveal-scroll--in");
        io.unobserve(el);
      }
    });
  });
}

function init() {
  wireMortgageProgramToggle();
  wireMortgageCalculator();
  wireQuickButtons();
  wireForm();
  wireNewChat();
  hydrateFromStorageOrReset();
  initTestimonialsReveal();
  initRevealOnScroll();
}

init();
