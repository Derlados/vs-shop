class MediaHelper {

  getCatalogFileUrl(file: string, type: "product" | "category"): string {
    if (type === "category") return `http://localhost/${file}`;

    return `http://localhost/media/catalog/product/${file}`;
  }
}

export default new MediaHelper();