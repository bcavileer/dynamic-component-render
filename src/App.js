import React, { Component } from 'react'
import './App.css'
import { Activity } from './Activity'
import axios from 'axios'
import io from 'socket.io-client'
import { ActivitySelector } from './ActivitySelector'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { activities: [], activity: null }
    this.socket = io.connect()

    this.setInitialState = this.setInitialState.bind(this)
    this.openActivity = this.openActivity.bind(this)
    this.updateActivities = this.updateActivities.bind(this)
  }

  componentDidMount () {
    axios.get('/activities')
      .then(({ data }) => this.setInitialState(data))
      .then(() => {
        this.socket.on('activities_updated', this.updateActivities)
        this.socket.on('missing_activity', () => {
          axios.get('/activities')
            .then(({ data }) => this.setInitialState(data))
        })
      })
  }

  updateActivities (activities) {
    this.setState({ activities })
  }

  setInitialState ({ activities, defaultActivity }) {
    this.setState({ activities, activity: defaultActivity, waiting: false })
  }

  openActivity (id, params = {}) {
    axios.get(`/activities/${id}`, { params }).then(({ data: activity }) => {
      this.setState({ activity })
    })
  }

  render () {
    const { activity, activities } = this.state
    return (
      <div className="App">
        <ActivitySelector
          activities={activities}
          currentActivity={activity}
          openActivity={this.openActivity}/>

        {activity ? <Activity activity={activity} openActivity={this.openActivity} socket={this.socket}/> : null}
      </div>
    )
  }
}

export default App
