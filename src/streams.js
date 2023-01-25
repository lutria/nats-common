import { RetentionPolicy } from 'nats'

export const EVENT_STREAM_PREFIX = "events"

export default [
  {
    name: "EVENTS",
    retention: RetentionPolicy.Workqueue,
    subjects: [`${EVENT_STREAM_PREFIX}.>`]
  }
]
