import React, { Component } from 'react'
import './App.css'

const Header = props => <header>{props.title}{props.children}</header>
const Section = props => <section>{props.content}{props.children}</section>
const Footer = props => <footer>{props.copyright}</footer>

const componentManifest = {
  'Header': Header,
  'Section': Section,
  'Footer': Footer,
}

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

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { currentActivity: demoActivity }
    this.renderComponent = this.renderComponent.bind(this)
  }

  renderActivity () {
    const { currentActivity } = this.state
    const { components } = currentActivity
    return components.map(this.renderComponent)
  }

  renderComponent (componentDesc, index) {
    const { component, props, children } = componentDesc
    const properties = {
      component: componentManifest[component],
      key: `component-${index}`,
      children: null
    }
    if (children) { properties.children = children.map(this.renderComponent) }
    return <properties.component
      key={`component-${properties.key}`}      {...props}    >      {properties.children}    </properties.component>
  }

  render () {
    return (
      <div className="App">
        {this.renderActivity()}
      </div>
    )
  }
}

export default App
