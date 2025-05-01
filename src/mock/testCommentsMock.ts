// Yorum arayüzü

// Test yorumları mock verileri
export const mockComments: Record<string, Comment[]> = {
  'tc-001': [
    {
      id: 'comment-001',
      testCaseId: 'tc-001',
      content: 'Bu test case, login işleminin tüm senaryolarını kapsamıyor. Hatalı şifre girişi durumunu da eklemeliyiz.',
      author: 'Hakan Gül',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2023-06-18T10:30:00')
    },
    {
      id: 'comment-002',
      testCaseId: 'tc-001',
      content: 'Haklısın, hatalı şifre senaryosunu da ekleyelim. Ayrıca şifre sıfırlama akışını da test etmeliyiz.',
      author: 'Ahmet Yılmaz',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      createdAt: new Date('2023-06-18T11:15:00')
    },
    {
      id: 'comment-003',
      testCaseId: 'tc-001',
      content: 'Test adımlarını güncelledim. Şimdi hem hatalı şifre hem de şifre sıfırlama senaryolarını içeriyor.',
      author: 'Hakan Gül',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2023-06-18T14:45:00')
    }
  ],
  'tc-002': [
    {
      id: 'comment-004',
      testCaseId: 'tc-002',
      content: 'Bu test case için daha fazla doğrulama adımı eklemeliyiz.',
      author: 'Mehmet Demir',
      authorAvatar: 'https://i.pravatar.cc/150?img=3',
      createdAt: new Date('2023-06-17T09:30:00')
    }
  ],
  'tc-003': [
    {
      id: 'comment-005',
      testCaseId: 'tc-003',
      content: 'API yanıtlarını daha detaylı kontrol etmeliyiz.',
      author: 'Ayşe Kaya',
      authorAvatar: 'https://i.pravatar.cc/150?img=4',
      createdAt: new Date('2023-06-16T15:20:00')
    },
    {
      id: 'comment-006',
      testCaseId: 'tc-003',
      content: 'Performans metrikleri de ekleyelim.',
      author: 'Hakan Gül',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2023-06-16T16:45:00'),
      updatedAt: new Date('2023-06-16T17:00:00')
    }
  ]
};
