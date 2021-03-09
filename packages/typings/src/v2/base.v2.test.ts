// import { Worker, isMainThread, workerData, parentPort as _parentPort, MessageChannel } from 'worker_threads';
// import { ReadableStream, ReadableStreamDefaultController } from 'web-streams-polyfill/ponyfill';
import { assert, IsExact } from 'conditional-type-checks';
class DatabaseValueUnit implements KVH2.DB.ValueUnit {
  toBytes() {
    return new Uint8Array();
  }
}
class Height {}
class Address {}
class Equity extends DatabaseValueUnit {}
class Amount extends DatabaseValueUnit {}
const keyBuilderFactory = {} as KVH2.KB.Factory;

async function test() {
  const keyBuilder = keyBuilderFactory
    .$defineAliasType<'Address', Address>()
    // .defineType('Equity', Equity)
    // .defineType('Amount', Amount)
    .$defineTemplateValue<'{senderId:Address}.voteTo.{recipientId:Address}.equity', Equity>()
    .$defineTemplateValue<'{senderId:Address}.transferTo.{recipientId:Address}.amount', Amount>()
    .toBuilder();
  const database = await keyBuilder.toDatabase();

  const key1 = await keyBuilder.build('{senderId:Address}.voteTo.{recipientId:Address}.equity', {
    senderId: new Address(),
    recipientId: new Address(),
  });
  assert<
    IsExact<typeof key1, KVH2.DB.KeyUnit<KVH2.KB.DatabaseKey<'{senderId:Address}.voteTo.{recipientId:Address}.equity'>>>
  >(true);

  const equity = (await database.get(key1))!;
  assert<IsExact<typeof equity.value, Equity>>(true);
}
