import solid1 from '../models/solid-1.json';
import solid2 from '../models/solid-2.json';

export const MIN_TEMP = -6; // *C
export const MAX_TEMP = 60; // *C

export default {
  solid: [
    {
      name: 'Solid 1',
      json: solid1,
      tempScale: function (temp) {
        return (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP) * 800 + 10;
      }
    },
    {
      name: 'Solid 2',
      json: solid2,
      tempScale: function (temp) {
        return (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP) * 800 + 10;
      }
    }
  ],
  liquid: [],
  gas: []
};
