# Easily convert your raw json coming to the initialized classes with typescript annotations


# Usage
Before usage you must import 'reflect-metadata' package into your project.
It's global, so you can add it in a separate script. For example, in polyfills.ts for Angular 2+.
```
import 'reflect-metadata';
```
Also you need to set ```"emitDecoratorMetadata": true``` in your tsconfig.json to autodiscover feature and array detection to work


# Gotchas
1. You cannot use autodiscover if you have an array, because we cannot infer the generic constructor from the Array class. Use customClass.
2. You should use autodiscover to automatically convert classes with @Property inside
3. If you don't want to convert into the class (It's simple numbers/strings/interface), just don't use anything at all
4. We don't need a customClass if using ```` { generic: true } ````, because it'll be taken from the ```TypeInfo``` passed in ```fromJson``` function


# Development

Install dependencies
```
yarn
```

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
