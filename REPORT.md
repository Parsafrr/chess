# Project Report

This small chess project implements board construction, piece move generation, state successor generation, and simple AI.

## Summary of work done

- Cleaned up repository by adding documentation files and metadata.
- Added high-level documentation and a short report.

## Algorithms used

- Move generation: piece-specific displacement rules (in `createBoard.js` / `piece.js`).
- Successor generation: `State.SuccessorFunction` applies moves and returns new `State` instances.
- AI: heuristic evaluation combining material and positional heuristics; minimax-like search in `minimax.js`.

## Next steps

- Add unit tests for `SuccessorFunction` and `Piece.Calculate_allMoves`.
- Consider porting to TypeScript and adding CI.
