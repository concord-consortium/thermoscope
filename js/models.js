import solid1 from '../models/solid-1.json';

export const MIN_TEMP = -6;
export const MAX_TEMP = 60;

export default {
  'solid-1': {
    json: solid1,
    tempScale: function (temp) {
      return (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP) * 800 + 10;
    }
  }
};
