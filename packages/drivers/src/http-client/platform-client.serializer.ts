import {
  Company,
  CompanyResponse,
  Purchaser,
  PurchaserResponse,
} from "./platform-api.types";

//Code.
export function companyDeserialize(data: Company): CompanyResponse {
  return {
    uuid: data.uuid,
    name: data.name,
    website_url: data.websiteUrl,
    logo_url: data.logoUrl,
    linkedin_url: data.linkedinUrl,
    description: data.description,
    created_by: data.createdBy,
    created_at: data.createdAt,
    modified_at: data.modifiedAt,
    active: data.active,
    auth0_organization_id: data.auth0OrganizationId,
  };
}

export function purchaserDeserialize(data: Purchaser): PurchaserResponse {
  return {
    uuid: data.uuid,
    auth0_id: data.auth0Id,
    created_by: data.createdBy,
    created_at: data.createdAt,
    modified_at: data.modifiedAt,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    title: data.title,
    role: data.role,
    linkedin_url: data.linkedinUrl,
    blocked: data.blocked,
    company_uuid: data.companyUuid,
    auth0_organization_id: data.auth0OrganizationId,
  };
}
