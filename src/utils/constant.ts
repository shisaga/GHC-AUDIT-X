export const AUDIT_STATUS = [
  "In-Progress",
  "Processed",
  "Submitted",
  "Approved",
  "Rejected",
  "Revised",
  "Cancelled",
  "Closed",
  "Waiting",
];

export const PRIORITY = [
  { value: "0", label: "High" },
  { value: "1", label: "Medium" },
  { value: "2", label: "Low" },
];

export const PAYMENT_METHOD = [
  { value: "cash", label: "Cash" },
  { value: "creditCard", label: "Credit Card" },
  { value: "eTransfer", label: "E Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "userSpecified", label: "User Specified" },
];

export const DAY_FILTER = [
  { value: "last30Days", label: "Last 30 Days" },
  { value: "last60Days", label: "Last 60 Days" },
  { value: "last90Days", label: "Last 90 Days" },
];

export const CANADA_PROVINCES = [
  "British Columbia",
  "Alberta",
  "Saskatchewan",
  "Manitoba",
  "Ontario",
  "Quebec",
  "New Brunswick",
  "Nova Scotia",
  "Prince Edward Island",
  "Newfoundland",
  "Yukon",
  "Northwest Territories",
  "Nunavut",
];

export const PRIORITY_STATUS_VALUE = ["High", "Medium", "Low"];

export const STATUS_TEXT_COLOR: any = {
  "In-Progress": "#FFFFFF",
  Processed: "#FFFFFF",
  Submitted: "#1C1C1C",
  Revised: "#1C1C1C",
  Cancelled: "#FFFFFF",
  Closed: "#878686",
  Waiting: "#1C1C1C",
};

export const STATUS_BG_COLOR: any = {
  "In-Progress": "#406AE8",
  Processed: "#12A8B7",
  Submitted: "#4ae16b9e",
  Approved: "#26B846",
  Rejected: "#E84848",
  Revised: "#FFC591",
  Cancelled: "#5A5A5A",
  Closed: "#5A5A5A3D",
  Waiting: "#ffc107",
};

export const APLHA_NUMERIC_REGEX = /^[a-zA-Z0-9]*$/;

export const PAID_STATUS: any = {
  PAID: "PAID",
  UNPAID: "UNPAID",
};

export const AUDIT_STATUS_FOR_EDIT = [
  "Processed",
  "Submitted",
  "Approved",
  "Rejected",
  "Revised",
  "Cancelled",
  "Closed",
  "Waiting",
];
