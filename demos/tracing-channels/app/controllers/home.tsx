import * as Sentry from '@sentry/node'
import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { render } from '../utils/render.tsx'

export const home: BuildAction<'GET', typeof routes.home> = {
  handler({ request }) {
    let activeSpan = Sentry.getActiveSpan()
    let rootSpan = activeSpan ? Sentry.getRootSpan(activeSpan) : undefined
    let traceHeader = rootSpan ? Sentry.spanToTraceHeader(rootSpan) : ''
    let baggageHeader = rootSpan
      ? Sentry.spanToBaggageHeader(rootSpan) ?? ''
      : ''

    return render(
      <HomePage sentryTrace={traceHeader} sentryBaggage={baggageHeader} />,
      request,
    )
  },
}

function HomePage() {
  return ({
    sentryTrace,
    sentryBaggage,
  }: {
    sentryTrace: string
    sentryBaggage: string
  }) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="sentry-trace" content={sentryTrace} />
        <meta name="baggage" content={sentryBaggage} />
        <title>Remix TracingChannel Demo</title>
      </head>
      <body>
        <h1>Remix 3 TracingChannel Demo</h1>
        <p>Check your terminal — each request logs traced spans to Sentry.</p>
        <button id="fetch-btn">Make a traced fetch</button>
        <pre id="result"></pre>
        <script type="module" src="/assets/app/assets/entry.ts"></script>
      </body>
    </html>
  )
}
