export interface UniversityWithMeta {
  id: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  type: string;
  websiteUrl: string | null;
  admissionUrl: string | null;
  logoUrl: string | null;
  ranking: number | null;
  programCount?: number;
  hostels?: { isActive: boolean }[];
  scholarships?: { isActive: boolean }[];
}

export interface ProgramWithUniversity {
  id: string;
  name: string;
  degreeLevel: string;
  field: string;
  minAggregate: number | null;
  universityId: string;
  university: {
    name: string;
    slug: string;
    city: string;
    province: string;
    type: string;
  };
}

export interface AdmissionWithUniversity {
  id: string;
  openDate: Date;
  closeDate: Date;
  status: string;
  universityId: string;
  university: {
    name: string;
    slug: string;
    city: string;
    province: string;
  };
  program?: {
    name: string;
  } | null;
}
