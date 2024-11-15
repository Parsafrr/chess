class State {
    constructor ( parent,value,depth,turn,pieces,blackPieces,whitePieces ) {
        this.parent=parent;
        this.value=value;
        this.depth=depth;
        this.turn=turn;
        this.pieces=pieces;
        this.whitePieces=whitePieces;
        this.blackPieces=blackPieces;
        this.removedPiece=[];

    }

    SuccessorFunction( piece ) {
        const PossibleMoves=[];
        const PossibleState=[];
        const moves=[ ...( piece.attackMove===undefined? []:piece.attackMove ),...piece.normalMove ]
        // piece.canMove( this.value,moves )
        for( const move of moves )
        {
            let [ i,j ]=piece.piecePosition;
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
            // piece.Calculate_attackMove( board );

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
    constructor ( startState,max_depth,pieces,blackPieces,whitePieces ) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces,blackPieces,whitePieces );
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
    }

    player() {
        let piece=''
        this.currentState.CalculationOfPossibleMoves();
        if( this.currentState.turn==0 )
        {
            while( true )
            {
                let number=Math.floor( Math.random()*this.currentState.whitePieces.length );
                piece=this.currentState.whitePieces[ number ]
                if( [ ...piece.attackMove,...piece.normalMove ].length!=0 )
                {
                    break
                }
            }
        }
        else if( this.currentState.turn==1 )
        {
            while( true )
            {
                let number=Math.floor( Math.random()*this.currentState.blackPieces.length );
                piece=this.currentState.blackPieces[ number ]
                if( [ ...piece.attackMove,...piece.normalMove ].length!=0 )
                {
                    break
                }
            }
        }
        
        console.log(piece)
        let PossibleMoves=this.currentState.SuccessorFunction( piece );
        let number=Math.floor( Math.random()*PossibleMoves.length );
        this.currentState=PossibleMoves[ number ]
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
    constructor ( pieceID,piecePosition,pieceMoves,color,pieceType ) {
        this.pieceID=pieceID;
        this.color=color;
        this.piecePosition=piecePosition;
        this.pieceMoves=pieceMoves;
        this.pieceType=pieceType;
        this.opponentColor=this.color==="black"? "white":"black";
        this.allMoves=[]
        this.normalMove=[]
        this.attackMove=[];
        this.ownReach = [];
        this.opponentReach = [];
    }

    Calculate_allMoves( board ) {
        let moves= this.pieceMoves( ... this.piecePosition ).filter( move =>
            move[ 0 ]>=0&&move[ 0 ]<8&&move[ 1 ]>=0&&move[ 1 ]<8
        );
        let steps={0: {},1: {},2: {},3: {},4: {},5: {},6: {},7: {}}
        for( let move of moves )
        {
            let [ currentX,currentY ]=move;
            let [ nextX,nextY ]=this.piecePosition;
            let DisplacementX=currentX-nextX;
            let DisplacementY=currentY-nextY;
            let absDisplacementX=Math.abs( currentX-nextX );
            let absDisplacementY=Math.abs( currentY-nextY );

            if( DisplacementX!=0&&DisplacementY!=0 )
            {
                if( DisplacementX*DisplacementY>0 )
                {
                    if( DisplacementX> 0 && DisplacementY >0 )
                    {
                        steps[ 0 ][ absDisplacementX+absDisplacementY ]=move;
                    }
                    else if( DisplacementX< 0 && DisplacementY < 0 )
                    {
                        steps[ 1 ][ absDisplacementX+absDisplacementY ]=move;
                    }

                }
                else if( DisplacementX*DisplacementY<0 )
                {
                    if(DisplacementX> 0 && DisplacementY < 0  )
                    {
                        steps[ 2 ][ absDisplacementX+absDisplacementY ]=move;
                    }
                    else if(DisplacementX< 0 && DisplacementY > 0  )
                    {
                        steps[ 3 ][ absDisplacementX+absDisplacementY ]=move;
                    }

                }
            }

            else if( DisplacementX==0&&DisplacementY!=0 )
            {
                if( DisplacementY<0 )
                {
                    steps[ 4 ][ absDisplacementX+absDisplacementY ]=move;
                }
                else if( DisplacementY>0 )
                {
                    steps[ 5 ][ absDisplacementX+absDisplacementY ]=move;
                }
            }
            else if( DisplacementX!=0&&DisplacementY==0 )
            {
                if( DisplacementX<0 )
                {
                    steps[ 6 ][ absDisplacementX+absDisplacementY ]=move;
                }
                else if( DisplacementX>0 )
                {
                    steps[ 7 ][ absDisplacementX+absDisplacementY ]=move;
                }
            }

        }
        this.allMoves = steps
        

    }


    Calculate_normalMove( board ) {
        this.normalMove = []
        this.ownReach = []
        this.opponentReach = []
        for( let direction in this.allMoves )
        {
            for(let step in this.allMoves[direction]){
                let move = this.allMoves[direction][step]
                let [moveX,moveY] = move; 
                if(board[moveX][moveY] != ''){
                    let piece = board[moveX][moveY] 
                    // console.log(piece)
                    if(piece.color == this.color){
                        break
                    }
                    else if(piece.color == this.opponentColor){
                        this.ownReach.push(piece)
                        piece.opponentReach.push(this)
                        break
                    }
                }
                else if(board[moveX][moveY] == ''){
                    this.normalMove.push(move)
                }
            }
        }
        // console.log(this.ownReach)
    }

    Calculate_attackMove( board ) {
        if( this.pieceType.includes( "Soldier" ) )
        {
            this.Calculate_SoldierAttackMove( board,this )
        }
        else
        {
            this.attackMove=this.is_opponentInPosition( board,this.opponentColor,this.allMoves )
        }
    }
    Calculate_SoldierAttackMove( board,piece ) {

        let whiteSoldierAttack=( i,j ) => [ [ i-1,j-1 ],[ i-1,j+1 ] ]
        let blackSoldierAttack=( i,j ) => [ [ i+1,j+1 ],[ i+1,j-1 ] ]


        if( this.pieceID.includes( "white" ) )
        {
            this.attackMove=this.is_opponentInPosition( board,this.opponentColor,this.is_InBoard( whiteSoldierAttack( piece.piecePosition[ 0 ],piece.piecePosition[ 1 ] ) ) )
        }
        else if( piece.pieceID.includes( "black" ) )
        {
            this.attackMove=this.is_opponentInPosition( board,this.opponentColor,this.is_InBoard( blackSoldierAttack( piece.piecePosition[ 0 ],piece.piecePosition[ 1 ] ) ) )
        }
    }

    is_InBoard( moves ) {
        moves=moves.filter( move =>
            move[ 0 ]>=0&&move[ 0 ]<8&&move[ 1 ]>=0&&move[ 1 ]<8
        );
        return moves
    }

    is_opponentInPosition( board,opponentColor,moves ) {
        moves=moves.filter( move =>
            board[ move[ 0 ] ][ move[ 1 ] ]!=''&&board[ move[ 0 ] ][ move[ 1 ] ].color==opponentColor
        );
        return moves
    }

}



const [ startState,pieces,blackPieces,whitePieces ]=createStartBoard();
let game=new GameTree( startState,100,pieces,blackPieces,whitePieces );
// game.currentState.CalculationOfPossibleMoves()

document.body.addEventListener( "mousedown",() => game.player() )
console.log( game.currentState.value )

// console.log(game.currentState.whitePieces)

// for(let piece of game.currentState.pieces){
// console.log(piece.attackMove)
//     console.log(piece.normalMove)

// }


// game.player( "whiteSoldier1",1 )
// game.player( "blackSoldier7",0 )
// console.log( game.currentState.CalculationOfPossibleMoves() )

