
import { InnerPropertyConfig, Properties, TypeBase, TypeInfo, typeInfo as ty, TypeChildren } from './public-api';

export namespace FromJson {

  export function fromJson<T>(type: TypeInfo, rawData: any): T {
    const { base, children } = type;
    const result = new base();
    const properties: Properties = base.prototype['properties'];

    Object.keys(rawData).forEach((serverPropertyKey) => {
      const property: InnerPropertyConfig = properties[serverPropertyKey];
      if (!property) {
        throw new Error(`[FromJson]: Unknown property passed: ${serverPropertyKey}`);
      }

      const config = combineConfig(property, serverPropertyKey, children, rawData);
      result[property.propertyKey] = convertProperty(config);
    });

    return result;
  }

  function combineConfig(
    property: InnerPropertyConfig,
    serverPropertyKey: string,
    children: TypeChildren,
    rawData: any,
  ): UpdateInfo {
    let { propertyKey, isGeneric, isArray, constructr } = property;

    if (isGeneric) {
      if (!children[propertyKey]) {
        throw new Error(`[FromJson] You cannot use generic properties without specifing their concrete type. Error on ${propertyKey} property`);
      }
      constructr = children[propertyKey].base;
    }

    const rawValue: any = rawData[serverPropertyKey];
    const needRecursiveConversion: boolean = isArray && (!!constructr);

    return {
      rawValue,
      needRecursiveConversion,
      constructr,
    };
  }

  function convertProperty<T>(update: UpdateInfo): any {
    const { needRecursiveConversion, rawValue, constructr } = update;

    if (needRecursiveConversion) { return rawValue.map((element) => fromJson(ty(constructr), element)); }
    else if (constructr) { return fromJson(ty(constructr), rawValue); }
    else { return rawValue; }
  }

  interface UpdateInfo {
    rawValue: any;
    needRecursiveConversion: boolean;
    constructr: TypeBase;
  }
}
