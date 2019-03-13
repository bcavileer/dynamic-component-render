import React, { Component } from 'react'

// This is for development mode - replace with menu structure
// TODO Ugly code in ActivitySelector - refactor later

export class ActivitySelector extends Component {
  render () {
    const { activities, currentActivity, openActivity } = this.props
    return <select
      value={(currentActivity && currentActivity.id) || ''}
      onChange={(e) => {openActivity(e.target.value)}}
      style={{ position: 'fixed' }}
    >
      {activities.map((activity) => {
          return <option key={activity.id} value={activity.id}>{activity.name}</option>
        }
      )}
    </select>
  }
}
