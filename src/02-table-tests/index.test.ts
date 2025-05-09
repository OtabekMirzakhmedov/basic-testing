import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3, description: 'add 1 + 2' },
  { a: 2, b: 2, action: Action.Add, expected: 4, description: 'add 2 + 2' },
  { a: 3, b: 2, action: Action.Add, expected: 5, description: 'add 3 + 2' },

  {
    a: 5,
    b: 2,
    action: Action.Subtract,
    expected: 3,
    description: 'subtract 5 - 2',
  },
  {
    a: 10,
    b: 5,
    action: Action.Subtract,
    expected: 5,
    description: 'subtract 10 - 5',
  },
  {
    a: 0,
    b: 5,
    action: Action.Subtract,
    expected: -5,
    description: 'subtract 0 - 5',
  },

  {
    a: 2,
    b: 3,
    action: Action.Multiply,
    expected: 6,
    description: 'multiply 2 * 3',
  },
  {
    a: 5,
    b: 5,
    action: Action.Multiply,
    expected: 25,
    description: 'multiply 5 * 5',
  },
  {
    a: 0,
    b: 5,
    action: Action.Multiply,
    expected: 0,
    description: 'multiply 0 * 5',
  },

  {
    a: 10,
    b: 2,
    action: Action.Divide,
    expected: 5,
    description: 'divide 10 / 2',
  },
  {
    a: 15,
    b: 3,
    action: Action.Divide,
    expected: 5,
    description: 'divide 15 / 3',
  },
  {
    a: 0,
    b: 5,
    action: Action.Divide,
    expected: 0,
    description: 'divide 0 / 5',
  },

  {
    a: 2,
    b: 3,
    action: Action.Exponentiate,
    expected: 8,
    description: 'exponentiate 2 ^ 3',
  },
  {
    a: 3,
    b: 2,
    action: Action.Exponentiate,
    expected: 9,
    description: 'exponentiate 3 ^ 2',
  },
  {
    a: 5,
    b: 0,
    action: Action.Exponentiate,
    expected: 1,
    description: 'exponentiate 5 ^ 0',
  },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    '$description should return $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 1, b: 2, action: 'invalid' });
    expect(result).toBeNull();
  });

  test('should return null for non-numeric a', () => {
    const result = simpleCalculator({ a: '1', b: 2, action: Action.Add });
    expect(result).toBeNull();
  });

  test('should return null for non-numeric b', () => {
    const result = simpleCalculator({ a: 1, b: '2', action: Action.Add });
    expect(result).toBeNull();
  });
});
