# from-json
## Easily convert your raw json coming to the initialized classes with typescript annotations
See usage and specs on github:
https://github.com/NeverHappened/from-json

# Notes
Before usage you must import 'reflect-metadata' package into your project.
It's global, so you can add it in a separate script. For example, in polyfills.ts for Angular 2+.
```
import 'reflect-metadata';
```
Also you need to set ```"emitDecoratorMetadata": true``` in your tsconfig.json to autodiscover feature and array detection to work

# Usage
You can actually look at the specs to see the working examples (src/specs/*)

## Simple case - convert simple types
1. Annotate your class propertis that you want to convert with @Property annotations
````convertable-class.ts````
````typescript
import { Property } from '@nhpd/from-json';

class ConvertableClass {
  @Property()
  public convertableProperty: string;
}
````
2. Than use the fromJson method to intantiate your class automatically
````test.ts````
````typescript
import { fromJson, typeInfo } from '@nhpd/from-json';
import { ConvertableClass } from './convertable-class';

const raw = { convertableProperty: 'Test' };
const convertedClass = fromJson<ConvertableClass>(typeInfo(ConvertableClass), raw); // instance of ConvertableClass
console.log(convertedClass.convertableProperty === 'Test'); // true
````

## For properties that are itself classes annotated
````convertable-class.ts````
````typescript
import { Property } from '@nhpd/from-json';

class DifferentClass {
  @Property()
  public prop: string;
}
class ConvertableClass {
  @Property({ autodiscover: true })
  public convertableProperty: DifferentClass;
}
````

## Simple arrays conversion:
Just specify
````@Property()````

## Custom class arrays conversion: ````typescript @Property({ customClass: DifferentClass })````
````convertable-class.ts````
````typescript
import { Property } from '@nhpd/from-json';

class DifferentClass {
  @Property({})
  public prop: string;
}
class ConvertableClass {
  @Property({ autodiscover: true })
  public convertableProperty: DifferentClass[];
}
````

## Generic classes
They present a problem, cause we cannot infer the types of generic classes in annotations.
The workaround for that is to pass around additional (recursive) type info to fromJson method:
````convertable-class.ts````
````typescript
import { Property } from '@nhpd/from-json';

class ConcretePropertyClass {
  @Property()
  public prop: string;
}

class GenericClass<T> {
  @Property({ generic: true })
  public convertableProperty: T;
}
````

````test.ts````
````typescript
const raw = { convertableProperty: { prop: 'Test' } };
const info = typeInfo(GenericClass, { convertableProperty: typeInfo(ConcretePropertyClass) });
const converted = fromJson<GenericClass<ConcretePropertyClass>>(raw, info);
console.log(converted.convertableProperty.prop) === 'Test'; // true
````

## TODO:
## For autoconversion of classes that cannot be annotated with @Property (For example, Date), use !TODO!

# Gotchas
1. You cannot use autodiscover if you have an array, because we cannot infer the generic constructor from the Array class. Use customClass.
2. You should use autodiscover to automatically convert classes with @Property inside
3. If you don't want to convert into the class (It's simple numbers/strings/interface), just don't use anything at all
4. We don't need a customClass if using ````{ generic: true } ````, because it'll be taken from the ```TypeInfo``` passed in ```fromJson``` function


# Development

Install dependencies
```
yarn
```

Run tests
```
yarn test
```

# Release
Increase version in package.json

Compile typescript
```
yarn run compile
```

Publish to npm
```
npm publish
```

Run tests
```
npm run test
```
