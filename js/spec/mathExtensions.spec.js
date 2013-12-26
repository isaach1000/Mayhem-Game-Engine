define(['util/mathExtensions'], function(MathExtensions) {
    describe('Matrix', function() {
        var
        matrix1 = new MathExtensions.Matrix([11, 9, 24, 2, 1, 5, 2, 6,
            3, 17, 18, 1, 2, 5, 7, 1], 4, 4),
            matrix2 = new MathExtensions.Matrix([11, 6, 32, 1, 2, 4, 5,
                2, 1], 3, 3);
        it('lu decomposition', function() {
            var
            luDec = matrix1.luDecomposition(),
                l = luDec.l,
                u = luDec.u;

            expect(l.get(0, 0)).toBeCloseTo(1);
            expect(l.get(1, 0)).toBeCloseTo(0.27273);
        });

        it('determinant', function() {
            var det = matrix2.determinant();

            expect(det).toBe(-208);
        });

        it('3 by 3 inverse', function() {
            var inv = matrix2.inverse();
            expect(inv.get(1, 1)).toBeCloseTo(149 / 208);
            expect(inv.get(0, 0)).toBeCloseTo(6 / 208);
        });
    });

    describe('Transformation', function() {
        var transformation = new MathExtensions.Transformation(),
            point = {
                x: 3,
                y: 4
            };

        it('apply to point', function() {
            transformation.tx = 10;
            transformation.ty = 3;
            var applied = transformation.applyToPoint(point);

            expect(applied.x).toBe(13);
            expect(applied.y).toBe(7);
        });

        it('adjust point', function() {
            var adjusted = transformation.adjustPoint(point);

            expect(adjusted.x).toBeCloseTo(-7);
            expect(adjusted.y).toBeCloseTo(1);
        });
    });
});
