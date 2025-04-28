import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Image as ImageIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Ek dosya türleri
enum AttachmentType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  CODE = 'code',
  PDF = 'pdf',
  OTHER = 'other'
}

// Ek dosya arayüzü
interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  url: string;
  size: number; // byte cinsinden
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

interface TestAttachmentsProps {
  testCaseId: string;
}

const TestAttachments: React.FC<TestAttachmentsProps> = ({ testCaseId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    // API'den veri çekme simülasyonu
    const fetchAttachments = async () => {
      setIsLoading(true);
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        setTimeout(() => {
          // Mock veri
          const mockAttachments: Attachment[] = [
            {
              id: 'att-001',
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
              name: 'test-steps.docx',
              type: AttachmentType.DOCUMENT,
              url: 'https://example.com/test-steps.docx',
              size: 512000, // 500 KB
              uploadedBy: 'Ayşe Kaya',
              uploadedAt: new Date('2023-06-14T11:30:00'),
              description: 'Test adımları dokümanı'
            }
          ];
          
          setAttachments(mockAttachments);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Ekler yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    fetchAttachments();
  }, [testCaseId]);

  // Dosya türüne göre ikon belirle
  const getAttachmentIcon = (type: AttachmentType) => {
    switch (type) {
      case AttachmentType.IMAGE:
        return <ImageIcon />;
      case AttachmentType.DOCUMENT:
        return <DescriptionIcon />;
      case AttachmentType.CODE:
        return <CodeIcon />;
      case AttachmentType.PDF:
        return <PdfIcon />;
      case AttachmentType.OTHER:
      default:
        return <FileIcon />;
    }
  };

  // Dosya boyutunu formatla
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1048576) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1073741824) {
      return `${(bytes / 1048576).toFixed(1)} MB`;
    } else {
      return `${(bytes / 1073741824).toFixed(1)} GB`;
    }
  };

  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Eki önizle
  const handlePreview = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setPreviewOpen(true);
  };

  // Önizleme modalını kapat
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedAttachment(null);
  };

  // Eki indir
  const handleDownload = (attachment: Attachment) => {
    // Gerçek uygulamada burada indirme işlemi yapılacak
    console.log(`İndiriliyor: ${attachment.name}`);
    alert(`${attachment.name} indiriliyor...`);
  };

  // Eki sil
  const handleDelete = (attachment: Attachment) => {
    // Gerçek uygulamada burada silme işlemi yapılacak
    console.log(`Siliniyor: ${attachment.name}`);
    setAttachments(attachments.filter(a => a.id !== attachment.id));
  };

  // Yeni ek ekle
  const handleAddAttachment = () => {
    // Gerçek uygulamada burada dosya yükleme modalı açılacak
    console.log('Yeni ek ekleniyor...');
    alert('Yeni ek ekleme özelliği henüz uygulanmadı.');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Ekler
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddAttachment}
        >
          Yeni Ek Ekle
        </Button>
      </Box>
      
      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Bu test case için henüz ek bulunmuyor.
        </Typography>
      ) : (
        <List>
          {attachments.map((attachment) => (
            <Card key={attachment.id} variant="outlined" sx={{ mb: 2 }}>
              <ListItem>
                <ListItemIcon>
                  {getAttachmentIcon(attachment.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={attachment.name}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" component="span" color="text.secondary">
                        {formatFileSize(attachment.size)} • Yükleyen: {attachment.uploadedBy} • {formatDate(attachment.uploadedAt)}
                      </Typography>
                      {attachment.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {attachment.description}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
                
                <ListItemSecondaryAction>
                  {attachment.type === AttachmentType.IMAGE && (
                    <IconButton edge="end" onClick={() => handlePreview(attachment)}>
                      <ImageIcon />
                    </IconButton>
                  )}
                  <IconButton edge="end" onClick={() => handleDownload(attachment)}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(attachment)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      )}
      
      {/* Önizleme Modalı */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAttachment?.name}
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedAttachment?.type === AttachmentType.IMAGE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img 
                src={selectedAttachment.url} 
                alt={selectedAttachment.name} 
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TestAttachments;
