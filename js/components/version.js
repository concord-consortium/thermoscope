import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class Version extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const iPadBuild = window.location.href.indexOf('/branch/ios') > -1;
    const versionId = iPadBuild ? 'iOS' : 'Master';
    return (
      <div className="version-identifier">{versionId} 20180920.2</div>
    )
  }
}