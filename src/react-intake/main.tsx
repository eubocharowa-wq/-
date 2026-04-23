import React from "react";
import { createRoot } from "react-dom/client";
import { InvestmentIntake } from "./InvestmentIntake";
import "./investment-intake.css";

const rootEl = document.getElementById("investment-intake-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <InvestmentIntake />
    </React.StrictMode>
  );
}
