const app = require('express')()
const cors = require('cors')
const server = require('http').Server(app)
const io = require('socket.io')(server)
app.use(cors())
server.listen(3001)

// TODO replace with a real DB
const ActivityDB = require('./activityDB')
const Activity = require('./activity')
const activityDB = new ActivityDB(Activity)

// Fake Data
const vehicles = [
  {
    id: 1,
    year: '2019',
    make: 'Ford',
    model: 'F-550'
  },
  {
    id: 2,
    year: '2019',
    make: 'Ford',
    model: 'F-350'
  }
]

activityDB.createActivity({
    name: 'Vehicle Index',
    components: [
      {
        component: 'Header',
        props: { title: 'Vehicle Index' },
      },
      {
        component: 'Section',
        children: [
          {
            component: 'VehicleList',
            props: {
              onClick: 'vehicle_details',
              fetchVehicles: 'fetchVehicles',
              loadVehicles: 'loadVehicles'
            },
          }
        ],
      },
      {
        component: 'Footer',
        props: { copyright: 'HSV 2018' },
      }
    ],
    actions: ['fetchVehicles', 'loadVehicles', 'openVehicle'],
    beforeActions: {},
    afterActions: {},
    defaultState: {
      vehicles: []
    },
    reducers: {
      fetchVehicles: async () => {
        return { vehicles }
      },
    }
  },
)

activityDB.createActivity({
    name: 'Vehicle Detail',
    components: [
      {
        component: 'Header',
        props: { title: 'I am a header' },
      },
      {
        component: 'Section',
        props: { content: 'Vehicle Details' },
        children: [
          {
            component: 'Section',
            props: { content: 'More vehicle details' },
          }
        ],
      },
      {
        component: 'Footer',
        props: { copyright: 'HSV 2018' },
      }
    ],
    actions: ['reserveVehicle']
  }
)

// TODO replace with a real job queue?
const queue = job =>
  new Promise(resolve => setTimeout(() => resolve(job), 0))

const activityLog = (activity, consoleMsg) =>
  console.log(`Activity ${activity.id} ${consoleMsg}\n`)

app.get('/activities', function (req, res) {
  res.json({
    activities: activityDB.getActivitiesMeta(),
    defaultActivity: activityDB.getActivity(1).attributes()
  })
})

app.get('/activities/:id', function (req, res) {
  res.json(activityDB.getActivity(req.params.id).attributes())
})

io.on('connection', function (socket) {
  socket.on('update_activity', function (updateActivityReq) {
    queue(updateActivityReq).then(() => {
      const { id, version } = updateActivityReq
      const activity = activityDB.getActivity(id)

      if (!activity) {
        socket.emit('missing_activity')
        console.log(`Activity ${id} not found`)
        return
      }

      activityDB.updateActivity(id, updateActivityReq)
        .then(updateActivityResp => {
            socket.emit('activity_updated', updateActivityResp)
            return updateActivityResp
          }
        )
        .then(updateActivityResp => {
          const { consoleMsg } = updateActivityResp
          activityLog(activity, `Updated\n${consoleMsg}`)
        })
        .catch((updateActivityResp) => {
          const { consoleMsg } = updateActivityResp
          socket.emit('activity_error', updateActivityResp)
          activityLog(activity, `Activity Error\n${consoleMsg}`)
        })
    })
  })
})
