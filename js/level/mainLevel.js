// @formatter:off
define(['level/levelBase', 'sprite/human'],
    function(LevelBase, Human) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports level/mainLevel
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * MainLevel, extends [LevelBase]{@link
         * module:level/levelBase.LevelBase}
         * @constructor
         * @extends {LevelBase}
         */
        MainLevel : function() {
            // Extend LevelBase constructor
            LevelBase.LevelBase.call(this);

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var _this = this;
            
            var human = new Human.Human(200, 200, this.mainDrawer, {
                fillStyle: 'FFA700',
                strokeStyle: 'black'    
            });
            human.draw();

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
        }
    };

    return module;
});
