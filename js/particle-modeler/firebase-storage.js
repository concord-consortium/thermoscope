import React, { PureComponent } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import Rebase from 're-base';

var base = Rebase.createClass({
    apiKey: "AIzaSyChElp_DuPn3Q0jwV1VXq2M4urgKgANrKw",
    authDomain: "particlemodeler.firebaseapp.com",
    databaseURL: "https://particlemodeler.firebaseio.com",
    storageBucket: "particlemodeler.appspot.com",
    messagingSenderId: "708009502450"
});


export default class FirebaseStorage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { stepNumber: 0, completed: 0, recordedSession: null, sessionData: null };
    this.saveModel = this.saveModel.bind(this);
    this.getStoredData = this.getStoredData.bind(this);
    this.replaySession = this.replaySession.bind(this);
    this.replayStep = this.replayStep.bind(this);
    this.clearSessions = this.clearSessions.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { stepNumber } = this.state;
    // only save state if we're not re-watching a replay.
    if (stepNumber === 0){
        this.saveModel();
    }
  }

  saveModel() {
    const { stepNumber } = this.state;
    const { recordInteractions, modelDiff, sessionName } = this.props;

    if (recordInteractions){
      base.post(`${sessionName}/${Date.now()}`, {
        data: modelDiff
      }).then(() => {
        // update completed console.log("then");
        }).catch(err => {
          console.log("Error storing diff data on Firebase", err);
      });
    }
  }
  getUsers(){
    base.fetch('/',{
      context: this,
      asArray: false,
      shallow: true,
      queries: {
        limitToLast: 50
      }
    }).then(data => {
      // we can use this to get lists of users, though the "shallow" parameter doesn't quite work... we may need to store data in a different hierarchy because firebase defaults to bringing it all down.
      console.log(Object.keys(data));
      }).catch(err => {
        console.log("Error fetching user data from Firebase", err);
    });
  }
  clearSessions(){
    const { sessionName } = this.props;
    let clearData = null;
    // wipe out data!
    base.post(`${sessionName}/`,{
      data: clearData
    }).then(() => {
        // update completed
        this.setState({sessionData: null});
        console.log("Clear completed");
        }).catch(err => {
          console.log("Error clearing data on Firebase", err);
      });
  }
  getStoredData(){
    const { sessionDate, sessionName } = this.props;
    base.fetch(`${sessionName}`, {
      context: this,
      asArray: false,
      queries: {
        limitToLast: 50
      }
    }).then(data => {
      localStorage.setItem(sessionName, JSON.stringify(data));
      this.setState({sessionData: data});
      }).catch(err => {
        console.log("Error fetching diff data from Firebase", err);
    });
  }

  replaySession(){
    const { sessionName } = this.props;

    let newSessionData = JSON.parse(localStorage.getItem(sessionName));
    let sessionTimestamps = Object.keys(newSessionData);
    // restart the replay
    let nextInterval = sessionTimestamps[0] - sessionTimestamps[1];

    this.setState({stepNumber: 0, completed: 0, sessionData: newSessionData});

    this.replayStep(0, nextInterval);
  }

  replayStep(currentInterval){
    const { sessionName, sessionData, model, stepNumber, completed } = this.state;
    const { onLoadDiff } = this.props;

    let sessionTimestamps = Object.keys(sessionData);

    this.timer = setTimeout(() => {
      let sessionTimestamp = sessionTimestamps[stepNumber];

      // call back to the authoring container to replay the diffed actions
      onLoadDiff(sessionData[sessionTimestamp]);

      if(stepNumber < sessionTimestamps.length-1){
        let nextStep = stepNumber + 1;
        let completed = nextStep / sessionTimestamps.length * 100;
        this.setState({stepNumber: nextStep, completed});
        let nextInterval = sessionTimestamps[nextStep]-sessionTimestamps[stepNumber];
        console.log(nextInterval);
        this.replayStep(nextInterval);
      } else {
        this.setState({stepNumber: 0, completed: 100});
      }
    }, currentInterval);
  }

  recordedSessionDetails(){
    const { sessionData, stepNumber, completed } = this.state;
    let sessionTimestamps = Object.keys(sessionData);
    let replayText = "Replay " + sessionTimestamps.length + " action";
    replayText = sessionTimestamps.length > 1 ? replayText + "s" : replayText;
    replayText += " over " + ((sessionTimestamps[sessionTimestamps.length - 1] - sessionTimestamps[0]) / 1000) + " seconds";

    return(
      <div className="recorded-session-details">
        <div className="replay-session-text">{replayText}</div>
        <LinearProgress mode="determinate" value={completed} />
      </div>
    )
  }

  sessionNameDetails(){
    const { sessionName } = this.props;
    let nameText = "Current username: " + sessionName;
    let details =
      <div>
        <IconButton onClick={this.getStoredData} iconClassName="material-icons" className="load-session-data" tooltip="Load activity">save</IconButton>
        <div className="student-name">{nameText}</div>
      </div>
    return details;
  }

  render(){
    const { sessionData } = this.state;
    const { recordInteractions, sessionName } = this.props;

    let sessionDetails = sessionData ? this.recordedSessionDetails() : null;
    let nameText = "Current username: " + sessionName;

    return(
      <div>
        {recordInteractions &&
        <div className="stored-activity">
          {/*<FlatButton
            label="Get Users"
            labelPosition="after"
            onClick={this.getUsers}
            className="get-users"
            icon={<i className="material-icons">people</i>}></FlatButton>*/}
          <div className="student-name">{nameText}</div>
          <div>
            <FlatButton
              label="Load Activity"
              labelPosition="after"
              onClick={this.getStoredData}
              className="load-session-data"
              icon={<i className="material-icons">cloud_download</i>}>
            </FlatButton>
            {sessionDetails &&
            <FlatButton
              label="Replay Activity"
              labelPosition="after"
              onClick={this.replaySession}
              className="replay-session"
              icon={<i className="material-icons">refresh</i>}>
            </FlatButton>}
            {sessionDetails &&
            <FlatButton
              label="Clear History"
              labelPosition="after"
              onClick={this.clearSessions}
              className="clear-session"
              icon={<i className="material-icons">delete_forever</i>}>
            </FlatButton>
            }

          </div>
          <div className="student-activity">{sessionDetails}</div>
        </div>
        }
      </div>
    )
  }
}