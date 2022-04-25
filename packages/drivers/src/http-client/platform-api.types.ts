export interface CreateUserInput {
  email: string;
  first_name: string;
  last_name: string;
  linkedin_url: string;
  role: string;
  title: string;
  password: string;
  supplier_uuid: string;
}

export interface Purchaser {
  uuid: string;
  auth0Id: string;
  createdBy: "";
  createdAt: string;
  modifiedAt: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  title: string;
  role: string;
  linkedinUrl: string;
  blocked: boolean;
  companyUuid: string;
  auth0OrganizationId: string;
}

export interface Company {
  uuid: string;
  name: string;
  websiteUrl: string;
  logoUrl: string;
  linkedinUrl: string;
  description: [{ type: string; children: any[] }];
  createdBy: string | null;
  createdAt: string;
  modifiedAt: string;
  active: boolean;
  auth0OrganizationId: string | null;
}

export interface PurchaserResponse {
  uuid: string;
  auth0_id: string;
  created_by: "";
  created_at: string;
  modified_at: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  title: string;
  role: string;
  linkedin_url: string;
  blocked: boolean;
  company_uuid: string;
  auth0_organization_id: string;
}

export interface CompanyResponse {
  uuid: string;
  name: string;
  website_url: string;
  logo_url: string;
  linkedin_url: string;
  description: [{ type: string; children: any[] }];
  created_by: string | null;
  created_at: string;
  modified_at: string;
  active: boolean;
  auth0_organization_id: string | null;
}
