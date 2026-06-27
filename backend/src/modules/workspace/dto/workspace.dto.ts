export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
  organizationPublicId: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
}

export interface WorkspaceResponseDTO {
  publicId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}