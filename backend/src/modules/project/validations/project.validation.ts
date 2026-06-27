import { CreateProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { ProjectStatus } from '../project.model';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateProject = (
  data: CreateProjectDTO
): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Project name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Project name must not exceed 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  if (!data.workspacePublicId) {
    errors.push('Workspace is required');
  }

  if (!data.organizationPublicId) {
    errors.push('Organization is required');
  }

  if (data.startDate && isNaN(Date.parse(data.startDate))) {
    errors.push('Start date is invalid');
  }

  if (data.endDate && isNaN(Date.parse(data.endDate))) {
    errors.push('End date is invalid');
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.push('Start date must be before end date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateProject = (
  data: UpdateProjectDTO
): ValidationResult => {
  const errors: string[] = [];

  if (data.name && data.name.trim().length < 2) {
    errors.push('Project name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Project name must not exceed 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  if (data.status && !Object.values(ProjectStatus).includes(data.status as ProjectStatus)) {
    errors.push('Invalid project status');
  }

  if (data.startDate && isNaN(Date.parse(data.startDate))) {
    errors.push('Start date is invalid');
  }

  if (data.endDate && isNaN(Date.parse(data.endDate))) {
    errors.push('End date is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};