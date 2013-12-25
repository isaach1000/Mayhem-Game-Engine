define(['util/minheap'], function(MinHeap) {
    "use strict";
    describe('MinHeap', function() {
        describe('with primitive data', function() {
            var minheap = new MinHeap.MinHeap();
            it('add elements and length', function() {
                minheap.add(3);
                minheap.add(1);
                minheap.add(5);
                minheap.add(2);
                expect(minheap.length).toBe(4);
            });
            it('peek', function() {
                expect(minheap.peek()).toBe(1);
            });
            it('poll', function() {
                expect(minheap.poll()).toBe(1);
                expect(minheap.length).toBe(3);
            });
        });
        describe('with complex data', function() {
            var minheap = new MinHeap.MinHeap(function(data1, data2) {
                return data1.complex.number - data2.complex.number;
            });
            var obj1 = {
                complex: {
                    number: 3
                }
            },
                obj2 = {
                    complex: {
                        number: 1
                    }
                },
                obj3 = {
                    complex: {
                        number: 5
                    }
                },
                obj4 = {
                    complex: {
                        number: 2
                    }
                };
            it('add elements and length', function() {
                minheap.add(obj1);
                minheap.add(obj2);
                minheap.add(obj3);
                minheap.add(obj4);
                expect(minheap.length).toBe(4);
            });
            it('peek', function() {
                expect(minheap.peek().complex.number).toBe(1);
            });
            it('poll', function() {
                expect(minheap.poll().complex.number).toBe(1);
                expect(minheap.length).toBe(3);
            });
        });
    });
});
