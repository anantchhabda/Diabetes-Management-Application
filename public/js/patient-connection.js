// public/js/patient-connection.js

document.addEventListener("DOMContentLoaded", () => {
  // ===== Containers =====
  const currentContainer = document.getElementById("currentConnections");
  const outgoingContainer = document.getElementById("outgoingRequests");

  // ===== Data =====
  let currentConnections = [
    { role: "Doctor", name: "John Smith" },
    { role: "Doctor", name: "Jane Smith" },
    { role: "Family Member", name: "Jane Doe" },
  ];

  let outgoingRequests = [
    { role: "Doctor", name: "Doctor Eggman" },
    { role: "Family Member", name: "Julia Doe" },
  ];

  // ===== Helpers =====
  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function renderConnections() {
    // --- Current Connections ---
    clearChildren(currentContainer);

    if (!currentConnections.length) {
      const p = document.createElement("p");
      p.className = "text-gray-500";
      p.textContent = "No current connections";
      currentContainer.appendChild(p);
    } else {
      currentConnections.forEach((c, idx) => {
        const div = document.createElement("div");
        div.className = "grid grid-cols-[100px_1fr_auto] border border-black";

        div.innerHTML = `
          <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
            ${c.role}
          </div>
          <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
            ${c.name}
          </div>
          <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
            Remove
          </button>
        `;

        const removeBtn = div.querySelector("button");
        removeBtn.addEventListener("click", () => {
          currentConnections.splice(idx, 1);
          renderConnections();
        });

        currentContainer.appendChild(div);
      });
    }

    // --- Outgoing Requests ---
    clearChildren(outgoingContainer);

    if (!outgoingRequests.length) {
      const p = document.createElement("p");
      p.className = "text-gray-500";
      p.textContent = "No outgoing requests";
      outgoingContainer.appendChild(p);
    } else {
      outgoingRequests.forEach((r, idx) => {
        const div = document.createElement("div");
        div.className = "grid grid-cols-[100px_1fr_auto_auto] border border-black";

        div.innerHTML = `
          <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
            ${r.role}
          </div>
          <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
            ${r.name}
          </div>
          <button class="bg-[var(--color-tertiary)] text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
            Add
          </button>
          <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
            Remove
          </button>
        `;

        const [addBtn, removeBtn] = div.querySelectorAll("button");

        addBtn.addEventListener("click", () => {
          currentConnections.push({ role: r.role, name: r.name });
          outgoingRequests.splice(idx, 1);
          renderConnections();
        });

        removeBtn.addEventListener("click", () => {
          outgoingRequests.splice(idx, 1);
          renderConnections();
        });

        outgoingContainer.appendChild(div);
      });
    }
  }

  // ===== Initial render =====
  renderConnections();
});
