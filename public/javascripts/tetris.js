const colors = [null,'red','blue','violet','green','purple','orange','pink'];

class Player {
    constructor() {
        this.pos = { x: 5, y: 5 };
        this.matrix = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;    
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.arena = createMatrix(12, 20);
    }

    rowCleared(rowCount) {
        console.log(rowCount);

        if (rowCount == 1) this.score += 40 * this.level;
        else if (rowCount == 2) this.score += 100 * this.level;
        else if (rowCount == 3) this.score += 400 * this.level;
        else if (rowCount == 4) this.score += 1200 * this.level;

        this.lines += rowCount;

        if (this.lines >= (5 * this.level)) {
            this.lines = this.lines - (5 * this.level);
            this.level++;
            this.dropInterval = this.dropInterval / 2;
        }
    }
}

function createPiece(type) {
    if(type === 'T') {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ];
    } else if(type === 'O') {
        return [
            [2,2],
            [2,2],
        ];
    } else if(type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if(type === 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if(type === 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    } else if(type === 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    } else if(type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function creatematrix(w, h) {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function drawMatrix(matrix, offset, context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
/* ========================================
 * =============== Player 1 ===============
 * ========================================
 */

$(document).ready(() => {
    document.getElementById('tetrisOne').getContext('2d').scale(20, 20);
});

function arenaSweep() {
    let rowCount = 0;
    outer: for(let y = player.arena.length - 1; y >= 0; y--) {
        for(let x = 0; x < player.arena[y].length; x++) {
            if(player.arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = player.arena.splice(y, 1)[0].fill(0);
        player.arena.unshift(row);
        y++;
        rowCount++
    }

    player.rowCleared(rowCount);
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for(let y = 0; y < m.length; y++) {
        for(let x = 0; x < m[y].length; x++) {
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if(type === 'T') {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ];
    } else if(type === 'O') {
        return [
            [2,2],
            [2,2],
        ];
    } else if(type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if(type === 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if(type === 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    } else if(type === 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    } else if(type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function draw() {
    const canvas = document.getElementById('tetrisOne');
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'; // set color
    context.fillRect(0, 0, canvas.width, canvas.height); // draw rectangle

    drawMatrix(player.arena, {x: 0, y: 0}, context);
    drawMatrix(player.matrix, player.pos, context);
}

function playerDrop() {
    player.pos.y++;
    if(collide(player.arena, player)) {
        player.pos.y--;
        merge(player.arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    player.dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if(collide(player.arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (player.arena[0].length / 2 | 0) - 
                   (player.matrix[0].length / 2 | 0);
    if(collide(player.arena, player)) {
        endGame(1)
    }
}

function playerRotate(dir) {
    rotate(player.matrix, dir);
    if(collide(player.arena, player)) {
        rotate(player.matrix, -dir);
    }
}

function rotate(matrix, dir) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = y + 1; x < matrix.length; x++) {
            [
                matrix[x][y], 
                matrix[y][x],
            ] = [
                matrix[y][x], 
                matrix[x][y],
            ];
        }
    }

    if(dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function update(time = 0) {
    if (sessionStorage.getItem('gameOver') == 'true') return;

    const deltaTime = time - player.lastTime; // millisecond
    player.lastTime = time;
    player.dropCounter += deltaTime;
    if(player.dropCounter > player.dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById("scoreOne").innerText = player.score;
    document.getElementById("levelOne").innerText = player.level;
}

function merge(arena, player){
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
var player = new Player();

document.addEventListener('keydown', event => {
    //console.log(event);
    if(event.keyCode === 65) { // keycode lookup: http://pomle.github.io/keycode/
        playerMove(-1);
    } else if(event.keyCode === 68) {
        playerMove(1);
    } else if(event.keyCode === 83) {
        playerDrop();
    } else if(event.keyCode === 87) {
        playerRotate(1);
    }
});