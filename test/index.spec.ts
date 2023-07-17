import { Message, MessageService } from '@ncss/message';
import { assert } from 'chai';

import { CheckIn } from '../src/messages/CheckIn';
import { UDPApp } from '../src/UDPApp';

describe('UDP App Test', () => {
  let app: UDPApp;
  const endDeviceMsgService = new MessageService();

  beforeEach(async () => {
    app = new UDPApp();
    await app.init();
    await app.start();
    assert.isTrue(app.running);
  });

  afterEach(async () => {
    await app.stop();
    assert.isFalse(app.running);
  });

  it('Should add route table entries', () => {
    const checkin = new CheckIn(0x5A000001);
    assert.isEmpty(app.routeTable);
    assert.isUndefined(app.routeTable['10.1.11.123:1234']);
    MockEndDeviceMsg(checkin, '10.1.11.123', 1234);
    const entry = app.routeTable['10.1.11.123:1234'];
    assert.isDefined(entry);
    assert.equal(entry.deviceId, 0x5A000001);
    assert.equal(entry.address, '10.1.11.123');
    assert.equal(entry.port, 1234);
    assert.isDefined(entry.lastCheckIn);
  });

  it('Should update route table device id', () => {
    assert.isEmpty(app.routeTable);
    assert.isUndefined(app.routeTable['10.1.11.123:1234']);
    MockEndDeviceMsg(new CheckIn(0x5A000001), '10.1.11.123', 1234);
    let entry = app.routeTable['10.1.11.123:1234'];
    assert.isDefined(entry);
    assert.equal(entry.deviceId, 0x5A000001);
    assert.equal(entry.address, '10.1.11.123');
    assert.equal(entry.port, 1234);
    assert.isDefined(entry.lastCheckIn);
    MockEndDeviceMsg(new CheckIn(0x5A000002), '10.1.11.123', 1234);
    entry = app.routeTable['10.1.11.123:1234'];
    assert.isDefined(entry);
    assert.equal(entry.deviceId, 0x5A000002);
  });

  function MockEndDeviceMsg(msg: Message, address: string, port: number) {
    app['socket']['socket'].emit('message', endDeviceMsgService.serialize(msg).getBuffer(), { address, port });
  }
});
