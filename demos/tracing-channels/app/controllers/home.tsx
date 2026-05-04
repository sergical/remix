import * as Sentry from '@sentry/node'
import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { render } from '../utils/render.tsx'

const SENTRY_DSN =
  'https://decfaa858bad92fd007e581fe6a55a95@o447951.ingest.us.sentry.io/4511333086986240'

export const home: BuildAction<'GET', typeof routes.home> = {
  handler({ request }) {
    let activeSpan = Sentry.getActiveSpan()
    let rootSpan = activeSpan ? Sentry.getRootSpan(activeSpan) : undefined
    let traceHeader = rootSpan ? Sentry.spanToTraceHeader(rootSpan) : ''
    let baggageHeader = rootSpan ? Sentry.spanToBaggageHeader(rootSpan) ?? '' : ''

    return render(
      <HomePage sentryTrace={traceHeader} sentryBaggage={baggageHeader} dsn={SENTRY_DSN} />,
      request,
    )
  },
}

function HomePage() {
  return ({
    sentryTrace,
    sentryBaggage,
    dsn,
  }: {
    sentryTrace: string
    sentryBaggage: string
    dsn: string
  }) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="sentry-trace" content={sentryTrace} />
        <meta name="baggage" content={sentryBaggage} />
        <title>Remix TracingChannel Demo</title>
        <script
          src="https://browser.sentry-cdn.com/10.51.0/bundle.tracing.min.js"
          crossOrigin="anonymous"
        ></script>
        <script innerHTML={`
          Sentry.init({
            dsn: "${dsn}",
            tracesSampleRate: 1.0,
            integrations: [Sentry.browserTracingIntegration()],
          });
        `}></script>
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
