const defaultOptions = {
  fieldSeparator: ', ',
  keySeparator: ': ',
  lineLength: 80,
  spaces: 2,
};

const NEWLINE = '\n';

function lastLine(text) {
  const lines = text.split('\n');
  return lines[lines.length - 1];
}

export default function stringify(obj: mixed, options: Options = defaultOptions) {
  function indent(indentLevel) {
    return ' '.repeat(options.spaces * indentLevel);
  }

  function stringifyObject(node, indentLevel = 0, currentLine) {
    const stringifiedObject = Object.keys(node).reduce((result, key) => {
      const value = node[key];

      const serializedKey = `"${key}"${options.keySeparator}`;
      const serializedValue = stringifyAny(value, indentLevel + 1, currentLine + serializedKey);
      const serializedField = serializedKey + serializedValue;

      if (result.length === 0) {
        return serializedField.trim();
      }

      return result + options.fieldSeparator.trim() + NEWLINE + indent(indentLevel + 1)
           + serializedField;
    }, '');

    const contents = NEWLINE + indent(indentLevel + 1) + stringifiedObject +
                     NEWLINE + indent(indentLevel);
    return `{${contents}}`;
  }

  function stringifyArray(array, indentLevel, currentLine) {
    const lineLength = options.lineLength - indent(indentLevel).length;

    // Try for a one line array
    const tryOneLine = array.reduce((result, element, n) => {
      const stringifiedElement = stringifyAny(
        element,
        indentLevel + 1,
        lastLine(currentLine + result),
      );

      return result + (n ? options.fieldSeparator : '') + stringifiedElement;
    }, '[');

    if ((`${currentLine}${tryOneLine}]`).length <= lineLength) {
      return `${tryOneLine}]`;
    }

    // Start array on a new line, but cram as many values in as possible onto one line
    const contents = array.reduce((result, element, n) => {
      const stringifiedElement = stringifyAny(element, indentLevel + 1, lastLine(result));
      const tryFit = result + (n ? options.fieldSeparator : '') + stringifiedElement;

      // The line being worked on
      const workingLine = lastLine(indent(indentLevel + 1) + tryFit + options.fieldSeparator);

      if (workingLine.length > lineLength) {
        return result + options.fieldSeparator.trim() + NEWLINE + indent(indentLevel + 1)
             + stringifiedElement;
      }

      return tryFit;
    }, `[${NEWLINE + indent(indentLevel + 1)}`);

    return `${contents + NEWLINE + indent(indentLevel)}]`;
  }

  function stringifyAny(node, indentLevel = 0, currentLine = '') {
    const lineLength = options.lineLength - indent(indentLevel).length;

    const { keySeparator, fieldSeparator } = options;

    /* Assuming the shortest possible key is `""` (empty string, 2
       characters) and shortest possible value is `0` (zero, 1
       character), then each key-value pair takes this number of
       characters, which can be used to decide whether the object
       should be split up or not */

    const maxObjectElements = Math.floor(
      lineLength / (options.fieldSeparator.length + options.keySeparator.length + 3),
    );


    if (typeof node !== 'object' || node === null) {
      return JSON.stringify(node);
    }

    if (Array.isArray(node)) {
      return stringifyArray(node, indentLevel, currentLine);
    }

    const keys = Object.keys(node);

    if (keys.length === 0) {
      return '{}';
    }

    if (keys.length > maxObjectElements) {
      return stringifyObject(node, indentLevel, currentLine);
    }

    const objectKeys = keys.map(
      key => `"${key}"${keySeparator}${stringifyAny(node[key], indentLevel + 1, currentLine)}`,
    );

    const stringifiedObject = `{ ${objectKeys.join(fieldSeparator)} }`;

    if (stringifiedObject.length >= lineLength) {
      return stringifyObject(node, indentLevel, currentLine);
    }

    return stringifiedObject;
  }

  JSON.stringify(obj);
  return stringifyAny(obj);
}
