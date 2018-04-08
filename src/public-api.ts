/// <reference types="reflect-metadata" />
import { FromJson } from './from-json';

export function fromJson<T>(type: TypeInfo, rawData: any): T {
  return FromJson.fromJson(type, rawData);
}

/**
 *   target: property to modify
 *   propertyKey: server property to convert from
 *   customClass: property when nested class exists
*/
export function Property<T>(config: PropertyConfig<T> = {}): Function  {
  const { key, customClass, arrayType, generic } = config;

  return function(target: any, propertyKey: string) {
    const serverPropertyKey = key || propertyKey;

    const result: { [name: string]: InnerPropertyConfig<T> } = target.properties || [];
    const constructr = customClass ? Reflect.getMetadata('design:type', target, serverPropertyKey) : null;
    result[serverPropertyKey] = { propertyKey, customClass, constructr, arrayType, generic };
    target['properties'] = result;
  };
}

export interface PropertyConfig<T> {
  key?: string;
  customClass?: boolean;
  generic?: boolean;
  arrayType?: { new(): T };
}

export interface InnerPropertyConfig<T> {
  propertyKey?: string;
  customClass?: boolean;
  generic?: boolean;
  arrayType?: { new(): T };
  constructr?: { new(): T };
}

export interface TypeBase {
  new();
}

export interface TypeInfo {
  base: TypeBase;
  children?: { [property: string]: TypeInfo };
}

export function typeInfo(base: TypeBase, children = null) {
  return { base, children };
}
