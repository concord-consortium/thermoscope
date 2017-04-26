import React from 'react';

const NewAtomBin = ({ atomVisibility }) => (

  <div className="new-atom-bin">
    <p>New</p>
    {atomVisibility.atomsToInclude[0] && <div className={atomVisibility.atomsToShow[0] ? "new-atom new-atom-0" : "new-atom hiding"}>
      <div></div>
    </div>}
    {atomVisibility.atomsToInclude[1] && <div className={atomVisibility.atomsToShow[1] ? "new-atom new-atom-1" : "new-atom hiding"}>
      <div></div>
    </div>}
    {atomVisibility.atomsToInclude[2] && <div className={atomVisibility.atomsToShow[2] ? "new-atom new-atom-2" : "new-atom hiding"}>
      <div></div>
    </div>}
  </div>
);

export default NewAtomBin;
