import React from 'react';

const NewAtomBin = ({showAtom0, showAtom1, showAtom2}) => (
  <div className="new-atom-bin">
    <p>New</p>
    <div className={showAtom0 ? "new-atom new-atom-0" : "new-atom hiding"}>
      <div></div>
    </div>
    <div className={showAtom1 ? "new-atom new-atom-1" : "new-atom hiding"}>
      <div></div>
    </div>
    <div className={showAtom2 ? "new-atom new-atom-2" : "new-atom hiding"}>
      <div></div>
    </div>
  </div>
);

export default NewAtomBin;
