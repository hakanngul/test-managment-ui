export interface Comment {
    id: string;
    testCaseId: string;
    content: string;
    author: string;
    authorAvatar?: string;
    createdAt: Date;
    updatedAt?: Date;
  }