export interface CreateProjectDTO {
  name: string;
  description?: string;
  workspacePublicId: string;
  organizationPublicId: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectResponseDTO {
  publicId: string;
  name: string;
  description: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
}