export class Piece {
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
        }

        else
        {
            for( let direction in this.allMoves )
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
            if( this.pieceType=="king" )
            {
                this.filterKingMove( board );
            }
        }

    }

    Calculate_attackMove( board ) {
        if( this.pieceType.includes( "Soldier" ) )
        {
            return
        }
        else
        {
            this.is_opponentInPosition( board,this.opponentColor,this.allMoves )
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
                        if( piece.color==this.opponentColor&&piece.pieceType!="king" )
                        {
                            this.ownReach.push( piece.pieceID )
                            piece.opponentReach.push( this.pieceID )
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
                            break
                        }
                    }
                    else if( board[ moveX ][ moveY ]=='' )
                    {
                        if(this.color =="black" && this.piecePosition[0] !=1){   /*Preventing double pawn moves after the first move */
                            this.normalMove.push( move )
                            break
                        }
                        else if(this.color =="white" && this.piecePosition[0] !=6){
                            this.normalMove.push( move )
                            break
                        }
                        else{
                            this.normalMove.push( move )
                        }


                    }
                }
            }

        }
    }

    is_InBoard( moves ) {
        moves=moves.filter( move =>
            move[ 0 ]>=0&&move[ 0 ]<8&&move[ 1 ]>=0&&move[ 1 ]<8
        );
        return moves
    }

    filterKingMove( board ) {
        let validMoves=[]; // Temporary array to store valid moves

        for( let move of this.normalMove )
        {
            let [ x,y ]=move;

            // All neighboring squares of the potential move
            let surroundingSquares=[
                [ x+1,y+1 ],[ x+1,y-1 ],[ x-1,y+1 ],[ x-1,y-1 ],
                [ x+1,y ],[ x,y+1 ],[ x-1,y ],[ x,y-1 ]
            ];

            let isValid=true; // Assume the move is valid initially
            
            for( let neighbor of surroundingSquares )
            {
                let [ nx,ny ]=neighbor;

                // Check if the neighbor is within the board
                if( nx>=0&&nx<=7&&ny>=0&&ny<=7 )
                {
                    let piece=board[ nx ][ ny ];

                    // If there's an opponent king in the neighboring square, invalidate the move
                    if( piece!==""&&piece.pieceType==="king"&&piece.color===this.opponentColor )
                    {
                        isValid=false;
                        break;
                    }
                }
            }

            // Add the move to validMoves if it's valid
            if( isValid )
            {
                validMoves.push( move );
            }
        }

        // Replace the original normalMove with the filtered validMoves
        this.normalMove=validMoves;
    }

    is_opponentInPosition( board,opponentColor,moves ) {
        for( let direction in this.allMoves )
        {
            for( let step in this.allMoves[ direction ] )
            {
                let move=this.allMoves[ direction ][ step ]
                let [ moveX,moveY ]=move;
                if( board[ moveX ][ moveY ]!='' )
                {
                    let piece=board[ moveX ][ moveY ]
                    if( piece.color==this.color ) {break}
                    else if( piece.color==this.opponentColor&&piece.pieceType!="king" )
                    {

                        this.attackMove.push( move )
                        break
                    }
                }
            }
        }

    }


}