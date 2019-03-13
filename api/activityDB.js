module.exports = class ActivityDB {
  constructor (Activity) {
    this.Activity = Activity
    this.activities = []
  }

  getActivitiesMeta () {
    return this.activities.map(activity => activity.meta())
  }

  getActivity (id) {
    return this.activities[id - 1]
  }

  createActivity (attributes) {
    const id = this.activities.length + 1
    const activity = new this.Activity({ id, ...attributes })
    this.activities.push(activity)
    const createActivityResp = {
      id,
      activity
    }
    return Promise.resolve(createActivityResp)
  }

  updateActivity (id, updateActivityReq) {
    let activity = this.getActivity(id)
    const { version } = updateActivityReq

    if (activity.version !== version) return Promise.reject({
        id,
        updateActivityReq,
        activity,
        error: 'Activity is out of sync',
        consoleMsg: 'Activity is out of sync'
      }
    )

    return activity.action(updateActivityReq)
  }

  clear () {
    this.activities = []
  }
}
