import { UDPSocket } from './UDPSocket';
import { RouteTableEntry } from './route-table/RouteTableEntry';

export class UDPApp {
  private socket: UDPSocket = new UDPSocket();
  private routeTable: { [address: string]: RouteTableEntry } = {};


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

  start() {
    return this.socket.bind();
  }

  stop() {
    return this.socket.close();
  }
}
