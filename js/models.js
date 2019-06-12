import solid1 from '../models/solid-1-wood.json';
import solid1a from '../models/solid-1-stone.json';
import solid2 from '../models/solid-2.json';
import solid3 from '../models/solid-3.json';
import solid4 from '../models/solid-4.json';
import liquid1 from '../models/liquid-1-oil.json';
import liquid1a from '../models/liquid-1-soap.json';
import liquid1b from '../models/liquid-1-water.json';
import liquid2 from '../models/liquid-2.json';
import liquid3 from '../models/liquid-3.json';
import liquid4 from '../models/liquid-4.json';
import mixing from '../models/mixing.json';
import mixinga from '../models/mixing-a.json';
import mixingb from '../models/mixing-b.json';
import gas1 from '../models/gas-1.json';
import gas3 from '../models/gas-3.json';
import gas4 from '../models/gas-4.json';
import uniform from '../models/uniform.json';
import coconutOil from '../models/coconut-oil.json';
import wax from '../models/wax.json';

export const MIN_TEMP = -6; // *C
export const MAX_TEMP = 60; // *C

function normalizeTemp(temp) {
  return (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
}

export default {
  solid: [
    {
      name: 'Wood',
      json: solid1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 800 + 10;
      }
    },
    {
      name: 'Stone',
      json: solid1a,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 800 + 10;
      }
    }
  ],
  liquid: [
    {
      name: 'Oil',
      json: liquid1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'Soap',
      json: liquid1a,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'Water',
      json: liquid1a,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'Mixing',
      json: mixing,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'MixingA',
      json: mixinga,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    },
    {
      name: 'MixingB',
      json: mixingb,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 1500 + 500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.55 + 0.25;
      }
    }
  ],
  gas: [
    {
      name: 'Air',
      json: gas1,
      tempScale: function (temp) {
        return normalizeTemp(temp) * 5000 + 1500;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 1.0 + 0.2;
      }
    },
    {
      name: 'Air',
      json: gas3,
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
      name: 'Wax',
      json: wax,
      tempScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.65)   // 37ºC
          return t * 1000 + 500;
        else
          return t * 6000;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.3 + 0.6;
      },
      gravityScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.65)
          return 1e-6
        else {
          return 3e-7
        }
      },
      coulombForcesSettings: function (temp) {
        let t = normalizeTemp(temp);
        if (t > 0.65)
          return true
        return false
      }
    },
    {
      name: 'Coconut Oil',
      json: coconutOil,
      tempScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.462)
          return t * 2000 + 1000;
        else
          return t * 7000;
      },
      timeStepScale: function (temp) {
        return normalizeTemp(temp) * 0.3 + 0.6;
      },
      gravityScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.462)
          return 1e-6
        else
          return 3e-7
      },
      coulombForcesSettings: function (temp) {
        let t = normalizeTemp(temp);
        if (t > 0.462)
          return true
        return false
      }
    },
    {
      name: 'Uniform',
      json: uniform,
      tempScale: function (temp) {
        let t = normalizeTemp(temp);
        if (t < 0.9)
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
