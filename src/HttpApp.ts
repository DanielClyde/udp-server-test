import express, { Application } from 'express';
import { Environment } from './Environment';
import { Server } from 'http';


export class HttpApp {
  private app: Application = express();
  private server: Server;

  init(): Promise<void> {
    this.app.use('/', (req, res) => res.sendStatus(200));
    return Promise.resolve();
  }

  start() {
    return new Promise<void>((resolve) => {
      this.server = this.app.listen(Environment.HTTP_PORT, () => {
        console.log('HTTP Server listening on port', Environment.HTTP_PORT);
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server?.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('\nHTTP Server Closed\n');
          resolve();
        }
      });
    });
  }
}
