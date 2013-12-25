define(['foundation/shape'], function(Shape) {
    "use strict";

    describe('Shape', function() {
        it('adjust point', function() {
            var
            point = {
                x: 2,
                y: 0
            },
                origin = {
                    x: 0,
                    y: 0
                },
                angle = Math.PI / 2,
                exp = {},
                result = null; // TODO

            expect(result.x).toBeCloseTo(exp.x);
            expect(result.y).toBeCloseTo(exp.y);
        });
    });
});
