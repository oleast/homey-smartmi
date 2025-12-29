# TypeScript Development Guide

This Homey app is written in TypeScript and compiled to JavaScript for release, following [Homey's official TypeScript guide](https://apps.developer.homey.app/guides/tools/typescript).

## Project Structure

```
app.ts                 - Main app class (TypeScript source)
app.js                 - Compiled JavaScript (generated from app.ts)
drivers/smartmi-p1/
  driver.ts            - Driver class (TypeScript source)
  driver.js            - Compiled JavaScript (generated from driver.ts)
  device.ts            - Device class (TypeScript source)
  device.js            - Compiled JavaScript (generated from device.ts)
homey.d.ts             - Type definitions for Homey SDK and TuyAPI
tsconfig.json          - TypeScript compiler configuration
```

## Development Workflow

### Building

To compile TypeScript to JavaScript:

```bash
npm run build
```

This compiles all `.ts` files to `.js` files in the same directory, following Homey's recommended approach.

### Watching for Changes

To automatically recompile on file changes:

```bash
npm run watch
```

This runs TypeScript in watch mode, automatically compiling files as you edit them.

## TypeScript Configuration

The TypeScript configuration in `tsconfig.json` follows Homey's guidelines:

- **Target**: ES2019 (compatible with Homey Pro)
- **Module**: CommonJS (required for Homey)
- **Strict Mode**: Enabled for type safety
- **Output**: Compiled JS files are placed alongside TS files

## Type Definitions

Type definitions for Homey and TuyAPI are in `homey.d.ts`. This provides TypeScript support for:
- Homey.App
- Homey.Driver  
- Homey.Device
- TuyAPI and its interfaces

## Release Process

For Homey releases, both TypeScript source (`.ts`) and compiled JavaScript (`.js`) files are committed to the repository. This ensures:
- Homey can run the JavaScript files directly
- Developers can see and modify the TypeScript source
- The code is always in sync

## Benefits of TypeScript

- **Type Safety**: Catch errors at compile-time instead of runtime
- **Better IDE Support**: Autocomplete, inline documentation, and refactoring tools
- **Code Quality**: Enforces consistent coding practices
- **Maintainability**: Explicit interfaces for device settings, DPS data, and Tuya responses
- **Documentation**: Types serve as inline documentation

## Git Workflow

Both TypeScript source files (`.ts`) and compiled JavaScript files (`.js`) are tracked in git, following Homey's recommended approach for app distribution.
