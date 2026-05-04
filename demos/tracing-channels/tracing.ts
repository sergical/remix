import * as Sentry from '@sentry/node'
import { tracingChannel } from 'otel-tracing-channel'

Sentry.init({
  dsn: 'https://decfaa858bad92fd007e581fe6a55a95@o447951.ingest.us.sentry.io/4511333086986240',
  tracesSampleRate: 1.0,
  debug: true,
})

function endSpan(ctx: any) {
  if (ctx._spanEnded) return
  ctx._spanEnded = true
  ctx.span?.end()
}

// remix:request — middleware and handler tracing
tracingChannel('remix:request', (ctx: any) => {
  let name =
    ctx.type === 'handler' ? `${ctx.context.method} ${ctx.name}` : `middleware - ${ctx.name}`

  return Sentry.startSpanManual(
    {
      name,
      op: ctx.type === 'handler' ? 'http.server' : 'middleware.remix',
      attributes: {
        'http.request.method': ctx.context?.method,
        'url.path': ctx.context?.url?.pathname,
        'remix.type': ctx.type,
        'remix.name': ctx.name,
      },
    },
    (span) => span,
  )
}).subscribe({
  asyncEnd(ctx: any) {
    endSpan(ctx)
  },
  error(ctx: any) {
    if (ctx.error) {
      ctx.span?.setStatus({ code: 2, message: ctx.error.message })
    }
    endSpan(ctx)
  },
})

// remix:render — server-side rendering
tracingChannel('remix:render', (ctx: any) => {
  return Sentry.startSpanManual(
    {
      name: 'remix.render',
      op: 'ui.render',
      attributes: {
        'remix.frame_src': ctx.frameSrc || '',
      },
    },
    (span) => span,
  )
}).subscribe({
  asyncEnd(ctx: any) {
    endSpan(ctx)
  },
  error(ctx: any) {
    if (ctx.error) {
      ctx.span?.setStatus({ code: 2, message: ctx.error.message })
    }
    endSpan(ctx)
  },
})

// remix:asset — on-demand compilation
tracingChannel('remix:asset', (ctx: any) => {
  return Sentry.startSpanManual(
    {
      name: `asset.${ctx.assetType}`,
      op: 'asset.compile',
      attributes: {
        'remix.asset.file_path': ctx.filePath,
        'remix.asset.type': ctx.assetType,
      },
    },
    (span) => span,
  )
}).subscribe({
  asyncEnd(ctx: any) {
    endSpan(ctx)
  },
  error(ctx: any) {
    if (ctx.error) {
      ctx.span?.setStatus({ code: 2, message: ctx.error.message })
    }
    endSpan(ctx)
  },
})

console.log(
  '✓ Sentry + TracingChannel subscribers active (remix:request, remix:render, remix:asset)',
)
