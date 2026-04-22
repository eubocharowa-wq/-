/* eslint-disable no-use-before-define */

const LS_KEY = "cbi_screening_dialog_v4";
const TG_USERNAME = "CENTR_BIZNES_INVEST";
const COLLECT_KEYS = ["goal", "budget", "type", "typeDetail", "term", "docs"];

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

const QUESTION_FLOW = {
  goal: {
    stage: "Рамка задачи",
    question: "Какая цель вложения в приоритете?",
    options: [
      "Арендный доход",
      "Перепродажа",
      "Сохранение капитала",
      "Развитие проекта / девелопмент",
    ],
  },
  budget: {
    stage: "Рамка задачи",
    question: "Какой ориентир по бюджету и источнику средств?",
    options: [
      "До 10 млн, собственные средства",
      "10–30 млн, смешанный источник",
      "30+ млн, собственные средства",
      "Планирую кредитное плечо / ипотеку",
    ],
  },
  type: {
    stage: "Конструкция объекта",
    question: "Что именно рассматриваете и в какой локации?",
    options: [
      "Новостройка",
      "Коммерческая недвижимость",
      "Земля / строительство",
      "Проект развития / реконструкция",
    ],
  },
  term: {
    stage: "Сценарная проверка",
    question: "Какой горизонт решения или входа в сделку?",
    options: ["1–3 месяца", "3–6 месяцев", "6–12 месяцев", "12+ месяцев"],
  },
  docs: {
    stage: "Основание для рассмотрения",
    question: "Что уже есть из документов и исходных данных?",
    options: [
      "Есть базовый пакет документов",
      "Есть только презентация / описание",
      "Есть адрес, цена и исходные вводные",
      "Документов нет, нужна стартовая рамка",
    ],
  },
};

