import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Property, fromJson, typeInfo } from '../public-api';

class AutodiscoveredClass {
  @Property()
  public prop: string;

  public test(): number {
    return 1;
  }
}

class SimpleClass {

  @Property({ autodiscovered: true })
  public convertableProperty: AutodiscoveredClass = new AutodiscoveredClass();

}

describe('Property key: autodiscovered', () => {

  it('should autodiscover the inner class and create it', () => {
    const raw = { convertableProperty: { prop: 'Test' } };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.convertableProperty.constructor).to.equal(AutodiscoveredClass);
  });

  it('should fill the autodiscovered inner class properties', () => {
    const raw = { convertableProperty: { prop: 'Test' } };
    const converted = fromJson<SimpleClass>(typeInfo(SimpleClass), raw);
    expect(converted.convertableProperty.prop).to.equal('Test');
    expect(converted.convertableProperty.test()).to.equal(1);
  });
});
