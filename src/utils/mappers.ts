import { Institution } from "../types/institution";
import { Database } from "../types/database";

type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];

export const mapInstitutionFromDB = (row: InstitutionRow): Institution => {
  const address = row.address as any;

  return {
    institutionId: row.id,
    institutionName: row.name,
    institutionType: row.type,
    ownershipType: address?.ownershipType || "Private",
    dateOfRegistration: row.created_at,
    physicalAddress: address?.physical || "",
    postalAddress: address?.postal,
    contactInfo: {
      phoneNumbers: [row.contact_phone || ""],
      emails: [row.contact_email || ""],
      website: address?.website,
    },
    premises: address?.premises || {
      status: "Owned",
      documents: [],
    },
    management: address?.management || {
      members: [],
    },
    infrastructure: address?.infrastructure || {
      classrooms: [],
      workshops: [],
      labs: [],
      toilets: {
        countFemale: 0,
        countMale: 0,
        qualityRating: 0,
      },
      waterSource: "",
      solidWasteDisposal: "",
      fireReadiness: 0,
      safetyFeaturesRating: 0,
    },
  };
};

export const mapInstitutionToDB = (
  institution: Institution,
): Omit<InstitutionRow, "id" | "created_at" | "updated_at"> => {
  return {
    name: institution.institutionName,
    type: institution.institutionType,
    registration_number: null,
    contact_email: institution.contactInfo.emails[0],
    contact_phone: institution.contactInfo.phoneNumbers[0],
    address: {
      physical: institution.physicalAddress,
      postal: institution.postalAddress,
      ownershipType: institution.ownershipType,
      premises: institution.premises,
      management: institution.management,
      infrastructure: institution.infrastructure,
    },
  };
};
