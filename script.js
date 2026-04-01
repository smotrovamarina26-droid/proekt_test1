document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");
  if (!app) return;

  const counters = new Map();
  const habitsList = app.querySelector(".habits-list");
  if (!habitsList) return;

  const newHabitInput = document.getElementById("new-habit-input");
  const addHabitButton = document.getElementById("add-habit-btn");

  let nextHabitId = 1;

  const registerCard = (card) => {
    const id = card.getAttribute("data-habit-id");
    if (!id) return;
    if (!counters.has(id)) counters.set(id, 0);
  };

  app.querySelectorAll(".habit-card").forEach((card) => {
    registerCard(card);
  });

  const createHabitCard = (name, id) => {
    const card = document.createElement("article");
    card.className = "habit-card";
    card.setAttribute("data-habit-id", id);
    card.innerHTML = `
      <div class="habit-main">
        <h2 class="habit-title" data-title></h2>
        <button class="edit-btn" type="button" aria-label="Редактировать название">✏️</button>
        <button class="delete-btn" type="button" aria-label="Удалить привычку">🗑️</button>
      </div>
      <div class="habit-controls">
        <button class="habit-btn" type="button">+1</button>
        <span class="habit-counter" data-counter>0</span>
      </div>
    `;
    const title = card.querySelector("[data-title]");
    if (title) title.textContent = name;
    return card;
  };

  const addHabit = () => {
    if (!(newHabitInput instanceof HTMLInputElement)) return;
    const name = newHabitInput.value.trim();

    if (!name) {
      alert("Введите название привычки.");
      return;
    }

    const id = `custom-${nextHabitId++}`;
    const card = createHabitCard(name, id);
    habitsList.append(card);
    counters.set(id, 0);
    newHabitInput.value = "";
    newHabitInput.focus();
  };

  if (addHabitButton) {
    addHabitButton.addEventListener("click", addHabit);
  }

  if (newHabitInput instanceof HTMLInputElement) {
    newHabitInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addHabit();
    });
  }

  app.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const plusButton = target.closest(".habit-btn");
    if (plusButton) {
      const card = plusButton.closest(".habit-card");
      if (!card) return;
      const id = card.getAttribute("data-habit-id");
      const counterEl = card.querySelector("[data-counter]");
      if (!id || !counterEl) return;

      const current = counters.get(id) ?? 0;
      const next = current + 1;
      counters.set(id, next);
      counterEl.textContent = String(next);
      return;
    }

    const deleteButton = target.closest(".delete-btn");
    if (deleteButton) {
      const card = deleteButton.closest(".habit-card");
      if (!card) return;

      const id = card.getAttribute("data-habit-id");
      if (id) counters.delete(id);
      card.remove();
      return;
    }

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

