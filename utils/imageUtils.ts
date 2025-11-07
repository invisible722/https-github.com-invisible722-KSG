export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // Get base64 string without the data:image/jpeg;base64, prefix
      } else {
        reject(new Error("Failed to convert file to base64 string."));
      }
    };
    reader.onerror = error => reject(error);
  });
};
