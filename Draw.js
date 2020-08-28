//Canvas variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//Center canvas
canvas.style.marginLeft = "auto";
canvas.style.marginRight = "auto";
canvas.parentElement.style.textAlign = "center";

//Set canvas size to take full height of window and half width of window
ctx.canvas.height = window.innerHeight - 20;
ctx.canvas.width = window.innerWidth / 4 * 3 - 20;

var lineW = 6;

//Outer frame variables
var canvH = canvas.scrollHeight - lineW * 2;
var canvW = canvas.scrollWidth - lineW * 2;
var canvX = lineW;
var canvY = lineW;

//Board frame variables
var topMargin = canvH / 12;
var gameH = canvH - topMargin;
var gameW = gameH / 2;
var sideMargins = (canvW - gameW) / 2;
var gameX = lineW + sideMargins;
var gameY = lineW + topMargin;

//Score variables
var linesCleared = 0;
var scoreFontSize = 1;
var scoreX = canvX + lineW;
var scoreY = canvY + lineW;
var scoreW = canvW - 2 * lineW;
var scoreH = gameY - scoreY;

//Grid variables
var gridLineW = 1;
var gridX = gameX + lineW;
var gridY = gameY + lineW;
var gridW = gameW - 2 * lineW;
var gridH = gameH - 2 * lineW;
var rowH = gridH / 20;
var colW = gridW / 10;


//Draw the game and canvas in a loop
function drawLoop()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(); //Draw background first
    drawScore(board.linesCleared); //Then draw score
    drawBoard(board); //Then draw the board

    //If this is removed it will show the piece teleporting around as the ai trys to find the best move
    if(!ai.midCalculating) drawCurrPiece(currPiece);
}


//Draw the canvas outer frame for the game
function drawFrame()
{
    //Draw outer frame
    ctx.beginPath();

    ctx.lineWidth = lineW;
    ctx.strokeStyle = "#1445c4";
    ctx.rect(canvX, canvY, canvW, canvH);

    ctx.fillStyle = "#bfb4b4";
    ctx.fillRect(canvX, canvY, canvW, canvH);

    ctx.stroke();
    ctx.closePath();

    //Draw board frame
    ctx.beginPath();

    ctx.lineWidth = lineW;
    ctx.strokeStyle = "#1445c4";
    ctx.rect(gameX, gameY, gameW, gameH);

    ctx.fillStyle = "#242121";
    ctx.fillRect(gameX, gameY, gameW, gameH);

    ctx.stroke();
    ctx.closePath();

    //Draw grid
    ctx.beginPath();

    ctx.lineWidth = gridLineW;
    ctx.strokeStyle = "white";
    
    //Draw horizontal grid
    for(var row = gridY, count = -1; count < 20; row += rowH, count++)
    {
        ctx.moveTo(gridX, row);
        ctx.lineTo(gridX + gridW, row);
    }

    //Draw vertical grid
    for(var col = gridX, count = -1; count < 10; col += colW, count++)
    {
        ctx.moveTo(col, gridY);
        ctx.lineTo(col, gridY + gridH);
    }

    ctx.stroke();
    ctx.closePath();
}


//Draw the current game score
function drawScore(score)
{
    scaleFont("Lines Cleared: " + score, scoreW, scoreH);
    ctx.beginPath();

    ctx.font = scoreFontSize + "px Oxygen";
    ctx.textAlign = "center";
    ctx.fillText("Lines Cleared: " + score, scoreX + scoreW / 2, scoreY + scoreH * 3 / 4);

    ctx.stroke();
    ctx.closePath();
}


//Scale the font to fit the input width and height
function scaleFont(txt, w, h)
{
    //Determine font size to take up correct amount of space
    scoreFontSize = 1;
    while(true)
    {
        ctx.font = (scoreFontSize + 1) + "px Oxygen";
        if(ctx.measureText(txt).width > w * 3 / 4 || ctx.measureText("M").width > h * 3 / 4) break;
        scoreFontSize++;
    }
}


//Draw the game
function drawBoard(board)
{
    //Draw each tile from the board
    for(var row = gridY + gridLineW, countR = 0; countR < board.rows; row += rowH, countR++)
    {
        for(var col = gridX + gridLineW, countC = 0; countC < board.cols; col += colW, countC++)
        {
            if(board.matrix[countR][countC] != "")
            {
                ctx.beginPath();
                ctx.fillStyle = board.matrix[countR][countC];
                ctx.fillRect(col, row, colW - gridLineW * 2, rowH - gridLineW * 2);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}


//Draw the current piece on top of the board
function drawCurrPiece(currPiece)
{
    for(var row = gridY + gridLineW + rowH * currPiece.row, countR = 0; countR < currPiece.rows; row += rowH, countR++)
    {
        for(var col = gridX + gridLineW + colW * currPiece.col, countC = 0; countC < currPiece.cols; col += colW, countC++)
        {
            if(currPiece.matrix[countR][countC] != "")
            {
                ctx.beginPath();
                ctx.fillStyle = currPiece.color;
                ctx.fillRect(col, row, colW - gridLineW * 2, rowH - gridLineW * 2);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

