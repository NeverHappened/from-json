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

class PropertyClass {

  @Property()
  public innerProperty: string;
}
class SimpleClassWithCustomClassKey {

  @Property({ customClass: PropertyClass })
  public propertyClass;
}

describe('Property config: customClass', () => {

  it('creates a child property class with specified constructor', () => {
    const raw = { propertyClass: { innerProperty: 'Test' } };
    const converted = fromJson<SimpleClassWithCustomClassKey>(typeInfo(SimpleClassWithCustomClassKey), raw);
    expect(converted.propertyClass.constructor).to.equal(PropertyClass);
  });

  it('creates a child property class with property in it filled', () => {
    const raw = { propertyClass: { innerProperty: 'Test' } };
    const converted = fromJson<SimpleClassWithCustomClassKey>(typeInfo(SimpleClassWithCustomClassKey), raw);
    expect(converted.propertyClass.innerProperty).to.equal('Test');
  });

  it('throws an error if incoming key for inner property class doesnt exist', () => {
    const raw = { propertyClass: { innerPropertyZ: 'Test' } };
    const testFunc = () => fromJson<SimpleClassWithCustomClassKey>(typeInfo(SimpleClassWithCustomClassKey), raw);
    expect(testFunc).to.throw('[FromJson]: Unknown property passed: innerPropertyZ');
  });

});

// TODO: spec for generic
// TODO: spec for customClass when generic: true
