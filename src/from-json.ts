
import { InnerPropertyConfig, TypeInfo, TypeBase, typeInfo as ty } from './public-api';

export namespace FromJson {

  export function fromJson<T>(type: TypeInfo, rawData: any): T {
    const result = new type.base();
    // NOTE: Map server names to `T` object names
    const properties: { [name: string]: InnerPropertyConfig<T> } = type.base.prototype['properties'];

    Object.keys(rawData).forEach((serverPropertyKey) => {
      const property: InnerPropertyConfig<T> = properties[serverPropertyKey];
      convertProperty(result, property, serverPropertyKey, type, rawData);
    });

    return result;
  }

  function convertProperty<T>(
    result: TypeBase,
    property: InnerPropertyConfig<T> | null,
    serverPropertyKey: string,
    type: TypeInfo,
    rawData: any,
  ) {
    if (!property) {
      throw new Error(`[FromJson]: Unknown property passed: ${serverPropertyKey}`);
    }

    if (property.generic) {
      const propertyConstructor = type.children ? type.children[property.propertyKey].base : null;
      property.arrayType = propertyConstructor;
    }

    const rawValue: any = rawData[serverPropertyKey];

    let objectPropertyValue;
    if (property.arrayType) {
      objectPropertyValue = rawValue.map((element) => fromJson(ty(property.arrayType), element));
    } else if (property.customClass) {
      objectPropertyValue = fromJson(ty(property.constructr), rawValue);
    } else {
      objectPropertyValue = rawValue;
    }

    result[property.propertyKey] = objectPropertyValue;
  }
}
