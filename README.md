# n8n Contact Form

A contact form that sends each message to an n8n workflow. The workflow saves the message in Google Sheets, notifies me by email, and sends the visitor a confirmation email.

## How it works

```
Visitor fills the form
        |
        v
n8n Webhook
        |
        v
IF: is the email valid?
   |-- no  --> reply with a 400 error
   |-- yes --> Google Sheets (save the row)
                    |
                    v
               Gmail (notify me)
                    |
                    v
               Gmail (auto-reply to the visitor)
                    |
                    v
               Respond to Webhook (success)
```

A separate **Error Alert** workflow emails me whenever the main workflow fails.

## Project files

| File | Purpose |
|---|---|
| `index.html` | The form (name, email, message) |
| `style.css` | Styling |
| `script.js` | Sends the form data to the n8n webhook |

## Built with

- HTML, CSS and JavaScript (no frameworks)
- [n8n](https://n8n.io) for the workflow automation
- Google Sheets and Gmail
- ngrok, to give my local n8n a public address

## Run it yourself

1. Start n8n and create a workflow with these nodes, in order: Webhook (POST, path `contact-form`), If, Google Sheets (Append Row), Gmail (Send), Gmail (Send), Respond to Webhook.
2. Create a Google Sheet with the headers `Timestamp`, `Name`, `Email`, `Message`.
3. Open `script.js` and set `WEBHOOK_URL` to your own n8n webhook address.
4. Open `index.html` in a browser (or use the VS Code Live Server extension) and submit the form.

## Notes

- The webhook address in `script.js` is the only setting to change.
- Credentials (Google sign-in) live in n8n and are never stored in this repo.
- The webhook's CORS setting should be limited to the website's own address.

## Author

Alex ([alexNdolo-dev](https://github.com/alexNdolo-dev))