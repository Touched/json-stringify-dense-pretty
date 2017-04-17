import { describe, it } from 'mocha';
import { expect } from 'chai';
import stringify from '../';

describe('JSON stringify', () => {
  it('turns basic types into JSON', () => {
    expect(stringify(1)).to.equal('1');
    expect(stringify(2.07)).to.equal('2.07');
    expect(stringify(true)).to.equal('true');
    expect(stringify(false)).to.equal('false');
    expect(stringify(null)).to.equal('null');
    expect(stringify('')).to.equal('""');
    expect(stringify('abc')).to.equal('"abc"');
    expect(stringify([])).to.equal('[]');
    expect(stringify({})).to.equal('{}');
  });

  it('fails on cyclic objects', () => {
    const data = {};
    data.data = data;

    expect(() => stringify(data)).to.throw('Converting circular structure to JSON');
  });

  it('fails on cyclic arrays', () => {
    const data = [];
    data.push(data);

    expect(() => stringify(data)).to.throw('Converting circular structure to JSON');
  });

  it('converts long objects to a pretty-printed object', () => {
    const data = {
      'property-one': 1,
      'property-two': 2,
      'property-three': 3,
      'property-four': 4,
      'property-four': 4,
    };

    const expected = `{
  "property-one": 1,
  "property-two": 2,
  "property-three": 3,
  "property-four": 4
}`;

    expect(stringify(data)).to.equal(expected);
  });

  it('converts short objects onto one line', () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    };

    const expected = '{ "a": 1, "b": 2, "c": 3 }';

    expect(stringify(data)).to.equal(expected);
  });

  it('crams as many array elements onto one line as possible', () => {
    const data = [...Array(50)].map(() => 0);

    const expected = `[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]`;

    expect(stringify(data)).to.equal(expected);
  });

  it('makes small arrays a single line', () => {
    expect(stringify([0, 0, 0])).to.equal('[0, 0, 0]');
  });

  it('converts nested objects', () => {
    const data = {
      a: [0, 0, 0],
      b: 7,
      c: {
        a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        c: null,
      },
      d: [{ a: 1 }, { b: 2 }, { c: 2 }],
    };

    const expected = `{
  "a": [0, 0, 0],
  "b": 7,
  "c": {
    "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    "c": null
  },
  "d": [{ "a": 1 }, { "b": 2 }, { "c": 2 }]
}`;

    expect(stringify(data)).to.equal(expected);
  });
});
