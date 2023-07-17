import { UDPSocket } from './UDPSocket';
import { RouteTableEntry } from './route-table/RouteTableEntry';

export class UDPApp {
  private socket: UDPSocket = new UDPSocket();
  routeTable: { [address: string]: RouteTableEntry } = {};
  running = false;


  async init() {
    this.socket.onError((err) => {
      console.error(`Socket error:\n ${err.stack}`);
      this.stop();
    });
    this.socket.onMessage((buffer, info) => {
      if (!this.routeTable[`${info.address}:${info.port}`]) {
        this.routeTable[`${info.address}:${info.port}`] = new RouteTableEntry(info.address, info.port, this.socket);
      }
      this.routeTable[`${info.address}:${info.port}`].onData(buffer);
    });
  }

  async start() {
    await this.socket.bind();
    this.running = true;
  }

  async stop() {
    await this.socket.close();
    this.routeTable = {};
    this.running = false;
  }
}
