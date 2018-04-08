
import { TypeInfo, InnerPropertyConfig } from './public-api';

export namespace FromJson {

  export function fromJson<T>(type: TypeInfo, raw: any): T {
    const obj = new type.base();
    // NOTE: Map server names to `T` object names
    const properties: { [name: string]: InnerPropertyConfig<T> } = type.base.prototype['properties'];

    Object.keys(raw).forEach((serverPropertyName) => {
      const property: InnerPropertyConfig<T> = properties[serverPropertyName];
      const innerValue: any = raw[serverPropertyName];
      let objectPropertyValue;

      if (!property) {
        throw new Error(`[FromJson]: Unknown property passed: ${serverPropertyName}`);
      }

      const propertyConstructor = type.children ? type.children[property.propertyKey].base : null;

      if (property.generic) {
        property.arrayType = propertyConstructor;
      }

      if (property.arrayType) {
        objectPropertyValue = innerValue.map((element) => this.convertFromJson(property.arrayType, element));
      } else if (property.nestedClass) {
        objectPropertyValue = this.convertFromJson(property.constructr, innerValue);
      } else {
        objectPropertyValue = innerValue;
      }

      obj[property.propertyKey] = objectPropertyValue;
    });

    return obj;
  }
}
