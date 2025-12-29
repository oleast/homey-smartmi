# TypeScript Development Guide

This Homey app is written in TypeScript and compiled to JavaScript for release.

## Project Structure

```
src/                    - TypeScript source files
  app.ts               - Main app class
  drivers/             - Device drivers
    smartmi-p1/
      driver.ts        - Driver class
      device.ts        - Device class
  @types/              - TypeScript type definitions
    homey/             - Homey types
    tuyapi/            - TuyAPI types
dist/                  - Compiled JavaScript (generated, not committed)
app.js                 - Compiled app (generated from src/app.ts)
drivers/smartmi-p1/
  driver.js            - Compiled driver (generated from src)
  device.js            - Compiled device (generated from src)
```

## Development Workflow

### Building

To compile TypeScript to JavaScript:

```bash
npm run build
```

This will:
1. Clean the `dist/` directory
2. Compile TypeScript files from `src/` to `dist/`
3. Copy the compiled JavaScript files to their final locations for Homey

### Watching for Changes

To automatically recompile on file changes:

```bash
npm run watch
```

Note: The watch mode only compiles TypeScript. You'll need to manually run the copy step or run `npm run build` to update the final JS files.

### Clean Build

To remove all compiled files:

```bash
npm run clean
```

## TypeScript Configuration

The TypeScript configuration is in `tsconfig.json`. Key settings:

- **Target**: ES2020
- **Module**: CommonJS (required for Homey)
- **Strict Mode**: Enabled for better type safety
- **Source Maps**: Generated for debugging

## Type Definitions

Custom type definitions for Homey and TuyAPI are in `src/@types/`. These provide TypeScript support for modules that don't have official type definitions.

## Release Process

For Homey releases, the compiled JavaScript files are used:
- `app.js`
- `drivers/smartmi-p1/driver.js`
- `drivers/smartmi-p1/device.js`

The `prepare` script in `package.json` automatically builds the project when running `npm install`, ensuring the JavaScript files are always up-to-date.

## Benefits of TypeScript

- **Type Safety**: Catch errors at compile-time instead of runtime
- **Better IDE Support**: Autocomplete, inline documentation, and refactoring tools
- **Code Quality**: Enforces consistent coding practices
- **Maintainability**: Easier to understand and modify code with explicit types
- **Documentation**: Types serve as inline documentation

## Git Workflow

The source TypeScript files in `src/` are tracked in git. The compiled JavaScript files are also committed to ensure they're always in sync for Homey releases. The `dist/` directory is ignored as it's only used during build.
