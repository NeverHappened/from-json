
import { InnerPropertyConfig, Properties, TypeBase, TypeInfo, typeInfo as ty } from './public-api';

export namespace FromJson {

  export function fromJson<T>(type: TypeInfo, rawData: any): T {
    const result = new type.base();
    const properties: Properties = type.base.prototype['properties'];

    Object.keys(rawData).forEach((serverPropertyKey) => {
      const property: InnerPropertyConfig = properties[serverPropertyKey];
      if (!property) {
        throw new Error(`[FromJson]: Unknown property passed: ${serverPropertyKey}`);
      }

      const config = combineConfig(property, serverPropertyKey, type, rawData);
      result[property.propertyKey] = convertProperty(config);
    });

    return result;
  }

  function combineConfig(
    property: InnerPropertyConfig,
    serverPropertyKey: string,
    type: TypeInfo,
    rawData: any,
  ): UpdateInfo {
    let { propertyKey, isGeneric, isArray, customClass } = property;

    if (isGeneric) {
      customClass = type.children[propertyKey].base;

      if (!customClass) {
        throw new Error(`[FromJson] You cannot use generic properties without specifing their concrete type. Error on ${propertyKey} property`);
      }
    }

    const rawValue: any = rawData[serverPropertyKey];
    const needRecursiveConversion: boolean = isArray && (!!customClass);

    return {
      rawValue,
      needRecursiveConversion,
      customClass,
    };
  }

  function convertProperty<T>(update: UpdateInfo): any {
    const { needRecursiveConversion, rawValue, customClass } = update;

    if (needRecursiveConversion) { return rawValue.map((element) => fromJson(ty(customClass), element)); }
    else if (customClass) { return fromJson(ty(customClass), rawValue); }
    else { return rawValue; }
  }

  interface UpdateInfo {
    rawValue: any;
    needRecursiveConversion: boolean;
    customClass: TypeBase;
  }
}
