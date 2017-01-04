module.exports = {
  authoring: false,
  temperatureControl: {
    label: "Heatbath",
    value: false
  },
  targetTemperature: {
    label: "Heatbath temperature",
    value: 0,
    min: 0,
    max: 1000
  },
  showGauge: {
    label: "Show Temperature Control",
    value: false
  },
  gravitationalField: {
    label: "Gravity",
    value: 0,
    min: 0,
    max: 1e-5
  },
  timeStep: {
    label: "Time step",
    value: 1,
    min: 0,
    max: 5
  },
  viscosity: {
    label: "Viscosity",
    value: 1,
    min: 0,
    max: 10
  },
  showFreezeButton: {
    label: "Show Freeze Button",
    value: false
  },
  startWithAtoms: {
    label: "Start With Existing Atoms",
    value: false
  },

  element1Sigma: {
    label: "Sigma",
    element: 0,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },
  element1Epsilon: {
    label: "Epsilon",
    element: 0,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  element1Mass: {
    label: "Mass",
    element: 0,
    property: "mass",
    value: 20,
    min: 10,
    max: 1000
  },

  element2Sigma: {
    label: "Sigma",
    element: 1,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },
  element2Epsilon: {
    label: "Epsilon",
    element: 1,
    property: "epsilon",
    value: -0.1,
    min: -0.5,
    max: 0
  },
  element2Mass: {
    label: "Mass",
    element: 1,
    property: "mass",
    value: 100,
    min: 10,
    max: 1000
  },

  element3Sigma: {
    label: "Sigma",
    element: 2,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },
  element3Epsilon: {
    label: "Epsilon",
    element: 2,
    property: "epsilon",
    value: -0.000001,
    min: -0.5,
    max: 0
  },
  element3Mass: {
    label: "Mass",
    element: 2,
    property: "mass",
    value: 30,
    min: 10,
    max: 1000
  },

  pair11Forces: {
    element1: 0,
    element2: 0,
    property: "use",
    value: false
  },
  pair11Epsilon: {
    element1: 0,
    element2: 0,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair11Sigma: {
    element1: 0,
    element2: 0,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },

  pair12Forces: {
    element1: 0,
    element2: 1,
    property: "use",
    value: false
  },
  pair12Epsilon: {
    element1: 0,
    element2: 1,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair12Sigma: {
    element1: 0,
    element2: 1,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },

  pair13Forces: {
    element1: 0,
    element2: 2,
    property: "use",
    value: false
  },
  pair13Epsilon: {
    element1: 0,
    element2: 2,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair13Sigma: {
    element1: 0,
    element2: 2,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },

  pair22Forces: {
    element1: 1,
    element2: 1,
    property: "use",
    value: false
  },
  pair22Epsilon: {
    element1: 1,
    element2: 1,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair22Sigma: {
    element1: 1,
    element2: 1,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },

  pair23Forces: {
    element1: 1,
    element2: 2,
    property: "use",
    value: false
  },
  pair23Epsilon: {
    element1: 1,
    element2: 2,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair23Sigma: {
    element1: 1,
    element2: 2,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  },

  pair33Forces: {
    element1: 2,
    element2: 2,
    property: "use",
    value: false
  },
  pair33Epsilon: {
    element1: 2,
    element2: 2,
    property: "epsilon",
    value: -0.05,
    min: -0.5,
    max: 0
  },
  pair33Sigma: {
    element1: 2,
    element2: 2,
    property: "sigma",
    value: 0.1915,
    min: 0.01,
    max: 0.5
  }
}
