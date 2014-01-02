var MathExtensions = require('../util/mathExtensions');

/**
    Enum for key arrow input

    @class Direction
 */
var thisModule = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    MIN: 37,

    toString: function(dir) {
        return ['left', 'up', 'right', 'down'][dir - thisModule.MIN];
    },

    opposite: function(dir) {
        return [thisModule.RIGHT, thisModule.DOWN, thisModule.LEFT, thisModule.UP]
        [dir -
            thisModule.MIN];
    },

    random: function() {
        return thisModule.MIN + MathExtensions.randomInt(4);
    }
};

module.exports = thisModule;
