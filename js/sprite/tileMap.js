define(['foundation/rectangle'], function(Rectangle) {
    "use strict";

    // Private class methods/fields
    
    
    /**
     * @exports sprite/tileMap
     */
    var module = {
        // Public class methods/fields
        
        /**
         * TileMap
         *
         * @param {int} x                               -   The x coordinate of the TileMap.
         * @param {int} y                               -   The y coordinate of the TileMap.
         * @param {int} width                           -   The width of a standard tile.
         * @param {int} height                          -   The height of a standard tile.
         * @param {int} numWidth                        -   The number of tiles in the width of the TileMap
         * @param {int} numHeight                       -   The number of tiles in the height of the TileMap
         * @param {CanvasDrawer} drawer                 -   A CanvasDrawer to draw the TileMap.
         * @param {Array.<Object>} drawingSettingsArray -   An array of to apply to the tiles repeatedly using modulo.
         *                                                  Iterates through each row.
         * @constructor
         */
        TileMap: function(x, y, width, height, numWidth, numHeight, drawer, drawingSettingsArray) {
            // Protect the `this` keyword to refer to the TileMap instance by storing it in a variable.
            var _this = this;

            // Private instance methods/fields
            
            /**
             * Iterate through each of the tiles. Iterates through rows.
             * @param  {function} f - A function to apply to each tile. The function is given each tile as a parameter.
             * @return {void}
             */
            var forEachTile = function(f) {
                for (var i = 0; i < numHeight; i++) {
                    for (var j = 0; j < numWidth; j++) {
                        f(_this.tiles[i][j]);
                    }
                }
            };
            
            // Public instance methods/fields

            // The 2d-array containing all of the tiles.            
            this.tiles = [];

            // Generate the tiles.
            var index = 0, settingsLen = drawingSettingsArray.length;
            for (var i = 0; i < numHeight; i++) {
                this.tiles.push([]);   // Add a row to the tiles matrix.
                for (var j = 0; j < numWidth; j++) {
                    var settingsIndex = index % settingsLen;
                    this.tiles[i].push(new Rectangle.Rectangle(
                                        x + j * width,
                                        y + i * height,
                                        width, height,
                                        drawer,
                                        drawingSettingsArray[settingsIndex]));
                    index++;
                }
            }

            this.draw = function() {
                forEachTile(function(tile) {
                    tile.draw();
                });
            };

            this.clear = function() {
                forEachTile(function(tile) {
                    tile.clear();
                });
            };
        }
    };

    return module; 
});
