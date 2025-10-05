// Helper to get and set reminders in localStorage
function getReminders() {
  return JSON.parse(localStorage.getItem('reminders') || '[]');
}
function setReminders(reminders) {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

// New function to create custom time picker
function createTimePicker(initialTime = '') {
  const [initialHour, initialMinute] = initialTime ? initialTime.split(':') : ['12', '00'];
  
  return `
    <div class="custom-time-picker relative w-full">
      <input type="text" 
             name="time" 
             readonly 
             placeholder="Select time..." 
             class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)] cursor-pointer time-input" 
             value="${initialTime ? formatTimeDisplay(initialTime) : ''}"
             data-time="${initialTime}">
      <div class="time-picker-popup hidden absolute top-full left-0 mt-1 bg-[var(--color-secondary)] border border-[var(--color-textWhite)] rounded-lg p-4 z-50 shadow-lg">
        <div class="flex gap-4 items-center">
          <div class="flex flex-col items-center">
            <label class="text-[var(--color-textWhite)] text-sm mb-2">Hour</label>
            <div class="hour-selector h-32 overflow-y-scroll border border-[var(--color-textWhite)] rounded w-16">
              ${Array.from({length: 24}, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return `<div class="hour-option px-2 py-1 text-center cursor-pointer text-[var(--color-textWhite)] hover:bg-[var(--color-tertiary)] ${hour === initialHour ? 'bg-[var(--color-tertiary)]' : ''}" data-hour="${hour}">${hour}</div>`;
              }).join('')}
            </div>
          </div>
          <div class="flex flex-col items-center">
            <label class="text-[var(--color-textWhite)] text-sm mb-2">Minute</label>
            <div class="minute-selector h-32 overflow-y-scroll border border-[var(--color-textWhite)] rounded w-16">
              ${Array.from({length: 60}, (_, i) => {
                const minute = i.toString().padStart(2, '0');
                return `<div class="minute-option px-2 py-1 text-center cursor-pointer text-[var(--color-textWhite)] hover:bg-[var(--color-tertiary)] ${minute === initialMinute ? 'bg-[var(--color-tertiary)]' : ''}" data-minute="${minute}">${minute}</div>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" class="time-cancel flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">Cancel</button>
          <button type="button" class="time-confirm flex-1 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] rounded py-1 font-semibold">Confirm</button>
        </div>
      </div>
    </div>
  `;
}

function formatTimeDisplay(time24) {
  if (!time24) return '';
  const [hour, minute] = time24.split(':');
  const hour12 = parseInt(hour) === 0 ? 12 : parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour);
  const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minute} ${ampm}`;
}

function setupTimePickerEvents(popup) {
  popup.addEventListener('click', function(e) {
    if (e.target.classList.contains('time-input')) {
      const timePicker = e.target.nextElementSibling;
      timePicker.classList.toggle('hidden');
    }
    
    if (e.target.classList.contains('hour-option')) {
      const hourSelector = e.target.parentElement;
      hourSelector.querySelectorAll('.hour-option').forEach(opt => opt.classList.remove('bg-[var(--color-tertiary)]'));
      e.target.classList.add('bg-[var(--color-tertiary)]');
    }
    
    if (e.target.classList.contains('minute-option')) {
      const minuteSelector = e.target.parentElement;
      minuteSelector.querySelectorAll('.minute-option').forEach(opt => opt.classList.remove('bg-[var(--color-tertiary)]'));
      e.target.classList.add('bg-[var(--color-tertiary)]');
    }
    
    if (e.target.classList.contains('time-confirm')) {
      const timePicker = e.target.closest('.time-picker-popup');
      const selectedHour = timePicker.querySelector('.hour-option.bg-\\[var\\(--color-tertiary\\)\\]')?.dataset.hour || '12';
      const selectedMinute = timePicker.querySelector('.minute-option.bg-\\[var\\(--color-tertiary\\)\\]')?.dataset.minute || '00';
      const time24 = `${selectedHour}:${selectedMinute}`;
      
      const timeInput = timePicker.previousElementSibling;
      timeInput.value = formatTimeDisplay(time24);
      timeInput.dataset.time = time24;
      timePicker.classList.add('hidden');
    }
    
    if (e.target.classList.contains('time-cancel')) {
      const timePicker = e.target.closest('.time-picker-popup');
      timePicker.classList.add('hidden');
    }
  });
  
  // Close time picker when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-time-picker')) {
      popup.querySelectorAll('.time-picker-popup').forEach(picker => {
        picker.classList.add('hidden');
      });
    }
  });
}

