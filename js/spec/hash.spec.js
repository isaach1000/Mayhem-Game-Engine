define(['util/hash'], function(Hash) {
    describe('Hash', function() {
        var obj1 = {}, obj2 = {};

        it('unique hashcodes', function() {
            expect(Hash.hashcode(obj1)).not.toBe(Hash.hashcode(obj2));
        });

        it('consistent hashcodes', function() {
            var originalHash = Hash.hashcode(obj1);
            obj1.newKey = 'newValue';
            expect(Hash.hashcode(obj1)).toBe(originalHash);
        });

    });
});
