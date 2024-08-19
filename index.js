const app = require('./app') // Actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  console.log(`Server running on ${config.PORT}`)
})