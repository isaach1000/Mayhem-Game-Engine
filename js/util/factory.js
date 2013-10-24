define(['jquery'], function($) {
    "use strict";

    /**
     * @exports util/factory
     */
    var module = {
        /** Construct a canvas. Should be called during/after `$(document).ready`.
         * 
         * @param {string} id -- The id of the new HTML canvas.
         * @return {JQueryObject} -- The canvas jQuery object.
         */
        createCanvas: function(options) {
            var canvas = $('<canvas></canvas>');
            canvas.attr(options);
            $('body').append(canvas);
            return canvas;
        }
    };

    return module; 
});

