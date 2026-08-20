# IIEE Institutional Website

This workspace contains an editorial Winter Chill multi-page static website for the Institute of Industrial Electronics Engineering. It uses the exact uploaded transparent crest, a Polar Night / Arctic Sunrise palette, numbered sections, a homepage bookshelf interaction with a PDF.js open-book reader, and a working admissions flow.

## Main pages
- index.html - Pakistan's first dedicated industrial electronics institute
- programs.html - B.E. Industrial Electronics Engineering
- admissions.html - Admissions
- about.html - History, mission, and leadership
- faculty.html - Faculty portrait grid
- campus.html - Labs, facilities, and partners
- notices.html - Admission notices and circulars
- contact.html - Contact

## Styling
- styles.css contains the shared institutional theme and responsive behavior.
- script.js contains the admissions wizard, FAQ toggles, mobile menu, and homepage magazine reader.

The homepage reader loads the supplied PDFs directly, renders real PDF pages, and supports desktop two-page spreads, edge-click navigation, Previous/Next controls, and drag-to-turn gestures:
- `assets/IIEE Chronicles 2024-25.pdf`
- `assets/IIEE Chronicles 2025-26 (2).pdf`

## Preview locally
Open any HTML file in a browser, or run a simple local server from this workspace:

python -m http.server 8000

Then visit http://localhost:8000/
