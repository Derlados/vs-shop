class FormatHelper {
  static formatCurrency(value: number, digits = 2): string {
    return `${Number(value).toFixed(digits)} ₴`;
  }
}

export default FormatHelper;