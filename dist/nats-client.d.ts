import pino from "pino";
declare class NatsClient {
  private jsonCodec;
  private logger;
  private name;
  private servers;
  private js?;
  private nc?;
  constructor({
    logger,
    name,
    servers,
  }: {
    logger: pino.Logger;
    name: string;
    servers: string;
  });
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(subject: string, data: any): Promise<void>;
  subscribe(
    subject: string,
    queue: string,
    handler: <T>(data: T) => void
  ): Promise<void>;
}
export default NatsClient;
