/* ============================================================
   custom.js — Lauren Souris
   → Contact Form
   → Quote Generator
   → Grade Converter Tool
============================================================ */

/* ================= SMALL HELPERS ================= */
//  easier to select elements by ID or CSS selector
function byId(id) { return document.getElementById(id); }
function qs(sel, root) { return (root || document).querySelector(sel); }

/* ================= CONTACT FORM =================
   - Validates name, email, and message
   - Shows a small popup for confirmation
   - Updates status text and resets the form
================================================== */
document.addEventListener("submit", function (e) {
  var form = e.target;
  var isContact = form && (form.id === "contactForm" || form.closest("#contact"));
  if (!isContact) return;

  e.preventDefault();

  var nameEl  = byId("name");
  var emailEl = byId("email");
  var msgEl   = byId("message");
  var status  = byId("formStatus");
  var popup   = byId("formPopup");
  var emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Small helper for basic error alerts
  function fail(msg) {
    alert(msg);
    if (status) status.textContent = msg;
  }

  // Gather input values
  var name = (nameEl?.value || "").trim();
  var email = (emailEl?.value || "").trim();
  var message = (msgEl?.value || "").trim();

  // Basic validation
  if (name.length < 2) return fail("Please enter your full name.");
  if (!emailOK.test(email)) return fail("Please enter a valid email address.");
  if (message.length < 10) return fail("Message should be at least 10 characters.");

  if (status) status.textContent = "Message sent successfully ✅";

  // Small popup confirmation (disappears after 3s)
  if (popup) {
    if (!byId("popupStyle")) {
      var s = document.createElement("style");
      s.id = "popupStyle";
      s.textContent =
        "#formPopup{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:9999}" +
        "#formPopup.show{display:flex}" +
        "#formPopup .popup-content{background:#1b1f3b;color:#fff;border-radius:10px;padding:20px;text-align:center;max-width:90%}";
      document.head.appendChild(s);
    }

    var nameSpan = qs("#popupName", popup);
    if (nameSpan) nameSpan.textContent = name;

    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");

    var hide = function () {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
      popup.removeEventListener("click", hide);
    };
    setTimeout(hide, 3000);
    popup.addEventListener("click", hide);
  } else {
    alert("Message sent!");
  }
  form.reset();
});

/* ================= QUOTE GENERATOR =================
   - Used on Home/About pages
   - Clicks a button to show one of my random quotesd
==================================================== */
var QUOTES = [
  "Education is the lighting of a fire.",
  "Students learn best when they feel safe and supported.",
  "Clarity helps students feel confident.",
  "Design for access first; excellence follows.",
  "Practice builds confidence; reflection builds growth.",
  "Assessment should guide improvement.",
  "Inclusion starts with empathy.",
  "Feedback is strongest when it’s specific and timely.",
  "Celebrate small wins every day.",
  "Teach with patience and lead with kindness."
];

document.addEventListener("click", function (e) {
  var btn = e.target.closest("#quoteBtn, [data-quote-btn]");
  if (!btn) return;

  var out = byId("quoteOut") || qs("[data-quote-out]");
  if (!out) return;

  var i = Math.floor(Math.random() * QUOTES.length);
  out.textContent = "“" + QUOTES[i] + "”";
});

/* ================= GRADE CONVERTER =================
   - Used on gctool.html
   - Converts mark to grade
   - Enter key shortcut included
==================================================== */

// Helper: returns grade label + class
function getGrade(n) {
  if (n >= 85) return { text: "HD (High Distinction)", cls: "gc-hd" };
  if (n >= 75) return { text: "D (Distinction)", cls: "gc-d" };
  if (n >= 65) return { text: "C (Credit)", cls: "gc-c" };
  if (n >= 50) return { text: "P (Pass)", cls: "gc-p" };
  return { text: "F (Fail)", cls: "gc-f" };
}

// Converts input mark to grade result
function convertGrade() {
  var mark = byId("gcMark");
  var out = byId("gcOut");
  if (!mark || !out) return;

  var v = parseFloat(mark.value);
  if (isNaN(v) || v < 0 || v > 100) {
    out.textContent = "Please enter a mark between 0 and 100.";
    return;
  }

  var g = getGrade(v);
  out.innerHTML = "Result: " + Math.round(v) + "/100 → " +
    "<span class='gc-badge " + g.cls + "'>" + g.text + "</span>";
}

// Clears mark and result
function clearGrade() {
  var mark = byId("gcMark");
  var out = byId("gcOut");
  if (!mark || !out) return;
  mark.value = "";
  out.textContent = "";
  mark.focus();
}

// Click handlers
document.addEventListener("click", function (e) {
  if (e.target.closest("#gcBtn")) convertGrade();
  if (e.target.closest("#gcClear")) clearGrade();
});

// Enter key shortcut
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (!byId("gcMark")) return;
  e.preventDefault();
  convertGrade();
});
