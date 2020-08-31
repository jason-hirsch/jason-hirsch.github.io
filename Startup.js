var fallDelay = 300; //Game speed
var gamePlaying = false;


//Start the draw loop for the game
function run()
{
    setInterval(drawLoop, 1000 / 60);
}


//Reset the game and allow a human to play
function startHuman()
{
    gamePlaying = true;
    clearInterval(fallInterval);
    board.clearBoard(currPiece);
    board.linesCleared = 0;
    ai.aiPlaying = false;
    board.spawnPiece(currPiece);
    fallInterval = setInterval(function() { currPiece.fall(board, ai); }, fallDelay);
}


//Reset the game and allow the AI to play
function startAI()
{
    gamePlaying = true;
    clearInterval(fallInterval);
    board.clearBoard(currPiece);
    board.linesCleared = 0;
    ai.aiPlaying = true;
    board.spawnPiece(currPiece);
    fallInterval = setInterval(function() { currPiece.fall(board, ai); }, fallDelay);
}


//Listen for user input
document.addEventListener('keydown', event => {
    //Right arrow key moves piece right
    if(event.keyCode === 65 && !ai.aiPlaying)
    {
        currPiece.col--;
        if(board.overlap(currPiece))
        {
            currPiece.col++;
        }
    }
    //Left arrow key moves piece left
    else if(event.keyCode === 68 && !ai.aiPlaying)
    {
        currPiece.col++;
        if(board.overlap(currPiece))
        {
            currPiece.col--;
        }
    }
    //Up arrow key rotates piece clockwise
    else if(event.keyCode === 87 && !ai.aiPlaying)
    {
        currPiece.rotate("cw");
        if(board.overlap(currPiece))
        {
            currPiece.rotate("ccw");
        }
    }
    //Down arrow key rotates piece counter clockwise
    else if(event.keyCode === 83 && !ai.aiPlaying) 
    {
        currPiece.rotate("ccw");
        if(board.overlap(currPiece))
        {
            currPiece.rotate("cw");
        }
    }
    //Plus key or numpad plus key doubles game speed
	else if(event.keyCode === 187 || event.keyCode === 107)
	{
		clearInterval(fallInterval);
		if(fallDelay / 2 >= 1) fallDelay /= 2;
		if(gamePlaying) fallInterval = setInterval(function() { currPiece.fall(board, ai); }, fallDelay);
    }
    //Minus key or numpad minus key halves game speed
	else if(event.keyCode === 189 || event.keyCode === 109)
	{
		clearInterval(fallInterval);
		if(fallDelay * 2 <= 10000) fallDelay *= 2;
		if(gamePlaying) fallInterval = setInterval(function() { currPiece.fall(board, ai); }, fallDelay);
	}
});

