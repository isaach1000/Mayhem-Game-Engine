var
    CanvasDrawer = require('../foundation/canvasDrawer'),
    Factory = require('../util/factory'),
    BoundingBox = require('../util/boundingBox'),
    Physics = require('../util/physics'),
    InputHandler = require('../events/inputHandler');

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module level/levelBase
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       @class LevelBase
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
                width: this.WIDTH + this.MARGIN + 'px',
                height: this.HEIGHT + this.MARGIN + 'px'
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
                w = this.WIDTH,
                h = this.HEIGHT,
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
        this.HEIGHT = 500;

        /**
            Margin add to width and height when creating canvas

            @property MARGIN
            @type {Number}
         */
        this.MARGIN = 5;

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
