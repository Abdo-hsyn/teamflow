import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';
import { TaskStatus, TaskPriority } from '../task.model';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateTask = (data: CreateTaskDTO): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 2) {
    errors.push('Task title must be at least 2 characters');
  }

  if (data.title && data.title.trim().length > 255) {
    errors.push('Task title must not exceed 255 characters');
  }

  if (data.description && data.description.length > 2000) {
    errors.push('Description must not exceed 2000 characters');
  }

  if (!data.projectPublicId) {
    errors.push('Project is required');
  }

  if (!data.organizationPublicId) {
    errors.push('Organization is required');
  }

  if (data.priority && !Object.values(TaskPriority).includes(data.priority as TaskPriority)) {
    errors.push('Invalid priority value');
  }

  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.push('Due date is invalid');
  }

  if (data.estimatedHours && data.estimatedHours < 0) {
    errors.push('Estimated hours must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateTask = (data: UpdateTaskDTO): ValidationResult => {
  const errors: string[] = [];

  if (data.title && data.title.trim().length < 2) {
    errors.push('Task title must be at least 2 characters');
  }

  if (data.title && data.title.trim().length > 255) {
    errors.push('Task title must not exceed 255 characters');
  }

  if (data.description && data.description.length > 2000) {
    errors.push('Description must not exceed 2000 characters');
  }

  if (data.status && !Object.values(TaskStatus).includes(data.status as TaskStatus)) {
    errors.push('Invalid status value');
  }

  if (data.priority && !Object.values(TaskPriority).includes(data.priority as TaskPriority)) {
    errors.push('Invalid priority value');
  }

  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.push('Due date is invalid');
  }

  if (data.estimatedHours && data.estimatedHours < 0) {
    errors.push('Estimated hours must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};