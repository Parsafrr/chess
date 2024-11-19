import { State } from "/state.js";


export class GameTree {
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
        // console.log( piece.allMoves,piece.pieceID,piece.piecePosition,piece.normalMove,piece.ownReach )

        let PossibleMoves=this.currentState.SuccessorFunction( piece );
        let number=Math.floor( Math.random()*PossibleMoves.length );
        this.currentState=PossibleMoves[ number ]
        // console.log( this.currentState,this.currentState.pieces.length )
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