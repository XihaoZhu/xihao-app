type EventMap = {
    BALL_CLICK: void
}

type Handler<T> = (payload: T) => void

const listeners: {
    [K in keyof EventMap]?: Set<Handler<EventMap[K]>>
} = {}

export const emit = <K extends keyof EventMap>(
    type: K,
    payload: EventMap[K]
) => {
    listeners[type]?.forEach(fn => fn(payload))
}

export const on = <K extends keyof EventMap>(
    type: K,
    handler: Handler<EventMap[K]>
) => {
    listeners[type] ??= new Set()
    listeners[type]!.add(handler)
    return () => listeners[type]!.delete(handler)
}