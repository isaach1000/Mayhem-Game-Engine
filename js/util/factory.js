define(['jquery'], function($) {
    "use strict";

    var module;

    // Private class methods/fields

    module = {
        // Public class methods/fields
        
        // Should be called during/after $(document).ready
        createCanvas: function(id) {
            var canvas = $('<canvas id=' + id + '></canvas>');
            $('body').append(canvas);
            return canvas;
        }
    };

    return module; 
});

