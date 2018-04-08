/// <reference types="reflect-metadata" />
import { FromJson } from './from-json';

export function fromJson<T>(type: TypeInfo, rawData: any): T {
  return FromJson.fromJson(type, rawData);
}

export function Property(config: PropertyConfig = {}): Function  {
  const { key, customClass, generic, autodiscovered } = config;

  return function(target: any, propertyKey: string) {
    const serverPropertyKey = key || propertyKey;
    const modifiedProperties: Properties = target.properties || [];

    const propertyClass = Reflect.getMetadata('design:type', target, propertyKey);
    const isArray = propertyClass === Array;
    const isGeneric = generic || false;
    const constructr = autodiscovered ? propertyClass : customClass;

    modifiedProperties[serverPropertyKey] = { propertyKey, constructr, isArray, isGeneric };
    target.properties = modifiedProperties;
  };
}

export function typeInfo(base: TypeBase, children: TypeChildren = null): TypeInfo {
  return { base, children };
}

export interface PropertyConfig {
  // If present, used as an incoming key. Else the property name will be used
  key?: string;

  // If present, we'll use this class to initialize property
  customClass?: TypeBase;

  // If true, we'll use the TypeInfo that's passed in fromJson to determine the property class
  generic?: boolean;
  
  // If true, property class will be deduced from the property field
  autodiscovered?: boolean;
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
  constructr?: TypeBase;
}
