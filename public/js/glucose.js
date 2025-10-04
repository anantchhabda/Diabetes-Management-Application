(function () {
    if (typeof document === "undefined") return; // Skip server

    const meals = [
        "Before Breakfast",
        "After Breakfast",
        "Before Lunch",
        "After Lunch",
        "Before Dinner",
        "After Dinner",
    ];

    const table = document.getElementById("glucoseTable");
    const modal = document.getElementById("glucoseModal");
    const modalTitle = document.getElementById("glucoseModalTitle");
    const modalInput = document.getElementById("glucoseModalInput");
    const cancelBtn = document.getElementById("cancelGlucoseBtn");
    const confirmBtn = document.getElementById("confirmGlucoseBtn");
    const saveBtn = document.getElementById("saveGlucoseBtn");
    const dateInput = document.getElementById("glucoseDate");

    const data = {};
    let currentMeal = null;

    function renderTable() {
        table.innerHTML = "";
        meals.forEach((meal) => {
            const tr = document.createElement("tr");
            tr.className = "border";

            const tdMeal = document.createElement("td");
            tdMeal.className = "bg-sky-950 text-white font-bold p-2 w-1/3";
            tdMeal.textContent = meal;

            const tdValue = document.createElement("td");
            tdValue.className = "p-2";
            tdValue.textContent = data[meal] || "";

            const tdBtn = document.createElement("td");
            tdBtn.className = "p-2";

            const btn = document.createElement("button");
            btn.className = "bg-green-600 text-white px-3 py-1 rounded";
            btn.textContent = "Edit";
            btn.addEventListener("click", () => openModal(meal));

            tdBtn.appendChild(btn);
            tr.appendChild(tdMeal);
            tr.appendChild(tdValue);
            tr.appendChild(tdBtn);

            table.appendChild(tr);
        });
    }

    function openModal(meal) {
        currentMeal = meal;
        modalTitle.textContent = meal;
        modalInput.value = data[meal] || "";
        modal.classList.remove("hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
        currentMeal = null;
    }

    function saveModal() {
        if (!currentMeal) return;
        data[currentMeal] = modalInput.value.trim();
        renderTable();
        closeModal();
    }

    cancelBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", saveModal);
    saveBtn.addEventListener("click", () => {
        alert("Data saved!\n" + JSON.stringify(data, null, 2));
    });

    dateInput.addEventListener("change", (e) => {
        console.log("Selected date:", e.target.value);
    });

    renderTable();
})();
