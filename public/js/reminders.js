
// merging to preserve backend functionality + language translations + reactivity
(async function () {
  const app = document.getElementById("remindersApp");
  if (!app) return;

  // i18n helpers preserved from main
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

  // map nepalese digits
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

  // detect user timezone (used for reminders)
  function getUserTimezone() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz && tz.length > 2 ? tz : "Australia/Perth";
    } catch {
      return "Australia/Perth";
    }
  }

  // BACKEND api preserved
  function getAuthToken() {
    const token = localStorage.getItem("authToken");
    if (!token)
      throw new Error(
        t("session_expired", "Session expired, please register again")
      );
    return token;
  }

  async function readResponseSafe(response) {
    const ct =
      (response.headers &&
        response.headers.get &&
        response.headers.get("content-type")) ||
      "";
    if (ct.includes("application/json")) {
      try {
        return { data: await response.json(), text: null };
      } catch (_) {}
    }
    try {
      return { data: null, text: await response.text() };
    } catch (_) {}
    return { data: null, text: null };
  }

  async function createReminder(reminder) {
    const token = getAuthToken();
    const res = await fetch("/api/patient/me/reminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reminder),
    });
    const { data, text } = await readResponseSafe(res);
    if (!res.ok)
      throw new Error(data?.error || text || "Failed to create reminder");
    return data;
  }

  async function fetchReminders() {
    try {
      const token = getAuthToken();
      const res = await fetch("/api/patient/me/reminder", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      const { data } = await readResponseSafe(res);
      if (!res.ok) throw new Error(data?.error || "Failed to fetch reminders");
      return data?.reminders || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function updateReminder(reminderID, updateData) {
    const token = getAuthToken();
    const res = await fetch(`/api/patient/me/reminder/${reminderID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(updateData),
    });
    const { data, text } = await readResponseSafe(res);
    if (!res.ok)
      throw new Error(data?.error || text || "Failed to update reminder");
    return data;
  }

  async function deleteReminder(reminderID) {
    const token = getAuthToken();
    const res = await fetch(`/api/patient/me/reminder/${reminderID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data, text } = await readResponseSafe(res);
    if (!res.ok)
      throw new Error(data?.error || text || "Failed to delete reminder");
    return data;
  }

  // date/time helper functions
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

  // language translation helpers for date, time
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

  // custom time picker
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
          .forEach((o) => o.classList.remove("bg-[var(--color-tertiary)]"));
        e.target.classList.add("bg-[var(--color-tertiary)]");
      }
      if (e.target.classList.contains("minute-option")) {
        const minuteSelector = e.target.parentElement;
        minuteSelector
          .querySelectorAll(".minute-option")
          .forEach((o) => o.classList.remove("bg-[var(--color-tertiary)]"));
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

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".custom-time-picker")) {
        popup
          .querySelectorAll(".time-picker-popup")
          .forEach((picker) => picker.classList.add("hidden"));
      }
    });
  }

  // nepalese date overlay
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
    setDateDefaultIfEmpty(input);
    const sync = () => updateDateOverlay(input, overlay);
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    sync();
    observeLangChanges(() => {
      setDateDefaultIfEmpty(input);
      sync();
    });
  }

  // rendering backend + lang translation
  async function renderReminders() {
    let container = document.getElementById("remindersList");
    if (!container) {
      container = document.createElement("div");
      container.id = "remindersList";
      container.className =
        "w-full max-w-md space-y-2 flex flex-col items-center";
      const mainElement = document.querySelector("#remindersApp main");
      (mainElement || app).appendChild(container);
    }

    const reminders = await fetchReminders();
    container.innerHTML = reminders
      .map((r) => {
        const schedule = formatReminderSchedule({
          name: r.name,
          date: r.date || r.startDate || "",
          time: r.time || "",
          interval: r.interval || "",
        });
        return `
        <div class="flex border rounded overflow-hidden w-full h-20">
          <div class="bg-[var(--color-secondary)] text-[var(--color-textWhite)] flex items-center justify-center px-4 w-32 text-sm font-bold text-center">${
            r.name || ""
          }</div>
          <div class="flex-1 flex flex-col justify-center px-3 py-2" style="background:#1b7fa6;">
            <span class="text-[var(--color-textWhite)] text-sm mb-1">${schedule}</span>
            <div class="flex gap-1">
              <button class="bg-[var(--color-tertiary)] text-[var(--color-textWhite)] px-2 py-1 rounded font-semibold text-xs editReminderBtn" data-id="${
                r._id
              }">${t("edit", "Edit")}</button>
              <button class="bg-[var(--color-delete)] text-[var(--color-textWhite)] px-2 py-1 rounded font-semibold text-xs removeReminderBtn" data-id="${
                r._id
              }">${t("remove", "Remove")}</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  // open pop up on lang switch
  function relocalizeOpenPopup(popup) {
    if (!popup || !popup.isConnected) return;
    const h2 = popup.querySelector("h2");
    if (h2) {
      const editing =
        !!popup.querySelector("#reminderForm")?.dataset.reminderId;
      h2.textContent = editing
        ? t("edit_reminder", "Edit Reminder")
        : t("new_reminder", "New Reminder");
    }
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

    const cancelBtn = popup.querySelector("#cancelReminderBtn");
    const saveBtn = popup.querySelector("button[type='submit']");
    if (cancelBtn) cancelBtn.textContent = t("cancel", "Cancel");
    if (saveBtn) saveBtn.textContent = t("save", "Save");
  }

  // pop ups create + edit
  function showReminderPopup(reminder = {}, reminderID = null) {
    document.getElementById("reminderPopup")?.remove();
    app.classList.add("reminder-blur");

    const popup = document.createElement("div");
    popup.id = "reminderPopup";
    popup.className = "fixed inset-0 flex items-center justify-center z-50";

    popup.innerHTML = `
      <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg text-[var(--color-textWhite)]">
        <h2 class="text-xl font-bold mb-4 text-[var(--color-textWhite)]">
          ${
            reminderID
              ? t("edit_reminder", "Edit Reminder")
              : t("new_reminder", "New Reminder")
          }
        </h2>
        <form id="reminderForm" class="flex flex-col gap-3" ${
          reminderID ? `data-reminder-id="${reminderID}"` : ""
        }>
          <input type="text" name="name" placeholder="${t(
            "reminder_name_ph",
            "Name..."
          )}" required
                 class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)]"
                 value="${reminder.name || ""}">
          <div class="date-wrap relative w-full overflow-hidden">
            <input type="date" name="date"
                   class="w-full min-w-[16ch] rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)] date-input"
                   value="${reminder.date || reminder.startDate || ""}">
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

    // default date + overlays + time picker events
    const dateInputInit = popup.querySelector("input[name='date']");
    if (dateInputInit) setDateDefaultIfEmpty(dateInputInit);
    wireDateOverlay(popup);
    setupTimePickerEvents(popup);

    // close
    document.getElementById("cancelReminderBtn").onclick = () => {
      popup.remove();
      app.classList.remove("reminder-blur");
    };

    // submit backend logic
    document.getElementById("reminderForm").onsubmit = async function (e) {
      e.preventDefault();
      const fd = new FormData(this);
      const name = fd.get("name");
      const date = fd.get("date");
      const timeInput = this.querySelector(".time-input");
      const time = timeInput?.dataset?.time || timeInput?.value || "";
      const interval = fd.get("interval");

      // include timezone detection
      const timezone = getUserTimezone();
      const payload = { name, date, time, interval, timezone };

      try {
        if (reminderID) await updateReminder(reminderID, payload);
        else await createReminder(payload);

        popup.remove();
        app.classList.remove("reminder-blur");
        await renderReminders();
      } catch (err) {
        console.error(err);
      }
    };

    // relocalize while open
    observeLangChanges(() => {
      relocalizeOpenPopup(popup);
      wireDateOverlay(popup);
    });
  }

  function showDeletePopup(reminderID) {
    document.getElementById("reminderPopup")?.remove();
    app.classList.add("reminder-blur");

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
      app.classList.remove("reminder-blur");
    };

    document.getElementById("confirmDeleteBtn").onclick = async () => {
      try {
        await deleteReminder(reminderID);
        popup.remove();
        app.classList.remove("reminder-blur");
        await renderReminders();
      } catch (err) {
        console.error("Error deleting reminder:", err);
      }
    };

    observeLangChanges(() => {
      const h2 = popup.querySelector("h2");
      const p = popup.querySelector("p");
      const cancel = popup.querySelector("#cancelDeleteBtn");
      const del = popup.querySelector("#confirmDeleteBtn");
      if (h2) h2.textContent = t("delete_reminder", "Delete Reminder");
      if (p)
        p.textContent = t(
          "delete_confirm_text",
          "Are you sure you want to delete this reminder?"
        );
      if (cancel) cancel.textContent = t("cancel", "Cancel");
      if (del) del.textContent = t("delete", "Delete");
    });
  }

  // wire events backend logic
  await renderReminders();

  document
    .getElementById("addReminderBtn")
    ?.addEventListener("click", () => showReminderPopup());

  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("editReminderBtn")) {
      const reminderID = e.target.dataset.id;
      const all = await fetchReminders();
      const reminder = all.find((r) => r._id === reminderID);
      if (reminder) showReminderPopup(reminder, reminderID);
    }
    if (e.target.classList.contains("removeReminderBtn")) {
      const reminderID = e.target.dataset.id;
      showDeletePopup(reminderID);
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    whenI18nReady(renderReminders);
  });

  // re-render list after language switches
  observeLangChanges(() => {
    whenI18nReady(renderReminders);
  });
})();
