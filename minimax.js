import {Piece} from "/piece.js";
import {State} from "/state.js";
import {createBoardAndPieces} from "/createBoard.js";



/**
 * Simple minimax-based GameTree controller used by the UI.
 */
export class GameTree {
    /**
     * @param {Array<Array>} startState - board array (Piece objects or "")
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
        this.scores={"soldier": 1,"knight": 3,"bishop": 3,"rock": 5,"queen": 9}
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


    evaluation_checkMode( state ) {
        let score=-( state.whiteKing.opponentReach.length )+( state.blackKing.opponentReach.length )
        return score;
    }

    evaluation_checkMateMode( state ) {
        if( this.isCheckMate( state ) )
        {
            let score;
            if( state.whiteKing.opponentReach!=0 )
            {
                score=-Infinity
            }
            else if( state.blackKing.opponentReach!=0 )
            {
                score=Infinity
            }
            return score;
        }
        else {return 0}
    }
    evaluation_function( state ) {
        let value1=this.evaluation_function1( state );
        let value2=this.evaluation_function2( state );
        let valueCheckMode=this.evaluation_checkMode( state );
        let valueCheckMateMode=this.evaluation_checkMateMode( state );
        return 1000*value1+50*value2+10000*valueCheckMode+valueCheckMateMode;
    }

    isCheck( state ) {
        if( state.whiteKing.opponentReach.length!=0||state.blackKing.opponentReach.length!=0 )
        {
            return true;
        }
        else {return false}
    }
    isCheckMate( state ) {
        if( this.isCheck( state ) )
        {
            let successors=state.computeAllSuccessors()

            for( let successor of successors )
            {
                if( !this.isCheck( successor ) )
                {
                    return false;
                }
            }
            return true;

        }
    }
    minimax( state ) {
        let step=0;
        let minDepth = state.depth+1;
        let successor =  this.value( state,-Infinity,Infinity,step );
        this.currentState = this.findRoot(successor,minDepth)
        // this.updateGame( this.currentState.value )
        // console.log("------------------------")
    }

    value( state,alpha,beta,step ) {
        let king=state.turn===0? state.whiteKing:state.blackKing;
        let successor;
        if( this.isCheckMate( state ) || step>2 )
        {
            // console.log( this.currentState.score)

            return state
        }
        else
        {
            if( state.turn==0 )
            {
                successor=this.max_value( state,alpha,beta,step );
                // console.log("max")
                // console.log(successor.score)
            }
            else if (state.turn==1 )
            {
                successor=this.min_value( state,alpha,beta,step );
                // console.log("min-------------------")

                // console.log(successor.score)
            }
        }
        // console.log(successor.score)
        return successor;
    }

    max_value( state,alpha,beta,step ) {
        let successors=state.computeAllSuccessors();
        let maxSuccessor=null;
        let value=-Infinity;
        successors.forEach( successor => successor.score=this.evaluation_function( successor ) );
        successors.sort( ( a,b ) => b.score-a.score );
        for( let successor of successors )
        {
            // successor.score=this.evaluation_function( successor )
            successor =  this.value( successor,alpha,beta,step+1 );
            if( value<successor.score )
            {
                value=successor.score;
                maxSuccessor=successor;
            }
            if( value>=beta )
            {
                return maxSuccessor
            }
            if( alpha<value )
            {
                alpha=value;
            }
        }
        return maxSuccessor
        // return successors[ 0 ]
    }

    min_value( state,alpha,beta,step ) {
        let successors=state.computeAllSuccessors();
        let minSuccessor=null;
        let value=Infinity;
        successors.forEach( successor => successor.score=this.evaluation_function( successor ) );
        successors.sort( ( a,b ) => a.score-b.score );
        for( let successor of successors )
        {
            // successor.score=this.evaluation_function( successor)
            successor =  this.value( successor,alpha,beta,step+1 );
            if( value>successor.score )
            {
                value=successor.score;
                minSuccessor=successor;
            }
            if( value<=alpha )
            {
                return minSuccessor
            }
            if( beta>value )
            {
                beta=value;
            }
        }
        return minSuccessor
        // return successors[ 0 ]
    }

    player2( piece,moveX,moveY ) {
        if( this.currentState.turn==0 )
        {
            let board=this.currentState.value.map( row => row.map( piece => piece!==""? piece.pieceID:"" ) );
            let [ i,j ]=piece.piecePosition;
            let tmp=board[ i ][ j ];
            board[ moveX ][ moveY ]=piece.pieceID;
            board[ i ][ j ]="";
            console.log( moveX,moveY )
            let [ newBoard,newPieces,newBlackPieces,newWhitePieces ]=createBoardAndPieces( board )
            this.currentState=new State( this.currentState,newBoard,this.currentState.depth+1,( this.currentState.turn+1 )%2,newPieces,newBlackPieces,newWhitePieces,this.currentState.removedPieces )
            this.updateGame( this.currentState.value )

        }
        this.minimax( this.currentState );
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
                    let moves=lastDiv.getAttribute( "data-moves" )
                    div.setAttribute( "data-moves",moves )
                    gameBoard.children[ i ].children[ j ].children[ 0 ].remove();
                }
                gameBoard.children[ i ].children[ j ].appendChild( div );

            }
        }
    }




}