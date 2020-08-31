//Ai object
var ai = 
{
	aiPlaying: true,
	aiMoves: [],
	seen: new Set(),
	currMax: Number.MIN_SAFE_INTEGER,
	currMoves: [],
	moves: ["l", "r", "cw", "ccw", "d"],
	midCalculating: false,
	
	calculateMoves(currPiece, board)
	{
		this.seen.clear();
		this.currMoves = [];
		this.currMax = Number.MIN_SAFE_INTEGER;
		this.midCalculating = true;
		this.findBestMoves(currPiece, board);
		this.midCalculating = false;
		this.aiMoves.reverse();
	},
	
	findBestMoves(currPiece, board)
	{
		if(this.seen.has([currPiece.row, currPiece.col, currPiece.rotation].toString())) return;
		this.seen.add([currPiece.row, currPiece.col, currPiece.rotation].toString());

		for(var i = 0; i < this.moves.length; i++)
		{
			switch(this.moves[i])
			{
				case "l": currPiece.col--; break;
				case "r": currPiece.col++; break;
				case "cw": currPiece.rotate("cw"); break;
				case "ccw": currPiece.rotate("ccw"); break;
				case "d": currPiece.row++; break;
			}
			this.currMoves.push(this.moves[i]);

			if(board.overlap(currPiece))
			{
				if(this.moves[i] == "d")
				{
					currPiece.row--;
					board.placeOrErasePiece(currPiece, "place");
					var value = this.boardValue(board);
					board.placeOrErasePiece(currPiece, "erase");
					currPiece.row++;
					if(value > this.currMax || (value == this.currMax && this.currMoves.length < this.aiMoves.length))
					{
						this.aiMoves = [...this.currMoves]; //Copy array by value
						this.currMax = value;
					}
				}
			}
			else this.findBestMoves(currPiece, board);

			switch(this.moves[i])
			{
				case "l": currPiece.col++; break;
				case "r": currPiece.col--; break;
				case "cw": currPiece.rotate("ccw"); break;
				case "ccw": currPiece.rotate("cw"); break;
				case "d": currPiece.row--; break;
			}
			this.currMoves.pop();
		}
	},
	
	boardValue(board)
	{
		sumHeights = 0;
		for(var col = 0; col < board.cols; col++)
		{
			sumHeights += board.colHeight(col);
		}

		var fullRows = 0;
		for(var row = 0; row < board.rows; row++)
		{
			if(board.isRowFull(row)) fullRows++;
		}

		holes = 0;
		for(var col = 0; col < board.cols; col++)
		{
			holes += board.numGaps(col);
		}

		bumpiness = 0;
		for(var col = 0; col < board.cols - 1; col++)
		{
			bumpiness += Math.abs(board.colHeight(col) - board.colHeight(col + 1));
		}

		return -0.51 * sumHeights + 0.76 * fullRows - 0.36 * holes - 0.18 * bumpiness;
	},
};

