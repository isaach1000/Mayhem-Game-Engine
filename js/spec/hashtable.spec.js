define(['util/hashtable'], function(Hashtable) {
    describe('Hashtable', function() {
        var table = new Hashtable.Hashtable();

        var key = {
            prop: 'property'
        }, value = {
                prop: 'val'
            }, keyClone = {
                prop: 'property'
            };

        it('put', function() {
            expect(table.put(key, value)).toBe(true);
            expect(table.put(key, value)).toBe(false);
        });

        it('containsKey', function() {
            expect(table.containsKey(key)).toBe(true);
            expect(table.containsKey(keyClone)).toBe(false);
        });

        it('get', function() {
            expect(table.get(key)).toBe(value);
        });

        it('contains only applies to original object, ' +
            'not equal object', function() {
                expect(table.containsKey(keyClone)).toBe(false);
            });

        it('remove & length', function() {
            expect(table.length).toBe(1);
            expect(table.remove(keyClone)).toBe(false);
            expect(table.remove(key)).toBe(true);
            expect(table.length).toBe(0);
            table.put(key);
            table.put(keyClone);
            expect(table.length).toBe(2);
            table.clear();
            expect(table.length).toBe(0);
        });

        it('only puts unique keys', function() {
            table.put(key, value);
            table.put(key, value);
            expect(table.length).toBe(1);
        });

        it('forEach', function() {
            var size = 0;
            table.forEach(function(k, v) {
                size++;
            });
            expect(size).toBe(table.length);
        });
    });
});
