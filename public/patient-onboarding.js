(() => {

  if (window.__onboardMounted) return;
  window.__onboardMounted = true;

  try { document.documentElement.lang = "en"; } catch {}

  const css = `
    :root{--bg:#049EDB;--teal:#0c6a70;--text:#1f2937;--muted:#e5f0ff;--white:#fff;
      --green:#22c55e;--green-hover:#16a34a;--ring-sky:#7dd3fc;--red:#e11d48;}
    *{box-sizing:border-box} html,body{height:100%}
    body{margin:0;background:var(--bg);color:var(--text);
      font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"}
    .hud{position:fixed;top:12px;left:14px;color:var(--muted);font-size:14px}
    .wrap{max-width:640px;margin:0 auto;padding:70px 16px 40px}
    .logo{display:flex;justify-content:center;margin-bottom:10px}
    .logo img{width:240px;height:240px;object-fit:contain;display:block}
    .card{max-width:480px;margin:0 auto}
    .field{margin-bottom:18px}
    .field label{display:block;font-weight:700;font-size:22px;margin-bottom:8px}
    .hint{margin-top:4px;font-size:12px;color:#f0f9ff}
    .error{margin-top:6px;font-size:12px;color:var(--red);font-weight:600;min-height:1.2em}
    input[type="text"],input[type="tel"],input[type="password"],input[type="date"],input[type="number"],select,textarea{
      width:100%;height:42px;padding:8px 12px;border-radius:8px;border:0;background:var(--white);
      box-shadow:0 1px 2px rgba(0,0,0,.08);outline:none;transition:box-shadow .15s ease}
    textarea{height:96px;resize:vertical}
    input:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px var(--ring-sky)}
    .readonly{background:var(--teal);color:#e6fbff}
    .actions{padding-top:8px;text-align:center}
    .btn{display:inline-block;padding:10px 28px;font-size:24px;font-weight:800;border-radius:10px;border:0;cursor:pointer;
      background:var(--green);color:#0f172a;box-shadow:0 2px 4px rgba(0,0,0,.15)}
    .btn:hover{background:var(--green-hover)}
    .saved{margin-top:8px;color:#f8fafc;font-size:14px;min-height:1.2em}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const host = document.getElementById("onboard-host") || document.body;

  const hud = document.createElement("div");
  hud.className = "hud";
  hud.textContent = "Patient Onboarding / Profile";
  host.appendChild(hud);

  const wrap = document.createElement("div");
  wrap.className = "wrap";
  host.appendChild(wrap);

  const logo = document.createElement("div");
  logo.className = "logo";
  logo.innerHTML = `<img src="/logo.png" alt="Logo">`; // keep logo at /public/logo.png
  wrap.appendChild(logo);

  const form = document.createElement("form");
  form.id = "onboard-form";
  form.className = "card";
  form.setAttribute("novalidate", "");
  form.innerHTML = `
    <div class="field">
      <label for="patientId">Patient ID</label>
      <input id="patientId" name="patientId" type="text" class="readonly" value="PDP-000123" style="color:#000000" readonly />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="new-password" />
      <div class="hint">Minimum 8 characters</div>
    </div>

    <div class="field">
      <label for="fullName">Full Name<span style="color:#e11d48">*</span></label>
      <input id="fullName" name="fullName" type="text" required />
      <div class="error" data-err="fullName"></div>
    </div>

    <div class="field">
      <label for="dob">Date of Birth<span style="color:#e11d48">*</span></label>
      <input id="dob" name="dateOfBirth" type="date" lang="en" required />
      <div class="error" data-err="dateOfBirth"></div>
    </div>

    <div class="field">
      <label for="sex">Sex<span style="color:#e11d48">*</span></label>
      <select id="sex" name="sex" required>
        <option value="" disabled selected>Select...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Intersex</option>
        <option>Prefer not to say</option>
      </select>
      <div class="error" data-err="sex"></div>
    </div>

    <div class="field">
      <label for="phone">Phone Number<span style="color:#e11d48">*</span></label>
      <input id="phone" name="phone" type="tel" placeholder="e.g., +61 4xx xxx xxx" required />
      <div class="error" data-err="phone"></div>
    </div>

    <div class="field">
      <label for="fullAddress">Full Address<span style="color:#e11d48">*</span></label>
      <textarea id="fullAddress" name="fullAddress" placeholder="Street, City, Country, Postcode" required></textarea>
      <div class="error" data-err="fullAddress"></div>
    </div>

    <div class="field">
      <label for="yod">Year of Diagnosis<span style="color:#e11d48">*</span></label>
      <input id="yod" name="yearOfDiagnosis" type="number" placeholder="e.g., 2025" min="1900" max="2100" step="1" required />
      <div class="error" data-err="yearOfDiagnosis"></div>
    </div>

    <div class="field">
      <label for="diag">Type of Diagnosis<span style="color:#e11d48">*</span></label>
      <select id="diag" name="diagnosisType" required>
        <option value="" disabled selected>Select...</option>
        <option>Type 1</option>
        <option>Type 2</option>
        <option>Gestational</option>
      </select>
      <div class="error" data-err="diagnosisType"></div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">Save</button>
      <div id="saved" class="saved" aria-live="polite"></div>
    </div>
  `;
  wrap.appendChild(form);

  const currentYear = new Date().getFullYear();
  const savedEl = form.querySelector("#saved");

  function setError(name, msg) {
    const el = form.querySelector('[data-err="' + name + '"]');
    if (el) el.textContent = msg || "";
  }

  function validate() {
    let ok = true;
    const required = [
      "fullName",
      "dateOfBirth",
      "sex",
      "phone",
      "fullAddress",
      "yearOfDiagnosis",
      "diagnosisType",
    ];
    required.forEach((k) => setError(k, ""));

    required.forEach((name) => {
      const field = form.elements[name];
      const val = ((field && field.value) || "").trim();
      if (!val) { setError(name, "Required"); ok = false; }
    });

    const phone = form.elements["phone"].value.trim();
    if (phone && !/^\+?[0-9 ()-]{7,}$/.test(phone)) {
      setError("phone", "Invalid phone number"); ok = false;
    }

    const y = Number(form.elements["yearOfDiagnosis"].value.trim());
    if (Number.isFinite(y) && (!Number.isInteger(y) || y < 1900 || y > currentYear)) {
      setError("yearOfDiagnosis", "Enter a year between 1900 and " + currentYear);
      ok = false;
    }

    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (savedEl) savedEl.textContent = "";
    if (!validate()) return;

    setTimeout(() => {
      if (savedEl) savedEl.textContent = "Saved at " + new Date().toLocaleTimeString();
    }, 200);
  });
})();
