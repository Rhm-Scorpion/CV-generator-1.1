# CV Generator

Aplikacija za pravljenje profesionalnih CV-jeva sa exportom u PDF.

## Pokretanje

```bash
npm install
npm run dev
```

Otvori `http://localhost:3000`.

## Funkcionalnosti

- Popunjavanje ličnih podataka, obrazovanja, radnog iskustva, veština i jezika
- 3 predloška: Moderni, Klasični, Minimalisti
- Live preview — vidi CV u realnom vremenu dok kucaš
- Export u PDF
- Drag & drop redosled stavki
- Auto-save u localStorage
- 18 jezika interfejsa
- Detekcija jezika po podešavanjima pretraživača

## Tech Stack

- React 19 + TypeScript
- Vite 4
- Tailwind CSS 3
- @react-pdf/renderer
- @dnd-kit (drag & drop)
- motion (animacije)
