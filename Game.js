//Board object
var board =
{
    rows: 20,
    cols: 10,
	linesCleared: 0,
    matrix: [[]],

    //Spawn a new piece at the top of the board and set it to the current piece
    spawnPiece(currPiece)
    {
        currPiece.reset(this);
    
        if(this.overlap(currPiece))
        {
            clearInterval(fallInterval);
            gamePlaying = false;
            //this.spawnPiece(currPiece); //TEMP automatic reset of game
        }
    },

    //End the game by clearing the board, current piece, and score
    clearBoard(currPiece)
    {
        currPiece.color = ""; //Prevent currPiece from being drawn
        for(var row = 0; row < this.rows; row++)
        {
            for(var col = 0; col < this.cols; col++)
            {
                this.matrix[row][col] = "";
            }
        }
    },

    //Place or erase a piece from the board
    placeOrErasePiece(currPiece, placeOrErase)
    {
        for(var row = currPiece.row; row < currPiece.row + currPiece.rows; row++)
        {
            for(var col = currPiece.col; col < currPiece.col + currPiece.cols; col++)
            {
                if(currPiece.matrix[row - currPiece.row][col - currPiece.col] != "")
                {
                    if(placeOrErase == "place") this.matrix[row][col] = currPiece.color;
                    else if(placeOrErase == "erase") this.matrix[row][col] = "";
                }
            }
        }
    },

    //Check for overlap between the input piece and the board
    overlap(currPiece)
    {
        for(var row = currPiece.row; row < currPiece.row + currPiece.rows; row++)
        {
            for(var col = currPiece.col; col < currPiece.col + currPiece.cols; col++)
            {
                if(row < 0 || row >= this.rows || col < 0 || col >= this.cols)
                {
                    if(currPiece.matrix[row - currPiece.row][col - currPiece.col] != "") return true;
                }
                else if(currPiece.matrix[row - currPiece.row][col - currPiece.col] != "" && this.matrix[row][col] != "") return true;
            }
        }
        return false;
    },

    //Check if a row is empty
    isRowEmpty(row)
    {
        for(var col = 0; col < this.cols; col++)
        {
            if(board.matrix[row][col] != "") return false;
        }
        return true;
    },

    //Clear the rows which are full and add to the score
    clearFullRows()
    {
        for(var row = 0; row < this.rows; row++)
        {
            if(this.isRowFull(row))
            {
                this.clearRow(row);
                this.linesCleared++;
            }
        }
    },
    
    //Check if a certain row is full
	isRowFull(r)
	{
		for(var col = 0; col < this.cols; col++)
		{
			if(this.matrix[r][col] == "") return false;
		}
		return true;
	},

    //Clear a certain row
    clearRow(r)
    {
        for(var row = r - 1; row >= 0; row--)
        {
            for(var col = 0; col < this.cols; col++)
            {
                this.matrix[row + 1][col] = this.matrix[row][col];
                this.matrix[row][col] = "";
            }
        }
    },
    
    //Find number of tiles which are empty and have a non-empty tile above them
	numGaps(c)
	{
		for(var row = 0; row < this.rows; row++)
		{
			if(this.matrix[row][c] != "")
			{
				var gaps = 0;
				for(var row2 = row; row2 < this.rows; row2++)
				{
					if(this.matrix[row2][c] == "") gaps++;
				}
				return gaps;
			}
		}
		return 0;
	},
    
    //Height of a certain column
	colHeight(c)
	{
		var row = 0;
		while(row < board.rows && board.matrix[row][c] == "") row++;
		return board.rows - row;
	},

};

//Initialize the board
board.matrix = new Array(board.rows);
for(var row = 0; row < board.rows; row++)
{
    board.matrix[row] = new Array(board.cols);
    for(var col = 0; col < board.cols; col++) board.matrix[row][col] = "";
}

//Falling interval object used to stop game from running
var fallInterval = 0;

//Current piece object
var currPiece =
{
    rows: 0,
    cols: 0,
    matrix: [[]],
    row: 0,
    col: 0,
	rotation: 0,
    color: "",

    //Spawn a random piece at the top of the board
    reset(board)
    {
		var randPiece = pieces[Math.floor(Math.random() * pieces.length)];
        var randColor = colors[Math.floor(Math.random() * colors.length)];
		
        this.color = randColor;
        this.rows = randPiece.length;
        this.cols = (this.rows > 0 ? randPiece[0].length : 0);
		this.rotation = 0;

        //Deep copy the random piece
        this.matrix = new Array(this.rows);
        for(var row = 0; row < this.rows; row++) currPiece.matrix[row] = [...randPiece[row]];
    
        //Place at the top middle of the board
        this.row = 0;
        this.col = Math.round(board.cols / 2) - Math.round(this.cols / 2);
    },

    //Height of piece excluding empty rows
    actualHeight()
    {
        for(var row = this.rows - 1; row >= 0; row--)
        {
            for(var col = 0; col < this.cols; col++)
            {
                if(currPiece.matrix[row][col] != "")
                {
                    return row + 1;
                }
            }
        }
        return -1;
    },

    //Rotate the piece in the specified direction
    rotate(dir)
    {
        for(var row = 0; row < this.rows; row++)
        {
            for(var col = 0; col < row; col++)
            {
                [this.matrix[row][col], this.matrix[col][row]] = [this.matrix[col][row], this.matrix[row][col]];
            }
        }

        if(dir == "cw")
		{
			this.matrix.reverse();
			this.rotation++; 
		}
        else if(dir == "ccw")
        {
            for(var row = 0; row < this.rows; row++) this.matrix[row].reverse();
			this.rotation--;
        }
		this.rotation = (this.rotation + 4) % 4;
    },

    //Move the piece 1 row downwards (and if the ai is active calculate the best move)
    fall(board, ai)
    {
        if(ai.aiPlaying)
        {
            if(ai.aiMoves.length == 0 && (this.row + this.actualHeight() >= board.rows || !board.isRowEmpty(this.row + this.actualHeight())))
            {
                ai.calculateMoves(this, board);
            }
            while(ai.aiMoves.length > 0 && ai.aiMoves[ai.aiMoves.length - 1] != "d")
            {
                switch(ai.aiMoves.pop())
                {
                    case "l": this.col--; break;
                    case "r": this.col++; break;
                    case "cw": this.rotate("cw"); break;
                    case "ccw": this.rotate("ccw"); break;
                }
            }
            if(ai.aiMoves.length > 0) ai.aiMoves.pop();
        }

        this.row++;
        if(board.overlap(this))
        {
            this.row--;
            board.placeOrErasePiece(this, "place");
            board.spawnPiece(this);
            board.clearFullRows();
        }
    },
};

//Pieces
const pieces =
[
    [
        ["", "0", "", ""],
        ["", "0", "", ""],
        ["", "0", "", ""],
        ["", "0", "", ""],
    ],
    [
        ["", "0", "" ],
        ["", "0", "" ],
        ["", "0", "0"],
    ],
    [
        ["" , "0", ""],
        ["" , "0", ""],
        ["0", "0", ""],
    ],
    [
        ["0", "0"],
        ["0", "0"],
    ],
    [
        ["0", "0", "" ],
        ["" , "0", "0"],
        ["" , "" , "" ],
    ],
    [
        ["" , "0", "0"],
        ["0", "0", "" ],
        ["" , "" , "" ],
    ],
    [
        ["" , "0", "" ],
        ["0", "0", "0"],
        ["" , "" , "" ],
    ]
]

//Colors
const colors = ['purple', 'yellow', 'orange', 'blue', 'aqua', 'green', 'red'];

