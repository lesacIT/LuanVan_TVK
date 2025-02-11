import { Buffer } from 'buffer';
class handleImgType {
  static getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  static readImgFromBase64(base64) {
    if (base64) {
      const imageBase64 = new Buffer(base64, 'base64').toString('binary');
      return imageBase64;
    }
  }
}

export default handleImgType;
