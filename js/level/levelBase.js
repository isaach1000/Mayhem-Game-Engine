define(['foundation/canvasDrawer', 'util/factory', 'util/boundingBox',
    'util/quadTree', 'events/inputHandler'
], function(CanvasDrawer, Factory, BoundingBox, QuadTree, InputHandler) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
       @module level/levelBase
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           LevelBase
           @constructor
         */
        LevelBase: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var WIDTH = 1000,
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
            this.quadTree = new QuadTree.QuadTree(this.quadBox);
            this.bgCtx = this.bgCanvas[0].getContext('2d');
            this.bgDrawer = new CanvasDrawer.CanvasDrawer(this.bgCtx, this.bgCanvas
                .width(), this.bgCanvas.height());
            this.mainCtx = this.mainCanvas[0].getContext('2d');
            this.mainDrawer = new CanvasDrawer.CanvasDrawer(this.mainCtx,
                this.mainCanvas.width(), this.mainCanvas.height());
            this.inputHandler = new InputHandler.InputHandler('body');
        }
    };
    return module;
});
