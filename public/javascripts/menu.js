$(document).ready(() => {
    $('#singlePlayer').click(() => {
        window.sessionStorage.setItem('gameType', 'single');
        toggleGame();
        togglePlayer();
        
    });
    
    $('#localMultiplayer').click(() => {
        window.sessionStorage.setItem('gameType', 'multi');
        toggleGame();
        togglePlayer(1);
    });

    $('#onlineMultiplayer').click(() => {
        window.sessionStorage.setItem('gameType', 'multi');
        toggleGame();
        togglePlayer();
    });
});

function endGame(id) {
    window.sessionStorage.setItem('gameOver', "true");

    var title = `GAME OVER\n`

    if (window.sessionStorage.getItem('gameType') == 'single') title += `YOU LOST`;
    else {
        title = (player.score == player2.score) ? title += `Draw` : player.score > player2.score ? `GAME OVER<br>Player 1 Lost` : `GAME OVER<br>Player 2`
    }

    var text = window.sessionStorage.getItem('gameType') == 'single' ? `Your final score is: ${player.score}` : `Player 1 score: ${player.score}<br>Player 2 score: ${player2.score}`

    Swal.fire({
        html: text,
        title: title,
        confirmButtonText: 'OK'
    });

    $('#playerOne').addClass('hidden');
    $('#playerTow').addClass('hidden');
    toggleGame();
}

function togglePlayer(id = 0) {
    togglePlayerOne();
    if (id != 0) togglePlayerTwo();
}

function togglePlayerOne() {
    let player = $('#playerOne');
    
    if (player.hasClass('hidden')) {
        player.removeClass('hidden');
        
        console.log("start");

        playerReset();
        updateScore();
        update();
    } else {
        player.addClass('hidden');
    }
}

function togglePlayerTwo() {
    let player = $('#playerTwo');

    if (player.hasClass('hidden')) {
        player.removeClass('hidden');
        
        playerReset2();
        updateScore2();
        update2();
    } else {
        player.addClass('hidden');
    }
}

function toggleGame() {
    let menu = $('#menu');
    let game = $('#game');

    if (menu.hasClass('hidden')) {
        menu.removeClass('hidden');
        game.addClass('hidden');
        
    } else {
        
        window.sessionStorage.setItem('gameOver', "false");
        
        player = new Player();
        player2 = new Player();
        updateScore();    
        updateScore2();

        game.removeClass('hidden');
        menu.addClass('hidden');
    }
}