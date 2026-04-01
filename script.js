document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");
  if (!app) return;

  const counters = new Map();
  const habitCards = app.querySelectorAll(".habit-card");

  habitCards.forEach((card) => {
    const id = card.getAttribute("data-habit-id") || Symbol("habit");
    const counterEl = card.querySelector("[data-counter]");
    const button = card.querySelector(".habit-btn");

    if (!counterEl || !button) return;

    counters.set(id, 0);

    button.addEventListener("click", () => {
      const current = counters.get(id) ?? 0;
      const next = current + 1;
      counters.set(id, next);
      counterEl.textContent = String(next);
    });
  });

  const resetButton = document.getElementById("reset-all");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      counters.forEach((_, id) => {
        counters.set(id, 0);
      });

      app.querySelectorAll("[data-counter]").forEach((el) => {
        el.textContent = "0";
      });
    });
  }
});

