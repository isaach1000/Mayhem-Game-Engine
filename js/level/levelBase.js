// @formatter:off
define([
    'foundation/canvasDrawer',
    'util/factory',
    'util/boundingBox',
    'util/quadTree'
], function(CanvasDrawer,
    Factory,
    BoundingBox,
    QuadTree) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @module level/levelBase
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * LevelBase
         * @constructor
         */
        LevelBase: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
                WIDTH = 1000,
                HEIGHT = 600;

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.bgCanvas = Factory.createCanvas({
                id: 'bgCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            });

            this.mainCanvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            });

            this.quadBox = new BoundingBox.BoundingBox(0, 0, WIDTH, HEIGHT);
            this.quadTree = new QuadTree.QuadTree(_this.quadBox);

            this.bgCtx = _this.bgCanvas[0].getContext('2d');
            this.bgDrawer = new CanvasDrawer.CanvasDrawer(_this.bgCtx, _this.bgCanvas.width(), _this.bgCanvas.height());
            this.mainCtx = _this.mainCanvas[0].getContext('2d');
            this.mainDrawer = new CanvasDrawer.CanvasDrawer(_this.mainCtx, _this.mainCanvas.width(), _this.mainCanvas.height());
        }
    };

    return module;
});
