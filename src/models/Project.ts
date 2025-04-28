import { IProject } from './interfaces/IProject';
import { ProjectStatus, ProjectPriority, ProjectCategory, ProjectEnvironment } from './enums/ProjectEnums';
import { BrowserType } from './enums/TestEnums';

export class Project implements IProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: ProjectCategory;
  tags: string[];
  members: Array<{
    userId: string;
    role: string;
  }>;
  config: {
    defaultEnvironment: ProjectEnvironment;
    supportedEnvironments: ProjectEnvironment[];
    defaultBrowsers: BrowserType[];
    defaultHeadless: boolean;
    defaultRetryCount: number;
    defaultTimeout: number;
    screenshotOnFailure: boolean;
    videoRecording: boolean;
    parallelExecution: boolean;
    maxParallelTests: number;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IProject>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || ProjectStatus.ACTIVE;
    this.priority = data.priority || ProjectPriority.MEDIUM;
    this.category = data.category || ProjectCategory.WEB;
    this.tags = data.tags || [];
    this.members = data.members || [];
    this.config = data.config || {
      defaultEnvironment: ProjectEnvironment.TESTING,
      supportedEnvironments: [
        ProjectEnvironment.DEVELOPMENT,
        ProjectEnvironment.TESTING,
        ProjectEnvironment.STAGING
      ],
      defaultBrowsers: [BrowserType.CHROMIUM],
      defaultHeadless: true,
      defaultRetryCount: 1,
      defaultTimeout: 30000,
      screenshotOnFailure: true,
      videoRecording: false,
      parallelExecution: false,
      maxParallelTests: 1
    };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Proje durumunu güncelle
  updateStatus(status: ProjectStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Proje önceliğini güncelle
  updatePriority(priority: ProjectPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  // Proje kategorisini güncelle
  updateCategory(category: ProjectCategory): void {
    this.category = category;
    this.updatedAt = new Date();
  }

  // Proje etiketlerini güncelle
  updateTags(tags: string[]): void {
    this.tags = tags;
    this.updatedAt = new Date();
  }

  // Proje üyesi ekle
  addMember(userId: string, role: string): void {
    if (!this.members.some(member => member.userId === userId)) {
      this.members.push({ userId, role });
      this.updatedAt = new Date();
    }
  }

  // Proje üyesini kaldır
  removeMember(userId: string): void {
    this.members = this.members.filter(member => member.userId !== userId);
    this.updatedAt = new Date();
  }

  // Proje üyesinin rolünü güncelle
  updateMemberRole(userId: string, role: string): void {
    const memberIndex = this.members.findIndex(member => member.userId === userId);
    if (memberIndex !== -1) {
      this.members[memberIndex].role = role;
      this.updatedAt = new Date();
    }
  }

  // Proje yapılandırmasını güncelle
  updateConfig(config: Partial<IProject['config']>): void {
    this.config = { ...this.config, ...config };
    this.updatedAt = new Date();
  }

  // Projeyi JSON formatına dönüştür
  toJSON(): IProject {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority,
      category: this.category,
      tags: this.tags,
      members: this.members,
      config: this.config,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
