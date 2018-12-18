import React from 'react';
const atoms = function (atoms) {
  let atomGlyphs = [];
  for (let i = 0; i < atoms.count; i++) {
    atomGlyphs.push(
      <div className={atoms.atomsToShow[i] ? "new-atom new-atom-" + i : "new-atom hiding"} key={i}>
        <div></div>
      </div>
    )
  }
  return atomGlyphs;
};
const NewAtomBin = ({ atomVisibility }) => (
  <div>
    <div className="new-atom-bin">
      {atoms(atomVisibility)}
    </div>
    <div className="new-atom-text">Add</div>
  </div>
);

export default NewAtomBin;
