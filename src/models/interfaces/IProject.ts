import { ProjectStatus, ProjectPriority, ProjectCategory, ProjectEnvironment } from '../enums/ProjectEnums';
import { BrowserType } from '../enums/TestEnums';

export interface IProject {
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
}
