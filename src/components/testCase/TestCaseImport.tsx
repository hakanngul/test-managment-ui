import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Upload as UploadIcon,
  ContentPaste as PasteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { TestCase } from '../../types';

interface TestCaseImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (testCase: Partial<TestCase>) => void;
}

const TestCaseImport: React.FC<TestCaseImportProps> = ({ open, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importMethod, setImportMethod] = useState<'paste' | 'upload'>('paste');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        setError(null);
      } catch (err) {
        setError('Dosya okunamadı. Lütfen geçerli bir JSON dosyası seçin.');
      }
    };
    reader.onerror = () => {
      setError('Dosya okunamadı. Lütfen geçerli bir JSON dosyası seçin.');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      if (!jsonText.trim()) {
        setError('Lütfen geçerli bir JSON metni girin veya dosya yükleyin.');
        return;
      }

      const parsedData = JSON.parse(jsonText);
      
      // Temel doğrulama
      if (!parsedData.title) {
        setError('Geçersiz test case formatı. "title" alanı eksik.');
        return;
      }

      if (!parsedData.steps || !Array.isArray(parsedData.steps)) {
        setError('Geçersiz test case formatı. "steps" alanı eksik veya dizi değil.');
        return;
      }

      // ID'yi kaldır, yeni bir test case oluşturulacak
      const { id, _id, ...testCaseData } = parsedData;
      
      // Zaman damgalarını güncelle
      const now = new Date().toISOString();
      testCaseData.createdAt = now;
      testCaseData.updatedAt = now;
      
      onImport(testCaseData);
      onClose();
      
      // Formu temizle
      setJsonText('');
      setError(null);
    } catch (err) {
      setError('JSON ayrıştırma hatası. Lütfen geçerli bir JSON formatı girin.');
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSwitchMethod = (method: 'paste' | 'upload') => {
    setImportMethod(method);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Test Case İçe Aktar
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        <DialogContentText sx={{ mb: 2 }}>
          Mevcut bir test case'i JSON formatında içe aktarın. Test case'i kopyala-yapıştır ile ekleyebilir veya bir JSON dosyası yükleyebilirsiniz.
        </DialogContentText>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Button
            variant={importMethod === 'paste' ? 'contained' : 'outlined'}
            startIcon={<PasteIcon />}
            onClick={() => handleSwitchMethod('paste')}
            sx={{ mr: 1 }}
          >
            Kopyala-Yapıştır
          </Button>
          <Button
            variant={importMethod === 'upload' ? 'contained' : 'outlined'}
            startIcon={<UploadIcon />}
            onClick={() => handleSwitchMethod('upload')}
          >
            Dosya Yükle
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {importMethod === 'paste' ? (
          <TextField
            label="JSON Metni"
            multiline
            rows={12}
            fullWidth
            value={jsonText}
            onChange={handleTextChange}
            placeholder='{"title": "Test Case Başlığı", "description": "Açıklama", "steps": [...]}'
            variant="outlined"
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />
        ) : (
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={handleClickUpload}
            >
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                JSON Dosyası Yükle
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dosyayı seçmek için tıklayın veya sürükleyip bırakın
              </Typography>
            </Paper>
            
            {jsonText && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Yüklenen JSON:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  {jsonText}
                </Paper>
              </Box>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Örnek Format:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: '150px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              bgcolor: 'background.default',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {`{
  "title": "Kullanıcı Girişi Testi",
  "description": "Kullanıcının sisteme başarılı bir şekilde giriş yapabildiğini doğrulayan test.",
  "status": "active",
  "priority": "high",
  "tags": ["login", "authentication"],
  "steps": [
    {
      "order": 1,
      "action": "navigate",
      "target": "",
      "value": "https://example.com/login",
      "description": "Login sayfasına git",
      "expectedResult": "Login sayfası yüklenmeli",
      "type": "automated"
    }
  ]
}`}
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button 
          onClick={handleImport} 
          variant="contained" 
          color="primary"
          disabled={!jsonText.trim()}
        >
          İçe Aktar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestCaseImport;
