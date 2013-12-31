define(['util/minHeap'], function(MinHeap) {
    'use strict';
    describe('MinHeap', function() {
        describe('with primitive data', function() {
            var minHeap = new MinHeap.MinHeap();
            it('add elements and length', function() {
                minHeap.add(3);
                minHeap.add(1);
                minHeap.add(5);
                minHeap.add(2);
                expect(minHeap.length).toBe(4);
            });
            it('peek', function() {
                expect(minHeap.peek()).toBe(1);
            });
            it('poll', function() {
                expect(minHeap.poll()).toBe(1);
                expect(minHeap.length).toBe(3);
            });
        });
        describe('with complex data', function() {
            var minHeap = new MinHeap.MinHeap(function(data1, data2) {
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
                minHeap.add(obj1);
                minHeap.add(obj2);
                minHeap.add(obj3);
                minHeap.add(obj4);
                expect(minHeap.length).toBe(4);
            });
            it('peek', function() {
                expect(minHeap.peek().complex.number).toBe(1);
            });
            it('poll', function() {
                expect(minHeap.poll().complex.number).toBe(1);
                expect(minHeap.length).toBe(3);
            });
        });
    });
});
