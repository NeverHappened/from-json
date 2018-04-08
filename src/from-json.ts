
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
        console.warn(`FromJson: Not parsed incoming key: ${serverPropertyName}`);
        return;
      }

      const propertyConstructor = type.children ? type.children[property.propertyKey].base : null;

      if (property.generic) {
        property.arrayType = propertyConstructor;
      }

      if (!raw[serverPropertyName]) {
        console.warn(`FromJson: Missing property in ${type}: ${serverPropertyName}`);
        objectPropertyValue = null;
      } else if (property.arrayType) {
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
