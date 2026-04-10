/* eslint-disable no-use-before-define */

const LS_KEY = "cbi_screening_demo_v2";

const els = {
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  btnNewChat: document.getElementById("btnNewChat"),
  checklist: document.getElementById("checklist"),
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
  return Array.from(els.checklist.querySelectorAll('input[type="checkbox"]'));
}

function setChecklistState(state) {
  const boxes = getChecklistCheckboxes();
  const order = ["goal", "budget", "type", "term", "docs"];
  order.forEach((key, idx) => {
    const box = boxes[idx];
    if (!box) return;
    box.checked = Boolean(state[key]);
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

function calcMortgage() {
  if (!els.mortgageMonthly || !els.mortgageOverpayment || !els.mortgageTotal) return;

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
  calcMortgage();
}

const initialBotText =
  "Здравствуйте. Опишите задачу: объект, цель, бюджет и что хотите понять.";

const initialState = {
  goal: false,
  budget: false,
  type: false,
  term: false,
  docs: false,
  messages: [{ role: "bot", text: initialBotText }],
};

let state = { ...initialState };

function resetChat() {
  state = { ...initialState };

  els.chatLog.innerHTML = "";
  state.messages.forEach((m) => {
    els.chatLog.appendChild(createMsg(m.role, m.text));
  });

  setChecklistState(state);
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
  return /(срок|горизонт|квартал|год\s*\d{4}|202[4-9]|203\d|месяц|срочно|не срочно)/i.test(text);
}

function detectDocs(text) {
  return /(документ|декларац|реестр|эскроу|выписк|егрн|право|собствен|материал|пока ничего|нет документ)/i.test(
    text
  );
}

function updateStateFromMessage(text) {
  const t = String(text || "");
  if (detectGoal(t)) state.goal = true;
  if (detectBudget(t)) state.budget = true;
  if (detectType(t)) state.type = true;
  if (detectTerm(t)) state.term = true;
  if (detectDocs(t)) state.docs = true;
}

function isAllCollected() {
  return state.goal && state.budget && state.type && state.term && state.docs;
}

function nextQuestion() {
  if (!state.goal)
    return "какая цель: для себя, аренда, перепродажа, строительство, сохранение капитала или проект?";
  if (!state.budget)
    return "какой ориентир по бюджету и источнику средств (наличные, ипотека, смешанно)?";
  if (!state.type) return "что за объект или направление (жилая, коммерция, земля, новостройка и т.д.)?";
  if (!state.term) return "какие сроки важны: когда нужно принять решение или выйти на сделку?";
  if (!state.docs) return "какие документы уже есть (или чего пока нет)?";
  return "";
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
      "Скрининг в реальной работе — это короткий список рисков и «что запросить дальше». В демо я только направляю мысль; итог возможен после ваших контактов и пакета данных."
    );
  }

  if (reply.length === 0) {
    if (/(привет|здравств|добрый)/i.test(lower)) {
      reply.push("Добрый день. Опишите задачу — постараюсь задать точечные вопросы.");
    } else {
      reply.push("Приняла запрос. Дальше — уточнения, чтобы не гадать вслепую.");
    }
  }

  if (!isAllCollected()) {
    reply.push(`Уточним: ${nextQuestion()}`);
  } else {
    reply.push(
      "По вводным картина складывается. В рабочем формате следующий шаг — короткий звонок или переписка в Telegram: согласуем формат (скрининг, аудит, консультация) и список документов."
    );
    reply.push("Если есть один приоритетный лот — пришлите, что уже знаете: адрес или кадастр, цена, статус объекта.");
  }

  return reply.join("\n\n");
}

function addAndPersistMessage(role, text) {
  state.messages.push({ role, text });
  els.chatLog.appendChild(createMsg(role, text));
  scrollChatToBottom();
  saveToStorage(state);
}

async function handleUserMessage(text) {
  if (!text.trim()) return;

  addAndPersistMessage("user", text.trim());

  const typingEl = showTyping();
  await new Promise((r) => setTimeout(r, 650));
  typingEl.remove();

  const botText = generateBotReply(text);
  addAndPersistMessage("bot", botText);
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

  document.querySelectorAll(".quick[data-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.getAttribute("data-quick") || "";
      els.chatInput.value = v;
      els.chatInput.focus();
    });
  });
}

function wireForm() {
  els.chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const value = els.chatInput.value || "";
    els.chatInput.value = "";

    els.chatInput.disabled = true;
    els.chatForm.querySelector("button[type='submit']").disabled = true;
    try {
      await handleUserMessage(value);
    } finally {
      els.chatInput.disabled = false;
      els.chatForm.querySelector("button[type='submit']").disabled = false;
      els.chatInput.focus();
    }
  });
}

function hydrateFromStorageOrReset() {
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
  scrollChatToBottom();
}

function wireNewChat() {
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
    ".hero-reflash__trust-grid > .hero-reflash__trust-card",
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
