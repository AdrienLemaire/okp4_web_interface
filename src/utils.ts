export const encodeStr = (text: string): string => {
  const encoder = new TextEncoder();
  // 1: split the string into an array of bytes
  const charCodes = encoder.encode(text);
  // 2: concatenate byte data to create a binary string
  const binaryStr = String.fromCharCode(...charCodes);
  // 3: encode base64
  return btoa(binaryStr);
};
