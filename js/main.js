var $ = require('./lib/jquery'),
    MainLevel = require('./level/mainLevel');

function restartGame() {
    var worker, mainLevel;

    $('#game-container')[0].innerHTML = '';

    if ($('#controls input').prop('checked')) {
        worker = new Worker('./worker.js');
        $('#controls p').text('Worker');
    } else {
        $('#controls p').text('No worker');
    }
    mainLevel = new MainLevel.MainLevel(worker);
    mainLevel.start();
}

$(function() {
    $('button').on('click', restartGame);
    restartGame();
});
