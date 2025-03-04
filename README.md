# Súper Pokémon

A website for Pokémon TCG enthusiasts in Uvita, Costa Rica.

## Project Structure

```
.
├── assets/
│   ├── cards/         # Card-related images
│   ├── data/          # JSON data files
│   ├── items/         # Item sprites
│   ├── maps/          # Map images
│   ├── pokemon/       # Pokémon sprites
│   └── ui/            # UI elements
├── index.html         # Main HTML file
├── script.js          # JavaScript code
└── styles.css         # CSS styles
```

## Assets Organization

- **cards/** - Contains card-related images like card backs
- **data/** - Contains JSON data files that are served publicly
  - `decks.json` - Information about pre-made decks
  - `inventory.json` - Information about available cards
- **items/** - Contains item sprites like Poké Balls
- **maps/** - Contains map images
- **pokemon/** - Contains Pokémon sprites
- **ui/** - Contains UI elements like deck, hand, and collection icons

## Adding New JSON Files

To add new JSON files that need to be served publicly, place them in the `assets/data/` directory. They will be accessible via:

```
assets/data/your-file.json
```

## Development

This is a static website that uses HTML, CSS, and JavaScript. No build process is required. 