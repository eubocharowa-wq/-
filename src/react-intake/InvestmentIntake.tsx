import React, { useMemo, useState } from "react";
import { INTAKE_STEPS, LIVE_LABELS, type IntakeAnswers, type RouteId } from "./investmentIntakeConfig";
import { buildChecklist } from "./investmentIntakeChecklist";
import { resolveRoute } from "./investmentIntakeRouting";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";
import { openTelegramWithIntakeText } from "./investmentIntakeTelegram";
import { downloadChecklistFile } from "./investmentIntakeDownload";

type Phase = "intro" | "steps" | "result";

const emptyAnswers: IntakeAnswers = {
  asset: null,
  task: null,
  horizon: null,
  focus: null,
  materials: null,
  output: null,
};

export type InvestmentIntakeProps = {
  className?: string;
};

export function InvestmentIntake({ className }: InvestmentIntakeProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>(emptyAnswers);
  const [dir, setDir] = useState<1 | -1>(1);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingShareUrl, setPendingShareUrl] = useState<string | null>(null);

  const currentStep = INTAKE_STEPS[step];
  const route = useMemo(() => resolveRoute(answers), [answers]);
  const checklist = useMemo(() => buildChecklist(answers, route.id), [answers, route.id]);
  const summary = useMemo(() => buildRequestSummary(answers), [answers]);
  const reality = useMemo(() => buyingReality(answers.asset), [answers.asset]);

  function pick(value: string) {
    if (!currentStep) return;
    setDir(1);
    setAnswers((prev) => ({ ...prev, [currentStep.key]: value }));
    if (step < INTAKE_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("result");
    }
  }

  function goBack() {
    if (step === 0) {
      setPhase("intro");
      setAnswers(emptyAnswers);
      return;
    }
    setDir(-1);
    const prevKey = INTAKE_STEPS[step - 1].key;
    setAnswers((prev) => ({ ...prev, [prevKey]: null }));
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setPhase("intro");
    setStep(0);
    setAnswers(emptyAnswers);
    setDir(1);
  }

  const progress = phase === "steps" ? ((step + 1) / INTAKE_STEPS.length) * 100 : phase === "result" ? 100 : 0;

  const liveItems = useMemo(
    () => [
      { label: LIVE_LABELS.asset, value: answers.asset || "—" },
      { label: LIVE_LABELS.task, value: answers.task || "—" },
      { label: LIVE_LABELS.horizon, value: answers.horizon || "—" },
      { label: LIVE_LABELS.focus, value: answers.focus || "—" },
      { label: LIVE_LABELS.materials, value: answers.materials || "—" },
      { label: LIVE_LABELS.output, value: answers.output || "—" },
    ],
    [answers]
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 4500);
  }

  function handleCta(id: "checklist" | "submit_object" | "next_step") {
    if (id === "checklist") {
      try {
        downloadChecklistFile(answers, route.id, checklist);
        showToast("Чек-лист скачан в формате .md");
      } catch (err) {
        console.error("checklist download failed", err);
        showToast("Не удалось скачать файл. Проверьте настройки браузера.");
      }
      return;
    }
    const labels: Record<"submit_object" | "next_step", string> = {
      submit_object: "Передать объект на проверку",
      next_step: "Узнать следующий шаг",
    };
    const result = openTelegramWithIntakeText(labels[id], answers, route.id, checklist);
    if (result.opened) {
      setPendingShareUrl(result.chatUrl);
      showToast(
        result.copied
          ? "Открываем Telegram — текст уже в буфере обмена, вставьте его в чат."
          : "Открываем Telegram. Если вкладка не открылась — воспользуйтесь ссылкой ниже."
      );
    } else {
      setPendingShareUrl(result.chatUrl);
      showToast("Не удалось открыть Telegram автоматически. Откройте чат по ссылке ниже.");
    }
  }

  return (
    <section
      className={`investment-intake ${className ?? ""}`.trim()}
      aria-labelledby="investment-intake-title"
    >
      <div className="investment-intake__inner">
        <header className="investment-intake__header">
          <p className="investment-intake__eyebrow">Не продаю — отбираю</p>
          <h2 id="investment-intake-title" className="investment-intake__title">
            Соберите свой инвестиционный запрос
          </h2>
          <p className="investment-intake__subtitle">
            За 2 минуты выстроим рамку вашей задачи и покажем, что стоит проверить в первую очередь.
          </p>
          <p className="investment-intake__note">На выходе вы получите персональный чек-лист под свой запрос.</p>
        </header>

        {phase === "intro" && (
          <div className="investment-intake__intro">
            <button type="button" className="investment-intake__cta" onClick={() => setPhase("steps")}>
              Собрать запрос
            </button>
            <p className="investment-intake__microcopy">
              Сначала задача, ограничения, документы, расчёт и сценарии — потом решение о капитале. Без обещаний доходности:
              только рамка и проверяемые вопросы.
            </p>
          </div>
        )}

        {(phase === "steps" || phase === "result") && (
          <>
            <div className="investment-intake__progress" role="group" aria-label="Прогресс">
              <div className="investment-intake__progress-meta">
                <span>{phase === "result" ? "Готово" : `Шаг ${step + 1} из ${INTAKE_STEPS.length}`}</span>
                <span className="investment-intake__progress-pct">{Math.round(progress)}%</span>
              </div>
              <div
                className="investment-intake__progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label={`Прогресс: ${Math.round(progress)} процентов`}
              >
                <div className="investment-intake__progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="investment-intake__layout">
              <aside className="investment-intake__live" aria-live="polite">
                <div className="investment-intake__live-title">Ваш запрос собирается</div>
                <ul className="investment-intake__live-list">
                  {liveItems.map((row) => (
                    <li key={row.label} className="investment-intake__live-row">
                      <span className="investment-intake__live-label">{row.label}</span>
                      <span className="investment-intake__live-value">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="investment-intake__main">
                {phase === "steps" && currentStep && (
                  <div key={currentStep.id} className="investment-intake__step" data-dir={dir}>
                    <h3 className="investment-intake__question">{currentStep.question}</h3>
                    <div className="investment-intake__options" role="list">
                      {currentStep.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className="investment-intake__option"
                          onClick={() => pick(opt)}
                        >
                          <span className="investment-intake__option-text">{opt}</span>
                          <span className="investment-intake__option-arrow" aria-hidden="true">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="investment-intake__nav">
                      <button type="button" className="investment-intake__linkish" onClick={goBack}>
                        Назад
                      </button>
                    </div>
                  </div>
                )}

                {phase === "result" && (
                  <div className="investment-intake__result">
                    <h3 className="investment-intake__result-title">Ваш инвестиционный запрос собран</h3>
                    <p className="investment-intake__result-summary">{summary}</p>

                    <section className="investment-intake__panel">
                      <h4 className="investment-intake__panel-title">Что вы покупаете на самом деле</h4>
                      <p className="investment-intake__panel-text">{reality}</p>
                    </section>

                    <section className="investment-intake__panel">
                      <h4 className="investment-intake__panel-title">{route.title}</h4>
                      <p className="investment-intake__panel-text">{route.description}</p>
                    </section>

                    <section className="investment-intake__panel">
                      <h4 className="investment-intake__panel-title">Ваш персональный чек-лист</h4>
                      <div className="investment-intake__checklists">
                        <div>
                          <div className="investment-intake__check-title">Что собрать</div>
                          <ul className="investment-intake__check">
                            {checklist.collect.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="investment-intake__check-title">Что проверить</div>
                          <ul className="investment-intake__check">
                            {checklist.verify.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section className="investment-intake__panel investment-intake__panel--accent">
                      <h4 className="investment-intake__panel-title">Следующий сильный шаг</h4>
                      <p className="investment-intake__panel-text">{route.nextStep}</p>
                    </section>

                    <div className="investment-intake__ctas">
                      <button
                        type="button"
                        className="investment-intake__cta investment-intake__cta--ghost"
                        onClick={() => handleCta("checklist")}
                        aria-label="Скачать персональный чек-лист в формате Markdown"
                      >
                        Скачать чек-лист
                      </button>
                      <button type="button" className="investment-intake__cta" onClick={() => handleCta("submit_object")}>
                        Передать объект на проверку
                      </button>
                      <button
                        type="button"
                        className="investment-intake__cta investment-intake__cta--ghost"
                        onClick={() => handleCta("next_step")}
                      >
                        Узнать следующий шаг
                      </button>
                    </div>
                    <p className="investment-intake__microcopy investment-intake__microcopy--ctas">
                      Чек-лист скачается файлом .md. Для связи откроется чат ЦБИ в Telegram — полный текст запроса автоматически попадёт в буфер обмена, его останется вставить в чат.
                    </p>

                    {toast && (
                      <div className="investment-intake__toast" role="status" aria-live="polite">
                        {toast}
                      </div>
                    )}

                    {pendingShareUrl && (
                      <p className="investment-intake__fallback">
                        Если Telegram не открылся автоматически —{" "}
                        <a href={pendingShareUrl} target="_blank" rel="noopener noreferrer">
                          откройте чат ЦБИ вручную
                        </a>
                        .
                      </p>
                    )}

                    <div className="investment-intake__nav investment-intake__nav--end">
                      <button type="button" className="investment-intake__linkish" onClick={restart}>
                        Собрать запрос заново
                      </button>
                      <a className="investment-intake__inline-link" href="./instrumenty.html#screening">
                        Перейти к первичной оценке
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
