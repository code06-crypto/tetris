// Each tetromino is represented as a matrix of 1s and 0s.
const TETROMINOES = {
    I: {
        shape: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        color: '#00e5ff' // Cyan
    },
    J: {
        shape: [
            [1,0,0],
            [1,1,1],
            [0,0,0]
        ],
        color: '#2962ff' // Blue
    },
    L: {
        shape: [
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        color: '#ff9100' // Orange
    },
    O: {
        shape: [
            [1,1],
            [1,1]
        ],
        color: '#ffd600' // Yellow
    },
    S: {
        shape: [
            [0,1,1],
            [1,1,0],
            [0,0,0]
        ],
        color: '#00e676' // Green
    },
    Z: {
        shape: [
            [1,1,0],
            [0,1,1],
            [0,0,0]
        ],
        color: '#ff1744' // Red
    },
    T: {
        shape: [
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
        color: '#d500f9' // Purple
    }
};

const SHAPES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];

function getRandomTetromino() {
    const randShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
        shape: TETROMINOES[randShape].shape,
        color: TETROMINOES[randShape].color,
        name: randShape
    };
}
