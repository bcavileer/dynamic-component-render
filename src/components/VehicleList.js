import React, { Component } from 'react'

export class VehicleList extends Component {
  componentDidMount () {
    const { fetchVehicles, dispatch } = this.props
    dispatch(fetchVehicles)
  }

  render () {
    const { activityState, openVehicle, dispatch } = this.props
    return <ul>
      {activityState.vehicles.map(vehicle =>
        <li key={vehicle.id}>
          <button key={`link-${vehicle.id}`}
                  onClick={() => dispatch(openVehicle, { vehicleId: vehicle.id })}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </button>
        </li>)}
    </ul>
  }
}
