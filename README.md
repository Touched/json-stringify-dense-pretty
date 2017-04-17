# json-stringify-dense-pretty

## Introduction

The built-in `JSON.stringify` function, when configured to pretty print, does not produce very compact output which makes certain structures, like long numeric arrays, very difficult to read.

For example,

```javascript
JSON.stringify([0, 0, 0, 0], null, 2);
```

produces

```json
[
  0,
  0,
  0,
  0
]
```

This can be very annoying for long arrays. This alternative function packs as many array elements on one line before creating a new line

```javascript
import jsonStringify from '@touched/json-stringify-dense-pretty';

jsonStringify([0, 0, 0, 0]);
```

produces

```
[0, 0, 0, 0]
```

However,

```javascript
// Stringify array of 50 zeroes
jsonStringify([...Array(50)].map(() => 0));
```

results in

```json
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]
```

which is much easier for a human to scan.

## Usage

ES6 imports:

```javascript
import jsonStringify from '@touched/json-stringify-dense-pretty';
```

Common.js:
```javascript
const jsonStringify = require('@touched/json-stringify-dense-pretty').default;
```

Usage
```
jsonStringify(obj: mixed, options: Options);
```

Options:

- `fieldSeparator`: The string that appears between fields. `", "` by default.
- `keySeparator`: The string that separates key-value pairs. `": "` by default.
- `lineLength`: A guide for how long to make lines. Default is `80`.
- `spaces`: The amount of spaces to indent with. Default is `2`.

## CLI

This library comes with a formatter utility that reads JSON from stdin and prints formatted JSON (using the default options above) on stdout.

Usage: `cat data.json | json-format-dense-pretty`

# License

GPLv3
