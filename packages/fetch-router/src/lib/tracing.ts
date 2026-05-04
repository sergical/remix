type TracingChannelLike = {
  hasSubscribers?: boolean
  tracePromise<T>(fn: () => Promise<T>, context: object): Promise<T>
}

let requestChannel: TracingChannelLike | undefined

try {
  let dc =
    'getBuiltinModule' in process
      ? (process as any).getBuiltinModule('node:diagnostics_channel')
      : require('node:diagnostics_channel')
  if (dc?.tracingChannel) {
    requestChannel = dc.tracingChannel('remix:request')
  }
} catch {
  // TracingChannel not available on this runtime
}

export function shouldTrace(): boolean {
  return requestChannel != null && requestChannel.hasSubscribers !== false
}

export function traceRequest<T>(fn: () => Promise<T>, context: object): Promise<T> {
  return requestChannel!.tracePromise(fn, context)
}
