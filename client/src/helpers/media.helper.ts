class MediaHelper {

  getCatalogFileUrl(file: string, type: "product" | "category"): string {
    if (type === "category") return `http://guessdraw.fun/${file}`;

    return `http://guessdraw.fun/media/catalog/product/${file}`;
  }
}

export default new MediaHelper();