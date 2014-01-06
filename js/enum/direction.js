var MathExtensions = require('../util/mathExtensions');

/**
    Enum for key arrow input

    @class Direction
 */
module.exports = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    MIN: 37,

    toString: function(dir) {
        return ['left', 'up', 'right', 'down'][dir - module.exports.MIN];
    },

    all: function() {
        return [module.exports.RIGHT, module.exports.DOWN, module.exports.LEFT,
            module.exports.UP];
    },

    opposite: function(dir) {
        return module.exports.all()[dir - module.exports.MIN];
    },

    contains: function(dir) {
        return module.exports.all().indexOf(dir) !== -1;
    },

    random: function() {
        return module.exports.MIN + MathExtensions.randomInt(4);
    }
};
