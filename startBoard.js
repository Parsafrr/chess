function createStartBoard() {

    let startState=[ [ "blackRock1","blackKnight1","blackBishop1","blackQueen","blackKing","blackBishop2","blackKnight2","blackRock2" ],
    [ "blackSoldier1","blackSoldier2","blackSoldier3","blackSoldier4","blackSoldier5","blackSoldier6","blackSoldier7","blackSoldier8" ],
    [ "","","","","","","","" ],
    [ "","","","","","","","" ],
    [ "","","","","","","","" ],
    [ "","","","","","","","" ],
    [ "whiteSoldier1","whiteSoldier2","whiteSoldier3","whiteSoldier4","whiteSoldier5","whiteSoldier6","whiteSoldier7","whiteSoldier8" ],
    [ "whiteRock1","whiteKnight1","whiteBishop1","whiteKing","whiteQueen","whiteBishop2","whiteKnight2","whiteRock2" ],];

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
            [ i+1,j+2 ],[ i+1,j-2 ],[ i-1,j+2 ],[ i-1,j-2 ]
        ],
        "queen": ( i,j ) => [ ...allMoves.rock( i,j ),...allMoves.bishop( i,j ) ],
        "king": ( i,j ) => [
            [ i+1,j ],[ i-1,j ],[ i,j+1 ],[ i,j-1 ],
            [ i+1,j+1 ],[ i-1,j-1 ],[ i+1,j-1 ],[ i-1,j+1 ]
        ]
    };

    let pieces=[];
    for( let row=0;row<startState.length;row++ )
    {
        for( let Column=0;Column<startState[ row ].length;Column++ )
        {
            let pieceName=startState[ row ][ Column ]
            if( pieceName!='' )
            {
                let pieceColor = pieceName.includes("black") ? "black":"white";
                let pieceType=Object.keys( allMoves ).find( key => pieceName.toLowerCase().includes( key.toLowerCase() ) );
                let piece=new Piece( pieceName,[ row,Column ],allMoves[ pieceType ] ,pieceColor)
                pieces.push( piece )
                startState[ row ][ Column ]=piece;
            }
        }
    }
    return [ startState,pieces ];
}