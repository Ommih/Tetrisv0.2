/* ========================================
 * =============== Player 2 ===============
 * ========================================
 */

$(document).ready(() => {
    document.getElementById('tetrisTwo').getContext('2d').scale(20, 20);
});

function arenaSweep2() {
    let rowCount = 0;
    outer: for(let y = player2.arena.length - 1; y >= 0; y--) {
        for(let x = 0; x < player2.arena[y].length; x++) {
            if(player2.arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = player2.arena.splice(y, 1)[0].fill(0);
        player2.arena.unshift(row);
        y++;
        rowCount++;
    }

    rowCleared(rowCount);
}

function collide2(arena, player2) {
    const [m, o] = [player2.matrix, player2.pos];
    for(let y = 0; y < m.length; y++) {
        for(let x = 0; x < m[y].length; x++) {
            if(m[y][x] !== 0 && (player2.arena[y + o.y] && player2.arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}


function draw2() {
    const canvas = document.getElementById('tetrisTwo');
    const context = canvas.getContext('2d');

    context.fillStyle = '#fff'; // set color
    context.fillRect(0, 0, canvas.width, canvas.height); // draw rectangle

    drawMatrix(player2.arena, {x: 0, y: 0}, context);
    drawMatrix(player2.matrix, player2.pos, context);
}

function playerDrop2() {
    player2.pos.y++;
    if(collide2(player2.arena, player2)) {
        player2.pos.y--;
        merge2(player2.arena, player2);
        playerReset2();
        arenaSweep2();
        updateScore2();
    }
    player2.dropCounter = 0;
}

function playerReset2() {
    const pieces = 'ILJOTSZ';
    player2.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player2.pos.y = 0;
    player2.pos.x = (player2.arena[0].length / 2 | 0) - 
                   (player2.matrix[0].length / 2 | 0);
    if(collide2(player2.arena, player2)) {
        player2.arena.forEach(row => row.fill(0));
        endGame(2);
    }
}

function playerRotate2(dir) {
    rotate2(player2.matrix, dir);
    if(collide2(player2.arena, player2)) {
        rotate2(player2.matrix, -dir);
    }
}

function rotate2(matrix, dir) {
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

function update2(time = 0) {
    if (sessionStorage.getItem('gameOver') == 'true') return; 

    const deltaTime = time - player2.lastTime; // millisecond
    player2.lastTime = time;
    player2.dropCounter += deltaTime;
    if(player2.dropCounter > player2.dropInterval) {
        playerDrop2();
    }
    draw2();
    requestAnimationFrame(update2);
}

function updateScore2() {
    document.getElementById("scoreTwo").innerText = player2.score;
    document.getElementById("levelTwo").innerText = player2.level;
}

function merge2(arena, player2){
    player2.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                player2.arena[y + player2.pos.y][x + player2.pos.x] = value;
            }
        });
    });
}

var player2 = new Player();

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