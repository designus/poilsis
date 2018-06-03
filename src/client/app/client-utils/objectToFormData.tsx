'use strict';

export function isObject(value) {
  return value === Object(value);
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isFile(value) {
  return value instanceof File;
}

export function makeArrayKey(key) {
  if (key.length > 2 && key.lastIndexOf('[]') === key.length - 2) {
    return key;
  } else {
    return key + '[]';
  }
}

export function objectToFormData(obj, fd?, pre?) {
  fd = fd || new FormData();

  Object.keys(obj).forEach((prop) => {
    const key = pre ? (pre + '[' + prop + ']') : prop;
    if (isObject(obj[prop]) && !isArray(obj[prop]) && !isFile(obj[prop])) {
      objectToFormData(obj[prop], fd, key);
    } else if (isArray(obj[prop])) {
      obj[prop].forEach((value) => {
        const arrayKey = makeArrayKey(key);

        if (isObject(value) && !isFile(value)) {
          objectToFormData(value, fd, arrayKey);
        } else {
          fd.append(arrayKey, value);
        }
      });
    } else {
      fd.append(key, obj[prop]);
    }
  });

  return fd;
}
