import { expect } from 'chai';
import 'mocha';
import { Property, fromJson, typeInfo } from '../public-api';

class SimpleClassWithDifferentPropertyKey {

  @Property({ key: 'anotherName' })
  public convertableProperty: string;

  public notConvertableProperty: number = 3;
}


describe('Property config: serverPropertyKey', () => {

  it('allowes to specify server key name different from property name', () => {
    const raw = { anotherName: 'Test' };
    const converted = fromJson<SimpleClassWithDifferentPropertyKey>(typeInfo(SimpleClassWithDifferentPropertyKey), raw);
    expect(converted.convertableProperty).to.equal('Test');
  });

  it('throws an error if server key doesnt exist', () => {
    // TODO
  });

});


describe('Property config: nestedClass', () => {

  it('allowes to specify nestedClass', () => {
    const raw = { anotherName: 'Test' };
    const converted = fromJson<SimpleClassWithDifferentPropertyKey>(typeInfo(SimpleClassWithDifferentPropertyKey), raw);
    expect(converted.convertableProperty).to.equal('Test');
  });

});
