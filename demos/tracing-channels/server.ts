// Subscribe to TracingChannels BEFORE importing the app
import './tracing.ts'

import * as http from 'node:http'
import { createRequestListener } from 'remix/node-fetch-server'

import { router } from './app/router.ts'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 44100

const server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }),
)

server.listen(port, () => {
  console.log(`Tracing channels demo running on http://localhost:${port}`)
})

process.on('SIGINT', () => {
  server.close(() => process.exit(0))
  server.closeAllConnections()
})
