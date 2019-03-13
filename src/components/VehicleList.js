import React, { Component } from 'react'

export class VehicleList extends Component {
  componentDidMount () {
    const { onLoad, dispatch } = this.props
    dispatch(onLoad)
  }

  render () {
    const { activityState, onClick, dispatch } = this.props
    return <ul>
      {activityState.vehicles.map(vehicle =>
        <li key={vehicle.id}>
          <button key={`link-${vehicle.id}`}
                  onClick={() => {
                    return dispatch(onClick, { vehicleId: vehicle.id })}}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </button>
        </li>)}
    </ul>
  }
}
