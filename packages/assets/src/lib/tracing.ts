type TracingChannelLike = {
  hasSubscribers?: boolean
  tracePromise<T>(fn: () => Promise<T>, context: object): Promise<T>
}

let assetChannel: TracingChannelLike | undefined

try {
  let dc =
    'getBuiltinModule' in process
      ? (process as any).getBuiltinModule('node:diagnostics_channel')
      : require('node:diagnostics_channel')
  if (dc?.tracingChannel) {
    assetChannel = dc.tracingChannel('remix:asset')
  }
} catch {
  // TracingChannel not available on this runtime
}

export function shouldTraceAsset(): boolean {
  return assetChannel != null && assetChannel.hasSubscribers !== false
}

export function traceAsset<T>(fn: () => Promise<T>, context: object): Promise<T> {
  return assetChannel!.tracePromise(fn, context)
}
