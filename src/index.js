const defaultOptions = {
  fieldSeparator: ', ',
  keySeparator: ': ',
  lineLength: 80,
  spaces: 2,
};

const NEWLINE = '\n';

export default function stringify(obj: mixed, options: Options = defaultOptions) {
  function indent(indentLevel) {
    return ' '.repeat(options.spaces * indentLevel);
  }

  function serializeObject(node, indentLevel = 0) {
    const stringifiedObject = Object.keys(node).reduce((result, key) => {
      const value = node[key];

      const serializedField = `"${key}"${options.keySeparator}${serialize(value, indentLevel + 1)}`;

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

  function serialize(node, indentLevel = 0) {
    const lineLength = options.lineLength - indent(indentLevel).length;

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
      if (node.length === 0) {
        return JSON.stringify(node, null, 2);
      }

      const stringifiedArray = node.reduce((result, element) => {
        const serializedElement = serialize(element, indentLevel + 1);

        if (result.length === 0) {
          return serializedElement.trim();
        }

        const lastNewline = result.lastIndexOf(NEWLINE);
        const currentLine = lastNewline < 0 ? result : result.substr(lastNewline);
        const singleLine = currentLine + options.fieldSeparator + serializedElement
                         + options.fieldSeparator;

        if (singleLine.length >= lineLength) {
          return result + options.fieldSeparator.trim() + NEWLINE + indent(indentLevel + 1)
               + serializedElement;
        }

        return result + options.fieldSeparator + serializedElement;
      }, '');

      return stringifiedArray.indexOf(NEWLINE) === -1 ?
             `[${stringifiedArray}]` :
             `[${NEWLINE + indent(indentLevel + 1) + stringifiedArray + NEWLINE}]`;
    }

    const keys = Object.keys(node);

    if (keys.length === 0) {
      return '{}';
    }

    if (keys.length > maxObjectElements) {
      return serializeObject(node, indentLevel);
    }

    const objectKeys = keys.map(
      key => `"${key}"${options.keySeparator}${serialize(node[key], indentLevel + 1)}`,
    );

    const stringifiedObject = `{ ${objectKeys.join(options.fieldSeparator)} }`;

    if (stringifiedObject.length >= lineLength) {
      return serializeObject(node, indentLevel);
    }

    return stringifiedObject;
  }

  JSON.stringify(obj);
  return serialize(obj);
}
