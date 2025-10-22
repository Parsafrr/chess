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

## Notes

- This project is intended as a learning / demo project. The AI implementations are simple and can be optimized.

## License & attribution

This project is licensed under the MIT License (see `LICENSE`). You are welcome to view, fork, and reuse the code under the terms of the MIT license. When redistributing or reusing code from this repository, please:

- Retain the `LICENSE` file and copyright notice.
- Give visible credit to the original project and author (for example: "Based on chess by Parsafrr").

If you need a special permission (for example, a separate commercial or proprietary license beyond the MIT terms) or would like an explicit attribution line to include in your product, please contact the repository owner `Parsafrr` via GitHub to request permission.

Note: the text of the `LICENSE` file is the authoritative legal statement. The above are requests and best-practice guidance to ensure proper credit.
