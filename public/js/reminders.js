// Helper to get and set reminders in localStorage
function getReminders() {
  return JSON.parse(localStorage.getItem('reminders') || '[]');
}
function setReminders(reminders) {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Render reminders list
function renderReminders() {
  let container = document.getElementById('remindersList');
  if (!container) {
    container = document.createElement('div');
    container.id = 'remindersList';
    container.className = 'w-full max-w-xs';
    const h1 = document.querySelector('h1');
    h1 && h1.insertAdjacentElement('afterend', container);
  }
  const reminders = getReminders();
  container.innerHTML = reminders.map((reminder, idx) => `
    <div class="flex border mb-2 rounded overflow-hidden">
      <div class="bg-[var(--color-secondary)] text-[var(--color-textWhite)] flex items-center justify-center px-2 min-w-[90px] text-xs font-bold text-center">${reminder.type}</div>
      <div class="flex-1 flex flex-col justify-center px-2 py-2 text-[var(--color-textWhite)] text-sm">${reminder.schedule}</div>
      <button class="bg-[var(--color-tertiary)] text-[var(--color-textWhite)] px-3 m-2 rounded font-semibold text-sm editReminderBtn" data-idx="${idx}">Edit</button>
    </div>
  `).join('');
}

// Show popup for new/edit reminder
function showReminderPopup(reminder = {}, idx = null) {
  // Remove existing popup if any
  document.getElementById('reminderPopup')?.remove();

  // Blur the main content
  document.querySelector('main')?.classList.add('reminder-blur');

  const popup = document.createElement('div');
  popup.id = 'reminderPopup';
  popup.className = 'fixed inset-0 flex items-center justify-center z-50';

  popup.innerHTML = `
    <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg">
      <h2 class="text-xl font-bold text-[var(--color-textWhite)] mb-4">${idx === null ? '(New) Reminder' : 'Edit Reminder'}</h2>
      <form id="reminderForm" class="flex flex-col gap-3 text-[var(--color-textWhite)]">
        <input type="text" name="name" placeholder="Name..." required class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]" value="${reminder.name || ''}">
        <select name="type" required class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]">
          <option value="">Type</option>
          <option value="Check Glucose" ${reminder.type === 'Check Glucose' ? 'selected' : ''}>Report Glucose</option>
          <option value="Check Insulin" ${reminder.type === 'Check Insulin' ? 'selected' : ''}>Report Insulin</option>
          <option value="Take medication" ${reminder.type === 'Take medication' ? 'selected' : ''}>Take Medication</option>
          <option value="Add comment" ${reminder.type === 'Add comment' ? 'selected' : ''}>Add Comment</option>
          <option value="Doctor appointment" ${reminder.type === 'Doctor appointment' ? 'selected' : ''}>Doctor Appointment</option>
          <option value="Remind" ${reminder.type === 'Remind' ? 'selected' : ''}>Remind (activity)</option>
        </select>
        <input type="date" name="date" class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]" value="${reminder.date || ''}">
        <input type="time" name="time" class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]" value="${reminder.time || ''}">
        <select name="interval" required class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]">
          <option value="">Interval/Repeat</option>
          <option value="Daily" ${reminder.interval === 'Daily' ? 'selected' : ''}>Daily</option>
          <option value="Weekly" ${reminder.interval === 'Weekly' ? 'selected' : ''}>Weekly</option>
          <option value="Monthly" ${reminder.interval === 'Monthly' ? 'selected' : ''}>Monthly</option>
        </select>
        <div class="flex gap-2 mt-4">
          <button type="button" id="cancelReminderBtn" class="flex-1 bg-gray-300 text-[var(--color-textWhite)] rounded py-1 font-semibold">Cancel</button>
          <button type="submit" class="flex-1 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] rounded py-1 font-semibold">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(popup);

  // Cancel button
  document.getElementById('cancelReminderBtn').onclick = () => {
    popup.remove();
    document.querySelector('main')?.classList.remove('reminder-blur');
  };

  // Form submit
  document.getElementById('reminderForm').onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const name = fd.get('name');
    const type = fd.get('type');
    const date = fd.get('date');
    const time = fd.get('time');
    const interval = fd.get('interval');
    let schedule = '';
    if (interval === 'Daily') {
      schedule = `Daily ${time}`;
    } else if (interval === 'Weekly') {
      const weekday = date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long' }) : '';
      schedule = `Weekly ${weekday} ${time}`;
    } else if (interval === 'Monthly') {
      schedule = `Monthly ${date?.slice(8,10)} ${time}`;
    } else if (date && time) {
      schedule = `${date.split('-').reverse().join('/')} ${time}`;
    }
    const newReminder = { name, type, date, time, interval, schedule };
    let reminders = getReminders();
    if (idx !== null) {
      reminders[idx] = newReminder;
    } else {
      reminders.push(newReminder);
    }
    setReminders(reminders);
    popup.remove();
    document.querySelector('main')?.classList.remove('reminder-blur');
    renderReminders();
  };
}

// Add button event
document.getElementById('addReminderBtn')?.addEventListener('click', () => showReminderPopup());

// Edit button event (delegated)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('editReminderBtn')) {
    const idx = e.target.getAttribute('data-idx');
    const reminders = getReminders();
    showReminderPopup(reminders[idx], Number(idx));
  }
});

// Initial render
window.addEventListener('DOMContentLoaded', renderReminders);