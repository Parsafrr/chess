import {Piece} from "/piece.js";
import {State} from "/state.js";

/**
 * Alpha-beta pruning variant of GameTree (work-in-progress).
 */
export class GameTree {
    /**
     * @param {Array<Array>} startState
     * @param {number} max_depth
     * @param {Array<Piece>} pieces
     * @param {Array<Piece>} blackPieces
     * @param {Array<Piece>} whitePieces
     */
    constructor ( startState,max_depth,pieces,blackPieces,whitePieces ) {
        this.startState=startState;
        this.max_depth=max_depth;
        this.currentState=new State( null,startState,0,0,pieces,blackPieces,whitePieces );
        this.list=[]
        this.list.push( this.currentState )
        this.updateGame( this.startState )
        this.scores={"soldier": 100,"knight": 3000,"bishop": 3000,"rock": 5000,"queen": 9000}
    }

    evaluation_function1( state ) {
        let score=0;
        let removedPieces=state.removedPieces[ "white" ].concat( state.removedPieces[ 'black' ] )
        for( let piece of removedPieces )
        {
            let pieceType=piece.pieceType
            if( pieceType.toLowerCase().includes( "soldier" ) )
            {
                pieceType="soldier"
            }
            else if( pieceType.toLowerCase().includes( "knight" ) )
            {
                pieceType="knight"
            }
            else if( pieceType.toLowerCase().includes( "bishop" ) )
            {
                pieceType="bishop"
            }
            else if( pieceType.toLowerCase().includes( "rock" ) )
            {
                pieceType="rock"
            }
            else if( pieceType.toLowerCase().includes( "queen" ) )
            {
                pieceType="queen"
            }
            if( piece.color=="black" )
            {
                score+=this.scores[ pieceType.toLowerCase() ]
            }
            else if( piece.color=="white" )
            {
                score-=this.scores[ pieceType.toLowerCase() ]
            }
        }
        return score
    }
    evaluation_function2( state ) {
        const positionValues=[
            [ 1,2,3,3,3,3,2,1 ],
            [ 2,4,6,6,6,6,4,2 ],
            [ 3,6,8,8,8,8,6,3 ],
            [ 3,6,8,10,10,8,6,3 ],
            [ 3,6,8,10,10,8,6,3 ],
            [ 3,6,8,8,8,8,6,3 ],
            [ 2,4,6,6,6,6,4,2 ],
            [ 1,2,3,3,3,3,2,1 ],
        ];

        let score=0;

        for( let piece of state.whitePieces )
        {
            let [ x,y ]=piece.piecePosition;
            score+=positionValues[ x ][ y ];
        }

        for( let piece of state.blackPieces )
        {
            let [ x,y ]=piece.piecePosition;
            score-=positionValues[ x ][ y ];
        }

        return score;


    }


    evaluation_terminal( state ) {
        let pieces=state.turn===0? state.whitePieces:state.blackPieces;
        let king=pieces.find( piece => piece.pieceType=="king" );
        let score;
        if( this.isTerminal( state,king ) )
        {
            let successors=state.SuccessorFunction( king )
            successors=state.computeKingMove( king,successors )
            if( successors.length==0 )
            {
                state.isTerminal=true;
                if( king.color=="white" ) {score=-Infinity}
                else if( king.color=="black" ) {score=Infinity}
            }
            else
            {
                if( state.turn==0 )
                {
                    score=successors.length
                }
                else if( state.turn==1 )
                {
                    score=-successors.length
                }
            }
            return score;
        }
        else
        {
            return 0;
        }
    }
    isTerminal( state,king ) {
        if( king.opponentReach.length!=0 )
        {
            return true;
        }
        else {return false}
    }


    evaluation_function( state ) {
        let value1=this.evaluation_function1( state );
        let value2=this.evaluation_function2( state );
        let valueTerminal=this.evaluation_terminal( state );
        return 10*value1+5*value2+1000*valueTerminal;
    }

    AlphaBetaPruning( state ) {
        let next_depth=state.depth+1;
        let max_depth=state.depth+2;
        let Head=0;
        let currentHead =0;
        let stack=[ state ];
        let Adjacency_List=new Map();
        let alpha=-Infinity;
        let beta=Infinity;
        let value;
        let i = 0
        // while( stack.length!=0 )
        while( i<10)
        {
            if( stack[ currentHead ].depth>=max_depth )
            {
                if(Adjacency_List.get( Head ).length==0 )
                {
                    Adjacency_List.get(currentHead).push(value)
                    stack.pop()
                    currentHead=currentHead-1;
                    value = null;
                }
                else
                {
                    value=stack[ currentHead ]
                    let valueScore=this.evaluation_function( stack[ currentHead ] );
                    if( stack[ currentHead ].turn==0 )
                    {
                        if( this.evaluation_function( stack[ currentHead ] )>valueScore )
                        {
                            value=stack[ currentHead ]
                            valueScore=score;
                        }
                    }
                    else
                    {
                        if( this.evaluation_function( stack[ currentHead ] )<valueScore )
                        {
                            value=stack[ currentHead ]
                            valueScore=score;
                        }
                    }
                    stack.pop()
                    Adjacency_List.get( Head ).pop();

                    currentHead=currentHead-1;
                }
            }
            else
            {
                
                currentHead = Head;
                let pieces=stack[Head].turn===0? stack[Head].whitePieces:stack[Head].blackPieces;
                let successors=stack[Head].computeAllSuccessors();
                let lastHeadOfStack=stack.length;
                stack.push( ...successors );
                Adjacency_List.set( Head,[] )
                for( let index=lastHeadOfStack;index<( stack.length );index++ )
                {
                    Adjacency_List.get( Head ).push( index );
                }
                currentHead=stack.length-1;
            }
            console.log( currentHead )
            console.log( stack );
            console.log( Adjacency_List )
            i+=1
        }
        // console.log( Head )
        // console.log( value )
        // console.log( alpha,beta )
        // console.log( stack );
        // console.log( Adjacency_List )
        
        // let root=this.findRoot( currentState,next_depth )
        // return root;

    }


    playerAlphaBetaPruning() {
        this.currentState=this.AlphaBetaPruning( this.currentState );
        this.updateGame( this.currentState.value )
    }



    findRoot( state,minDepth ) {
        while( state.depth>minDepth )
        {
            state=state.parent;
        }
        return state
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