/**
 * Entry script that wires up the initial board and creates a GameTree AI instance.
 */
import {createBoardAndPieces} from "./createBoard.js";
import {State} from "./state.js";
// import {GameTree} from "/gameTree.js";
import { GameTree } from "./minimax.js";
import {Piece} from "./piece.js";
import { initDesignBoard } from "./designBoard.js";
// import { GameTree } from "./Alpha_beta_pruning.js";






let startState=[ [ "blackRock1","blackKnight1","blackBishop1","blackQueen","blackKing","blackBishop2","blackKnight2","blackRock2" ],
[ "blackSoldier1","blackSoldier2","blackSoldier3","blackSoldier4","blackSoldier5","blackSoldier6","blackSoldier7","blackSoldier8" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "whiteSoldier1","whiteSoldier2","whiteSoldier3","whiteSoldier4","whiteSoldier5","whiteSoldier6","whiteSoldier7","whiteSoldier8" ],
[ "whiteRock1","whiteKnight1","whiteBishop1","whiteQueen","whiteKing","whiteBishop2","whiteKnight2","whiteRock2" ],];

// let startState=[[ "blackRock1","blackKnight1","blackBishop1","blackQueen","blackKing","blackBishop2","blackKnight2","blackRock2" ],
//                             [ "blackSoldier1","blackSoldier2","blackSoldier3","","blackSoldier5","blackSoldier6","blackSoldier7","blackSoldier8" ],
//                             [ "","","","blackSoldier4","","","","" ],
//                             [ "","","","","","","","" ],
//                             [ "","","","","","","","" ],
//                             [ "","whiteQueen","whiteSoldier3","","","","","" ],
//                             [ "whiteSoldier1","whiteSoldier2","","whiteSoldier4","whiteSoldier5","whiteSoldier6","whiteSoldier7","whiteSoldier8" ],
//                             [ "whiteRock1","whiteKnight1","whiteBishop1","","whiteKing","whiteBishop2","whiteKnight2","whiteRock2" ],];


// let startState=[ [ "","","","","blackKing","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","blackRock1" ],
// [ "","","","whiteKing","","","","blackRock2" ],];

// let startState=[ [ "","","","","blackKing","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","blackRock1" ],
// [ "","","","","","","","blackRock2" ],
// [ "","","","whiteKing","","","","" ],];


// let startState=[ [ "blackKing","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","whiteKing","" ],
// [ "","","","","","","","" ],
// [ "","","blackSoldier1","blackSoldier2","","","","" ],
// [ "whiteBishop1","","","","","","","" ],];


// let startState=[ [ "blackKing","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","whiteSoldier1","whiteSoldier2","whiteSoldier3","","","","" ],
// [ "","whiteBishop2","whiteKing","whiteBishop1","","","","" ],];

// let startState=[ [ "blackKing","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "blackrock2","","","","","","","" ],
// [ "","","","","","","","" ],
// [ "blackRock1","","whiteKing","","","","","" ],];


const [ StartState,pieces,blackPieces,whitePieces ]=createBoardAndPieces( startState );

export let game=new GameTree( StartState,5,pieces,blackPieces,whitePieces );
// initialize the UI/board interactions after creating the game instance
initDesignBoard(game);
// game.currentState.CalculationOfPossibleMoves()
document.body.addEventListener( "keydown",( e ) => {
    if( e.key=="ArrowLeft" )
    {
        game.updateGame( game.currentState.parent.value )
    }
    else if( e.key=="ArrowRight" )
    {
        game.minimax(game.currentState);
    }
    else if( e.key=="ArrowUp" )
    {
        console.log( game.evaluation_function( game.currentState ) );
    }
    else if( e.key=="ArrowDown" )
    {   
        console.log( game.currentState );
    }
}
);

