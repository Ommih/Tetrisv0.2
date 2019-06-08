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

    if (window.sessionStorage.getItem('gameType') == 'single') {
        togglePlayer()
        title += `YOU LOST`;
    }
    else {
        togglePlayer(1);
        title = (player.score == player2.score) ? title += `Draw` : player.score > player2.score ? `GAME OVER<br>Player 1 Lost` : `GAME OVER<br>Player 2`
    }

    var text = window.sessionStorage.getItem('gameType') == 'single' ? `Your final score is: ${player.score}` : `Player 1 score: ${player.score}<br>Player 2 score: ${player2.score}`

    Swal.fire({
        html: text,
        title: title,
        confirmButtonText: 'OK'
    });

    toggleGame();
}

function togglePlayer(id = 0) {
    $(document).trigger('togglePlayer', 1);
    if (id != 0) $(document).trigger('togglePlayer', 2);
}

$(document).on('togglePlayer', (event, playerNr) => {
    switch(playerNr) {
        case 1:
            let playerWindow = $('#playerOne');

            if (playerWindow.hasClass('hidden')) {
                playerWindow.removeClass('hidden');   

                playerReset();
                updateScore();
                update();
            } else {
                playerWindow.addClass('hidden');
            }
            break;
        case 2:
            let playerWindow2 = $('#playerTwo');

            if (playerWindow2.hasClass('hidden')) {
                playerWindow2.removeClass('hidden');
                
                playerReset2();
                updateScore2();
                update2();
            } else {
                playerWindow2.addClass('hidden');
            }
            break
    }
});

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