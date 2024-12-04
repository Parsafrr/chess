import {Piece} from "./piece.js";
import {createBoardAndPieces} from "/createBoard.js";

export class State {
    constructor ( parent,value,depth,turn,pieces,blackPieces,whitePieces,removedPieces={"white": [],"black": []} ) {
        this.parent=parent;
        this.value=value;
        this.depth=depth;
        this.turn=turn;
        this.turnColor=this.turn===0? "white":"black";
        this.turnOpponentColor=this.turn===0? "black":"white";
        this.pieces=pieces;
        this.whitePieces=whitePieces;
        this.blackPieces=blackPieces;
        this.removedPieces=removedPieces;
        this.whiteKing=null;
        this.blackKing=null;
        this.score=0;
        this.computeAllMove( this.value );
    }

    computeKingMove( king ) {
        let successors=this.SuccessorFunction( king )
        let newSuccessors=[];
        for( let successor of successors )
        {
            let newKing=successor.pieces.find( piece => piece.pieceID==king.pieceID )
            if( newKing.opponentReach.length==0 )
            {
                newSuccessors.push( successor )
            }
        }
        return newSuccessors
    }

    computeAllSuccessors() {
        let pieces=this.turn===0? this.whitePieces:this.blackPieces
        let successors=[];
        for( let piece of pieces )
        {
            if( piece.pieceType!="king" )
            {
                let PossibleStates=this.SuccessorFunction( piece );
                successors.push( ...PossibleStates )
            }
            else
            {
                successors.push( ...this.computeKingMove( piece,successors ) )
            }
        }
        return successors;
    }

    computeAllMove( board ) {
        for( let piece of this.pieces )
        {
            if( piece.pieceID=="whiteKing" ) {this.whiteKing=piece}
            else if( piece.pieceID=="blackKing" ) {this.blackKing=piece}
            piece.Calculate_allMoves( board );
            piece.Calculate_normalMove( board );
            piece.Calculate_attackMove( board );
        }
    }

    SuccessorFunction( piece ) {
        let board=this.value;
        const PossibleMoves=[];
        const PossibleState=[];
        const normalMoves=[ ...piece.normalMove ]
        const attackMoves=[ ...( piece.attackMove===undefined? []:piece.attackMove ) ]
        for( const move of normalMoves )
        {
            let board=this.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );

            let [ i,j ]=piece.piecePosition;
            let tmp=board[ i ][ j ];
            board[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            board[ i ][ j ]="";

            let [ newState,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )

            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces,this.removedPieces ) )
        }
        for( const move of attackMoves )
        {
            let board=this.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );

            let [ i,j ]=piece.piecePosition;
            let opponentPiece=this.value[ move[ 0 ] ][ move[ 1 ] ]
            let removedPiece=opponentPiece;
            let newRemovedPieces=JSON.parse( JSON.stringify( this.removedPieces ) );;
            newRemovedPieces[ removedPiece.color ].push( removedPiece );
            let tmp=board[ i ][ j ];
            board[ move[ 0 ] ][ move[ 1 ] ]=tmp;
            board[ i ][ j ]=""
            let [ newState,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )
            PossibleState.push( new State( this,newState,this.depth+1,( this.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces,newRemovedPieces ) )
        }
        return PossibleState;
    }


}
