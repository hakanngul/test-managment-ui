// Ek dosya türleri
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

// Test ekleri mock verileri
export const mockAttachments: Record<string, Attachment[]> = {
  'tc-001': [
    {
      id: 'att-001',
      testCaseId: 'tc-001',
      name: 'screenshot-login.png',
      type: AttachmentType.IMAGE,
      url: 'https://via.placeholder.com/800x600.png?text=Login+Screenshot',
      size: 256000, // 250 KB
      uploadedBy: 'Hakan Gül',
      uploadedAt: new Date('2023-06-18T10:30:00'),
      description: 'Login sayfası ekran görüntüsü'
    },
    {
      id: 'att-002',
      testCaseId: 'tc-001',
      name: 'test-data.json',
      type: AttachmentType.CODE,
      url: 'https://example.com/test-data.json',
      size: 1024, // 1 KB
      uploadedBy: 'Ahmet Yılmaz',
      uploadedAt: new Date('2023-06-17T14:45:00'),
      description: 'Test verileri'
    },
    {
      id: 'att-003',
      testCaseId: 'tc-001',
      name: 'test-report.pdf',
      type: AttachmentType.PDF,
      url: 'https://example.com/test-report.pdf',
      size: 1048576, // 1 MB
      uploadedBy: 'Mehmet Demir',
      uploadedAt: new Date('2023-06-16T09:15:00'),
      description: 'Test raporu'
    },
    {
      id: 'att-004',
      testCaseId: 'tc-001',
      name: 'error-screenshot.png',
      type: AttachmentType.IMAGE,
      url: 'https://via.placeholder.com/800x600.png?text=Error+Screenshot',
      size: 307200, // 300 KB
      uploadedBy: 'Hakan Gül',
      uploadedAt: new Date('2023-06-15T16:20:00'),
      description: 'Hata ekran görüntüsü'
    },
    {
      id: 'att-005',
      testCaseId: 'tc-001',
      name: 'test-steps.docx',
      type: AttachmentType.DOCUMENT,
      url: 'https://example.com/test-steps.docx',
      size: 512000, // 500 KB
      uploadedBy: 'Ayşe Kaya',
      uploadedAt: new Date('2023-06-14T11:30:00'),
      description: 'Test adımları dokümanı'
    }
  ],
  'tc-002': [
    {
      id: 'att-006',
      testCaseId: 'tc-002',
      name: 'dashboard-screenshot.png',
      type: AttachmentType.IMAGE,
      url: 'https://via.placeholder.com/800x600.png?text=Dashboard+Screenshot',
      size: 204800, // 200 KB
      uploadedBy: 'Hakan Gül',
      uploadedAt: new Date('2023-06-17T11:30:00'),
      description: 'Dashboard sayfası ekran görüntüsü'
    }
  ],
  'tc-003': [
    {
      id: 'att-007',
      testCaseId: 'tc-003',
      name: 'api-response.json',
      type: AttachmentType.CODE,
      url: 'https://example.com/api-response.json',
      size: 2048, // 2 KB
      uploadedBy: 'Mehmet Demir',
      uploadedAt: new Date('2023-06-16T13:45:00'),
      description: 'API yanıtı'
    }
  ]
};
