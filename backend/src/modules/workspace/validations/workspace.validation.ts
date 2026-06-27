import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from '../dto/workspace.dto';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateWorkspace = (
  data: CreateWorkspaceDTO
): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Workspace name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Workspace name must not exceed 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  if (!data.organizationPublicId) {
    errors.push('Organization is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateWorkspace = (
  data: UpdateWorkspaceDTO
): ValidationResult => {
  const errors: string[] = [];

  if (data.name && data.name.trim().length < 2) {
    errors.push('Workspace name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Workspace name must not exceed 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};