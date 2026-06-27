import { CreateOrganizationDTO, UpdateOrganizationDTO } from '../dto/organization.dto';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateOrganization = (
  data: CreateOrganizationDTO
): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Organization name must not exceed 100 characters');
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.push('Website must be a valid URL starting with http:// or https://');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateOrganization = (
  data: UpdateOrganizationDTO
): ValidationResult => {
  const errors: string[] = [];

  if (data.name && data.name.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Organization name must not exceed 100 characters');
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.push('Website must be a valid URL starting with http:// or https://');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};