define(['jquery'], function($) {
    "use strict";

    /**
     * @exports util/factory
     */
    var module = {
        /** Construct a canvas. Should be called during/after `$(document).ready`.
         * 
         * @param {(Object)} [options]      - A dictionary of attributes for a new HTML canvas.
         * @param {(Object)} [cssRules]     - A dictionary of CSS rules for a new HTML canvas.
         * @return {JQueryObject}           The canvas jQuery object.
         */
        createCanvas: function(options, cssRules) {
            var canvas = $('<canvas></canvas>');
            if (options !== undefined) {
                canvas.attr(options);
            }
            var defaultCss = {
                position: 'absolute',
                top: '0',
                left: '0'
            };
            
            if (cssRules === undefined) {
                cssRules = {};
            }
           
            for (var key in defaultCss) {
                if (cssRules[key] === undefined) {
                    cssRules[key] = defaultCss[key];
                }
            }
            canvas.css(cssRules);
            $('body').append(canvas);
            return canvas;
        }
    };

    return module; 
});
