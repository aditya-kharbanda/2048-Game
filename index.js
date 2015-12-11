var game = (function(){
	
  
  var gridItems;	
  var trackKey;
  var pair= {"first": 0 , "second": false};
  var arena = [[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}]];
  var done = false;
  var win = false;
  var moved = false;
  var score = 0;
  var el_class_name;
  var scorecard;
  var highScore = 0;
  var gameOver = 0;
  var high_score;
  
  
  function initGame(className)
  { 
    scorecard = document.getElementById("curscore");
    high_score = document.getElementById("high_score");console.log(high_score);
    el_class_name = className
  

     if(el_class_name===undefined)
      {
        throw "enter a valid element";
      }
   
      gridItems = document.getElementsByClassName(className);
     

     if(gridItems===null)
      {
       throw "element does not exist";
      }
     
     loadFromLocalStorage();
     render();
     gameplay();

     if(highScore===0 || isNaN(highScore))
     {
       addtile();addtile();
       render();
       gameplay();
     }
  }

  
  
 function loadFromLocalStorage()
  { 
    
    highScore = parseInt(localStorage.getItem("highScore"));
    
    if(highScore !==0 && !isNaN(highScore))
      {
       score = parseInt(localStorage.getItem("score"));
       arena = JSON.parse(localStorage.getItem("arena"));
       gameOver = parseInt(localStorage.getItem("gameOver"));
       if(gameOver===1)
        {
          reset();
        } 
      }
   }

  

  function updateLocalStorage() 
  {
    localStorage.setItem("highScore",highScore);
    localStorage.setItem("score",score);
    localStorage.setItem("arena",JSON.stringify(arena));
    localStorage.setItem("gameOver",gameOver);
  }




   
  function addtile()
  {
    var a,b,c,d,e;
    	do
        {
   	 	  a= function(){
   		  return Math.floor(Math.random()*(4-0)+0);
   	      	};
   	    b=function(){
   			return Math.floor(Math.random()*(4-0)+0);
      	  };
        c=a();
        d=b();

   	    } while(arena[c][d].first!==0);
   	  
   	          
    var prob = function(){
   			return Math.floor(Math.random()*(101-1)+1);
   	    	};

   	 e=prob();
         if(e<=90)
           {
    
    	    arena[c][d].first = 2;
           }
         else if(e>90)
           {
         	arena[c][d].first= 4;
           }

           if(canMove()===true)
           {return;
           }
           
       done = true;
       return;
  }




  function render()
  {
    var tiles = $('.innerbox').removeAttr('class').addClass('innerbox');

        for(var i = 0; i < arena.length; i++) 
        {
            for (var j = 0; j < arena[i].length; j++) 
            {
                if (arena[i][j].first !== 0) {
                    $(tiles[i*4 + j]).addClass('innerbox_' + arena[i][j].first);
                }
            }
        }
        scorecard.innerHTML = "SCORE" + "<p/>" +score;
        high_score.innerHTML = "HIGHSCORE" + "<p/>" +highScore;
  }



function gameplay()
{

  var winning = "You've made it!";
    
    if(win)
    {
      gameOver = 1;
      updateLocalStorage();
      alert(winning);
      return;
    }

    
    if(moved)
     {
       if(canMove()===false)
        {
          gameOver = 1;updateLocalStorage();
          alert("Game Over!");
          throw "Game Over!";
          return;
        }
       addtile();
       render();
     }

    if(done)
     {
        gameOver = 1;updateLocalStorage();
        alert("Game Over!");
        throw "Game Over!";
        return;
     }

      askKey();
      updateHighScore();
      updateLocalStorage();
   
}



function askKey()
{
  moved = false;

  document.addEventListener("keypress",make_move);


  for(var i=0 ; i<4; i++)
   {
     for(var j=0; j<4; j++)
     {
      arena[i][j].second=false;
     }
   }

}


function moveHori( i, j, d )
{
    if( arena[i][j + d].first && arena[i][j + d].first == arena[i][j].first && !arena[i][j].second && !arena[i][j + d].second  )
      {

         arena[i][j].first = 0;
         arena[i][j + d].first *= 2;
         score += arena[i][j + d].first;
         arena[i][j + d].second = true;
         moved = true;
      }

    else if( !arena[i][j + d].first && arena[i][j].first )
      {
        arena[i][j + d].first = arena[i][j].first;
        arena[i][j].first = 0;
        moved = true;
      }
  
  
   if( d > 0 ) 
    { 
      if( j + d < 3 ) 
        moveHori( i, j + d,  1 ); 
    }
   else 
    {
      if( j + d > 0 )
       moveHori( i, j + d, -1 );
    }
  
    updateHighScore();
  return;
   
}



function moveVerti( i, j, d )
{
    if( arena[i + d][j].first && arena[i + d][j].first == arena[i][j].first && !arena[i][j].second && !arena[i + d][j].second  )
      {
      
         arena[i][j].first = 0;
         arena[i + d][j].first *= 2;
         score += arena[i + d][j].first;
         arena[i + d][j].second = true;
         moved = true;
      }

    else if( !arena[i + d][j].first && arena[i][j].first )
      {
         arena[i + d][j].first = arena[i][j].first;
         arena[i][j].first = 0;
         moved = true;
      }

  
    if( d > 0 )
     { 
       if( i + d < 3 ) 
        moveVerti( i + d, j,  1 ); 
     }
    else 
     { 
      if( i + d > 0 ) 
        moveVerti( i + d, j, -1 ); 
     }
  
  updateHighScore();
  return;

}



function canMove()
{
  
  for(var i=0; i<4; i++)
   {
     for(var j=0; j<4; j++)
        {
        if(arena[i][j].first===0)
        return true;
      }
   }

  for(var i=0; i<4; i++)
   {
      
     for(var j=0; j<4; j++)
      {
      
        if( testAdd(i+1, j, arena[i][j].first))
         {
          return true;
         }
        if( testAdd(i-1, j, arena[i][j].first))
         {
         return true;
         }
        if( testAdd(i, j+1, arena[i][j].first))
         {
         return true;
         }
        if( testAdd(i, j-1, arena[i][j].first))
         {
          return true;
         }
      }
   }
   
  return false;
}
 



function make_move( e )
{
  var d=e.keyCode;
 
  switch( d )
  {
     
     case 38:
     for( var y = 0; y < 4; y++ )
      {
        var x = 1;
        while( x < 4 )
         {
          if( arena[x][y].first ) moveVerti( x, y, -1 ); 
          x++;
         }
      }
      break;

     
     case 40:
     for( var y = 0; y < 4; y++ )
      {
        var x = 2;
        while( x >= 0 )
         { 
          if( arena[x][y].first ) moveVerti( x, y, 1 ); 
          x--;
         }
      }
      break;
      
      
     case 37:
     for( var x = 0; x < 4; x++ )
      {
        var y = 1;
        while( y < 4 )
        {
         if( arena[x][y].first ) moveHori( x, y, -1 ); 
         y++;
        }
      }
      break;
      

     case 39:
     for( var x = 0; x < 4; x++ )
      {
        var y = 2;
        while( y >= 0 )
        { 
          if( arena[x][y].first ) moveHori( x, y, 1 ); 
          y--;
        }
      }

   }
  
  }



function updateHighScore()
 {
  if(isNaN(highScore))
  {
    highScore=score;
  }
  else if(score > highScore)
    highScore = score;
 }



function testAdd( i , j , v)
 {
  
  if( i< 0 || i > 3 || j < 0 || j> 3)
  return false;

  if (arena[i][j].first === v)
    return true;

  return false;
 }


function reset()
{
  console.log("reset called");
  arena = [[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}],[{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false},{"first": 0 , "second": false}]];
  score = 0;
  gameOver = 0;
  done = false;
  win = false;
  moved = false;
  addtile();
  addtile();
}



function resetGame()
{
  reset();

  updateLocalStorage();
  render();
}

  

  return{

  	"init2048" : initGame,
    "play":gameplay,
    "reset" : resetGame
  };

})();
   
    



    