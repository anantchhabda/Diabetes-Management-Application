(function() {
  if (typeof document === "undefined") return;

  // Helper functions for i18n
  function getDict() {
    return (window.__i18n && window.__i18n.dict) || {};
  }

  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback;
  }

  // Constants for data rows
  const GLUCOSE_ROWS = [
    "Before Breakfast",
    "After Breakfast", 
    "Before Lunch",
    "After Lunch",
    "Before Dinner",
    "After Dinner"
  ];

  const INSULIN_ROWS = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night"
  ];

  // Get the patient ID from URL params
  function getPatientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  // Fetch patient data for a specific date
  async function fetchPatientData(date) {
    const patientId = getPatientId();
    if (!patientId) {
      console.error('No patient ID provided');
      return null;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const res = await fetch(`/api/patient/${patientId}/data/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching patient data:', err);
      return null;
    }
  }

  // Update table with glucose data
  function updateGlucoseTable(data) {
    const table = document.getElementById('dataTable');
    if (!table) return;

    table.innerHTML = '';
    GLUCOSE_ROWS.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border';
      
      const tdLabel = document.createElement('td');
      tdLabel.className = 'bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base';
      tdLabel.textContent = t(rowKey(row), row);
      
      const tdValue = document.createElement('td');
      tdValue.className = 'px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-900';
      tdValue.textContent = data?.glucose?.[rowKey(row)] || '—';
      
      tr.appendChild(tdLabel);
      tr.appendChild(tdValue);
      table.appendChild(tr);
    });
  }

  // Update table with insulin data
  function updateInsulinTable(data) {
    const table = document.getElementById('dataTable');
    if (!table) return;

    table.innerHTML = '';
    INSULIN_ROWS.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border';
      
      const tdLabel = document.createElement('td');
      tdLabel.className = 'bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base';
      tdLabel.textContent = t(rowKey(row), row);
      
      const tdValue = document.createElement('td');
      tdValue.className = 'px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-900';
      tdValue.textContent = data?.insulin?.[rowKey(row)] || '—';
      
      tr.appendChild(tdLabel);
      tr.appendChild(tdValue);
      table.appendChild(tr);
    });
  }

  // Update comments display
  function updateComments(data) {
    const commentsDisplay = document.getElementById('commentsDisplay');
    if (commentsDisplay) {
      commentsDisplay.textContent = data?.comments || t('no_comments', 'No comments for this date.');
    }
  }

  // Helper for row keys
  function rowKey(s) {
    return `row_${s.toLowerCase().replace(/\s+/g, '_')}`;
  }

  // Tab switching logic
  function setupTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const tableWrap = document.getElementById('tableWrap');
    const commentsWrap = document.getElementById('commentsWrap');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active states
        tabs.forEach(t => {
          t.classList.remove('bg-green-600');
          t.classList.add('bg-[#049EDB]');
          t.setAttribute('aria-pressed', 'false');
        });
        tab.classList.remove('bg-[#049EDB]');
        tab.classList.add('bg-green-600');
        tab.setAttribute('aria-pressed', 'true');

        // Show/hide appropriate content
        if (tab.dataset.tab === 'comments') {
          tableWrap.classList.add('hidden');
          commentsWrap.classList.remove('hidden');
        } else {
          tableWrap.classList.remove('hidden');
          commentsWrap.classList.add('hidden');
          // Refresh data display
          refreshData();
        }
      });
    });
  }

  // Date change handler
  async function onDateChange(e) {
    const date = e.target.value;
    if (!date) return;
    
    const data = await fetchPatientData(date);
    if (!data) return;

    const activeTab = document.querySelector('[aria-pressed="true"]');
    if (!activeTab) return;

    switch (activeTab.dataset.tab) {
      case 'glucose':
        updateGlucoseTable(data);
        break;
      case 'insulin':
        updateInsulinTable(data);
        break;
      default:
        updateComments(data);
    }
  }

  // Initial setup
  async function init() {
    // Set up date input
    const dateInput = document.getElementById('dataDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
      dateInput.addEventListener('change', onDateChange);
      
      // Trigger initial load
      const event = new Event('change');
      dateInput.dispatchEvent(event);
    }

    // Set up tabs
    setupTabs();
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();