export const encodeStr = (text: string): string => {
  const encoder = new TextEncoder();
  // 1: split the string into an array of bytes
  const charCodes = encoder.encode(text);
  // 2: concatenate byte data to create a binary string
  const binaryStr = String.fromCharCode(...charCodes);
  // 3: encode base64
  return btoa(binaryStr);
};

export const decodeStr = (base64Str: string): string => {
  //  fromBase64 from "@cosmjs/encoding" is broken on some instances, unreliable
  const binaryStr = atob(base64Str);
  const charCodes = binaryStr.split('').map((char) => char.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(charCodes));
}
