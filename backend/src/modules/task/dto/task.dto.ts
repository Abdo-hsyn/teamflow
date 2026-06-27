export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: string;
  projectPublicId: string;
  organizationPublicId: string;
  assigneePublicId?: string;
  dueDate?: string;
  estimatedHours?: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneePublicId?: string;
  dueDate?: string;
  estimatedHours?: number;
  order?: number;
}

export interface TaskResponseDTO {
  publicId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigneeId: number | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  order: number;
  createdAt: Date;
}