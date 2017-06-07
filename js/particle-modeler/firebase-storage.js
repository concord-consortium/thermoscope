import React, { PureComponent } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Rebase from 're-base';
import { loadModelDiff } from '../utils';
import authorableProps from './models/authorable-props';

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
  }

  componentDidUpdate(prevProps, prevState) {
    this.saveModel();
  }

  saveModel() {
    const { stepNumber } = this.state;
    const { recordInteractions, modelDiff, sessionName } = this.props;

    if (recordInteractions && !stepNumber){
      base.post(`${sessionName}/${Date.now()}`, {
        data: modelDiff
      }).then(() => {
        // update completed console.log("then");
        }).catch(err => {
          console.log("Error storing diff data on Firebase", err);
      });
    }
  }

  getStoredData(){
    const { sessionDate, sessionName } = this.props;
    base.fetch(`${sessionName}`, {
      context: this,
      asArray: false,
      queries: {
        limitToLast: 10
      }
    }).then(data => {
      // update completed console.log("then");
      console.log(data);
      localStorage.setItem(sessionName, JSON.stringify(data));
      this.setState({sessionData: data});
      }).catch(err => {
        console.log("Error fetching diff data from Firebase", err);
    });
  }

  replaySession(){
    const {sessionName} = this.props;

    let newSessionData = JSON.parse(localStorage.getItem(sessionName));
    let sessionTimestamps = Object.keys(newSessionData);
    // restart the replay
    let nextInterval = sessionTimestamps[0] - sessionTimestamps[1];

    this.setState({stepNumber: 0, completed: 0, sessionData: newSessionData});

    this.replayStep(0, nextInterval);
  }

  replayStep(currentInterval){
    const {sessionName, sessionData, model, stepNumber, completed} = this.state;
    const {authoring, onLoadDiff} = this.props;

    let sessionTimestamps = Object.keys(sessionData);

    this.timer = setTimeout(() => {
      let sessionTimestamp = sessionTimestamps[stepNumber];
      let nextDiff = loadModelDiff(sessionData[sessionTimestamp], authorableProps);
      nextDiff.authoring = authoring;
      nextDiff.stepNumber = stepNumber;

      // call back to the authoring container to replay the diffed actions
      onLoadDiff(nextDiff);

      if(stepNumber < sessionTimestamps.length-1){
        let nextStep = stepNumber + 1;
        let completed = nextStep / sessionTimestamps.length * 100;
        this.setState({stepNumber: nextStep, completed});
        let nextInterval = sessionTimestamps[nextStep] - sessionTimestamps[stepNumber];
        this.replayStep(nextStep, nextInterval);
      } else {
        this.setState({stepNumber: 0, completed: 100});
      }
    }, currentInterval);
  }

  recordedSessionDetails(){
    const { sessionData, stepNumber, completed } = this.state;
    let sessionTimestamps = Object.keys(sessionData);

    return(
      <div className="recordedSessionDetails">
        <div onClick={this.replaySession} className="replay-session">{sessionTimestamps.length}</div>
        <LinearProgress mode="determinate" value={completed} />
      </div>
    )
  }

  render(){
    const { sessionData } = this.state;
    const { sessionName } = this.props;

    let sessionDetails = sessionData ? this.recordedSessionDetails() : null;
    return(
      <div className="stored-activity">
        <div className="student-name" onClick={this.getStoredData}>{sessionName}</div>
        <div className="student-activity">{sessionDetails}</div>

      </div>
    )
  }
}