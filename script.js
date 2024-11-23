import {createBoardAndPieces} from "/createBoard.js";
import {State} from "/state.js";
import {GameTree} from "/gameTree.js";
import {Piece} from "/piece.js";






let startState=[ [ "blackRock1","blackKnight1","blackBishop1","blackQueen","blackKing","blackBishop2","blackKnight2","blackRock2" ],
[ "blackSoldier1","blackSoldier2","blackSoldier3","blackSoldier4","blackSoldier5","blackSoldier6","blackSoldier7","blackSoldier8" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "whiteSoldier1","whiteSoldier2","whiteSoldier3","whiteSoldier4","whiteSoldier5","whiteSoldier6","whiteSoldier7","whiteSoldier8" ],
[ "whiteRock1","whiteKnight1","whiteBishop1","whiteKing","whiteQueen","whiteBishop2","whiteKnight2","whiteRock2" ],];




const [ StartState,pieces,blackPieces,whitePieces ]=createBoardAndPieces( startState );

export let game=new GameTree( StartState,5,pieces,blackPieces,whitePieces );
// game.currentState.CalculationOfPossibleMoves()
// document.body.addEventListener( "mousedown",( e ) => game.evaluation_function1())

document.body.addEventListener( "keydown",( e ) => {
    if( e.key=="ArrowLeft" )
    {
        game.updateGame(game.currentState.parent.value)
    }
    else if( e.key=="ArrowRight" )
    {
        game.player1();
    }
}
);

