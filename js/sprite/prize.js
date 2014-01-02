var Sprite = require('./sprite'),
    Shape = require('../foundation/shape');

/**
    A pickup item that end the game

    @class Prize
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
FILL_STYLE = '#00FF76',
    PRIZE_SIDE = 15;

/**
    @module sprite/prize
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Prize
         @constructor
     */

    Prize: function(row, column, maze, drawer) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        rect = new Shape.Rectangle(-PRIZE_SIDE / 2, -PRIZE_SIDE / 2,
            PRIZE_SIDE, PRIZE_SIDE, drawer, {
                fillStyle: FILL_STYLE
            }),
            location = maze.get(row, column),
            shapes = [rect];


        function init() {
            rect.rotate(Math.PI / 4);
            Sprite.Sprite.call(_this, shapes, drawer);
            _this.x = location.x + location.width / 2;
            _this.y = location.y + location.height / 2;
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////


        // Call init to perform setup
        init();
    }

};
