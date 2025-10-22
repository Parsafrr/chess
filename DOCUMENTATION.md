# Project documentation

## Overview

This project is organized as small ES modules for a browser-based chess demo. Key modules:

- `piece.js` — Piece class; generates moves, separates normal vs attack moves and tracks reachability.
- `createBoard.js` — `createBoardAndPieces(state)` takes a 2D array of piece ID strings and returns an initialized board and piece lists.
- `state.js` — `State` class representing a board state; has successor generation methods used by the AI.
- `minimax.js`, `gameTree.js`, `Alpha_beta_pruning.js` — different AI or search implementations. They expose a `GameTree` class which holds the current `State` and search/evaluation code.

## Important functions/classes

### Piece (class, `piece.js`)

- constructor(pieceID, piecePosition, pieceMoves, color, pieceType)
- Calculate_allMoves(board)
- Calculate_normalMove(board)
- Calculate_attackMove(board)
- Calculate_SoldierMove(board)
- is_InBoard(moves)
- filterKingMove(board)
- is_opponentInPosition(board, opponentColor, moves)

### createBoardAndPieces(state) (`createBoard.js`)

- Input: 2D array of piece ID strings ("whiteKing", "blackSoldier1", or "")
- Output: [board, pieces, blackPieces, whitePieces]

### State (class, `state.js`)

- constructor(parent, value, depth, turn, pieces, blackPieces, whitePieces, removedPieces)
- computeAllMove(board)
- computeAllSuccessors()
- SuccessorFunction(piece)
- computeKingMove(king)

## AI notes

There are multiple AI implementations in the repo. They use heuristic evaluation functions combining material and positional heuristics. `minimax.js` implements a recursive minimax with alpha-beta-like structure. `gameTree.js` and `Alpha_beta_pruning.js` have alternative implementations and may be incomplete.

## Limitations & next steps

- Add formal tests (Jest or similar) for successor generation.
- Add TypeScript or JSDoc types for better editor support.
- Improve alpha-beta implementation and performance.
