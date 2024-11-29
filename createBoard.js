import { Piece } from "/piece.js";

export function  createBoardAndPieces( state ) {
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
            [ i+1,j+2 ],[ i-1,j+2 ],[ i+1,j-2 ],[ i-1,j-2 ]
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
