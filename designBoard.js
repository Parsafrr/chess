var gameBoard=document.getElementById( "gameBoard" );

for( let i=0;i<=7;i++ )
    {
        for( let j=0;j<=7;j++ )
        {
            const div=gameBoard.children[ i ].children[ j ];
            div.addEventListener( "click",( e ) => {console.log( e.target.id )} )
            if( ( i+j )%2==0 )
            {
                div.style.backgroundColor="#ebecd0";
            }
            else if( ( i+j )%2==1 )
            {
                div.style.backgroundColor="#739552";
            }
        }
    }
    