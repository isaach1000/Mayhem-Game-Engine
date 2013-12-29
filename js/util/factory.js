/**
    Factory class to produce HTML elements.

    @class Factory
 */
define(['jquery'], function($) {
    'use strict';
    /**
       @module util/factory
     */
    var module = {
        /** Construct a canvas. Should be called during/after .

            @param   {(Object)} options A dictionary of attributes for a new
            HTML canvas.
            @param   {(Object)} cssRules A dictionary of CSS rules for a new
            HTML canvas.
            @return  {JQueryObject} The canvas jQuery object.
         */
        createCanvas: function(options, cssRules) {
            options = options || {};
            cssRules = cssRules || {};
            var width = '1000px',
                height = '600px';
            if (options.width) {
                width = options.width;
                delete options.width;
            }
            if (options.height) {
                height = options.height;
                delete options.height;
            }
            var defaultCss = {
                position: 'absolute',
                top: '0',
                left: '0'
            };
            for (var key in defaultCss) {
                if (cssRules[key] === undefined) {
                    cssRules[key] = defaultCss[key];
                }
            }
            options.css = cssRules;
            // Must use attr method for width and height and not options
            // or jQuery will default to using CSS for width and height
            return $('<canvas>', options).attr('width', width).attr(
                'height', height).appendTo('body');
        }
    };
    return module;
});
