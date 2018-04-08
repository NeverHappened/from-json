import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

class SimpleClass {

  @Property()
  public convertableProperty: string;

  public notConvertableProperty: number = 3;
}

describe('Basics', () => {

  it('should convert json to the SimpleClass', () => {
    const raw = { convertableProperty: 'Test' };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.constructor).to.equal(SimpleClass);
  });

  it('should assign property for annotated properties', () => {
    const raw = { convertableProperty: 'Test' };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.convertableProperty).to.equal('Test');
  });

  it('should throw an exception when there are non-existent properties', () => {
    const badRaw = { convertableProperty: 'test', convertablePropertyZ: 'test' };
    const testFunc = () => fromJson<SimpleClass>(typeInfo(SimpleClass), badRaw);
    expect(testFunc).to.throw('[FromJson]: Unknown property passed: convertablePropertyZ');
  });

  it('shouldnt touch properties that are not annotated with @Property', () => {
    const raw = { convertableProperty: 'Test' };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.notConvertableProperty).to.equal(3);
  });

});
