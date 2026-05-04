type TracingChannelLike = {
  hasSubscribers?: boolean
  tracePromise<T>(fn: () => Promise<T>, context: object): Promise<T>
}

let renderChannel: TracingChannelLike | undefined

try {
  let dc =
    'getBuiltinModule' in process
      ? (process as any).getBuiltinModule('node:diagnostics_channel')
      : require('node:diagnostics_channel')
  if (dc?.tracingChannel) {
    renderChannel = dc.tracingChannel('remix:render')
  }
} catch {
  // TracingChannel not available on this runtime
}

export function shouldTraceRender(): boolean {
  return renderChannel != null && renderChannel.hasSubscribers !== false
}

export function traceRender<T>(fn: () => Promise<T>, context: object): Promise<T> {
  return renderChannel!.tracePromise(fn, context)
}
