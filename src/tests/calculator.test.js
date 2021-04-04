const cal = require('../calculator')


describe('calculator', () => {
    test('sum', () => {
        
        const result = cal.add(10, 20)

        expect(30).toEqual(result);
    });

    test('mul', () => {
        
        const result = cal.multiply(10, 20)

        expect(200).toEqual(result);
    });

    test('add', () => {
        
        const result = cal.add(10, 20)

        expect(10).toEqual(result);
    });
});