import dc from 'node:diagnostics_channel'

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const MAGENTA = '\x1b[35m'

let depth = 0

function indent() {
  return '  '.repeat(depth)
}

function elapsed(startTime: bigint): string {
  let ms = Number(process.hrtime.bigint() - startTime) / 1e6
  return `${ms.toFixed(2)}ms`
}

// remix:request — middleware and handler tracing
dc.tracingChannel('remix:request').subscribe({
  start(ctx: any) {
    ctx._startTime = process.hrtime.bigint()
    let color = ctx.type === 'handler' ? GREEN : CYAN
    let label = ctx.type === 'handler' ? 'handler' : 'middleware'
    console.log(`${indent()}${color}${BOLD}→ ${label}${RESET} ${color}${ctx.name}${RESET}`)
    depth++
  },
  asyncEnd(ctx: any) {
    depth = Math.max(0, depth - 1)
    let color = ctx.type === 'handler' ? GREEN : CYAN
    let label = ctx.type === 'handler' ? 'handler' : 'middleware'
    let time = ctx._startTime ? elapsed(ctx._startTime) : '?'
    console.log(`${indent()}${color}← ${label}${RESET} ${color}${ctx.name}${RESET} ${DIM}${time}${RESET}`)
  },
  error(ctx: any) {
    depth = Math.max(0, depth - 1)
    console.log(`${indent()}${RED}✗ ${ctx.type} ${ctx.name}${RESET} ${RED}${ctx.error?.message}${RESET}`)
  },
})

// remix:render — server-side rendering
dc.tracingChannel('remix:render').subscribe({
  start(ctx: any) {
    ctx._startTime = process.hrtime.bigint()
    let src = ctx.frameSrc || '(root)'
    console.log(`${indent()}${MAGENTA}${BOLD}→ render${RESET} ${MAGENTA}${src}${RESET}`)
    depth++
  },
  asyncEnd(ctx: any) {
    depth = Math.max(0, depth - 1)
    let time = ctx._startTime ? elapsed(ctx._startTime) : '?'
    let src = ctx.frameSrc || '(root)'
    console.log(`${indent()}${MAGENTA}← render${RESET} ${MAGENTA}${src}${RESET} ${DIM}${time}${RESET}`)
  },
  error(ctx: any) {
    depth = Math.max(0, depth - 1)
    console.log(`${indent()}${RED}✗ render${RESET} ${RED}${ctx.error?.message}${RESET}`)
  },
})

// remix:asset — on-demand compilation
dc.tracingChannel('remix:asset').subscribe({
  start(ctx: any) {
    ctx._startTime = process.hrtime.bigint()
    console.log(`${indent()}${YELLOW}${BOLD}→ asset${RESET} ${YELLOW}${ctx.assetType} ${ctx.filePath}${RESET}`)
    depth++
  },
  asyncEnd(ctx: any) {
    depth = Math.max(0, depth - 1)
    let time = ctx._startTime ? elapsed(ctx._startTime) : '?'
    console.log(`${indent()}${YELLOW}← asset${RESET} ${YELLOW}${ctx.assetType} ${ctx.filePath}${RESET} ${DIM}${time}${RESET}`)
  },
  error(ctx: any) {
    depth = Math.max(0, depth - 1)
    console.log(`${indent()}${RED}✗ asset ${ctx.filePath}${RESET} ${RED}${ctx.error?.message}${RESET}`)
  },
})

console.log(`${GREEN}✓ TracingChannel subscribers active${RESET} (remix:request, remix:render, remix:asset)`)
