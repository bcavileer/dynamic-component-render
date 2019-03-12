import React, { Component } from 'react'

export class Section extends Component {
  render () {
    return <section>{this.props.content}{this.props.children}</section>
  }
}