const TYPE_DETAIL_FLOW = {
  newbuild: {
    stage: "Конструкция объекта",
    question: "Что важнее всего по новостройке на первом этапе?",
    options: [
      "Надежность застройщика и сроки ввода",
      "Ликвидность и сценарий выхода",
      "Рост цены и конкуренция",
      "Юридическая чистота и ограничения",
    ],
  },
  commercial: {
    stage: "Конструкция объекта",
    question: "Что критично по коммерческой недвижимости?",
    options: [
      "Качество арендатора и ставка аренды",
      "Риск простоя и расходы",
      "Локация и трафик",
      "Потенциал дохода при смене арендатора",
    ],
  },
  land: {
    stage: "Конструкция объекта",
    question: "Что важно уточнить по земле/строительству?",
    options: [
      "Правовой статус и ограничения",
      "Сценарии использования участка",
      "Инфраструктура и логистика",
      "Инвестиционная емкость проекта",
    ],
  },
  development: {
    stage: "Конструкция объекта",
    question: "Что ключевое по проекту развития/реконструкции?",
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
  COLLECT_KEYS.forEach((key, idx) => {
    const box = boxes[idx];
    if (!box) return;
    box.checked = Boolean(state[key]);
  });
  updateChatProgress(state);
}

function getCollectedCount(currentState) {
  return COLLECT_KEYS.reduce((acc, key) => acc + (currentState[key] ? 1 : 0), 0);
}

function updateChatProgress(currentState) {
  if (!els.chatProgress) return;
  const count = getCollectedCount(currentState);
  els.chatProgress.textContent = `Собрано ${count}/${COLLECT_KEYS.length} параметров`;
  els.chatProgress.classList.remove("chatProgress--low", "chatProgress--mid", "chatProgress--ready");
  if (count >= 5) {
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

function detectTypeDetail(text, typeCategory) {
  const t = String(text || "").toLowerCase();
  if (!typeCategory) return false;
  if (typeCategory === "newbuild") {
    return /(застройщик|срок|ввод|ликвид|выход|рост|конкурен|ограничен|юрид)/i.test(t);
  }
  if (typeCategory === "commercial") {
    return /(арендатор|ставк|простой|расход|трафик|локац|доход)/i.test(t);
  }
  if (typeCategory === "land") {
    return /(правов|ограничен|использован|инфраструкт|логист|емкост|строитель)/i.test(t);
  }
  if (typeCategory === "development") {
    return /(этап|структур|уязвим|сценар|срок|модел|ограничен)/i.test(t);
  }
  return false;
}

function getTypeDetailFlow(typeCategory) {
  return TYPE_DETAIL_FLOW[typeCategory] || null;
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

function getCurrentStepKey() {
  if (!state.goal) return "goal";
  if (!state.budget) return "budget";
  if (!state.type) return "type";
  if (!state.typeDetail) return "typeDetail";
  if (!state.term) return "term";
  if (!state.docs) return "docs";
  return null;
}

function renderQuickOptions() {
  if (!els.quickWrap) return;
  const stepKey = getCurrentStepKey();
  const flow =
    stepKey === "typeDetail"
      ? getTypeDetailFlow(state.objectType)
      : stepKey
        ? QUESTION_FLOW[stepKey]
        : null;

  els.quickWrap.innerHTML = "";
  if (!flow) return;

  flow.options.forEach((option) => {
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
  goal: false,
  budget: false,
  type: false,
  typeDetail: false,
  term: false,
  docs: false,
  objectType: null,
  readyToSend: false,
  messages: [{ role: "bot", text: initialBotText }],
};

let state = { ...initialState };

function resetChat() {
  state = { ...initialState };

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

function detectGoal(text) {
  return /(цель|для себя|саможив|жить|аренд|инвест|перепродаж|доход|строительств|бизнес|глэмпинг|кемпинг|проект|сохранен|капитал)/i.test(
    text
  );
}

function detectBudget(text) {
  return /(бюджет|до\s*\d+(\s*\d+)?\s*млн|от\s*\d+(\s*\d+)?\s*млн|миллион|млн\s*руб|рубл|₽|наличн|ипотек|взнос|кредит)/i.test(
    text
  );
}

function detectType(text) {
  return /(новостро|жил|квартир|коммерц|офис|ритейл|склад|земл|участок|дом|коттедж|жк|строен|реконструкц|турист)/i.test(
    text
  );
}

function detectTerm(text) {
  return /(\bсрок(и|а|ов)?\b|горизонт|квартал|полугод|месяц(а|ев)?|недел(я|и|ь)|\b\d+\s*[-–]?\s*\d*\s*(мес|месяц|месяцев|год|года|лет)\b|\b\d+\s*(мес|месяц|месяцев|год|года|лет)\b|в\s*\d{4}\s*г|\b20(2[4-9]|3\d)\b|срочно|не срочно|как можно скорее|в ближайшее время|долгосрок|краткосрок)/i.test(
    text
  );
}

function detectDocs(text) {
  return /(документ|декларац|реестр|эскроу|выписк|егрн|право|собствен|материал|пока ничего|нет документ)/i.test(
    text
  );
}

function updateStateFromMessage(text) {
  const t = String(text || "");
  const detectedType = detectTypeCategory(t);
  if (detectedType && detectedType !== state.objectType) {
    state.objectType = detectedType;
    state.typeDetail = false;
  }
  if (detectGoal(t)) state.goal = true;
  if (detectBudget(t)) state.budget = true;
  if (detectType(t)) state.type = true;
  if (state.type && detectTypeDetail(t, state.objectType)) state.typeDetail = true;
  if (detectTerm(t)) state.term = true;
  if (detectDocs(t)) state.docs = true;
}

function isAllCollected() {
  return state.goal && state.budget && state.type && state.typeDetail && state.term && state.docs;
}

function nextQuestion() {
  if (!state.goal)
    return "какая цель: для себя, аренда, перепродажа, строительство, сохранение капитала или проект?";
  if (!state.budget)
    return "какой ориентир по бюджету и источнику средств (наличные, ипотека, смешанно)?";
  if (!state.type) return "что за объект или направление (жилая, коммерция, земля, новостройка и т.д.)?";
  if (!state.typeDetail) return "что для вас критично проверить по выбранному типу объекта?";
  if (!state.term) return "какие сроки важны: когда нужно принять решение или выйти на сделку?";
  if (!state.docs) return "какие документы уже есть (или чего пока нет)?";
  return "";
}

function getMissingFields() {
  const missing = [];
  if (!state.goal) missing.push("цель вложения");
  if (!state.budget) missing.push("бюджет и источник средств");
  if (!state.type) missing.push("тип объекта или проекта и локацию");
  if (!state.typeDetail) missing.push("критичный параметр по выбранному типу объекта");
  if (!state.term) missing.push("горизонт / сроки");
  if (!state.docs) missing.push("какие документы уже есть");
  return missing;
}

function generateBotReply(userText) {
  const text = String(userText || "").trim();
  const lower = text.toLowerCase();

  updateStateFromMessage(text);
  setChecklistState(state);

  const wantsDocs = /(документ|декларац|реестр|эскроу|проектн|провер|красн|флаг)/i.test(text);
  const wantsModel = /(модел|сценари|расчёт|цифр|дохо|арендн|окупаем)/i.test(text);
  const wantsScreening = /(скрининг|аудит|экспресс|один лот)/i.test(text);

  const reply = [];

  if (wantsDocs) {
    reply.push(
      "По документам в первую очередь смотрю право, обременения, разрешённое использование и цепочку сделок — в зависимости от типа актива. Для новостройки добавляются проектная декларация, эскроу и надёжность застройщика."
    );
    reply.push("Напишите, на какой стадии объект: поиск, бронь, уже есть выписка или договор?");
  }

  if (wantsModel) {
    reply.push(
      "Финмодель строю с явными допущениями: базовый и более осторожный сценарий, плюс чувствительность к ставке аренды или срокам. Доходность не гарантирую — показываю, при каких вводных картина держится, а при каких рассыпается."
    );
  }

  if (wantsScreening) {
    reply.push(
      "На первом этапе формируется короткий перечень рисков и данных, которые нужно запросить дальше. Итоговая позиция возможна после контакта и пакета исходных материалов."
    );
  }

  if (reply.length === 0 && /(привет|здравств|добрый)/i.test(lower)) {
    reply.push("Добрый день. Приняла запрос, уточним ключевые параметры для первичной оценки.");
  }

  if (!isAllCollected()) {
    const missing = getMissingFields();
    const stepKey = getCurrentStepKey();
    const flow =
      stepKey === "typeDetail"
        ? getTypeDetailFlow(state.objectType)
        : stepKey
          ? QUESTION_FLOW[stepKey]
          : null;
    state.readyToSend = false;
    if (reply.length === 0) {
      reply.push("Приняла запрос. Чтобы сформировать профессиональную позицию, уточним вводные по шагам.");
    }
    reply.push(`Нужно уточнить: ${missing.join(", ")}.`);
    if (flow) {
      reply.push(`${flow.stage}: ${flow.question}`);
      reply.push("Можно выбрать вариант кнопкой ниже или написать свой.");
    } else {
      reply.push(`Первый шаг: ${nextQuestion()}`);
    }
    return reply.join("\n\n");
  }

  state.readyToSend = true;
  reply.push(
    "По вводным картина складывается. На первом этапе можно сформировать предварительную позицию по качеству входа и ключевым ограничениям."
  );
  reply.push(getFinalTypeSummary(state.objectType));
  reply.push(
    "Следующий шаг — отправить заявку в Telegram, чтобы согласовать формат оценки, приоритетные вопросы и список документов."
  );
  reply.push("Если всё верно, нажмите кнопку «Отправить в Telegram».");

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
  const userMsgs = (state.messages || [])
    .filter((m) => m.role === "user" && String(m.text || "").trim())
    .map((m, i) => `${i + 1}. ${String(m.text).trim()}`);
  const dialogPart = userMsgs.length
    ? `Что уже указано в заявке:\n${userMsgs.join("\n")}\n\n`
    : "";
  const finalPart = payload ? `Последнее уточнение:\n${payload}` : "";
  const fullText = `${intro}${typeSummary}${dialogPart}${finalPart}`.trim();
  const url = `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(fullText)}`;
  window.open(url, "_blank", "noopener,noreferrer");
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
      if (state.readyToSend) openTelegramWithMessage(trimmed);
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

  state = { ...initialState, ...saved };
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
