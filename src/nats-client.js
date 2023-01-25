import { connect, JSONCodec } from 'nats'
import streams from './streams.js'

class NatsClient {
  constructor(config = {}) {
    Object.assign(
      this,
      {
        logger: config.logger,
        name: config.name,
        servers: config.servers
      }
    )

    this.jsonCodec = JSONCodec()
  }

  async connect() {
    this.nc = await connect({
      name: this.name,
      servers: this.servers.split(',')
    })

    this.nc.closed().then((err) => {
      if (err) {
        logger.error(`Client ${this.name} exited because of error: ${err.message}`)
      }
    })

    // Access the JetStream manager which provides the methods for managing streams and consumers.
    const jsm = await this.nc.jetstreamManager()

    // Initialise streams. Each stream can bind one or more subjects that are not overlapping with other
    // streams. By default, a stream will have one replica and use file storage.
    for (const stream of streams) {
      // Add/create the stream
      await jsm.streams.add(stream)
      this.logger.info(`Created stream with name: ${stream.name}`)
    }

    // Access the JetStream client for publishing and subscribing to streams.
    this.js = this.nc.jetstream()
  }

  async disconnect() {
    // Finally we drain the connection which waits for any pending
    // messages (published or in a subscription) to be flushed.
    await this.nc.drain()

    await this.nc.close()
  }

  async publish(subject, data) {
    // Publish a series of messages and wait for each one to be completed.
    await this.js.publish(subject, this.jsonCodec.encode(data));
  }

  async subscribe(subject, queue, handler) {
    const handleMessage = async (s) => {
      for await (const m of s) {
        const data = this.jsonCodec.decode(m.data)
        handler(data)
      }
    }

    const sub = this.nc.subscribe(subject, { queue } )
    handleMessage(sub)
  }
}

export default NatsClient
