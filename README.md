# Chess (minimal JS engine)

This repository contains a small JavaScript chess engine and UI scaffold. It implements piece movement generation, game state, and simple AI (minimax / alpha-beta variants).

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
