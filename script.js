// ---------------------------------------------------------------
// script.js: sends the contact form data to n8n
// ---------------------------------------------------------------

// The address of your n8n webhook. This is where the form data is sent.
// Use the TEST URL (/webhook-test/) while testing in the n8n editor.
// After you publish the workflow, switch to the PRODUCTION URL (/webhook/).
const WEBHOOK_URL = "https://drool-district-muscular.ngrok-free.dev/webhook/contact-form";

// Find the elements on the page by their id and store them in variables,
// so we can use them below. These ids must match your index.html exactly.
const form = document.getElementById("contactForm");   // the whole <form>
const statusEl = document.getElementById("status");    // <p> that shows messages
const btn = document.getElementById("submitBtn");      // the Send Message button

// Run this function every time the form is submitted
// (the visitor clicks the button, or presses Enter in a field).
// "async" lets us use "await" inside to wait for the network request.
form.addEventListener("submit", async (e) => {

  // Stop the browser's default behavior, which is to reload the page.
  // We want to send the data ourselves without leaving the page.
  e.preventDefault();

  // Disable the button so the visitor can't click it twice while sending,
  // and tell them something is happening.
  btn.disabled = true;
  statusEl.textContent = "Sending...";

  // Collect what the visitor typed into one object.
  // form.name, form.email and form.message find the inputs by their
  // name="" attributes. .value is the text typed in, and .trim() removes
  // any extra spaces at the start or end.
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  // "try" runs the risky code (a network request can fail).
  // If anything goes wrong, JavaScript jumps to "catch".
  try {

    // Send the data to n8n with a POST request.
    // "await" pauses here until n8n replies.
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",                                    // we are sending data
      headers: { "Content-Type": "application/json" },   // tells n8n it is JSON
      body: JSON.stringify(data)                         // turns the object into JSON text
    });

    // res.ok is true when n8n answers with a success code (200 to 299).
    // If not, we create an error on purpose so "catch" handles it.
    if (!res.ok) throw new Error("Request failed: " + res.status);

    // Success: thank the visitor and clear the form for the next message.
    statusEl.textContent = "Thank you! Your message has been sent.";
    form.reset();

  } catch (err) {
    // Something failed (n8n not reachable, wrong URL, CORS problem, etc.).
    // Show a friendly message to the visitor, and log the real error
    // in the browser console (F12 > Console) for you to debug.
    statusEl.textContent = "Something went wrong. Please try again.";
    console.error(err);

  } finally {
    // "finally" runs whether the request succeeded or failed.
    // Turn the button back on so the visitor can try again.
    btn.disabled = false;
  }
});