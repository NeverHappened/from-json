/// <reference types="reflect-metadata" />

import { FromJson } from './from-json';

export function fromJson<T>(type: TypeInfo, raw: any): T {
  return FromJson.fromJson(type, raw);
}

/**
 *   target: property to modify
 *   propertyKey: server property to convert from
 *   nestedClass: property when nested class exists
*/
export function Property<T>(config: PropertyConfig<T> = {}): Function  {
  let { serverPropertyKey } = config;
  const { nestedClass, arrayType, generic } = config;

  return function(target: any, propertyKey: string) {
    if (!serverPropertyKey) {
      serverPropertyKey = propertyKey;
    }

    const result: { [name: string]: InnerPropertyConfig<T> } = target.properties || [];
    const constructr = (nestedClass || arrayType) ? Reflect.getMetadata('design:type', target, serverPropertyKey) : null;
    result[serverPropertyKey] = { nestedClass, propertyKey, constructr, arrayType, generic };
    target['properties'] = result;
  };
}

export interface PropertyConfig<T> {
  serverPropertyKey?: string;
  nestedClass?: boolean;
  generic?: boolean;
  arrayType?: { new(): T };
  constructr?: { new(): T };
}

export interface InnerPropertyConfig<T> {
  propertyKey?: string;
  nestedClass?: boolean;
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

export function typeInfo(base, children = null) {
  return { base, children };
}