const canvas2 = document.getElementById('tetris2');

const context2 = canvas2.getContext('2d');
context2.scale(20, 20);

function arenaSweep2() {
    let rowCount = 1;
    outer: for(let y = arena2.length - 1; y >= 0; y--) {
        for(let x = 0; x < arena2[y].length; x++) {
            if(arena2[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena2.splice(y, 1)[0].fill(0);
        arena2.unshift(row);
        y++;

        player2.score2 += rowCount * 10;
        rowCount *= 2;
    }
}

function collide2(arena2, player2) {
    const [m, o] = [player2.matrix2, player2.pos2];
    for(let y = 0; y < m.length; y++) {
        for(let x = 0; x < m[y].length; x++) {
            if(m[y][x] !== 0 && (arena2[y + o.y] && arena2[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix2(w, h) {
    const matrix2 = [];
    while(h--) {
        matrix2.push(new Array(w).fill(0));
    }
    return matrix2;
}

function createPiece2(type) {
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

function draw2() {
    context2.fillStyle = '#fff'; // set color
    context2.fillRect(0, 0, canvas2.width, canvas2.height); // draw rectangle

    drawMatrix2(arena2, {x: 0, y: 0});
    drawMatrix2(player2.matrix2, player2.pos2);
}

function drawMatrix2(matrix2, offset) {
    matrix2.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                context2.fillStyle = colors2[value];
                context2.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function playerDrop2() {
    player2.pos2.y++;
    if(collide2(arena2, player2)) {
        player2.pos2.y--;
        merge2(arena2, player2);
        playerReset2();
        arenaSweep2();
        updateScore2();
    }
    dropCounter2 = 0;
}

function playerMove2(dir) {
    player2.pos2.x += dir;
    if(collide2(arena2, player2)) {
        player2.pos2.x -= dir;
    }
}

function playerReset2() {
    const pieces = 'ILJOTSZ';
    player2.matrix2 = createPiece2(pieces[pieces.length * Math.random() | 0]);
    player2.pos2.y = 0;
    player2.pos2.x = (arena2[0].length / 2 | 0) - 
                   (player2.matrix2[0].length / 2 | 0);
    if(collide2(arena2, player2)) {
        arena2.forEach(row => row.fill(0));
        alert("GAME OVER");
    document.location.reload();
    clearInterval(interval);
        player2.score2 = 0;
        updateScore2();
    }
}

function playerRotate2(dir) {
    rotate2(player2.matrix2, dir);
    if(collide2(arena2, player2)) {
        rotate2(player2.matrix2, -dir);
    }
}

function rotate2(matrix2, dir) {
    for(let y = 0; y < matrix2.length; y++) {
        for(let x = y + 1; x < matrix2.length; x++) {
            [
                matrix2[x][y], 
                matrix2[y][x],
            ] = [
                matrix2[y][x], 
                matrix2[x][y],
            ];
        }
    }

    if(dir > 0) {
        matrix2.forEach(row => row.reverse());
    } else {
        matrix2.reverse();
    }
}

let dropCounter2 = 0;
let dropInterval2 = 1000;

let lastTime2 = 0;

function update2(time = 0) {
    const deltaTime = time - lastTime2; // millisecond
    lastTime2 = time;
    dropCounter2 += deltaTime;
    if(dropCounter2 > dropInterval2) {
        playerDrop2();
    }
    draw2();
    requestAnimationFrame(update2);
}

function updateScore2() {
    document.getElementById("score2").innerText = player2.score2;
}

const colors2 = [null,'red','blue','violet','green','purple','orange','pink'];

const arena2 = createMatrix2(12, 20);

function merge2(arena2, player2){
    player2.matrix2.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena2[y + player2.pos2.y][x + player2.pos2.x] = value;
            }
        });
    });
}
const player2 = {
    pos2: { x: 5, y: 5 },
    matrix2: null,
    score2: 0,
}

document.addEventListener('keydown', event => {
    //console.log(event);
    if(event.keyCode === 100) { // keycode lookup: http://pomle.github.io/keycode/
        playerMove2(-1);
    } else if(event.keyCode === 102) {
        playerMove2(1);
    } else if(event.keyCode === 101) {
        playerDrop2();
    } else if(event.keyCode === 104) {
        playerRotate2(-1);
    } 
});

playerReset2();
updateScore2();
update2();