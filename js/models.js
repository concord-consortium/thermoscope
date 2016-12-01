import solid1 from '../models/solid-1.json';
import solid2 from '../models/solid-2.json';
import solid3 from '../models/solid-3.json';
import liquid1 from '../models/liquid-1.json';
import liquid2 from '../models/liquid-2.json';
import liquid3 from '../models/liquid-3.json';
import gas1 from '../models/gas-1.json';
import gas2 from '../models/gas-2.json';

export const MIN_TEMP = -6; // *C
export const MAX_TEMP = 60; // *C

function normalizeTemp(temp) {
  return (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
}

export default {
  solid: [
    {
      name: 'Solid 1',
      json: solid1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 800 + 10;
      }
    },
    {
      name: 'Solid 2',
      json: solid2,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 800 + 10;
      }
    },
    {
      name: 'Solid 3',
      json: solid3,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 800 + 10;
      }
    }
  ],
  liquid: [
    {
      name: 'Liquid 1',
      json: liquid1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      }
    },
    {
      name: 'Liquid 2',
      json: liquid2,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 1000;
      }
    },
    {
      name: 'Liquid 3',
      json: liquid3,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 1000;
      }
    }
  ],
  gas: [
    {
      name: 'Gas 1',
      json: gas1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 5000 + 1500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 1.0 + 0.2;
      }
    },
    {
      name: 'Gas 2',
      json: gas2,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 7000 + 3500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.65 + 0.03;
      }
    }
  ]
};
