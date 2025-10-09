(function () {
  // i18n helpers
  function getDict() {
    const d = window.__i18n && window.__i18n.dict;
    return typeof d === "function" ? d() : d || {};
  }
  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback ?? key;
  }
  function currentLang() {
    return (document.documentElement && document.documentElement.lang) || "en";
  }
  // wait until i18n ready
  function whenI18nReady(fn, maxTries = 20) {
    const want = currentLang();
    let tries = 0;
    const tick = () => {
      const ok =
        window.__i18n &&
        window.__i18n.lang === want &&
        window.__i18n.dict &&
        Object.keys(window.__i18n.dict).length > 0;
      if (ok) return fn();
      if (++tries >= maxTries) return fn();
      setTimeout(tick, 25);
    };
    tick();
  }
  function observeLangChanges(onChange) {
    try {
      const mo = new MutationObserver(() => whenI18nReady(onChange));
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    } catch (_) {}
  }

  // nepalese digits
  const NE_DIG = {
    0: "०",
    1: "१",
    2: "२",
    3: "३",
    4: "४",
    5: "५",
    6: "६",
    7: "७",
    8: "८",
    9: "९",
  };
  function toNepaliDigits(str) {
    if (currentLang() !== "ne") return String(str);
    return String(str).replace(/[0-9]/g, (d) => NE_DIG[d] || d);
  }

  // storage
  function getReminders() {
    try {
      return JSON.parse(localStorage.getItem("reminders") || "[]");
    } catch {
      return [];
    }
  }
  function setReminders(reminders) {
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    } catch {}
  }

  // helps with date
  function getTodayYMD() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function setDateDefaultIfEmpty(input) {
    if (input && !input.value) input.value = getTodayYMD();
  }

  // helps with date and time formatting
  function formatTimeDisplay(time24) {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    const h = Number(hStr),
      m = Number(mStr);
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const am = t("time_am", "AM");
    const pm = t("time_pm", "PM");
    const ampm = h >= 12 ? pm : am;
    const out = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
    return currentLang() === "ne" ? toNepaliDigits(out) : out;
  }

  // swaps digits when ne is active
  function formatDateForDisplay(date) {
    if (!date) return "";
    const [y, mo, d] = date.split("-").map(Number);
    const out = `${String(d).padStart(2, "0")}/${String(mo).padStart(
      2,
      "0"
    )}/${y}`;
    return currentLang() === "ne" ? toNepaliDigits(out) : out;
  }

  function weekdayLong(date) {
    if (!date) return "";
    try {
      return new Date(date + "T00:00:00").toLocaleDateString(currentLang(), {
        weekday: "long",
      });
    } catch {
      return "";
    }
  }

  // compute at render so updates language switch
  function formatReminderSchedule(rem) {
    const timeText = formatTimeDisplay(rem.time);
    if (rem.interval === "Daily") {
      return t("schedule_daily", "Daily {time}").replace("{time}", timeText);
    }
    if (rem.interval === "Weekly") {
      const wk = weekdayLong(rem.date);
      return t("schedule_weekly", "Weekly {weekday} {time}")
        .replace("{weekday}", wk)
        .replace("{time}", timeText);
    }
    if (rem.interval === "Monthly") {
      const day = rem.date ? rem.date.slice(8, 10) : "";
      const dayOut = currentLang() === "ne" ? toNepaliDigits(day) : day;
      return t("schedule_monthly", "Monthly {day} {time}")
        .replace("{day}", dayOut)
        .replace("{time}", timeText);
    }
    const d = formatDateForDisplay(rem.date);
    return t("schedule_onetime", "{date} {time}")
      .replace("{date}", d)
      .replace("{time}", timeText);
  }

  // custom time pciker
  function createTimePicker(initialTime = "") {
    const [initialHour, initialMinute] = initialTime
      ? initialTime.split(":")
      : ["12", "00"];
    return `
      <div class="custom-time-picker relative w-full">
        <input type="text"
               name="time"
               readonly
               placeholder="${t("tp_select_time", "Select time...")}"
               class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)] cursor-pointer time-input"
               value="${initialTime ? formatTimeDisplay(initialTime) : ""}"
               data-time="${initialTime}">
        <div class="time-picker-popup hidden absolute top-full left-0 mt-1 bg-[var(--color-secondary)] border border-[var(--color-textWhite)] rounded-lg p-4 z-50 shadow-lg">
          <div class="flex gap-4 items-center">
            <div class="flex flex-col items-center">
              <label class="text-[var(--color-textWhite)] text-sm mb-2">${t(
                "tp_hour",
                "Hour"
              )}</label>
              <div class="hour-selector h-32 overflow-y-scroll border border-[var(--color-textWhite)] rounded w-16">
                ${Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, "0");
                  const label =
                    currentLang() === "ne" ? toNepaliDigits(hour) : hour;
                  return `<div class="hour-option px-2 py-1 text-center cursor-pointer text-[var(--color-textWhite)] hover:bg-[var(--color-tertiary)] ${
                    hour === initialHour ? "bg-[var(--color-tertiary)]" : ""
                  }" data-hour="${hour}">${label}</div>`;
                }).join("")}
              </div>
            </div>
            <div class="flex flex-col items-center">
              <label class="text-[var(--color-textWhite)] text-sm mb-2">${t(
                "tp_minute",
                "Minute"
              )}</label>
              <div class="minute-selector h-32 overflow-y-scroll border border-[var(--color-textWhite)] rounded w-16">
                ${Array.from({ length: 60 }, (_, i) => {
                  const minute = i.toString().padStart(2, "0");
                  const label =
                    currentLang() === "ne" ? toNepaliDigits(minute) : minute;
                  return `<div class="minute-option px-2 py-1 text-center cursor-pointer text-[var(--color-textWhite)] hover:bg-[var(--color-tertiary)] ${
                    minute === initialMinute ? "bg-[var(--color-tertiary)]" : ""
                  }" data-minute="${minute}">${label}</div>`;
                }).join("")}
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="button" class="time-cancel flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">${t(
              "cancel",
              "Cancel"
            )}</button>
            <button type="button" class="time-confirm flex-1 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] rounded py-1 font-semibold">${t(
              "confirm",
              "Confirm"
            )}</button>
          </div>
        </div>
      </div>
    `;
  }

  function setupTimePickerEvents(popup) {
    popup.addEventListener("click", function (e) {
      if (e.target.classList.contains("time-input")) {
        const timePicker = e.target.nextElementSibling;
        timePicker.classList.toggle("hidden");
      }

      if (e.target.classList.contains("hour-option")) {
        const hourSelector = e.target.parentElement;
        hourSelector
          .querySelectorAll(".hour-option")
          .forEach((opt) => opt.classList.remove("bg-[var(--color-tertiary)]"));
        e.target.classList.add("bg-[var(--color-tertiary)]");
      }

      if (e.target.classList.contains("minute-option")) {
        const minuteSelector = e.target.parentElement;
        minuteSelector
          .querySelectorAll(".minute-option")
          .forEach((opt) => opt.classList.remove("bg-[var(--color-tertiary)]"));
        e.target.classList.add("bg-[var(--color-tertiary)]");
      }

      if (e.target.classList.contains("time-confirm")) {
        const timePicker = e.target.closest(".time-picker-popup");
        const selectedHour =
          timePicker.querySelector(
            ".hour-option.bg-\\[var\\(--color-tertiary\\)\\]"
          )?.dataset.hour || "12";
        const selectedMinute =
          timePicker.querySelector(
            ".minute-option.bg-\\[var\\(--color-tertiary\\)\\]"
          )?.dataset.minute || "00";
        const time24 = `${selectedHour}:${selectedMinute}`;
        const timeInput = timePicker.previousElementSibling;
        timeInput.value = formatTimeDisplay(time24);
        timeInput.dataset.time = time24;
        timePicker.classList.add("hidden");
      }

      if (e.target.classList.contains("time-cancel")) {
        const timePicker = e.target.closest(".time-picker-popup");
        timePicker.classList.add("hidden");
      }
    });

    // closes time picker when clicked outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".custom-time-picker")) {
        popup
          .querySelectorAll(".time-picker-popup")
          .forEach((picker) => picker.classList.add("hidden"));
      }
    });
  }

  //  date overlay for nepalese
  function updateDateOverlay(input, overlay) {
    if (!input || !overlay) return;
    input.setAttribute("lang", currentLang());
    if (currentLang() === "ne") {
      input.style.color = "transparent";
      input.style.caretColor = "transparent";
      overlay.textContent = toNepaliDigits(input.value || "");
      overlay.style.visibility = overlay.textContent ? "visible" : "hidden";
    } else {
      input.style.color = "";
      input.style.caretColor = "";
      overlay.style.visibility = "hidden";
      overlay.textContent = "";
    }
  }

  function wireDateOverlay(popupRoot) {
    const wrap = popupRoot.querySelector(".date-wrap");
    if (!wrap) return;
    const input = wrap.querySelector("input[name='date']");
    const overlay = wrap.querySelector(".date-overlay");
    if (!input || !overlay) return;

    // shows todays date even if in nepalese
    setDateDefaultIfEmpty(input);

    const sync = () => updateDateOverlay(input, overlay);

    input.addEventListener("input", sync);
    input.addEventListener("change", sync);

    // initial sync
    sync();

    // refresh if language changes while popup is open
    observeLangChanges(() => {
      setDateDefaultIfEmpty(input);
      sync();
    });
  }

  // rendering
  function renderReminders() {
    let container = document.getElementById("remindersList");
    if (!container) {
      container = document.createElement("div");
      container.id = "remindersList";
      container.className = "w-full max-w-2xl";
      const h1 = document.querySelector("h1");
      h1 && h1.insertAdjacentElement("afterend", container);
    }

    const reminders = getReminders();
    container.innerHTML = reminders
      .map((reminder, idx) => {
        const scheduleText = formatReminderSchedule(reminder);
        return `
        <div class="flex border mb-2 rounded overflow-hidden w-full">
          <div class="bg-[var(--color-secondary)] text-[var(--color-textWhite)] flex items-center justify-center px-4 min-w-[180px] text-base font-bold text-center">${
            reminder.name || ""
          }</div>
          <div class="flex-1 flex items-center justify-between px-4 py-2" style="background: #1b7fa6;">
            <span class="text-[var(--color-textWhite)] text-base">${scheduleText}</span>
            <div class="flex gap-2">
              <button class="bg-[var(--color-tertiary)] text-[var(--color-textWhite)] px-3 py-1 rounded font-semibold text-base editReminderBtn" data-idx="${idx}">${t(
          "edit",
          "Edit"
        )}</button>
              <button class="bg-[var(--color-delete)] text-[var(--color-textWhite)] px-3 py-1 rounded font-semibold text-base removeReminderBtn" data-idx="${idx}">${t(
          "remove",
          "Remove"
        )}</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  function relocalizeOpenPopup(popup) {
    if (!popup || !popup.isConnected) return;
    // Title
    const h2 = popup.querySelector("h2");
    if (h2) {
      const editing = !!popup.querySelector("#reminderForm")?.dataset.idx;
      h2.textContent = editing
        ? t("edit_reminder", "Edit Reminder")
        : t("new_reminder", "New Reminder");
    }
    // input and labels
    const nameInput = popup.querySelector("input[name='name']");
    if (nameInput) nameInput.placeholder = t("reminder_name_ph", "Name...");

    const interval = popup.querySelector("select[name='interval']");
    if (interval) {
      const [ph, d, w, m] = interval.querySelectorAll("option");
      if (ph) ph.textContent = t("interval_placeholder", "Interval/Repeat");
      if (d) d.textContent = t("interval_daily", "Daily");
      if (w) w.textContent = t("interval_weekly", "Weekly");
      if (m) m.textContent = t("interval_monthly", "Monthly");
    }

    // time picker and text for buttons
    const hourLabel = popup
      .querySelector(".hour-selector")
      ?.closest("div")
      ?.querySelector("label");
    if (hourLabel) hourLabel.textContent = t("tp_hour", "Hour");
    const minuteLabel = popup
      .querySelector(".minute-selector")
      ?.closest("div")
      ?.querySelector("label");
    if (minuteLabel) minuteLabel.textContent = t("tp_minute", "Minute");
    const timeInput = popup.querySelector(".time-input");
    if (timeInput) {
      timeInput.placeholder = t("tp_select_time", "Select time...");
      if (timeInput.dataset.time)
        timeInput.value = formatTimeDisplay(timeInput.dataset.time);
      // hh/mm in nepalese
      popup
        .querySelectorAll(".hour-option")
        .forEach(
          (el) =>
            (el.textContent =
              currentLang() === "ne"
                ? toNepaliDigits(el.dataset.hour)
                : el.dataset.hour)
        );
      popup
        .querySelectorAll(".minute-option")
        .forEach(
          (el) =>
            (el.textContent =
              currentLang() === "ne"
                ? toNepaliDigits(el.dataset.minute)
                : el.dataset.minute)
        );
    }
    popup
      .querySelectorAll(".time-cancel")
      .forEach((b) => (b.textContent = t("cancel", "Cancel")));
    popup
      .querySelectorAll(".time-confirm")
      .forEach((b) => (b.textContent = t("confirm", "Confirm")));

    // footer buttons
    const cancelBtn = popup.querySelector("#cancelReminderBtn");
    const saveBtn = popup.querySelector("button[type='submit']");
    if (cancelBtn) cancelBtn.textContent = t("cancel", "Cancel");
    if (saveBtn) saveBtn.textContent = t("save", "Save");
  }

  function showReminderPopup(reminder = {}, idx = null) {
    document.getElementById("reminderPopup")?.remove();
    document.getElementById("remindersApp")?.classList.add("reminder-blur");

    const popup = document.createElement("div");
    popup.id = "reminderPopup";
    popup.className = "fixed inset-0 flex items-center justify-center z-50";

    popup.innerHTML = `
      <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg text-[var(--color-textWhite)]">
        <h2 class="text-xl font-bold mb-4 text-[var(--color-textWhite)]">${
          idx === null
            ? t("new_reminder", "New Reminder")
            : t("edit_reminder", "Edit Reminder")
        }</h2>
        <form id="reminderForm" class="flex flex-col gap-3" ${
          idx !== null ? 'data-idx="1"' : ""
        }>
          <input type="text" name="name" placeholder="${t(
            "reminder_name_ph",
            "Name..."
          )}" required class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)]" value="${
      reminder.name || ""
    }">

          <!-- Date with overlay (Nepali digits), fixed width to prevent shrink -->
          <div class="date-wrap relative w-full overflow-hidden">
            <input type="date" name="date"
                   class="w-full min-w-[16ch] rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)] date-input"
                   value="${reminder.date || ""}">
            <span class="date-overlay pointer-events-none absolute inset-0 flex items-center justify-center font-bold text-[var(--color-textWhite)] px-2 py-1 rounded" style="visibility:hidden;"></span>
          </div>

          ${createTimePicker(reminder.time || "")}

          <select name="interval" required class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]">
            <option value="">${t(
              "interval_placeholder",
              "Interval/Repeat"
            )}</option>
            <option value="Daily" ${
              reminder.interval === "Daily" ? "selected" : ""
            }>${t("interval_daily", "Daily")}</option>
            <option value="Weekly" ${
              reminder.interval === "Weekly" ? "selected" : ""
            }>${t("interval_weekly", "Weekly")}</option>
            <option value="Monthly" ${
              reminder.interval === "Monthly" ? "selected" : ""
            }>${t("interval_monthly", "Monthly")}</option>
          </select>

          <div class="flex gap-2 mt-4">
            <button type="button" id="cancelReminderBtn" class="flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">${t(
              "cancel",
              "Cancel"
            )}</button>
            <button type="submit" class="flex-1 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] rounded py-1 font-semibold">${t(
              "save",
              "Save"
            )}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(popup);

    // ensures todays date
    const dateInputInit = popup.querySelector("input[name='date']");
    if (dateInputInit) setDateDefaultIfEmpty(dateInputInit);

    wireDateOverlay(popup);
    setupTimePickerEvents(popup);

    // Close
    document.getElementById("cancelReminderBtn").onclick = () => {
      popup.remove();
      document
        .getElementById("remindersApp")
        ?.classList.remove("reminder-blur");
    };

    // Submit
    document.getElementById("reminderForm").onsubmit = function (e) {
      e.preventDefault();
      const fd = new FormData(this);
      const name = fd.get("name");
      const date = fd.get("date");
      const timeInput = this.querySelector(".time-input");
      const time = timeInput.dataset.time || timeInput.value;
      const interval = fd.get("interval");

      const newReminder = { name, date, time, interval };

      const reminders = getReminders();
      if (idx !== null) reminders[idx] = newReminder;
      else reminders.push(newReminder);
      setReminders(reminders);

      popup.remove();
      document
        .getElementById("remindersApp")
        ?.classList.remove("reminder-blur");
      renderReminders();
    };

    // if language changes while popup is open, re-localize it
    observeLangChanges(() => {
      relocalizeOpenPopup(popup);
      wireDateOverlay(popup); // re-sync overlay state
    });
  }

  function showDeletePopup(idx) {
    document.getElementById("reminderPopup")?.remove();
    document.getElementById("remindersApp")?.classList.add("reminder-blur");

    const popup = document.createElement("div");
    popup.id = "reminderPopup";
    popup.className = "fixed inset-0 flex items-center justify-center z-50";

    popup.innerHTML = `
      <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg text-[var(--color-textWhite)]">
        <h2 class="text-xl font-bold mb-4 text-[var(--color-textWhite)]">${t(
          "delete_reminder",
          "Delete Reminder"
        )}</h2>
        <p class="mb-6 text-[var(--color-textWhite)]">${t(
          "delete_confirm_text",
          "Are you sure you want to delete this reminder?"
        )}</p>
        <div class="flex gap-2">
          <button type="button" id="cancelDeleteBtn" class="flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">${t(
            "cancel",
            "Cancel"
          )}</button>
          <button type="button" id="confirmDeleteBtn" class="flex-1 bg-[var(--color-delete)] text-[var(--color-textWhite)] rounded py-1 font-semibold">${t(
            "delete",
            "Delete"
          )}</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("cancelDeleteBtn").onclick = () => {
      popup.remove();
      document
        .getElementById("remindersApp")
        ?.classList.remove("reminder-blur");
    };

    document.getElementById("confirmDeleteBtn").onclick = () => {
      const reminders = getReminders();
      reminders.splice(idx, 1);
      setReminders(reminders);
      popup.remove();
      document
        .getElementById("remindersApp")
        ?.classList.remove("reminder-blur");
      renderReminders();
    };

    observeLangChanges(() => {
      popup.querySelector("h2").textContent = t(
        "delete_reminder",
        "Delete Reminder"
      );
      popup.querySelector("p").textContent = t(
        "delete_confirm_text",
        "Are you sure you want to delete this reminder?"
      );
      popup.querySelector("#cancelDeleteBtn").textContent = t(
        "cancel",
        "Cancel"
      );
      popup.querySelector("#confirmDeleteBtn").textContent = t(
        "delete",
        "Delete"
      );
    });
  }

  // wiring
  document
    .getElementById("addReminderBtn")
    ?.addEventListener("click", () => showReminderPopup());

  // Edit / Remove (delegated)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("editReminderBtn")) {
      const idx = e.target.getAttribute("data-idx");
      const reminders = getReminders();
      showReminderPopup(reminders[idx], Number(idx));
    }
    if (e.target.classList.contains("removeReminderBtn")) {
      const idx = e.target.getAttribute("data-idx");
      showDeletePopup(Number(idx));
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    // render immediately with reserved container
    renderReminders();
  });

  // re-render list after i18n really switches
  observeLangChanges(() => {
    whenI18nReady(renderReminders);
  });
})();
