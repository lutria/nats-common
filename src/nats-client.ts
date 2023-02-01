import {
  connect,
  JetStreamClient,
  JSONCodec,
  NatsConnection,
  Subscription,
} from "nats";
import pino from "pino";
import { LutriaEvent } from "@lutria/types";
import streams from "./streams";

class NatsClient {
  private jsonCodec;
  private logger;
  private name;
  private servers;

  private js?: JetStreamClient;
  private nc?: NatsConnection;

  constructor({
    logger,
    name,
    servers,
  }: {
    logger: pino.Logger;
    name: string;
    servers: string;
  }) {
    this.logger = logger;
    this.name = name;
    this.servers = servers;
    this.jsonCodec = JSONCodec();
  }

  async connect() {
    this.nc = await connect({
      name: this.name,
      servers: this.servers.split(","),
    });

    this.nc.closed().then((err) => {
      if (err) {
        this.logger.error(
          `Client ${this.name} exited because of error: ${err.message}`
        );
      }
    });

    // Access the JetStream manager which provides the methods for managing streams and consumers.
    const jsm = await this.nc.jetstreamManager();

    // Initialise streams. Each stream can bind one or more subjects that are not overlapping with other
    // streams. By default, a stream will have one replica and use file storage.
    for (const stream of streams) {
      // Add/create the stream
      await jsm.streams.add(stream);
      this.logger.info(`Created stream with name: ${stream.name}`);
    }

    // Access the JetStream client for publishing and subscribing to streams.
    this.js = this.nc.jetstream();
  }

  async disconnect() {
    // Finally we drain the connection which waits for any pending
    // messages (published or in a subscription) to be flushed.
    await this.nc?.drain();

    await this.nc?.close();
  }

  async publish(subject: string, data: any) {
    // Publish a series of messages and wait for each one to be completed.
    await this.js?.publish(subject, this.jsonCodec.encode(data));
  }

  async subscribe(
    subject: string,
    queue: string,
    handler: <T extends LutriaEvent>(data: T) => void
  ) {
    const handleMessage = async (s: Subscription) => {
      for await (const m of s) {
        const data = this.jsonCodec.decode(m.data);
        handler(data as LutriaEvent);
      }
    };

    const sub = this.nc?.subscribe(subject, { queue });
    if (sub) {
      handleMessage(sub);
    } else {
      throw new Error("Failed to create subscription");
    }
  }
}

export default NatsClient;
