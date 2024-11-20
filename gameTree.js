import {State} from "/state.js";


export class GameTree {
    constructor ( startState,max_depth,pieces,blackPieces,whitePieces ) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces,blackPieces,whitePieces );
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
        this.scores = {"soldier":1,"knight":3,"bishop":3,"rock":5,"queen":9}
    }

    evaluation_function1(){
        this.player()
        let pieces = []
        if(this.currentState.turn == 0){
            pieces = this.currentState.whitePieces; 
        }
        else if(this.currentState.turn == 1){
            pieces = this.currentState.blackPieces; 
        }
        let score = 0;
        let removedPieces = this.currentState.removedPieces[this.currentState.turnColor]
        for(let piece of removedPieces){
            score+=this.scores[piece.pieceType.toLowerCase()]
        }
        console.log(removedPieces,score)
    }

    minimax(){}

    Alpha_beta_pruning(){}


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
        let PossibleMoves=this.currentState.SuccessorFunction( piece );
        let number=Math.floor( Math.random()*PossibleMoves.length );
        this.currentState=PossibleMoves[ number ]

        // console.log( piece )
        // console.log( this.currentState ) // important console

        // console.log( this.currentState,this.currentState.pieces.length )
        this.updateGame( this.currentState.value )
    }

    // player2( id ) {
    //     if( id!="undefined" )
    //     {
    //         let pieces=this.currentState.pieces;
    //         let piece=pieces.find( piece => piece.pieceID==id )
    //         let board=this.currentState.value;
    //         piece.Calculate_allMoves( board );
    //         piece.Calculate_normalMove( board );
    //         piece.Calculate_attackMove( board );
    //         let moves=this.currentState.SuccessorFunction( piece )
    //         console.log(moves)
    //         for( let move of moves )
    //         {
    //             console.log( move )
    //         }
    //     }
    // }

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