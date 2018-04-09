import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo as ty } from '../public-api';

class ArraySimpleClass {
  @Property()
  public array: number[];
}

describe('Array keys', () => {

  it('should correctly initialize the array of simple values', () => {
    const array = [1, 2, 3, 9];
    const raw = { array };
    const result = fromJson<ArraySimpleClass>(ty(ArraySimpleClass), raw);
    expect(result.array).to.eq(array);
    expect(result.array.length).to.eq(array.length);
  });
});

class PropertyClass {
  @Property()
  public prop: string;

  public test(): number { return 4; }
}
class ArrayCustomClass {
  @Property({ customClass: PropertyClass })
  public array: PropertyClass[];
}

describe('Array keys with custom classes', () => {

  it('should correctly initialize the array of custom class values', () => {
    const array = [ { prop: 'prop1' }, { prop: 'prop2' }];
    const raw = { array };
    const result = fromJson<ArrayCustomClass>(ty(ArrayCustomClass), raw);
    expect(result.array).to.not.eq(array);
    expect(result.array.length).to.eq(array.length);
  });

  it('should correctly initialize custom class items in array', () => {
    const array = [ { prop: 'prop1' }, { prop: 'prop2' }];
    const raw = { array };
    const result = fromJson<ArrayCustomClass>(ty(ArrayCustomClass), raw);
    const firstItem = result.array[0];
    expect(firstItem.constructor).to.eq(PropertyClass);
    expect(firstItem.test()).to.eq(4);
    expect(firstItem.prop).to.eq('prop1');
  });
});

class ConcretePropertyItemClass {
  @Property()
  public prop: string;

  public test(): number { return 4; }
}
class ArrayGenericClass<T> {
  @Property({ generic: true })
  public array: T[];
}

describe('Array keys with generic values', () => {
  const typeInfo = ty(ArrayGenericClass, { array: ty(ConcretePropertyItemClass) });
  const raw = { array: [ { prop: 'prop1' }, { prop: 'prop2' } ] };

  it('should correctly create array with passed type info', () => {
    const result = fromJson<ArrayGenericClass<ConcretePropertyItemClass>>(typeInfo, raw);
    expect(result.constructor).to.eq(ArrayGenericClass);
    expect(result.array.constructor).to.eq(Array);
  });

  it('should initialize items of correct concrete types', () => {
    const result = fromJson<ArrayGenericClass<ConcretePropertyItemClass>>(typeInfo, raw);
    const firstItem = result.array[0];
    expect(firstItem.constructor).to.eq(ConcretePropertyItemClass);
    expect(firstItem.test()).to.eq(4);
    expect(firstItem.prop).to.eq('prop1');
  });
});
