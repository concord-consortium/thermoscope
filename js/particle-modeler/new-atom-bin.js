import React from 'react';

const NewAtomBin = ({showAtom}) => (
  <div className="new-atom-bin">
    <p>New</p>
    <div className={showAtom ? "new-atom" : "new-atom hiding"}>
      <div></div>
    </div>
  </div>
);

export default NewAtomBin;
