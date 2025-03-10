import { supabase } from "@/lib/supabase";
import { InspectionFormData } from "@/components/inspection/useInspectionForm";

export interface InspectionResponse extends InspectionFormData {
  id: string;
  institution_id: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export interface InspectionListParams {
  status?: string;
  institution_id?: string;
  from_date?: string;
  to_date?: string;
}

export const inspectionApi = {
  async create(data: InspectionFormData): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .insert([
        {
          institution_name: data.institutionName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          location: data.location,
          category: data.category,
          ownership: data.ownership,
          manager_name: data.managerName,
          principal_name: data.principalName,
          health_inspection: data.healthInspection,
          lease_agreement: data.leaseAgreement,
          financial_records: data.financialRecords,
          legal_documents: data.legalDocuments,
          internal_quality_assurance: data.internalQualityAssurance,
          strategic_plan: data.strategicPlan,
          physical_facilities: data.physicalFacilities,
          theory_rooms: data.theoryRooms,
          laboratories: data.laboratories,
          library: data.library,
          sanitation: data.sanitation,
          water_electricity: data.waterElectricity,
          teaching_staff: data.teachingStaff,
          technical_staff: data.technicalStaff,
          administrative_staff: data.administrativeStaff,
          guidance_counseling_unit: data.guidanceCounselingUnit,
          safety_measures: data.safetyMeasures,
          industrial_attachment: data.industrialAttachment,
          courses_approved: data.coursesApproved.split("\n"),
          licensed_courses: data.licensedCourses.split("\n"),
          trainer_preparation: data.trainerPreparation,
          examination_results: data.examinationResults,
          assessor_name: data.assessorName,
          assessor_signature: data.assessorSignature,
          recommendations: data.recommendations,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },

  async update(
    id: string,
    data: Partial<InspectionFormData>,
  ): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },

  async getById(id: string): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },

  async submit(id: string): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },

  async uploadDocument(inspectionId: string, file: File, type: string) {
    const filePath = `inspections/${inspectionId}/${type}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("inspection-documents")
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: document, error: insertError } = await supabase
      .from("inspection_documents")
      .insert([
        {
          inspection_id: inspectionId,
          document_type: type,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        },
      ])
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    return document;
  },

  async list(params?: InspectionListParams): Promise<InspectionResponse[]> {
    let query = supabase.from("inspections").select("*");

    if (params?.status) {
      query = query.eq("status", params.status);
    }
    if (params?.institution_id) {
      query = query.eq("institution_id", params.institution_id);
    }
    if (params?.from_date) {
      query = query.gte("created_at", params.from_date);
    }
    if (params?.to_date) {
      query = query.lte("created_at", params.to_date);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  },

  async getDocuments(inspectionId: string) {
    const { data, error } = await supabase
      .from("inspection_documents")
      .select("*")
      .eq("inspection_id", inspectionId);

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteDocument(documentId: string) {
    const { data: document, error: fetchError } = await supabase
      .from("inspection_documents")
      .select("file_path")
      .eq("id", documentId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("inspection-documents")
      .remove([document.file_path]);

    if (storageError) throw new Error(storageError.message);

    // Delete from database
    const { error: deleteError } = await supabase
      .from("inspection_documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) throw new Error(deleteError.message);
  },

  async approve(id: string, comments?: string): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .update({
        status: "approved",
        recommendations: comments || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },

  async reject(id: string, comments?: string): Promise<InspectionResponse> {
    const { data: inspection, error } = await supabase
      .from("inspections")
      .update({
        status: "rejected",
        recommendations: comments || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inspection;
  },
};
