import {State} from "/state.js";


export class GameTree {
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
        let removedPieces=state.removedPieces[ "white" ]
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
            score-=this.scores[ pieceType.toLowerCase() ]
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

    evaluation_function( state ) {
        let value1=this.evaluation_function1( state );
        let value2=this.evaluation_function2( state );
        return 10*value1+5*value2;
    }


    minimax( state ) {
        let max_depth=state.depth+2;
        let currentState=state;
        let currentHead=0;
        let stack=[ currentState ];
        let Adjacency_List=new Map();
        let i=0;
        let alpha=-Infinity;
        let beta=+Infinity;
        let value;
        while( stack.length!=0 )
        {
            if( currentState.depth>=max_depth&&Adjacency_List.get( currentHead )!="visited" )
            {
                Adjacency_List.set( currentHead,"visited" );
                let successors;
                let successor;
                successors=this.calculateSuccessor( currentState,currentHead,stack,Adjacency_List,true );
                if( currentState.turn==0 )
                {
                    [ successor,value ]=this.max_value( currentState,successors );
                }
                else
                {
                    [ successor,value ]=this.min_value( currentState,successors );
                }

                stack[ currentHead ]=successor;
                currentHead=currentHead-1;
                currentState=stack[ currentHead ];
            }


            else if( currentState.depth<max_depth )
            {
                if( Adjacency_List.has( currentHead ) )
                {
                    let successors=Adjacency_List.get( currentHead ).map( ( value,index ) => stack[ value ] )
                    let successor;
                    if( currentState.turn==0 )
                    {
                        [ successor,value ]=this.max_value( currentState,successors );
                    }
                    else
                    {
                        [ successor,value ]=this.min_value( currentState,successors );
                    }
                    if( currentHead==0 )
                    {
                        stack[ currentHead ]=successor;
                        Adjacency_List.set( currentHead,"visited" );
                        stack=[];
                        currentState=successor;
                        break
                    }
                    let upperBound;
                    for( let i of Adjacency_List.keys() )
                    {
                        for( let j of Adjacency_List.get( i ) )
                        {
                            if( currentHead==j )
                            {
                                upperBound=Math.max( ...Adjacency_List.get( i ) )+1;
                            }
                        }
                    }
                    stack[ currentHead ]=successor;
                    Adjacency_List.set( currentHead,"visited" );
                    stack=stack.slice( 0,upperBound )
                    Adjacency_List.forEach( ( value,key ) => {
                        if( key>upperBound-1 )
                        {
                            Adjacency_List.delete( key )
                        }
                    } );
                    stack[ currentHead ]=successor;
                    currentHead=currentHead-1;
                    currentState=stack[ currentHead ];
                }
                else
                {
                    [ currentState,currentHead,stack,Adjacency_List ]=this.calculateSuccessor( currentState,currentHead,stack,Adjacency_List,false );
                }
            }
            else if( Adjacency_List.get( currentHead )=="visited" )
            {
                currentHead-=1;
                currentState=stack[ currentHead ]
            }
            // console.log( currentState )
            // console.log( currentHead )
            // console.log( stack );
            // console.log( Adjacency_List )
            i+=1;
        }
        // console.log( currentState )
        // console.log( currentHead )
        // console.log( stack );
        // console.log( Adjacency_List )
        // console.log(this.findRoot(currentState,max_depth-1))
        console.log(currentState.removedPieces)
        console.log( value )
        return this.findRoot( currentState,max_depth-1 )

    }
    calculateSuccessor( currentState,currentHead,stack,Adjacency_List,is_end ) {
        let pieces=currentState.turn===0? currentState.whitePieces:currentState.blackPieces;
        let successors=[]
        for( let piece of pieces )
            successors.push( ...currentState.SuccessorFunction( piece ) )
        if( is_end )
        {

            return successors
        }
        else
        {
            let lastHeadOfStack=stack.length;
            stack.push( ...successors );
            Adjacency_List.set( currentHead,[] )
            for( let index=lastHeadOfStack;index<( stack.length );index++ )
            {
                Adjacency_List.get( currentHead ).push( index );
            }
        }

        currentHead=stack.length-1;
        currentState=stack[ currentHead ];
        return [ currentState,currentHead,stack,Adjacency_List ];
    }


    max_value( state,successors ) {
        let maxValue=-Infinity;
        let maxSuccessor
        for( let successor of successors )
        {
            let value=this.evaluation_function( successor );
            if( value>maxValue )
            {
                maxValue=value;
                maxSuccessor=successor;
            }
        }
        return [ maxSuccessor,maxValue ];
    }

    min_value( state,successors ) {
        let minValue=Infinity;
        let minSuccessor
        for( let successor of successors )
        {
            let value=this.evaluation_function( successor );
            if( value<minValue )
            {
                minValue=value;
                minSuccessor=successor;
            }
        }

        return [ minSuccessor,minValue ];
    }





    isTerminal( state ) {
        return false
    }

    findRoot( state,minDepth ) {
        while( state.depth>minDepth )
        {
            state=state.parent;
        }
        return state
    }

    player1() {
        this.currentState=this.minimax( this.currentState );
        this.updateGame( this.currentState.value )
    }



    maximizer() {
        let pieces=this.currentState.turn===0? this.currentState.whitePieces:this.currentState.blackPieces
        let PossibleMoves=[]
        for( let piece of pieces )
            PossibleMoves.push( ...this.currentState.SuccessorFunction( piece ) );
        let optimalScore=-1000;
        let optimalMove
        for( let newState of PossibleMoves )
        {
            let score=this.evaluation_function1( newState )
            if( score>optimalScore )
            {
                console.log( score )
                optimalScore=score;
                optimalMove=newState;
            }
        }
        this.currentState=optimalMove;
        this.updateGame( this.currentState.value )


    }

    Alpha_beta_pruning() {}



    player() {
        this.maximizer();
        let pieces=this.currentState.turn===0? this.currentState.whitePieces:this.currentState.blackPieces
        let PossibleMoves=[]
        while( true )
        {
            let piece=pieces[ Math.floor( Math.random()*pieces.length ) ]
            PossibleMoves=this.currentState.SuccessorFunction( piece );
            if( PossibleMoves.length!=0 ) {break}
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