import { createBoardAndPieces } from "/createBoard.js";

export class State {
    constructor ( parent,value,depth,turn,pieces,blackPieces,whitePieces,removedPieces=[] ) {
        this.parent=parent;
        this.value=value;
        this.depth=depth;
        this.turn=turn;
        this.pieces=pieces;
        this.whitePieces=whitePieces;
        this.blackPieces=blackPieces;
        this.removedPieces=removedPieces;

    }

    SuccessorFunction( piece ) {
        const PossibleMoves=[];
        const PossibleState=[];
        const normalMoves=[ ...piece.normalMove ]
        const attackMoves=[ ...( piece.attackMove===undefined? []:piece.attackMove ) ]

        // piece.canMove( this.value,moves )
        for( const move of normalMoves )
        {
            let [ i,j ]=piece.piecePosition;
            let board=this.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );


            let [ newState,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )
            let tmp=newState[ i ][ j ];
            newState[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            newState[ i ][ j ]=""
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces ) )
        }
        for( const move of attackMoves )
        {
            let [ i,j ]=piece.piecePosition;
            if( this.value[ move[ 0 ] ][ move[ 1 ] ]!="" )
            {
                let opponentPiece=this.value[ move[ 0 ] ][ move[ 1 ] ]
                this.removedPieces.push( opponentPiece )
                if( opponentPiece.pieceType=="king" )
                {
                    // console.log( ( this.removedPieces,piece ) )
                }
            }
            let board=this.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );


            let [ newState,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )
            let tmp=newState[ i ][ j ];
            newState[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            newState[ i ][ j ]=""
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces,this.removedPieces ) )
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
