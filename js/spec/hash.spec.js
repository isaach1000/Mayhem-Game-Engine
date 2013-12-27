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

    describe('Hashset', function() {
        var set = new Hash.Hashset();
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

    describe('Hashtable', function() {
        var table = new Hash.Hashtable();
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
