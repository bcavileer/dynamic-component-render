import React, { Component } from 'react'
import componentManifest from './components'

export class Activity extends Component {
  constructor (props) {
    super(props)
    const { activity, socket } = this.props
    this.state = activity.defaultState
    this.socket = socket
    this.renderComponent = this.renderComponent.bind(this)
    this.updateActivity = this.updateActivity.bind(this)
    this.activityUpdated = this.activityUpdated.bind(this)
    this.activityError = this.activityError.bind(this)
  }

  componentDidMount () {
    this.socket.on('activity_updated', this.activityUpdated)
    this.socket.on('activity_error', this.activityError)
  }

  componentWillUnmount () {
    this.socket.off('activity_updated', this.activityUpdated)
    this.socket.off('activity_error', this.activityError)
  }

  updateActivity (action, args) {
    const { activity } = this.props
    const { id, version } = activity
    this.setState({ waiting: true }, () => {
      this.socket.emit('update_activity', { id, version, action, args })
    })
  }

  activityUpdated ({ state }) {
    // do we want to keep the previous state and merge in the changes?
    // or strictly accept the new state from the API?
    this.setState((prevState) => {
      return { ...prevState, invalid: null, waiting: false, ...state }
    })
  }

  activityError ({ error }) {
    this.setState({ invalid: error, waiting: false })
  }

  renderComponent ({ component, props, children = [] }, index) {
    const o = { component: componentManifest[component] }
    return <o.component
      key={`component-${index}`}
      dispatch={this.updateActivity}
      activityState={this.state}
      {...props}>
      {children.map(this.renderComponent)}
    </o.component>
  }

  render () {
    const { activity } = this.props
    if (!activity) return null
    const { components } = activity
    return components.map(this.renderComponent)
  }
}
