import {game} from "/script.js";
var gameBoard=document.getElementById( "gameBoard" );
let is_show_on=false;
function clearBoardMoves() {
    for( let squarePackage of gameBoard.children )
    {
        for( let square of squarePackage.children )
        {
            square.className='';
            square.children[0].setAttribute('data-is_show_on','false')
            square.children[0].setAttribute('data-pieceID','')
        }
    }
}
for( let i=0;i<=7;i++ )
{
    for( let j=0;j<=7;j++ )
    {
        const div=gameBoard.children[ i ].children[ j ];
        div.children[0].setAttribute("data-moves",[i,j])
        div.children[0].setAttribute("data-is_show_on",is_show_on)
        div.addEventListener( "click",( e ) => {
            if(e.target.getAttribute('data-is_show_on')=='true'){
                let move = (e.target.getAttribute('data-moves'))
                let pieceID= e.target.getAttribute('data-pieceID')
                let piece=game.currentState.whitePieces.find( el => el.pieceID==pieceID )
                game.player2(piece,Number(move[0]),Number(move[2]))
            }
            if( e.target.id.includes( "white" )&&!is_show_on)
            {
                let piece=game.currentState.whitePieces.find( el => el.pieceID==e.target.id )
                piece.Calculate_allMoves( game.currentState.value )
                let moves=[ ...piece.attackMove,...piece.normalMove ]
                is_show_on=true;
                for( let move of moves )
                {
                    gameBoard.children[ move[ 0 ] ].children[ move[ 1 ] ].className="possibleMove";
                    gameBoard.children[ move[ 0 ] ].children[ move[ 1 ] ].children[0].setAttribute('data-is_show_on',is_show_on);
                    gameBoard.children[ move[ 0 ] ].children[ move[ 1 ] ].children[0].setAttribute('data-pieceID',piece.pieceID);


                }
            }
            else
            {
                clearBoardMoves()
                is_show_on=false;
            }
        } )
        if( ( i+j )%2==0 )
        {
            div.style.backgroundColor="#ebecd0";
        }
        else if( ( i+j )%2==1 )
        {
            div.style.backgroundColor="#739552";
        }
    }
}

