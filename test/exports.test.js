const range = require('../exports.js').range;
const randomColumn = require('../exports.js').randomColumn;
const shuffleArray = require('../exports.js').shuffleArray;
const standardBingoCard = require('../exports.js').standardBingoCard;
const buildResponse = require('../exports.js').buildResponse;
const newBall = require('../exports.js').newBall;
const logical = require('../exports.js').logical;

describe('range', () => {
  it('defaults to a range of 15', () => {
    const expectResult = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(range(1)).toEqual(expectResult);
  });

  it('it can return a custom range', () => {
    const expectResult = [1, 2, 3];
    expect(range(1,3)).toEqual(expectResult);
  });
});

describe('randomColumn', () => {
  it('returns an array of 5 random ints from a range', () => {
    const column = randomColumn(1);
    expect(column.length).toBe(5);
  });

  it('returns an array of elements within a specified range', () => {
    const column = randomColumn(61);
    expect(column[0]).toBeGreaterThanOrEqual(61);
  });
});

describe('shuffleArray', () => {
  it('shuffles a given array', () => {
    const array = range(1, 100);
    expect(shuffleArray(array)).not.toEqual(array);
  });
});

describe('standardBingoCard', () => {
  const card = standardBingoCard();

  it('returns a standard bingo card', () => {
    expect(Object.keys(card)).toEqual(["b", "i", "n", "g", "o"])
  });

  it('has a free space', () => {
    expect(card.n[2]).toBe('Free');
  });
});

describe('buildResponse', () => {
  it('builds a response with a default status', () => {
    const expectedResponse = {
      status: 200,
      headers: {},
      body: 'test response',
    };
    expect(buildResponse('test response')).toEqual(expectedResponse);
  });

  it('builds a response with a custom status', () => {
    const expectedResponse = {
      status: 418,
      headers: {},
      body: 'Im a teapot',
    };
    expect(buildResponse('Im a teapot', 418)).toEqual(expectedResponse);
  });
});

describe('newBall', () => {
  it('returns a random bingo number', () => {
    expect(/(b|i|n|g|o)[1-75]/.test(newBall())).toBe(true)
  });

  it('returns an empty array if everything is excluded', () => {
    const bRange = range(1).map((e) => `b${e}`);
    const iRange = range(16).map((e) => `i${e}`);
    const nRange = range(31).map((e) => `n${e}`);
    const gRange = range(46).map((e) => `g${e}`);
    const oRange = range(61).map((e) => `o${e}`);
    const fullRange = bRange.concat(iRange)
      .concat(nRange)
      .concat(gRange)
      .concat(oRange)
    expect(newBall(fullRange)).toEqual([]);
  });
});

describe('logical', () => {
  it('hits the root path', () => {
    const testEvent = {
      path: '/',
    };
    return logical(testEvent)
      .then((result) => expect(result.body).toBe('root path'))
      .catch(() => expect('Error, should not get here').not.toBeDefined());
  });

  it('hits the newball path', () => {
    const testEvent = {
      path: '/newball',
    };
    return logical(testEvent)
    .then((result) => {
      expect(/b|i|n|g|o[1-75]/.test(result.body)).toBe(true)
    })
    .catch(() => expect('Error, should not get here').not.toBeDefined());
  });

  it('hits the bingcard path', () => {
    const testEvent = {
      path: '/bingocard',
    };
    return logical(testEvent)
      .then((result) => expect(result.body.n[2]).toBe('Free'))
      .catch(() => expect('Error, should not get here').not.toBeDefined());
  });

  it('returns 404 for an undefined path', () => {
    const testEvent = {
      path: '/helpimtrappedinaslugfactory',
    };
    return logical(testEvent)
      .then((result) => expect(result.status).toBe(404))
      .catch(() => expect('Error, should not get here').not.toBeDefined());
  });
});