import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: 'https://decfaa858bad92fd007e581fe6a55a95@o447951.ingest.us.sentry.io/4511333086986240',
  tracesSampleRate: 1.0,
  integrations: [Sentry.browserTracingIntegration()],
})

let btn = document.getElementById('fetch-btn')
let result = document.getElementById('result')

btn?.addEventListener('click', async () => {
  let res = await fetch('/ping')
  let data = await res.json()
  if (result) result.textContent = JSON.stringify(data, null, 2)
})