function renderReminders() {
  let container = document.getElementById('remindersList');
  if (!container) {
    container = document.createElement('div');
    container.id = 'remindersList';
    container.className = 'w-full max-w-2xl'; 
    const h1 = document.querySelector('h1');
    h1 && h1.insertAdjacentElement('afterend', container);
  }
  const reminders = getReminders();
  container.innerHTML = reminders.map((reminder, idx) => `
    <div class="flex border mb-2 rounded overflow-hidden w-full">
      <div class="bg-[var(--color-secondary)] text-[var(--color-textWhite)] flex items-center justify-center px-4 min-w-[180px] text-base font-bold text-center">${reminder.name}</div>
      <div class="flex-1 flex items-center justify-between px-4 py-2" style="background: #1b7fa6;">
        <span class="text-[var(--color-textWhite)] text-base">${reminder.schedule}</span>
        <div class="flex gap-2">
          <button class="bg-[var(--color-tertiary)] text-[var(--color-textWhite)] px-3 py-1 rounded font-semibold text-base editReminderBtn" data-idx="${idx}">Edit</button>
          <button class="bg-[var(--color-delete)] text-[var(--color-textWhite)] px-3 py-1 rounded font-semibold text-base removeReminderBtn" data-idx="${idx}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showReminderPopup(reminder = {}, idx = null) {
  document.getElementById('reminderPopup')?.remove();

  document.getElementById('remindersApp')?.classList.add('reminder-blur');

  const popup = document.createElement('div');
  popup.id = 'reminderPopup';
  popup.className = 'fixed inset-0 flex items-center justify-center z-50';

  popup.innerHTML = `
    <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg text-[var(--color-textWhite)]">
      <h2 class="text-xl font-bold mb-4 text-[var(--color-textWhite)]">${idx === null ? 'New Reminder' : 'Edit Reminder'}</h2>
      <form id="reminderForm" class="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Name..." required class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)]" value="${reminder.name || ''}">
        <input type="date" name="date" class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)] placeholder-[var(--color-textWhite)]" value="${reminder.date || ''}">
        ${createTimePicker(reminder.time || '')}
        <select name="interval" required class="w-full rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-[var(--color-textWhite)]">
          <option value="" class="text-[var(--color-textWhite)]">Interval/Repeat</option>
          <option value="Daily" ${reminder.interval === 'Daily' ? 'selected' : ''}>Daily</option>
          <option value="Weekly" ${reminder.interval === 'Weekly' ? 'selected' : ''}>Weekly</option>
          <option value="Monthly" ${reminder.interval === 'Monthly' ? 'selected' : ''}>Monthly</option>
        </select>
        <div class="flex gap-2 mt-4">
          <button type="button" id="cancelReminderBtn" class="flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">Cancel</button>
          <button type="submit" class="flex-1 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] rounded py-1 font-semibold">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(popup);

  // Setup time picker events
  setupTimePickerEvents(popup);

  document.getElementById('cancelReminderBtn').onclick = () => {
    popup.remove();
    document.getElementById('remindersApp')?.classList.remove('reminder-blur');
  };

  document.getElementById('reminderForm').onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const name = fd.get('name');
    const date = fd.get('date');
    const timeInput = this.querySelector('.time-input');
    const time = timeInput.dataset.time || timeInput.value;
    const interval = fd.get('interval');
    let schedule = '';
    if (interval === 'Daily') {
      schedule = `Daily ${formatTimeDisplay(time)}`;
    } else if (interval === 'Weekly') {
      const weekday = date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long' }) : '';
      schedule = `Weekly ${weekday} ${formatTimeDisplay(time)}`;
    } else if (interval === 'Monthly') {
      schedule = `Monthly ${date?.slice(8,10)} ${formatTimeDisplay(time)}`;
    } else if (date && time) {
      schedule = `${date.split('-').reverse().join('/')} ${formatTimeDisplay(time)}`;
    }
    const newReminder = { name, date, time, interval, schedule };
    let reminders = getReminders();
    if (idx !== null) {
      reminders[idx] = newReminder;
    } else {
      reminders.push(newReminder);
    }
    setReminders(reminders);
    popup.remove();
    document.getElementById('remindersApp')?.classList.remove('reminder-blur');
    renderReminders();
  };
}

function showDeletePopup(idx) {
  document.getElementById('reminderPopup')?.remove();
  document.getElementById('remindersApp')?.classList.add('reminder-blur');

  const popup = document.createElement('div');
  popup.id = 'reminderPopup';
  popup.className = 'fixed inset-0 flex items-center justify-center z-50';

  popup.innerHTML = `
    <div class="bg-[var(--color-secondary)] rounded-lg p-6 w-80 relative shadow-lg text-[var(--color-textWhite)]">
      <h2 class="text-xl font-bold mb-4 text-[var(--color-textWhite)]">Delete Reminder</h2>
      <p class="mb-6 text-[var(--color-textWhite)]">Are you sure you want to delete this reminder?</p>
      <div class="flex gap-2">
        <button type="button" id="cancelDeleteBtn" class="flex-1 bg-gray-300 text-[var(--color-textBlack)] rounded py-1 font-semibold">Cancel</button>
        <button type="button" id="confirmDeleteBtn" class="flex-1 bg-[var(--color-delete)] text-[var(--color-textWhite)] rounded py-1 font-semibold">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('cancelDeleteBtn').onclick = () => {
    popup.remove();
    document.getElementById('remindersApp')?.classList.remove('reminder-blur');
  };

  document.getElementById('confirmDeleteBtn').onclick = () => {
    let reminders = getReminders();
    reminders.splice(idx, 1);
    setReminders(reminders);
    popup.remove();
    document.getElementById('remindersApp')?.classList.remove('reminder-blur');
    renderReminders();
  };
}

document.getElementById('addReminderBtn')?.addEventListener('click', () => showReminderPopup());

// Edit and Remove button events (delegated)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('editReminderBtn')) {
    const idx = e.target.getAttribute('data-idx');
    const reminders = getReminders();
    showReminderPopup(reminders[idx], Number(idx));
  }
  if (e.target.classList.contains('removeReminderBtn')) {
    const idx = e.target.getAttribute('data-idx');
    showDeletePopup(Number(idx));
  }
});

window.addEventListener('DOMContentLoaded', renderReminders);
