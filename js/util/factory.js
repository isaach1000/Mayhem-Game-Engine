define(['jquery'], function($) {
    "use strict";

    /**
     * @exports util/factory
     */
    var module = {
        /** Construct a canvas. Should be called during/after `$(document).ready`.
         * 
         * @param {string} id -- The id of the new HTML canvas.
         * @return {jQueryObject} -- The canvas jQuery object.
         */
        createCanvas: function(id) {
            var canvas = $('<canvas id="' + id + '"></canvas>');
            $('body').append(canvas);
            return canvas;
        }
    };

    return module; 
});

