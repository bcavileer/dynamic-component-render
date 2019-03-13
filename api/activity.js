module.exports = class Activity {
  constructor ({ id, name, components, actions, reducers, defaultState = {} }) {
    this.id = id
    this.name = name
    this.components = components
    this.actions = actions
    this.reducers = reducers
    this.defaultState = defaultState
    this.version = 0
  }

  meta () {
    return { id: this.id, name: this.name, version: this.version }
  }

  attributes () {
    return {
      id: this.id,
      name: this.name,
      components: this.components,
      defaultState: this.defaultState,
      version: this.version
    }
  }

  async action (updateActivityReq) {
    const { action: reducerName, args = {} } = updateActivityReq

    if (!this.actions.includes(reducerName)) throw {
      id: this.id,
      updateActivityReq,
      activity: this,
      error: `Action ${reducerName} does not exist`,
      consoleMsg: `Action ${reducerName} does not exist`
    }

    const newState = await this.reducers[reducerName](args) // this is probably very insecure?

    return {
      id: this.id,
      updateActivityReq,
      activity: this,
      state: newState,
      consoleMsg: `${reducerName} ${JSON.stringify(args)}, ${JSON.stringify(newState)}`
    }
  }
}
