
define([
    'sprite/sprite',
    'foundation/rectangle'
	], function(Sprite, 
			Rectangle) {
    "use strict";

	//////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    function TileMap(x, y, width, height, numWidth, numHeight, drawer, drawingSettingsArr) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            // Preserve the "this" keyword to refer to the TileMap instance by storing it in a variable.
            var _this = this,
                initialShapes = [];
            
            /**
             * Iterate through each of the tiles. Iterates through rows.
             * @param {function} f      - A function to apply to each tile. The function is given each tile as a parameter.
             * @return {void}
             */
            function forEachTile(f) {
                var i, j;
                for (i = 0; i < numHeight; i += 1) {
                    for (j = 0; j < numWidth; j += 1) {
                        f(_this.tiles[i][j]);
                    }
                }
            }

            function generateTiles() {
                // Generate the tiles
                var index = 0, settingsLen = drawingSettingsArr.length, i, j, settingsIndex, rect;
                for (i = 0; i < numHeight; i += 1) {
                    _this.tiles.push([]);   // Add a row to the tiles matrix.
                    for (j = 0; j < numWidth; j += 1) {
                        settingsIndex = index % settingsLen;
                        rect = new Rectangle.Rectangle(
                                            x + j * width,
                                            y + i * height,
                                            width, height,
                                            drawer,
                                            drawingSettingsArr[settingsIndex]);
                        _this.tiles[i].push(rect);
                        initialShapes.push(rect);
                        index += 1;
                    }
                }
            }
            
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            _this.tiles = [];
            generateTiles();

            // Extend Sprite constructor
            Sprite.Sprite.call(_this, initialShapes, drawer, drawingSettingsArr);
            _this.updateBoundingBox();

            this.draw = function() {
                _this.forEachShape(function(tile) {
                    tile.draw();
                });
            };

            this.clear = function() {
                forEachTile(function(tile) {
                    tile.clear();
                });
            };
        }
    
    
    /**
     * @exports sprite/tileMap
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * TileMap
         * @param {int} x                               -   The x coordinate of the TileMap.
         * @param {int} y                               -   The y coordinate of the TileMap.
         * @param {int} width                           -   The width of a standard tile.
         * @param {int} height                          -   The height of a standard tile.
         * @param {int} numWidth                        -   The number of tiles in the width of the TileMap
         * @param {int} numHeight                       -   The number of tiles in the height of the TileMap
         * @param {CanvasDrawer} drawer                 -   A CanvasDrawer to draw the TileMap.
         * @param {Array.<Object>} drawingSettingsArr	-   An array of to apply to the tiles repeatedly using modulo.
         *                                                  Iterates through each row.
         * @constructor
         */
        TileMap: TileMap
    };

    return module; 
});
