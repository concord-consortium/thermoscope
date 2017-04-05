import solid1 from '../models/solid-1.json';
import solid2 from '../models/solid-2.json';
import solid3 from '../models/solid-3.json';
import solid4 from '../models/solid-4.json';
import liquid1 from '../models/liquid-1.json';
import liquid2 from '../models/liquid-2.json';
import liquid3 from '../models/liquid-3.json';
import liquid4 from '../models/liquid-4.json';
import gas1 from '../models/gas-1.json';
import gas2 from '../models/gas-2.json';
import gas4 from '../models/gas-4.json';
import uniform from '../models/uniform.json';

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
    },
    {
      name: 'Solid 4',
      json: solid4,
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
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'Liquid 2',
      json: liquid2,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 2000 + 2000;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.40 + 0.25;
      }
    },
    {
      name: 'Liquid 3',
      json: liquid3,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 2000 + 3000;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.85 + 0.15;
      }
    },
    {
      name: 'Liquid 4',
      json: liquid4,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 900 + 700;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.45 + 0.2;
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
    },
    {
      name: 'Gas 4',
      json: gas4,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 5000 + 1500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 1.0 + 0.2;
      }
    }
  ],
  uniform: [
    {
      name: 'Uniform',
      json: uniform,
      tempScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.27)
          return t * 2000 + 1000;
        else if (t < 0.71)
          return t * 7000;
        else
          return t * 7000 + 1000;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.3 + 0.6;
      },
      gravityScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.27)
          return 1e-6
        else if (t < 0.71)
          return 3e-7
        else
          return 1e-8
      },
      coulombForcesSettings: function (temp) {
        let t = normalizeTemp(temp);
        if (t > 0.27 && t < 0.71 )
          return true
        return false
      }
    }
  ]
};
