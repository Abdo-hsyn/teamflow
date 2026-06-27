export interface CreateOrganizationDTO {
  name: string;
  description?: string;
  website?: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
}

export interface OrganizationResponseDTO {
  publicId: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface OrganizationMemberResponseDTO {
  publicId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: string;
  status: string;
  joinedAt: Date | null;
}