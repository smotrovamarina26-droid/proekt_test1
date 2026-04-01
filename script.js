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

  app.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const editButton = target.closest(".edit-btn");
    if (!editButton) return;

    const card = editButton.closest(".habit-card");
    if (!card) return;

    const titleEl = card.querySelector("[data-title]");
    if (!titleEl) return;

    if (card.querySelector("input.habit-title-input")) return;

    const oldTitle = (titleEl.textContent || "").trim();
    const input = document.createElement("input");
    input.className = "habit-title-input";
    input.type = "text";
    input.value = oldTitle;
    input.setAttribute("aria-label", "Название привычки");

    titleEl.replaceWith(input);
    input.focus();
    input.select();

    const finish = (mode) => {
      const nextTitle = (input.value || "").trim();
      const finalTitle = nextTitle.length > 0 ? nextTitle : oldTitle;

      const restoredTitle = document.createElement("h2");
      restoredTitle.className = "habit-title";
      restoredTitle.setAttribute("data-title", "");
      restoredTitle.textContent = mode === "cancel" ? oldTitle : finalTitle;

      input.replaceWith(restoredTitle);
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish("save");
      if (e.key === "Escape") finish("cancel");
    });

    input.addEventListener("blur", () => finish("save"));
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

