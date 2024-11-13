class State {
    constructor ( parent,value,depth,turn,pieces,blackPieces, whitePieces) {
        this.parent=parent;
        this.value=value;
        this.depth=depth;
        this.turn=turn;
        this.pieces=pieces;
        this.whitePieces = whitePieces;
        this.blackPieces = blackPieces;
        this.removedPiece=[];

    }

    SuccessorFunction( piece ) {
        const PossibleMoves=[];
        const PossibleState=[];
        for( const move of [...piece.attackMove , ...piece.normalMove] )
        {
            let[i,j] = piece.piecePosition;
            let newState=JSON.parse( JSON.stringify( this.value ) );
            let tmp=newState[ i ][ j ];
            newState[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            newState[ i ][ j ]=""
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,this.pieces,this.blackPieces,this.whitePieces ) )
        }
        return PossibleState;
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




    }
}



class GameTree {
    constructor ( startState,max_depth,pieces,blackPieces ,whitePieces) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces ,blackPieces,whitePieces);
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
    }

    player() {
        let piece = ''
        if(this.currentState.turn == 0){
            while (true){
                let number = Math.floor(Math.random()*this.currentState.whitePieces.length);
                piece = this.currentState.whitePieces[number]
                if([...piece.attackMove , ...piece.normalMove].length != 0){
                    break
                }
            }
        }
        else if(this.currentState.turn == 1){
            while (true){
                let number = Math.floor(Math.random()*this.currentState.blackPieces.length);
                piece = this.currentState.blackPieces[number]
                if([...piece.attackMove , ...piece.normalMove].length != 0){
                    break
                }
            }
        }

        
        let PossibleMoves = this.currentState.SuccessorFunction(piece);
        let number = Math.floor(Math.random()*PossibleMoves.length);
        this.currentState = PossibleMoves[number]
        this.updateGame(this.currentState.value)
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
    }

    Calculate_allMoves( board ) {
        this.allMoves=this.allMoves.filter( move =>
            move[ 0 ]>=0&&move[ 0 ]<8&&move[ 1 ]>=0&&move[ 1 ]<8
        );
    }


    Calculate_normalMove( board ) {
        for(let move of this.allMoves){
            if(board[ move[ 0 ] ][ move[ 1 ] ]==''){
                this.normalMove.push(move)
            }
            else{
                break
            }
        }
    }

    Calculate_attackMove( board ) {
        for(let move of this.allMoves){
            if(( board[ move[ 0 ] ][ move[ 1 ] ]!='')  && ( board[ move[ 0 ] ][ move[ 1 ] ].color==this.opponentColor)){
                this.attackMove.push(move)
            }
            else{
                break
            }
        }
    }


}


const [ startState,pieces,blackPieces,whitePieces ]=createStartBoard();
let game=new GameTree( startState,100,pieces,blackPieces,whitePieces );
game.currentState.CalculationOfPossibleMoves()

document.body.addEventListener("mousedown",()=>game.player())

// console.log(game.currentState.whitePieces)

// for(let piece of game.currentState.pieces){
// console.log(piece.attackMove)
//     console.log(piece.normalMove)

// }


// game.player( "whiteSoldier1",1 )
// game.player( "blackSoldier7",0 )
// console.log( game.currentState.CalculationOfPossibleMoves() )

