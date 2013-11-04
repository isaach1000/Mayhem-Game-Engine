define(['jquery'], function($) {
    "use strict";

    /**
     * @exports util/factory
     */
    var module = {
        /** Construct a canvas. Should be called during/after `$(document).ready`.
         * 
         * @param {string} options - The options for the new HTML canvas.
         * @return {JQueryObject} The canvas jQuery object.
         */
        createCanvas: function(options) {
            var canvas = $('<canvas></canvas>');
            canvas.attr(options);
            canvas.css({
                position: 'absolute',
                top: '0',
                left: '0'
            });
            $('body').append(canvas);
            return canvas;
        }
    };

    return module; 
});

