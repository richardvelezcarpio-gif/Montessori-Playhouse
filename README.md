# Montessori Playhouse Premium Website

Static bilingual website (English primary / Spanish secondary) based on the provided flyer, logo and activity images.

## Open locally
1. Run `npm install`.
2. Run `npm run build` to validate the site and assets.
3. Serve the folder with a local static server. The email endpoint runs as a Vercel Function in Vercel's local or production environment.

## Main features
- English / Spanish language buttons
- Responsive mobile + desktop design
- Same purple, yellow, green, orange and pink brand family
- Programs and licensing information from the flyer
- Pre-registration form that sends the completed information securely by email
- Floating WhatsApp button
- Phone call buttons
- Ridgewood, NY address and contact information

## Email configuration
Configure these private environment variables in Vercel (never in browser code):
- `GMAIL_USER=montessoriplayhousegfd@gmail.com`
- `GMAIL_APP_PASSWORD` with a Google App Password for that account

Email destination: `montessoriplayhousegfd@gmail.com`.

## WhatsApp number
Currently configured to Marelyn: +1 (646) 953-7825.
To change it, replace `16469537825` in `index.html` and `script.js`.

## Assets
- `assets/montessori-playhouse-logo.png` — transparent Montessori Playhouse logo
- `assets/photos/` — individual daycare photos used throughout the page
- `assets/flyer-reference.png` — original flyer reference

The previous `assets/gallery.png` collage is retained as an unused source asset; it is not referenced by the website.
