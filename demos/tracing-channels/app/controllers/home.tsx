import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { routes as r } from '../routes.ts'
import { render } from '../utils/render.tsx'

export const home: BuildAction<'GET', typeof routes.home> = {
  handler({ request }) {
    return render(<HomePage />, request)
  },
}

function HomePage() {
  return () => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Remix TracingChannel Demo</title>
      </head>
      <body>
        <h1>Remix 3 TracingChannel Demo</h1>
        <p>Check your terminal for tracing output.</p>
        <p>Each request logs middleware, handler, render, and asset spans.</p>
        <script type="module" src={r.assets.href({ path: 'app/assets/entry.ts' })}></script>
      </body>
    </html>
  )
}
