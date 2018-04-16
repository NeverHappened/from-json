import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

function convert(isoString): Date {
  return 
}

class SimpleClass {
  @Property({ createFunction: (isoString) => new Date(isoString) })
  public convertableProperty: Date;
}

describe('Property key: autodiscovered', () => {

  it('should create inner class using the createFunction', () => {
    const dateString = '2018-04-16T12:21:08.997Z';
    const raw = { convertableProperty: dateString };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.constructor).to.equal(SimpleClass);
    expect(converted.convertableProperty.constructor).to.equal(Date);
    expect(converted.convertableProperty.toISOString()).to.equal(dateString);
  });

});
