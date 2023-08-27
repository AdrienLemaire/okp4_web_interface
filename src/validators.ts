export const isImageUrl = (url: string) => {
  try {
    const imageUrl = new URL(url);
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    // Check if the protocol is valid and the pathname ends with a valid extension
    if (imageUrl.protocol.startsWith("http") && validExtensions.some((ext) => imageUrl.pathname.endsWith(ext))) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const isDateTimeLocal = (str: string) => {
  const dateTimeLocalPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return dateTimeLocalPattern.test(str);
};
