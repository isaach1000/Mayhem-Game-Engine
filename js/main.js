var $ = require('./lib/jquery'),
    MainLevel = require('./level/mainLevel');

$(function() {
    var
    worker = new Worker('./worker.js'),
        mainLevel = new MainLevel.MainLevel(worker);

    mainLevel.start();
});
