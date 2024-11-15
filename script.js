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
            let board=this.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );


            let [ newState,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )
            let tmp=newState[ i ][ j ];
            newState[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            newState[ i ][ j ]=""
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces ) )
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
            // piece.Calculate_SoldierMove( board );

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
        console.log( piece.allMoves,piece.pieceID,piece.piecePosition,piece.normalMove,piece.ownReach )

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
        this.ownReach=[];
        this.opponentReach=[];
    }

    Calculate_allMoves( board ) {
        let moves=this.pieceMoves( ... this.piecePosition ).filter( move =>
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
                    if( DisplacementX>0&&DisplacementY>0 )
                    {
                        steps[ 0 ][ absDisplacementX+absDisplacementY ]=move;
                    }
                    else if( DisplacementX<0&&DisplacementY<0 )
                    {
                        steps[ 1 ][ absDisplacementX+absDisplacementY ]=move;
                    }

                }
                else if( DisplacementX*DisplacementY<0 )
                {
                    if( DisplacementX>0&&DisplacementY<0 )
                    {
                        steps[ 2 ][ absDisplacementX+absDisplacementY ]=move;
                    }
                    else if( DisplacementX<0&&DisplacementY>0 )
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
        this.allMoves=steps


    }


    Calculate_normalMove( board ) {
        if( this.pieceType.includes( "Soldier" ) )
        {
            this.Calculate_SoldierMove( board )
            return
        }

        for( let direction in this.allMoves )
        {
            for( let step in this.allMoves[ direction ] )
            {
                let move=this.allMoves[ direction ][ step ]
                let [ moveX,moveY ]=move;
                if( board[ moveX ][ moveY ]!='' )
                {
                    let piece=board[ moveX ][ moveY ]
                    // console.log(piece)
                    if( piece.color==this.color )
                    {
                        break
                    }
                    else if( piece.color==this.opponentColor )
                    {
                        // this.ownReach.push(piece)  ------>
                        // piece.opponentReach.push(this)--->/*TypeError: cyclic object value*/
                        this.attackMove.push(move)
                        this.ownReach.push( piece.pieceID )
                        piece.opponentReach.push( this.pieceID )
                        break
                    }
                }
                else if( board[ moveX ][ moveY ]=='' )
                {
                    this.normalMove.push( move )
                }
            }
        }
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
    Calculate_SoldierMove( board ) {

        for( let direction in this.allMoves )
        {
            if( direction<=3 )
            {
                for( let step in this.allMoves[ direction ] )
                {
                    let move=this.allMoves[ direction ][ step ]
                    let [ moveX,moveY ]=move;
                    if( board[ moveX ][ moveY ]!='' )
                    {
                        let piece=board[ moveX ][ moveY ]
                        if( piece.color==this.opponentColor )
                        {

                            this.attackMove.push( move )
                            break
                        }
                    }
                }
            }
            else if( direction>3 )
            {
                for( let step in this.allMoves[ direction ] )
                {
                    let move=this.allMoves[ direction ][ step ]
                    let [ moveX,moveY ]=move;
                    if( board[ moveX ][ moveY ]!='' )
                    {
                        let piece=board[ moveX ][ moveY ]
                        if( piece.color==this.color )
                        {
                            break
                        }
                        else if( piece.color==this.opponentColor )
                        {
                            // this.ownReach.push(piece)  ------>
                            // piece.opponentReach.push(this)--->/*TypeError: cyclic object value*/
                            this.ownReach.push( piece.pieceID )
                            piece.opponentReach.push( this.pieceID )
                            break
                        }
                    }
                    else if( board[ moveX ][ moveY ]=='' )
                    {
                        this.normalMove.push( move )
                    }
                }
            }

            // attackMove.push(this.allMoves[direction])

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


let startState=[ [ "blackRock1","blackKnight1","blackBishop1","blackQueen","blackKing","blackBishop2","blackKnight2","blackRock2" ],
[ "blackSoldier1","blackSoldier2","blackSoldier3","blackSoldier4","blackSoldier5","blackSoldier6","blackSoldier7","blackSoldier8" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "","","","","","","","" ],
[ "whiteSoldier1","whiteSoldier2","whiteSoldier3","whiteSoldier4","whiteSoldier5","whiteSoldier6","whiteSoldier7","whiteSoldier8" ],
[ "whiteRock1","whiteKnight1","whiteBishop1","whiteKing","whiteQueen","whiteBishop2","whiteKnight2","whiteRock2" ],];

function createBoardAndPieces( state ) {
    const allMoves={
        "whiteSoldier": ( i,j ) => [ [ i-1,j ],[ i-2,j ],[ i-1,j-1 ],[ i-1,j+1 ] ],
        "blackSoldier": ( i,j ) => [ [ i+1,j ],[ i+2,j ],[ i+1,j+1 ],[ i+1,j-1 ] ],
        "rock": ( i,j ) => {
            const positions=[];
            for( let x=1;x<8;x++ )
            {
                positions.push( [ i+x,j ],[ i-x,j ],[ i,j+x ],[ i,j-x ] );
            }
            return positions;
        },
        "bishop": ( i,j ) => {
            const positions=[];
            for( let x=1;x<8;x++ )
            {
                positions.push( [ i+x,j+x ],[ i-x,j-x ],[ i+x,j-x ],[ i-x,j+x ] );
            }
            return positions;
        },
        "knight": ( i,j ) => [
            [ i+2,j+1 ],[ i+2,j-1 ],[ i-2,j+1 ],[ i-2,j-1 ],
            [ i+1,j+2 ],[ i+1,j-2 ],[ i-1,j+2 ],[ i-1,j-2 ]
        ],
        "queen": ( i,j ) => [ ...allMoves.rock( i,j ),...allMoves.bishop( i,j ) ],
        "king": ( i,j ) => [
            [ i+1,j ],[ i-1,j ],[ i,j+1 ],[ i,j-1 ],
            [ i+1,j+1 ],[ i-1,j-1 ],[ i+1,j-1 ],[ i-1,j+1 ]
        ]
    };

    let pieces=[];
    let whitePieces=[];
    let blackPieces=[];
    let SoldierPiece=[]
    for( let row=0;row<state.length;row++ )
    {
        for( let Column=0;Column<state[ row ].length;Column++ )
        {
            let pieceName=state[ row ][ Column ]
            if( pieceName!='' )
            {
                let pieceColor=pieceName.includes( "black" )? "black":"white";
                let pieceType=Object.keys( allMoves ).find( key => pieceName.toLowerCase().includes( key.toLowerCase() ) );

                let piece=new Piece( pieceName,[ row,Column ],allMoves[ pieceType ],pieceColor,pieceType )
                pieces.push( piece )

                if( piece.color=="white" )
                {
                    whitePieces.push( piece )
                }
                else if( piece.color=="black" )
                {
                    blackPieces.push( piece )
                }
                state[ row ][ Column ]=piece;

            }
        }
    }

    return [ state,pieces,blackPieces,whitePieces ];
}



const [ StartState,pieces,blackPieces,whitePieces ]=createBoardAndPieces( startState );

let game=new GameTree( StartState,100,pieces,blackPieces,whitePieces );
// game.currentState.CalculationOfPossibleMoves()

document.body.addEventListener( "mousemove",() => game.player() )
// console.log( game.currentState.value )

// console.log(game.currentState.whitePieces)

// for(let piece of game.currentState.pieces){
// console.log(piece.attackMove)
//     console.log(piece.normalMove)

// }


// game.player( "whiteSoldier1",1 )
// game.player( "blackSoldier7",0 )
// console.log( game.currentState.CalculationOfPossibleMoves() )

