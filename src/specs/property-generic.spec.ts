import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

class ConcretePropertyClass {
  @Property()
  public prop: string;
}

class GenericClass<T> {
  @Property({ generic: true })
  public propertyClass: T;
}

describe('Property config: generic', () => {

  it('creates a child property class with specified constructor', () => {
    const raw = { propertyClass: { prop: 'Test' } };
    const converted = fromJson<GenericClass<ConcretePropertyClass>>(
      typeInfo(GenericClass, { propertyClass: typeInfo(ConcretePropertyClass) }),
      raw,
    );
    expect(converted.propertyClass.constructor).to.equal(ConcretePropertyClass);
  });

  it('fills the property in the concrete child class', () => {
    const raw = { propertyClass: { prop: 'Test' } };
    const converted = fromJson<GenericClass<ConcretePropertyClass>>(
      typeInfo(GenericClass, { propertyClass: typeInfo(ConcretePropertyClass) }),
      raw,
    );
    expect(converted.propertyClass.prop).to.equal('Test');
  });
});

// TODO: spec for customClass when generic: true
