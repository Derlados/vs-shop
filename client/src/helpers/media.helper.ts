class MediaHelper {

  getProductUrl(file: string): string {
    return `http://localhost/media/catalog/product/${file}`;
  }
}

export default new MediaHelper();