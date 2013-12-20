/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */
define(['jquery', 'level/levelBase', 'foundation/shape'], //'sprite/human', 'foundation/polygon'],
    function($, LevelBase, Shape) { //Human, Polygon) {
        "use strict";

        //////////////////////////////////
        // Private class methods/fields //
        //////////////////////////////////

        /**
           @module level/mainLevel
         */
        var module = {
            /////////////////////////////////
            // Public class methods/fields //
            /////////////////////////////////

            /**
               @constructor
             */
            MainLevel: function() {
                // Extend LevelBase constructor
                LevelBase.LevelBase.call(this);
                var _this = this;

                /////////////////////////////////////
                // Private instance methods/fields //
                /////////////////////////////////////

                var poly = new Shape.Polygon({
                    x: 200,
                    y: 200
                }, [{
                    x: 100,
                    y: 0
                }, {
                    x: -100,
                    y: 0
                }, {
                    x: 0,
                    y: 100
                }], this.mainDrawer, {
                    fillStyle: 'purple'
                });

                poly.draw();

                /*
                var human1 = new Human.Human(200, 200, this.mainDrawer);
                var human2 = new Human.Human(500, 500, this.mainDrawer);
                human1.draw();
                human2.turn(Math.PI / 4);
                human2.draw();
                $('body').click(function() {
                    human2.step();
                });
                human1.step();
                */

                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
            }
        };

        return module;
    });
