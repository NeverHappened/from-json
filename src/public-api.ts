/// <reference types="reflect-metadata" />
import { FromJson } from './from-json';

export function fromJson<T>(type: TypeInfo, rawData: any): T {
  return FromJson.fromJson(type, rawData);
}

export function Property(config: PropertyConfig = {}): Function  {
  const { key, customClass, generic } = config;

  return function(target: any, propertyKey: string) {
    const serverPropertyKey = key || propertyKey;
    const modifiedProperties: Properties = target.properties || [];

    const propertyClass = Reflect.getMetadata('design:type', target, serverPropertyKey);
    const isArray = propertyClass === Array;
    const isGeneric = generic || false;

    modifiedProperties[serverPropertyKey] = { propertyKey, customClass, isArray, isGeneric };
    target.properties = modifiedProperties;
  };
}

export function typeInfo(base: TypeBase, children = null) {
  return { base, children };
}

export interface PropertyConfig {
  key?: string;
  customClass?: TypeBase;
  generic?: boolean;
}

export interface Properties {
  [name: string]: InnerPropertyConfig;
}

export interface TypeInfo {
  base: TypeBase;
  children?: TypeChildren;
}

export interface TypeBase {
  new();
}

export interface TypeChildren {
  [property: string]: TypeInfo;
}

export interface InnerPropertyConfig {
  propertyKey: string;
  isGeneric: boolean;
  isArray: boolean;
  customClass?: TypeBase;
}
