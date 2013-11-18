define(['character/player'], function(Player) {
    describe('Player', function() {
        var room1 = {
            name : 'room1'
        }, room2 = {
            name : 'room2'
        }, player = new Player.Player(room1);

        it('room getter', function() {
            expect(player.getRoom()).toBe(room1);
        });
        
        it('room setter', function() {
            player.setRoom(room2);
            expect(player.getRoom()).toBe(room2);
        });

        var item = {
            name : 'myItem'
        };
        it('add to bag & bag getter', function() {
            player.addToBag(item);
            expect(player.getBag().length).toBe(1);
            expect(player.getBag()[0]).toBe(item);
        });
        
        it('remove from bag', function() {
            expect(player.removeFromBag('a')).toBe(null);
            expect(player.removeFromBag(item)).toBe(item);
            expect(player.getBag().length).toBe(0);
        });

        it('get maxWeight & increase maxWeight', function() {
            expect(player.getMaxWeight()).toBe(100);
            player.increaseMaxWeight();
            expect(player.getMaxWeight()).toBe(150);
        });

    });
});
