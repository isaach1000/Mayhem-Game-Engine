// @formatter:off
define(['jquery', 'level/levelBase', 'sprite/human'],
    function($, LevelBase, Human) {
        "use strict";
        // @formatter:on

        //////////////////////////////////
        // Private class methods/fields //
        //////////////////////////////////

        /**
         * @module level/mainLevel
         */
        var module = {
            /////////////////////////////////
            // Public class methods/fields //
            /////////////////////////////////

            /**
             * MainLevel, extends [LevelBase]{@link module:level/levelBase.LevelBase}
             * @constructor
             * @extends {LevelBase}
             */
            MainLevel: function() {
                // Extend LevelBase constructor
                LevelBase.LevelBase.call(this);

                /////////////////////////////////////
                // Private instance methods/fields //
                /////////////////////////////////////

                var _this = this;

                var human1 = new Human.Human(200, 200, this.mainDrawer);
                var human2 = new Human.Human(-400, -200, this.mainDrawer);
                human1.draw();
                human2.turn(Math.PI / 180 * 180);
                human2.draw();
                $('body').click(function() {
                    human1.step();
                    human2.step();
                });

                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
            }
        };

        return module;
    });
