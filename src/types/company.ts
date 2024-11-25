export interface CompanyInfo {
  id?: string;
  accountType?: string;
  companyName: string;
  phone?: string;
  companyEmail?: string;
  SOPrefix: string;
  branchName?: string;
  imgUrl?: any;
  unit?: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  hasAcceptedTerm?: boolean;
  isVerified?: boolean;
  businessNumber: string;
  bankName?: string;
  bankAccountNumber?: string;
  transitNumber?: string;
  institution?: string;
}
