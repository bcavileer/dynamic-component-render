import React, { Component } from 'react'

export class Header extends Component {
  render () {
    return <header>{this.props.title}{this.props.children}</header>
  }
}
