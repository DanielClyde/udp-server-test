import { Message, MessageService } from "@ncss/message";
import { Ping, PingMessageType } from "../messages/Ping";
import { Pong } from "../messages/Pong";
import { CheckIn, CheckInMessageType } from "../messages/CheckIn";
import { ByteList } from "byte-list";
import { UDPSocket } from "../UDPSocket";
import { CheckInAck } from "../messages/CheckInAck";

export class RouteTableEntry {
  private messageService = new MessageService();
  public deviceId?: number;
  public lastCheckIn?: Date;

  constructor(
    public address: string,
    public port: number,
    private socket: UDPSocket,
  ) {
    this.messageService.registerMessageGroup({
      mask: PingMessageType.GROUP_MASK,
      messageClass: Pong,
      handler: (msg) => this.onPong(msg),
    });
    this.messageService.registerMessageGroup({
      mask: CheckInMessageType.GROUP_MASK,
      messageClass: CheckIn,
      handler: (msg) => this.onCheckin(msg),
    });
  }

  ping() {
    return this.sendMessage(new Ping());
  }

  onData(data: Buffer) {
    return this.messageService.deserialize(new ByteList(data));
  }

  private onPong(pong: Pong) {
    if (pong.deviceId !== this.deviceId) {
      this.deviceId = pong.deviceId;
    }
    this.lastCheckIn = new Date();
    console.log(`PONG from ${this.deviceId?.toString(16)?.toUpperCase()} - ${this.address}:${this.port}`);
  }

  private onCheckin(checkIn: CheckIn) {
    if (checkIn.deviceId !== this.deviceId) {
      this.deviceId = checkIn.deviceId;
    }
    this.lastCheckIn = new Date();
    const ack = new CheckInAck();
    console.log(`Check in from ${this.deviceId?.toString(16)?.toUpperCase()} - ${this.address}:${this.port}`);
    return this.sendMessage(ack);
  }

  private sendMessage(message: Message) {
    const bytes = this.messageService.serialize(message);
    return this.socket.sendData(bytes.getBuffer(), this.address, this.port);
  }
}
