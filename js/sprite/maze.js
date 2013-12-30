/**
    Maze class generates a maze from a graph.

    @class Maze
 */
define([
    'sprite/sprite',
    'foundation/shape',
    'util/hash',
    'util/mathExtensions',
    'enum/direction'
], function(Sprite, Shape, Hash, MathExtensions, Direction) {
    'use strict';

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var
    TILE_SIDE = 50,
        FILL_STYLE = '#7CF2EC',
        WALL_STYLE = '#FFFFFF',
        WALL_THICKNESS = 5;

    /**
        @module sprite/maze
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
             @class Maze
             @constructor
         */

        Maze: function(numWidth, numHeight, drawer) {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var
            locations = [],
                shapes = [],
                i, j;

            /**
                MazeLocation represents locations within a maze

                @class MazeLocation
                @for Maze
                @constructor
                @param  {integer} i Row index of location
                @param  {integer} j Column index of location
             */
            function MazeLocation(i, j) {
                /**
                    Row index of MazeLocation in Maze

                    @property row
                    @type {integer}
                 */
                this.row = i;

                /**
                    Column index of MazeLocation in Maze

                    @property column
                    @type {integer}
                 */
                this.column = j;

                /**
                    x coordination of tile

                    @property x
                    @type {number}
                 */
                this.x = TILE_SIDE * this.column;

                /**
                    y coordination of tile

                    @property y
                    @type {number}
                 */
                this.y = TILE_SIDE * this.row;

                /**
                    Width of tile

                    @property width
                    @type {number}
                 */
                this.width = TILE_SIDE;

                /**
                    Width of tile

                    @property height
                    @type {number}
                 */
                this.height = TILE_SIDE;

                /**
                    Tile rectangle to represent MazeLocation

                    @property tile
                    @type {Rectangle}
                 */
                this.tile = new Shape.Rectangle(this.x, this.y, TILE_SIDE,
                    TILE_SIDE, drawer, {
                        fillStyle: FILL_STYLE
                    });

                /**
                    Location to the left of this one

                    @property left
                    @type {MazeLocation}
                 */
                this.left = null;

                /**
                    Location to the right of this one

                    @property right
                    @type {MazeLocation}
                 */
                this.right = null;

                /**
                    Location above this one

                    @property up
                    @type {MazeLocation}
                 */
                this.up = null;

                /**
                    Location below this one

                    @property down
                    @type {MazeLocation}
                    @for Maze
                 */
                this.down = null;
            }

            /**
                Initialize maze

                @method init
                @private
                @return {void}
             */
            function init() {
                for (i = 0; i < numHeight; i++) {
                    var locationRow = [];
                    for (j = 0; j < numWidth; j++) {
                        var location = new MazeLocation(i, j);
                        shapes.push(location.tile);
                        locationRow.push(location);
                    }
                    locations.push(locationRow);
                }

                Sprite.Sprite.call(_this, shapes, drawer);

                connectLocations();
                generateMaze();
            }

            /**
                Connect MazeLocations to their neighbors

                @method connectLocations
                @private
                @return {void}
             */
            function connectLocations() {
                for (var i = 0; i < numHeight; i++) {
                    for (var j = 0; j < numWidth; j++) {
                        var location = _this.get(i, j);

                        if (i > 0) {
                            location.up = _this.get(i - 1, j);
                        }
                        if (i < numHeight - 1) {
                            location.down = _this.get(i + 1, j);
                        }
                        if (j > 0) {
                            location.left = _this.get(i, j - 1);
                        }
                        if (j < numWidth - 1) {
                            location.right = _this.get(i, j + 1);
                        }
                    }
                }
            }

            /**
                Generate the maze

                @method generateMaze
                @private
                @return {void}
             */
            function generateMaze() {
                // TODO
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Get MazeLocation with given row and column indices

                @method get
                @param  {integer} i Row index
                @param  {integer} j Column index
                @return {MazeLocation} MazeLocation at specified indices
             */
            this.get = function(i, j) {
                return locations[i][j];
            };

            // Call init to do setup
            init();
        }
    };

    return module;
});
