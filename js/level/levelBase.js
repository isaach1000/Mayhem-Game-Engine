define(['foundation/canvasDrawer', 'util/factory', 'util/boundingBox',
    'util/physics', 'events/inputHandler'
], function(CanvasDrawer, Factory, BoundingBox, Physics, InputHandler) {
    'use strict';

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

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Create a canvas with the dimensions this.WIDTH by this.HEIGHT

                @method createCanvas
                @param  {string} [id] String to use as HTML id
                @return {JQueryObject} A new jQuery object of the new canvas
             */
            this.createCanvas = function(id) {
                return Factory.createCanvas({
                    id: id,
                    width: this.WIDTH + 'px',
                    height: this.HEIGHT + 'px'
                });
            };

            /**
                Create a canvas with the createCanvas method and return a new
                CanvasDrawer for that canvas

                @method createContext
                @param  {string} [id] String to use as HTML id
                @return {CanvasDrawer} CanvasDrawer for new canvas
             */
            this.createContext = function(id) {
                var
                $canvas = this.createCanvas(id),
                    w = $canvas.width(),
                    h = $canvas.height(),
                    ctx = $canvas[0].getContext('2d');
                return new CanvasDrawer.CanvasDrawer(ctx, w, h);
            };

            /**
                Width of canvas

                @property WIDTH
                @type {number}
             */
            this.WIDTH = 1000;

            /**
                Height of canvas

                @property HEIGHT
                @type {number}
             */
            this.HEIGHT = 600;

            /**
                Physics engine

                @property physicsEngine
                @type {Engine}
             */
            this.physicsEngine = new Physics.Engine();

            /**
                Input handler

                @property inputHandler
                @type {InputHandler}
             */
            this.inputHandler = new InputHandler.InputHandler('body');
        }
    };

    return module;
});
