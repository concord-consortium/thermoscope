const wallThickness = 0.1;
const basePos = 0.15;
const baseThickness = 0.01;
const leftPos = 1.25;
const rightPos = 3.25;
const baseColor = "rgba(128,96,96,0)";
const hiddenWallColor = "rgba(0,128,0,0)";
const wallColor = "rgba(0,0,0,1)";
const lidColor = "rgba(0,0,0,1)";
const containerWidth = rightPos - leftPos;

export function getContainerPosition() {
  let c = {};
  c.basePos = basePos;
  c.leftPos = leftPos;
  c.rightPos = rightPos;
  c.wallThickness = wallThickness;
  return c
}
export function updateContainerVisibility(visible, height, currentContainerHeight, containerLid, api) {
    let h = height ? height : currentContainerHeight ? currentContainerHeight.value : 2.25;
    let currentlyVisible = api.getNumberOfObstacles() > 0;

    if (currentlyVisible) {
      if (!visible) {
        // remove old obstacles
        for (let i = api.getNumberOfObstacles() - 1; i > -1; i--) {
          api.removeObstacle(i);
        }

        let atomsToDelete = [];
        // iterate through all atoms, remove elements no longer needed
        for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
          if (api.getAtomProperties(i).element == 2)
            atomsToDelete.push(i);
        }
        for (let i = atomsToDelete.length - 1; i > -1; i--) {
          api.removeAtom(atomsToDelete[i]);
        }
        // remove shapes
        let shapesToDelete = [];
        for (let i = 0, ii = api.getNumberOfShapes(); i < ii; i++) {
          shapesToDelete.push(i);
        }
        for (let i = shapesToDelete.length - 1; i > -1; i--) {
          api.removeShape(shapesToDelete[i]);
        }

        // remove lines
        let linesToDelete = [];
        for (let i = 0, ii = api.getNumberOfLines(); i < ii; i++) {
          linesToDelete.push(i);
        }
        for (let i = linesToDelete.length - 1; i > -1; i--) {
          api.removeLine(linesToDelete[i]);
        }

        api.setImageProperties(0, { visible: false });
      } else {
        // adjust height - if the container is on screen, wall indices will be 3 and 4
        api.setObstacleProperties(3, { height: h }); // left
        api.setObstacleProperties(4, { height: h }); // right
        if (containerLid.value) {
          // adjusting height should reposition lid
          let lidObstacleIndex = api.getNumberOfObstacles() - 1;
          api.setObstacleProperties(lidObstacleIndex, { y: h - wallThickness });
        }
      }
    }
    if (!currentlyVisible && visible) {
      api.addObstacle({ x: leftPos, y: basePos, width: containerWidth, height: baseThickness, color: baseColor }); // base
      api.addObstacle({ x: leftPos, y: 0, width: wallThickness, height: basePos, color: baseColor }); // base edge left
      api.addObstacle({ x: rightPos - wallThickness, y: 0, width: wallThickness, height: basePos, color: baseColor }); // base edge right

      api.addObstacle({ x: leftPos, y: basePos + baseThickness, width: wallThickness, height: h, color: wallColor }); // left
      api.addObstacle({ x: rightPos - wallThickness, y: basePos + baseThickness, width: wallThickness, height: h, color: wallColor }); // right

      // add base layer atoms
      let spacing = 0.2;
      for (let i = 1; i < 10; i++) {
        api.addAtom({ x: leftPos + (i * spacing), y: 0, element: 2, draggable: 0, pinned: 1, visible: false });
      }

      // show image
      api.setImageProperties(0, { visible: true });
    }
  }

  export function updateContainerLid(containerLid, lidVisible, containerVisible, containerHeight, api) {
    let h = containerHeight ? containerHeight.value : 2.25;
    let lid = containerLid;

    let lidObstacleIndex = lid.value ? api.getNumberOfObstacles() - 1 : -1;
    if (containerVisible) {
      if (lidVisible) {
        api.addObstacle({ x: leftPos + (wallThickness), y: h - wallThickness, width: containerWidth - (wallThickness * 2.01), height: wallThickness, color: lidColor });
        lidObstacleIndex = api.getNumberOfObstacles() - 1;
      } else if (lidObstacleIndex > -1) {
        api.removeObstacle(lidObstacleIndex);
        lidObstacleIndex = -1;
      }
    } else {
      // container is not visible, attempting to show a lid in this state is invalid
      if (lidVisible) {
        // nope
        lidObstacleIndex = -1;
      } else {
        if (api.getNumberOfObstacles() > 0 && lidObstacleIndex > -1) {
          api.removeObstacle(lidObstacleIndex);
          lidObstacleIndex = -1;
        }
      }
    }
    return lidObstacleIndex > -1;
  }