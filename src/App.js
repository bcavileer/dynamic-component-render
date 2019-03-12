import React, { Component } from 'react'
import './App.css'
import componentManifest from './components'

const demoActivity = {
  components: [
    {
      component: 'Header',
      props: { title: 'I am a header' },
    },
    {
      component: 'Section',
      props: { content: 'I am a section' },
      children: [
        {
          component: 'Section',
          props: { content: 'I am a nested section' },
        }
      ],
    },
    {
      component: 'Footer',
      props: { copyright: 'HSV 2018' },
    }
  ]
}

class Activity extends Component {
  constructor (props) {
    super(props)
    this.renderComponent = this.renderComponent.bind(this)
  }

  renderComponent ({ component, props, children = [] }, index) {
    const o = { component: componentManifest[component] }
    return <o.component key={`component-${index}`} {...props}>{children.map(this.renderComponent)}</o.component>
  }

  render () {
    const { components } = this.props.activity
    return components.map(this.renderComponent)
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { currentActivity: demoActivity }
  }

  render () {
    const { currentActivity } = this.state
    return (
      <div className="App">
        <Activity activity={currentActivity}/>
      </div>
    )
  }
}

export default App
