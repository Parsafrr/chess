import {State} from "/state.js";


export class GameTree {
    constructor ( startState,max_depth,pieces,blackPieces,whitePieces ) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces,blackPieces,whitePieces );
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
        this.scores={"soldier": -1,"knight": -3,"bishop": -3,"rock": -5,"queen": -9}
    }

    evaluation_function1(state) {
        let score=0;
        let removedPieces=state.removedPieces[ state.turnColor ]
        for( let piece of removedPieces )
        {
            let pieceType=piece.pieceType
            if( pieceType.toLowerCase().includes( "soldier" ) )
            {
                pieceType="soldier"
            }
            score+=this.scores[ pieceType.toLowerCase() ]
        }
        return score
    }

    minimax() {
        let pieces=this.currentState.turn===0? this.currentState.whitePieces:this.currentState.blackPieces
        let PossibleMoves = []
        for(let piece of pieces)
            PossibleMoves.push(...this.currentState.SuccessorFunction(piece));
        let optimalScore= -1000;
        let optimalMove 
        for(let newState of PossibleMoves){
            let score =  this.evaluation_function1(newState)
            if(score > optimalScore){
                console.log(score)
                optimalScore = score;
                optimalMove = newState;
            }   
        }
        this.currentState = optimalMove;
        this.updateGame( this.currentState.value )

        
    }

    Alpha_beta_pruning() {}


    player() {
        this.minimax();
        let pieces=this.currentState.turn===0? this.currentState.whitePieces:this.currentState.blackPieces
        let PossibleMoves = []
        while( true )
        {
            let piece=pieces[ Math.floor( Math.random()*pieces.length ) ]
            PossibleMoves=this.currentState.SuccessorFunction( piece );
            if(PossibleMoves.length != 0){break}
        }
        this.currentState=PossibleMoves[ Math.floor( Math.random()*PossibleMoves.length ) ]
        this.updateGame( this.currentState.value )
    }


    updateGame( state ) {
        for( let i=0;i<=7;i++ )
        {
            for( let j=0;j<=7;j++ )
            {
                const piece=state[ i ][ j ]
                const div=document.createElement( "div" );
                div.id=piece.pieceID;
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