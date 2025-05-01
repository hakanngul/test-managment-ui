
export enum AttachmentType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  CODE = 'code',
  PDF = 'pdf',
  OTHER = 'other'
}

// Ek dosya arayüzü
export interface Attachment {
  id: string;
  testCaseId: string;
  name: string;
  type: AttachmentType;
  url: string;
  size: number; // byte cinsinden
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}