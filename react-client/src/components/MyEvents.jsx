/* eslint-disable import/extensions, react/prop-types */
import React from 'react';
import axios from 'axios';
import { Row, Col } from 'react-materialize';
import EventList from './eventList.jsx';

class MyEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myEvents: [],
      myRsvps: [],
      view: this.props.view,
    };
  }

  componentDidMount() {
  // need to pull events thats match the userID that is already passed into this component on props.
    const { togglePreloader } = this.props;
    togglePreloader();
    axios.get('/events/my-events')
      .then(({ data }) => {
        console.log(data);
        this.setState({ myEvents: data });
        return axios.get('/user/rsvp');
      })
      .then(({ data }) => {
        console.log(data);
        this.setState({ myRsvps: data });
        togglePreloader();
      });
  }


  render() {
    const { myEvents, myRsvps } = this.state;
    const { renderClickedEventTitle } = this.props;
    if (!myEvents.length && !myRsvps.length) {
      return (
        <div>
          <span id="my-events-title-empty">MyEvents</span>
          <p>
            Awww it looks like you havent made any events.
            <br />
            Click the New Event button to make a new event!
          </p>
        </div>
      );
    }
    return (
      <Row>
        <Col s={12} m={6}>
          <h5>My RSVPs</h5>
          <EventList events={myRsvps} size="12" renderClickedEventTitle={renderClickedEventTitle} />
        </Col>
        <Col s={12} m={6}>
          <h5>My created events</h5>
          <EventList events={myEvents} size="12" renderClickedEventTitle={renderClickedEventTitle} />
        </Col>
        <br />
      </Row>
    );
  }
}

export default MyEvents;
