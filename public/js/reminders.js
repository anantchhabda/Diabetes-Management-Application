(async function () {
  const app = document.getElementById('remindersApp');
  if (!app) return;
  //get token
  function getAuthToken () {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Session expired, please register again');
    return token;
  }
  //parse response
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
  //api calls
  async function createReminder(reminder) {
    const token = getAuthToken();
    const res = await fetch('/api/patient/me/reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reminder)
    });
    return await res.json();
  }
  async function fetchReminders() {
    try {
    const token = getAuthToken();
    const res = await fetch('/api/patient/me/reminder', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    const {data} = await readResponseSafe(res);
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch reminders');
    return data?.reminders || []
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  async function updateReminder(reminderID, updateData) {
    const token = getAuthToken();
    const res = await fetch(`/api/patient/me/reminder/${reminderID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  }
  async function deleteReminder(reminderID) {
    const token = getAuthToken();
    const res = await fetch(`/api/patient/me/reminder/${reminderID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  }
  function getScheduleText(reminder) {
    const today = new Date();
    const rDate = new Date(reminder.startDate);

    switch(reminder.interval) {
      case 'Daily': return `Daily ${reminder.time}`;
      case 'Weekly':
        const weekday = reminder.dayOfWeek;
        return `Weekly ${reminder.dayOfWeek} ${reminder.time}`;
      case 'Monthly':
        const date = rDate.getDate();
        return `Monthly ${reminder.startDate} ${reminder.time}`;
    }
  }
  async function renderReminders() {
    let container = document.getElementById('remindersList');
    if (!container) {
      container = document.createElement('div');
      container.id = 'remindersList';
      container.className = 'w-full max-w-md space-y-2 flex flex-col items-center'; // Removed mx-auto since parent centers
      
      // Insert inside the main element instead of after remindersApp
      const mainElement = document.querySelector('#remindersApp main');
      mainElement.appendChild(container);
    }
    const reminders = await fetchReminders();
    container.innerHTML = reminders.map(r => `
      <div class="flex border rounded overflow-hidden w-full h-20">
        <div class="bg-color-secondary text-color-textWhite flex items-center justify-center px-4 w-32 text-sm font-bold text-center">${r.name}</div>
        <div class="flex-1 flex flex-col justify-center px-3 py-2" style="background: #1b7fa6;">
            <span class="text-color-textWhite text-sm mb-1">${getScheduleText(r)}</span>
            <div class="flex gap-1"> 
              <button class="bg-color-tertiary text-color-textWhite px-2 py-1 rounded font-semibold text-xs editReminderBtn" data-id="${r._id}">Edit</button> 
              <button class="bg-color-delete text-color-textWhite px-2 py-1 rounded font-semibold text-xs removeReminderBtn" data-id="${r._id}">Remove</button> 
            </div>
          </div>
        </div>
      `).join('');
  }
  function showReminderPopup(reminder = {}, reminderID = null) {
    document.getElementById('reminderPopup')?.remove();
    app.classList.add('reminder-blur');

    const popup = document.createElement('div');
    popup.id = 'reminderPopup';
    popup.className = 'fixed inset-0 flex items-center justify-center z-50';

    popup.innerHTML = `
      <div class="bg-color-secondary rounded-lg p-6 w-80 relative shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-color-textWhite">${!reminderID ? 'New Reminder' : 'Edit Reminder'}</h2>
        <form id="reminderForm" class="flex flex-col gap-3">
          <input type="text" name="name" placeholder="Name..." required class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-color-textBlack placeholder-[var(--color-textWhite)]" value="${reminder.name || ''}">
          <input type="date" name="date" class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-color-textBlack placeholder-[var(--color-textWhite)]" value="${reminder.startDate || ''}">
          <input type="time" name="time" class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-color-textBlack placeholder-[var(--color-textWhite)]" value="${reminder.time || ''}" style="-webkit-appearance: none;">
          <select name="interval" required class="rounded px-2 py-1 bg-transparent border border-[var(--color-textWhite)] text-color-textBlack">
            <option value="" class="text-color-textBlack bg-color-secondary">Interval/Repeat</option>
            <option value="Daily" class="text-color-textBlack bg-color-secondary" ${reminder.interval === 'Daily' ? 'selected' : ''}>Daily</option>
            <option value="Weekly" class="text-color-textBlack bg-color-secondary" ${reminder.interval === 'Weekly' ? 'selected' : ''}>Weekly</option>
            <option value="Monthly" class="text-color-textBlack bg-color-secondary" ${reminder.interval === 'Monthly' ? 'selected' : ''}>Monthly</option>
          </select>
          <div class="flex gap-2 mt-4">
            <button type="button" id="cancelReminderBtn" class="flex-1 bg-gray-300 text-color-textBlack rounded py-1 font-semibold">Cancel</button>
            <button type="submit" class="flex-1 bg-color-tertiary text-color-textWhite rounded py-1 font-semibold">Save</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('cancelReminderBtn').onclick = () => {
      popup.remove();
      app.classList.remove('reminder-blur');
    };

    document.getElementById('reminderForm').onsubmit = async function (e) {
      e.preventDefault();
      const fd = new FormData(this);
      const newReminder = {
        name: fd.get('name'),
        date: fd.get('date'),
        time: fd.get('time'),
        interval: fd.get('interval')
      };
      try {
        if (reminderID) {
          await updateReminder(reminderID, newReminder);
        } else {
          await createReminder(newReminder);
        }
        popup.remove();
        app.classList.remove('reminder-blur');
        await renderReminders();
      } catch (err) {
        console.error(err);
      }
    };
  }
  function showDeletePopup(reminderID) {
    document.getElementById('reminderPopup')?.remove();
    app.classList.add('reminder-blur');

    const popup = document.createElement('div');
    popup.id = 'reminderPopup';
    popup.className = 'fixed inset-0 flex items-center justify-center z-50';

    popup.innerHTML = `
      <div class="bg-color-secondary rounded-lg p-6 w-80 relative shadow-lg">
        <h2 class="text-xl font-bold mb-1 text-color-textWhite">Delete Reminder</h2> <!-- Reduced mb-2 to mb-1 -->
        <p class="mb-6 text-color-textWhite">Are you sure you want to delete this reminder?</p> <!-- Reduced mb-10 to mb-6 -->
        <div class="flex gap-2">
          <button type="button" id="cancelDeleteBtn" class="flex-1 bg-gray-300 text-color-textBlack rounded py-1 font-semibold">Cancel</button>
          <button type="button" id="confirmDeleteBtn" class="flex-1 bg-color-delete text-color-textWhite rounded py-1 font-semibold">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('cancelDeleteBtn').onclick = () => {
      popup.remove();
      app.classList.remove('reminder-blur');
    };

    document.getElementById('confirmDeleteBtn').onclick = async () => {
      try {
        await deleteReminder(reminderID);
        popup.remove();
        app.classList.remove('reminder-blur');
        await renderReminders();
      } catch (err) {
        console.error('Error deleting reminder:', err);
      }
    };
  }
  await renderReminders();
  document.getElementById('addReminderBtn')?.addEventListener('click', () => showReminderPopup());

  // Edit and Remove button events (delegated)
  document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('editReminderBtn')) {
      const reminderID = e.target.dataset.id;
      const reminders = await fetchReminders();
      const reminder = reminders.find(r => r._id === reminderID);
      if (reminder) showReminderPopup(reminder, reminderID);
    }

    if (e.target.classList.contains('removeReminderBtn')) {
      const reminderID = e.target.dataset.id;
      showDeletePopup(reminderID);
    }
  });

  window.addEventListener('DOMContentLoaded', renderReminders);
})();






