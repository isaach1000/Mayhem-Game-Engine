/**
    Enum for key arrow input

    @class Direction
 */
define(['util/mathExtensions'], function(MathExtensions) {
    var module = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        toString: function(dir) {
            return ['left', 'up', 'right', 'down'][dir - module.LEFT];
        },

        opposite: function(dir) {
            return [module.RIGHT, module.DOWN, module.LEFT, module.UP][dir -
                module.LEFT];
        },

        random: function() {
            return module.LEFT + MathExtensions.randomInt(4);
        }
    };

    return module;
});
