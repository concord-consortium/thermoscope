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

  <div className="new-atom-bin">
    <p>New</p>
    {atoms(atomVisibility)}

  </div>
);

export default NewAtomBin;
