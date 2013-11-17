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
     * @exports level/levelBase
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * LevelBase
         * @constructor
         */
        LevelBase : function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var that = this, WIDTH = 1000, HEIGHT = 600;

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            that.bgCanvas = Factory.createCanvas({
                id : 'bgCanvas',
                width : WIDTH + 'px',
                height : HEIGHT + 'px'
            });

            that.mainCanvas = Factory.createCanvas({
                id : 'mainCanvas',
                width : WIDTH + 'px',
                height : HEIGHT + 'px'
            });

            that.qBox = new BoundingBox.BoundingBox(0, 0, WIDTH, HEIGHT);
            that.quadTree = new QuadTree.QuadTree(that.qBox);

            that.bgCtx = that.bgCanvas[0].getContext('2d');
            that.bgDrawer = new CanvasDrawer.CanvasDrawer(that.bgCtx, that.bgCanvas.width(), that.bgCanvas.height());
            that.mainCtx = that.mainCanvas[0].getContext('2d');
            that.mainDrawer = new CanvasDrawer.CanvasDrawer(that.mainCtx, that.mainCanvas.width(), that.mainCanvas.height());
        }
    };

    return module;
});
