define(['util/hashset'], function(Hashset) {
    describe('Hashset', function() {
        var set = new Hashset.Hashset();

        var item = {
            key1: 'val1',
            key2: 2
        }, itemClone = {
                key1: 'val1',
                key2: 2
            };

        it('add', function() {
            expect(set.add(item)).toBe(true);
            expect(set.add(item)).toBe(false);
        });

        it('contains', function() {
            expect(set.contains(item)).toBe(true);
        });

        it('contains only applies to original object, not equal object',
            function() {
                expect(set.contains(itemClone)).toBe(false);
            });

        it('remove & length', function() {
            expect(set.length).toBe(1);
            expect(set.remove(itemClone)).toBe(false);
            expect(set.remove(item)).toBe(true);
            expect(set.length).toBe(0);
            set.add(item);
            set.add(itemClone);
            expect(set.length).toBe(2);
            set.clear();
            expect(set.length).toBe(0);
        });

        it('only adds unique elements', function() {
            set.add(item);
            set.add(item);
            expect(set.length).toBe(1);
        });

        it('get', function() {
            expect(set.get(item)).toBe(item);
        });

        it('forEach', function() {
            var size = 0;
            set.forEach(function(elem) {
                size++;
            });
            expect(size).toBe(set.length);
        });
    });
});
