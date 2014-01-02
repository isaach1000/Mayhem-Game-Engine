var $ = require('./lib/jquery'),
    MainLevel = require('./level/mainLevel');

$(function() {
    var mainLevel = new MainLevel.MainLevel();
    mainLevel.start();
});
