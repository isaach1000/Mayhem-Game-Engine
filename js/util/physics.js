define([], function() {
    'use strict';
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
       @module util/physics
     */
    var module = {};
    Object.defineProperties(module, {
        /**
            @property GRAVITY
            @type {number}
         */
        GRAVITY: {
            value: 0.008,
            enumerable: true
        },

        /**
            @property ENERGY_LOSS_RATIO
            @type {number}
        */
        ENERGY_LOSS_RATIO: {
            value: 0.8,
            enumerable: true
        }
    });

    /**
        Physics engine

        @constructor
        @class Engine
        @param  {Array} [objects=[]] An array of objects to control
     */
    module.Engine = function(objects) {
        this.objects = objects || [];
    };

    module.Engine.prototype = {
        /**
            Check shapes for collisions with point

            @method collisionQuery
            @param  {Point} point Point to test for
            @return {Array} Array of objects with bounding boxes that contain
            the given point
         */
        collisionQuery: function(point) {
            return this.objects.filter(function(obj) {
                return obj.boundingBox.containsPoint(point);
            });
        }
    };

    return module;
});
