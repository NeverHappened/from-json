import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

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

// TODO: spec for customClass when generic: true
