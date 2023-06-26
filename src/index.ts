import { HttpApp } from './HttpApp';
import { UDPApp } from './UDPApp';

const udpApp = new UDPApp();
udpApp.init().then(() => udpApp.start());

const httpApp = new HttpApp();
httpApp.init().then(() => httpApp.start());

process.on('SIGINT', () => kill());
process.on('SIGTERM', () => kill());

async function kill() {
  await udpApp.stop();
  await httpApp.close();
  process.exit();
}
