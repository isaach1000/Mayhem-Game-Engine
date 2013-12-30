/**
    Enum for key arrow input

    @class Direction
 */
define([], function() {
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
        }
    };

    return module;
});
