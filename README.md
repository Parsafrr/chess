# Chess (minimal JS engine)

This repository contains a small JavaScript chess engine and UI scaffold. It implements piece movement generation, game state, and simple AI (minimax / alpha-beta variants).

Disclaimer: This project was created for educational and recreational purposes and is incomplete. Use it as a learning reference rather than a production-ready engine.

## What you'll find

- `piece.js` — Piece class and move generation helpers.
- `createBoard.js` — Helpers to build board and piece objects from a simple 2D array representation.
- `state.js` — Game `State` object and successor generation.
- `minimax.js`, `gameTree.js`, `Alpha_beta_pruning.js` — AI logic and tree search implementations.
- `script.js` and `index.htm` — Minimal UI wiring.

## Getting started

1. Open `index.htm` in a browser (it expects `images/*.png` for piece art).
2. The code is written as ES modules and intended to run in a browser environment.

## Run locally

There are two simple ways to run the project locally. Because the code uses ES modules, some browsers require the files to be served from a local HTTP server rather than opened via the `file://` protocol.

Option A — Open directly in a browser

- Double-click `index.htm` or open it from your browser. This may work in many browsers, but if you see module loading errors in the console, use Option B.

Option B — Run a lightweight local HTTP server (recommended)

1) Using Node (http-server)

If you have Node.js installed, you can install and run `http-server` quickly.

```cmd
npm install -g http-server
cd C:\parsa\projectAi\chess\final\chess
http-server -c-1
```

Then open the URL printed by `http-server` (usually `http://127.0.0.1:8080`) in your browser.

1) Using Python (if Node is not available)

If you have Python 3 installed, run the built-in HTTP server from the project directory:

```cmd
cd C:\parsa\projectAi\chess\final\chess
python -m http.server 8000
```

Then open `http://127.0.0.1:8000` in your browser.

Notes

- The UI expects an `images/` folder with piece PNGs named like `whiteKing.png`, `blackSoldier1.png`, etc. If the images are missing, the board will still load but pieces may be empty.
- Use the browser developer console to inspect errors and AI evaluation logs (the script prints debug output to the console).

## Notes

- This project is intended as a learning / demo project. The AI implementations are simple and can be optimized.

## License & attribution

This project is licensed under the MIT License (see `LICENSE`). You are welcome to view, fork, and reuse the code under the terms of the MIT license. When redistributing or reusing code from this repository, please:

- Retain the `LICENSE` file and copyright notice.
- Give visible credit to the original project and author (for example: "Based on chess by Parsafrr").

If you need a special permission (for example, a separate commercial or proprietary license beyond the MIT terms) or would like an explicit attribution line to include in your product, please contact the repository owner `Parsafrr` via GitHub to request permission.

Note: the text of the `LICENSE` file is the authoritative legal statement. The above are requests and best-practice guidance to ensure proper credit.
