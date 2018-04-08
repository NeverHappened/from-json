import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

class SimpleClassWithDifferentPropertyKey {

  @Property({ key: 'anotherName' })
  public convertableProperty: string;

  public notConvertableProperty: number = 3;
}


describe('Property config: key', () => {

  it('allows to specify incoming key name different from property name', () => {
    const raw = { anotherName: 'Test' };
    const converted = fromJson<SimpleClassWithDifferentPropertyKey>(typeInfo(SimpleClassWithDifferentPropertyKey), raw);
    expect(converted.convertableProperty).to.equal('Test');
  });

  it('throws an error if incoming key doesnt exist', () => {
    const raw = { anotherNames: 'Test' };
    const testFunc = () => fromJson<SimpleClassWithDifferentPropertyKey>(typeInfo(SimpleClassWithDifferentPropertyKey), raw);
    expect(testFunc).to.throw('[FromJson]: Unknown property passed: anotherNames');
  });

});


describe('Property config: nestedClass', () => {

  it('allows to specify nestedClass', () => {
    const raw = { anotherName: 'Test' };
    const converted = fromJson<SimpleClassWithDifferentPropertyKey>(typeInfo(SimpleClassWithDifferentPropertyKey), raw);
    expect(converted.convertableProperty).to.equal('Test');
  });

});

// TODO: spec for customClass
// TODO: spec for generic
// TODO: spec for customClass when generic: true
