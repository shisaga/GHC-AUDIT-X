export interface UserInfo {
  id?: string;
  accountType?: string;
  email: string;
  SOPrefix?: string;
  organizationId?: string;
  companyName?: string;
  imgUrl?: any;
  firstName: string;
  lastName: string;
  password?: string;
  mobile: string;
  unit?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  hasAcceptedTerm?: boolean;
  isVerified?: boolean;
  roles?: [{ name: string }];
}

interface Commission {
  type?: string;
  CAD?: number;
  GHCLead?: number;
  EALead?: number;
}

export interface AdminManagerInfo {
  [x: string]: any;
  id?: string;
  EANumber?: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  unit?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  HSTNumber?: string;
  businessName?: string;
  businessEmail?: string;
  role?: number;
  organizationId?: string;
  commissionD?: Commission;
  commissionE?: Commission;
  referralD?: Commission;
  referralE?: Commission;
}

export interface AuditFormData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  clientId?: string;
  unit?: string;
  streetAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  isMailingAddressSame?: boolean;
  mailingAddress?: {
    unit?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    country?: string;
    postalCode?: string;
  };
  calculatedSum: string;
  notes: Notes;
  organizationId?: number | null;
  creatorId?: string | null;
  preferredContactMethod: string;
  auditType: string;
  auditMode: string;
  dAuditId?: string;
  dAudit?: AuditDetail;
  dCost?: CostDetail;
  dPayment?: PaymentDetail;
  dSONotes?: string;
  eAuditId?: string;
  eAudit?: AuditDetail;
  eCost?: CostDetail;
  ePayment?: PaymentDetail;
  eSONotes?: string;
  createdAt?: string;
  updatedAt?: string;
  client?: any;
  auditor?: any;
  audit?: any;
}

interface AuditDetail {
  audit?: string;
  leadType?: string;
  auditStatus?: string;
  priority: string;
  auditDate?: number | null;
  startTime?: number | null;
  endTime?: number | null;
  application: string;
  auditorId: Number | null;
  contractorId: Number | null;
  SOId: Number | null;
}

interface CostDetail {
  auditCost: number;
  paidBy?: string;
}

interface PaymentDetail {
  paid: boolean;
  invoiceSent: boolean;
  EABalanceCleared: boolean;
  contractorBalanceCleared: boolean;
  SOBalanceCleared: boolean;
  reportSent: boolean;
  paymentType: string;
  paymentDate: number | null;
}

interface Notes {
  note: string;
  files: [];
}
