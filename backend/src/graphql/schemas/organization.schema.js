const org_schema = `
type OrganizationName {
  name: String
  logo: String
  status: String
}

type OrganizationContact {
    personId: String
    phoneNumber: String
    email: String
    role: String
}

type OrganizationLicense {
  date: Date
  licenseNumber: String
  taxNumber: String
  licenseProviderId: String
  status: String
}

type OrganizationMember {
  _id:ID
  personId:String
  role: String
}

type OrganizationAddress {
  _id:ID
  officeType:String
  addressType: String
  addressId:String
}

type OrganizationAlias {
  _id:ID
  organizationId: String
}

type Organization {
  organization: [OrganizationName]
  contact: [OrganizationContact]
  license: [OrganizationLicense]
  organizationType: String
  privatePublic: String
  members: [OrganizationMember]
  address: [OrganizationAddress]
  aliasOrganization: [OrganizationAlias]
  description: String,
}

type OrganizationResponse {
  error: Boolean
  statusCode: Int
  items:[Organization]
  total:Int
}
type OneOrgResponse {
  error: Boolean
  statusCode: Int
  item:Organization
  message:String
}
`
const org_queries = `
organizations:OrganizationResponse
organization(id:String!):OneOrgResponse
`

export {
  org_schema,
  org_queries
};