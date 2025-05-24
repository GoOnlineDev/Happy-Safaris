export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
  { code: "BWP", name: "Botswana Pula", symbol: "P" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
  { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "SR" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "Rs" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
]; 