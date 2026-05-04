let sentryTrace =
  document.querySelector<HTMLMetaElement>('meta[name="sentry-trace"]')?.content ?? ''
let baggage =
  document.querySelector<HTMLMetaElement>('meta[name="baggage"]')?.content ?? ''

console.log('Trace context from server:', { sentryTrace, baggage })

let btn = document.getElementById('fetch-btn')
let result = document.getElementById('result')

btn?.addEventListener('click', async () => {
  let res = await fetch('/ping', {
    headers: {
      'sentry-trace': sentryTrace,
      baggage: baggage,
    },
  })
  let data = await res.json()
  if (result) result.textContent = JSON.stringify(data, null, 2)
})
