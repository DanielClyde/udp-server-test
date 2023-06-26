import { RemoteInfo, Socket, createSocket } from 'node:dgram';
import { Environment } from './Environment';

export type OnMessageCallback = (buffer: Buffer, info: RemoteInfo) => void;
export type OnErrorCallback = (err: Error) => void;

export class UDPSocket {
  private socket: Socket = createSocket('udp4');

  onError(cb: OnErrorCallback) {
    this.socket.on('error', cb);
  }

  onMessage(cb: OnMessageCallback) {
    this.socket.on('message', cb);
  }

  async bind() {
    return new Promise<void>(resolve => {
      this.socket.bind(Environment.UDP_PORT, undefined, () => {
        const address = this.socket.address();
        console.log(`UDP Server listening on port`, address.port);
        resolve();
      });
    });
  }

  sendData(data: Buffer, address: string, port: number) {
    return new Promise<void>((resolve, reject) => {
      this.socket.send(data, port, address, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async close() {
    return new Promise<void>(resolve => {
      this.socket.close(() => {
        console.log('\nUDP Server Closed\n');
        resolve();
      });
    });
  }
}
