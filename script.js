class State {
    constructor ( parent,value,depth,turn,pieces ) {
        this.parent=parent;
        this.value=value;
        this.depth=depth;
        this.turn=turn;
        this.pieces=pieces;
        this.removedPiece=[]

    }

    SuccessorFunction( piece ) {
        let [ i,j ]=piece.piecePosition;
        const moves=this.CalculationOfPossibleMoves()
        const PossibleMoves=[];
        const PossibleState=[];
        for( const move of moves[ pieceName ] )
        {
            let newState=JSON.parse( JSON.stringify( this.value ) );
            let tmp=newState[ i ][ j ];
            newState[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            newState[ i ][ j ]=""
            newPiecesPosition[ pieceName ]=move
            PossibleMoves.push( move );
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPiecesPosition ) )
        }
        return [ PossibleMoves,PossibleState ];
    }

    CalculationOfPossibleMoves() {

        const turn=this.turn;
        const opponent=turn===0? "white":"black";

        function is_opponent( board,move ) {
            return board[ move[ 0 ] ][ move[ 1 ] ].includes( opponent );
        }

        const board=this.value;

        for( const piece of this.pieces )
        {
            piece.Calculate_allMoves( board );
            piece.Calculate_normalMove( board );
            piece.Calculate_attackMove( board );

        }


        // function isWithinBoard( move ) {
        //     return ( 0<=move[ 0 ]&&move[ 0 ]<8 )&&( 0<=move[ 1 ]&&move[ 1 ]<8 );
        // }

        // function is_blocked( board,move ) {
        //     return board[ move[ 0 ] ][ move[ 1 ] ]!="";
        // }


        // function is_SoldierMove( piece,board,move ) {
        //     if( piece.includes( "Soldier" ) )
        //     {

        //         if( Math.abs( move[ 1 ]-piecesPosition[ piece ][ 1 ] )>=1 )
        //         {
        //             const OpponentPieceColor=opponent( board,move )
        //             if( board[ move[ 0 ] ][ move[ 1 ] ].includes( OpponentPieceColor ) )
        //             {
        //                 return true
        //             }
        //             else
        //             {
        //                 return false
        //             }
        //         }
        //         else
        //         {
        //             return true
        //         }
        //     }
        //     else
        //     {
        //         return true
        //     }
        // }

        // const board=this.value;
        // function validMoves( PossibleMoves ) {
        //     const PossibleValidMoves={}
        //     console.log( PossibleMoves )
        //     for( const piece in PossibleMoves )
        //     {
        //         PossibleValidMoves[ piece ]=[]
        //         const moves=PossibleMoves[ piece ];
        //         for( const move of moves )
        //         {
        //             if( isWithinBoard( move ) )
        //             {
        //                 if( is_blocked( board,move ) )
        //                 {
        //                     if( is_opponent( board,move ) )
        //                     {
        //                         PossibleValidMoves[ piece ].push( move )
        //                     }
        //                     else
        //                     {
        //                         break
        //                     }
        //                 }
        //                 else if( !is_SoldierMove( piece,board,move ) )
        //                 {
        //                     continue
        //                 }
        //                 else
        //                 {
        //                     PossibleValidMoves[ piece ].push( move );
        //                 }
        //             }
        //         }
        //     }
        //     return PossibleValidMoves
        // }


        // const PossibleValidMoves=validMoves( PossibleMoves );

        // return PossibleValidMoves;
    }
}



class GameTree {
    constructor ( startState,max_depth,pieces ) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces );
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
    }

    player( piece,move ) {
        let [ PossibleMoves,PossibleState ]=this.currentState.SuccessorFunction( piece );
        // console.log(PossibleState[1].value)
        this.currentState=PossibleState[ move ]
        this.updateGame( this.currentState.value )

    }

    updateGame( state ) {
        for( let i=0;i<=7;i++ )
        {
            for( let j=0;j<=7;j++ )
            {
                const piece=state[ i ][ j ]
                const div=document.createElement( "div" );
                div.id=piece;
                if( piece!='' )
                {
                    const image=document.createElement( "img" );
                    image.src=`images/${ piece.pieceID }.png`;
                    div.appendChild( image )
                }
                const lastDiv=gameBoard.children[ i ].children[ j ].children[ 0 ]
                if( lastDiv )
                {
                    gameBoard.children[ i ].children[ j ].children[ 0 ].remove();
                }
                gameBoard.children[ i ].children[ j ].appendChild( div );

            }
        }
    }




}

class Piece {
    constructor ( pieceID,piecePosition,pieceMoves,color ) {
        this.pieceID=pieceID;
        this.color=color;
        this.piecePosition=piecePosition;
        this.pieceMoves=pieceMoves;
        this.opponentColor=this.color==="black"? "white":"black";
        this.allMoves=this.pieceMoves( ... this.piecePosition );
        this.normalMove=[]
        this.attackMove=[];
        this.attacker = [];
        this.Threatened_by=[];
    }
    
    Calculate_allMoves( board ) {
        this.allMoves=this.allMoves.filter( move =>
            move[ 0 ]>=0&&move[ 0 ]<8&&move[ 1 ]>=0&&move[ 1 ]<8
        );
    }


    Calculate_normalMove( board ) {
        this.normalMove=this.allMoves.filter( move =>
            board[move[0]][move[1]] == ''
        );
    }

    Calculate_attackMove( board ) {
        this.attackMove=this.allMoves.filter( move =>
            board[move[0]][move[1]] != '' && (board[move[0]][move[1]].color == this.opponentColor)
        );
    }
    Calculate_treats( board ) {}
}


const [ startState,pieces ]=createStartBoard();
let game=new GameTree( startState,100,pieces );
game.currentState.CalculationOfPossibleMoves()
console.log( game.currentState.value )



// game.player( "whiteSoldier1",1 )
// game.player( "blackSoldier7",0 )
// console.log( game.currentState.CalculationOfPossibleMoves() )

