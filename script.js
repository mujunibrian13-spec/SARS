// ---------------------------------------------------------------------------
// Paste the Web App URL you get after deploying Code.gs (see SETUP instructions).
// It looks like: https://script.google.com/macros/s/AKfycb.../exec
// ---------------------------------------------------------------------------
const WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

function setStatus(form, message, kind) {
  const el = form.querySelector("[data-status]");
  el.textContent = message;
  el.className = "form-status" + (kind ? " " + kind : "");
}

function markTouched(form) {
  form.querySelectorAll("input").forEach((input) => {
    input.classList.add("touched");
  });
}

async function submitForm(form, formType) {
  markTouched(form);

  if (!form.checkValidity()) {
    setStatus(form, "Please fill in every field correctly.", "error");
    return;
  }

  if (WEB_APP_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    setStatus(form, "Form is not connected yet — set WEB_APP_URL in script.js.", "error");
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  setStatus(form, "Submitting…", "pending");

  const formData = new FormData(form);
  formData.append("formType", formType);

  try {
    // Apps Script web apps don't return readable CORS headers to fetch(),
    // so this call is fire-and-forget: a resolved promise just means the
    // request was sent, not that the row was necessarily written.
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    setStatus(form, "Submitted! Check the sheet to confirm it was saved.", "success");
    form.reset();
    form.querySelectorAll("input").forEach((input) => input.classList.remove("touched"));
  } catch (err) {
    setStatus(form, "Network error — please try again.", "error");
  } finally {
    button.disabled = false;
  }
}

document.getElementById("student-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitForm(event.target, "student");
});

document.getElementById("activity-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitForm(event.target, "activity");
});
