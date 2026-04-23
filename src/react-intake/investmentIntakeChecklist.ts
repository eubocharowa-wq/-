import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";

export type Checklist = { collect: string[]; verify: string[] };

function trimToTotal(c: Checklist, minTotal = 5, maxTotal = 7): Checklist {
  let collect = [...c.collect];
  let verify = [...c.verify];
  while (collect.length + verify.length > maxTotal) {
    if (collect.length >= verify.length && collect.length > 1) collect.pop();
    else if (verify.length > 1) verify.pop();
    else break;
  }
  const fillersCollect = [
    "Критерий «да / нет» после первого экрана вводных",
    "Список допущений, которые нельзя оставить неявными",
  ];
  const fillersVerify = [
    "Перекрёстная проверка: право ↔ экономика ↔ сроки",
    "Список вопросов, ответы на которые меняют решение",
  ];
  let i = 0;
  let j = 0;
  let guard = 0;
  while (collect.length + verify.length < minTotal && guard < 24) {
    guard += 1;
    if (collect.length <= verify.length) {
      collect.push(fillersCollect[i % fillersCollect.length]);
      i += 1;
    } else {
      verify.push(fillersVerify[j % fillersVerify.length]);
      j += 1;
    }
  }
  return { collect, verify };
}

function baseByAsset(asset: string | null): { collect: string[]; verify: string[] } {
  switch (asset) {
    case "Земельный участок":
      return {
        collect: ["Выписка ЕГРН", "Сведения о ВРИ", "ПЗЗ / ГПЗУ (если применимо)", "Схема границ / межевание"],
        verify: ["Ограничения и обременения", "Коммуникации и подъездность", "Сценарий использования и допущения"],
      };
    case "Коммерческую недвижимость":
      return {
        collect: ["Адрес и паспорт объекта", "Арендатор и ставка (если есть)", "Договор аренды или LOI", "OPEX / CAPEX вводные"],
        verify: ["Срок и условия договора", "Риск простоя и конкуренция", "Ограничения по назначению и эксплуатации"],
      };
    case "Новостройку":
      return {
        collect: ["Проектная декларация / ключевые документы", "Условия бронирования", "Понимание лота и очереди"],
        verify: ["Цена входа и допущения по выходу", "Сроки и стадия строительства", "Конкуренты и альтернативы"],
      };
    case "Проект развития":
      return {
        collect: ["Концепция и границы проекта", "Стадия и план этапности", "Форма участия и роли сторон"],
        verify: ["Ключевая инвестиционная гипотеза", "Ограничения: право, инфраструктура, сроки", "Сценарии при неблагоприятных допущениях"],
      };
    case "Несколько вариантов":
      return {
        collect: ["Сопоставимая таблица вводных по каждому варианту", "Единые критерии сравнения", "Что подтверждено документами"],
        verify: ["Ограничения по каждому варианту", "Сценарии выхода или удержания", "Цена ошибки и чувствительность модели"],
      };
    default:
      return {
        collect: ["Короткое описание объекта или проекта", "Локация и ключевые допущения", "Что уже есть из материалов"],
        verify: ["Ограничения, которые могут закрыть сделку", "Базовый и запасной сценарий", "Что должно быть доказано до капитала"],
      };
  }
}

export function buildChecklist(a: IntakeAnswers, route: RouteId): Checklist {
  const base = baseByAsset(a.asset);

  const early =
    a.materials === "Пока только идея" ||
    a.materials === "Есть ссылка или адрес" ||
    a.horizon === "Пока без жёсткого срока";

  const heavyVerify =
    route === "complex" ||
    route === "project" ||
    a.materials === "Есть документы" ||
    a.materials === "Есть несколько материалов для сравнения";

  let collect = [...base.collect];
  let verify = [...base.verify];

  if (early) {
    collect.unshift("Формулировка задачи одним абзацем", "Сроки и «красные линии», которые нельзя нарушить");
  }

  if (a.focus === "Документы и ограничения") {
    verify.unshift("Матрица документов: что подтверждает право, что — экономику");
  }
  if (a.focus === "Устойчивость дохода") {
    verify.unshift("Допущения по доходу: база, стресс, пессимизм");
  }
  if (a.focus === "Реальный сценарий выхода") {
    verify.unshift("Ликвидность и альтернативы выхода");
  }

  if (heavyVerify) {
    verify.push("Список вопросов, ответы на которые меняют решение");
  } else {
    collect.push("Список недостающих документов и источник получения");
  }

  if (early && collect.length < verify.length) {
    collect.push("Критерий продолжения работы после первого экрана вводных");
  }
  if (!early && verify.length < collect.length) {
    verify.push("Проверка согласованности: право ↔ экономика ↔ сроки");
  }

  return trimToTotal({ collect, verify });
}
