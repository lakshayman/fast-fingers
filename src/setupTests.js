if (typeof structuredClone !== 'function') {
  global.structuredClone = obj => {
    if (obj === undefined || obj === null) return obj;
    return JSON.parse(JSON.stringify(obj));
  }
} 