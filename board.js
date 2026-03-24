class Board {
    constructor(ctx, nextCtx) {
        this.ctx = ctx;
        this.nextCtx = nextCtx;
        this.grid = this.getEmptyGrid();
        this.ROWS = 20;
        this.COLS = 10;
        this.BLOCK_SIZE = 30;
        
        this.piece = null;
        this.nextPiece = null;
    }

    getEmptyGrid() {
        return Array.from({ length: 20 }, () => Array(10).fill(0));
    }

    reset() {
        this.grid = this.getEmptyGrid();
        this.piece = null;
        this.setNextPiece();
        this.spawnPiece();
    }

    setNextPiece() {
        this.nextPiece = getRandomTetromino();
        this.drawNextPiece();
    }

    spawnPiece() {
        this.piece = {
            ...this.nextPiece,
            shape: JSON.parse(JSON.stringify(this.nextPiece.shape)),
            x: 3,
            y: 0
        };
        // Center O piece and I piece properly based on their matrices
        if (this.piece.name === 'O') this.piece.x = 4;
        
        this.setNextPiece();
    }

    draw() {
        // Clear board
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Draw placed blocks
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                if (this.grid[r][c] !== 0) {
                    this.drawBlock(this.ctx, c, r, this.grid[r][c]);
                }
            }
        }

        // Draw active piece
        if (this.piece) {
            this.piece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value > 0) {
                        this.drawBlock(this.ctx, this.piece.x + x, this.piece.y + y, this.piece.color);
                    }
                });
            });
        }
    }

    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
        
        const shape = this.nextPiece.shape;
        const color = this.nextPiece.color;
        
        const size = 30;
        const width = shape[0].length * size;
        const height = shape.length * size;
        const offsetX = (120 - width) / 2;
        const offsetY = (120 - height) / 2;

        shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.drawBlockAbsolute(this.nextCtx, offsetX + x * size, offsetY + y * size, color);
                }
            });
        });
    }

    drawBlock(ctx, x, y, color) {
        this.drawBlockAbsolute(ctx, x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, color);
    }

    drawBlockAbsolute(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, y, this.BLOCK_SIZE, 4); // top
        ctx.fillRect(x, y, 4, this.BLOCK_SIZE); // left
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y + this.BLOCK_SIZE - 4, this.BLOCK_SIZE, 4); // bottom
        ctx.fillRect(x + this.BLOCK_SIZE - 4, y, 4, this.BLOCK_SIZE); // right
        
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.strokeRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }

    moveDown() {
        this.piece.y += 1;
        if (this.collide()) {
            this.piece.y -= 1;
            this.freeze();
            return false;
        }
        return true;
    }

    moveRight() {
        this.piece.x += 1;
        if (this.collide()) this.piece.x -= 1;
    }

    moveLeft() {
        this.piece.x -= 1;
        if (this.collide()) this.piece.x += 1;
    }

    rotate() {
        const originalShape = this.piece.shape;
        const rotated = originalShape[0].map((_, index) => originalShape.map(row => row[index]).reverse());
        
        const previousShape = this.piece.shape;
        this.piece.shape = rotated;

        if (this.collide()) {
            this.piece.x -= 1;
            if (this.collide()) {
                this.piece.x += 2;
                if (this.collide()) {
                    this.piece.x -= 1;
                    this.piece.shape = previousShape;
                }
            }
        }
    }

    hardDrop() {
        while (!this.collide()) {
            this.piece.y += 1;
        }
        this.piece.y -= 1;
        this.freeze();
    }

    collide() {
        for (let y = 0; y < this.piece.shape.length; y++) {
            for (let x = 0; x < this.piece.shape[y].length; x++) {
                if (this.piece.shape[y][x] !== 0) {
                    let newX = this.piece.x + x;
                    let newY = this.piece.y + y;
                    
                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.grid[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0 && this.piece.y + y >= 0) {
                    this.grid[this.piece.y + y][this.piece.x + x] = this.piece.color;
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let r = this.ROWS - 1; r >= 0; r--) {
            let isRowFull = true;
            for (let c = 0; c < this.COLS; c++) {
                if (this.grid[r][c] === 0) {
                    isRowFull = false;
                    break;
                }
            }
            
            if (isRowFull) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(10).fill(0));
                linesCleared++;
                r++; // Re-check line after shift
            }
        }
        
        return linesCleared;
    }
}
