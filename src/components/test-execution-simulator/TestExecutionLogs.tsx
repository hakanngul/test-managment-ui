import React, { useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface TestExecutionLogsProps {
  logs: string[];
  onClearLogs: () => void;
}

const TestExecutionLogs: React.FC<TestExecutionLogsProps> = ({
  logs,
  onClearLogs
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Loglar güncellendiğinde otomatik olarak en alta kaydır
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Logları kopyala
  const handleCopyLogs = () => {
    const logText = logs.join('\n');
    navigator.clipboard.writeText(logText);
  };

  // Logları indir
  const handleDownloadLogs = () => {
    const logText = logs.join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-execution-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Log satırının türüne göre renk belirle
  const getLogColor = (log: string) => {
    if (log.includes('[ERROR]')) return 'error.main';
    if (log.includes('[WARNING]')) return 'warning.main';
    if (log.includes('[INFO]')) return 'text.primary';
    return 'text.secondary';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{
        p: 2,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="h6" fontWeight="medium">
            Test Logları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Test çalıştırma sırasında oluşturulan loglar
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Logları Kopyala">
            <IconButton onClick={handleCopyLogs} size="small" sx={{ ml: 0.5 }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logları İndir">
            <IconButton onClick={handleDownloadLogs} size="small" sx={{ ml: 0.5 }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logları Temizle">
            <IconButton onClick={onClearLogs} size="small" color="error" sx={{ ml: 0.5 }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: '#1E1E1E',
          fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
          fontSize: '0.8rem',
          position: 'relative',
          height: '100%'
        }}
      >
        {logs.length > 0 ? (
          <Box sx={{ p: 2 }}>
            {logs.map((log, index) => (
              <Box
                key={index}
                sx={{
                  color: getLogColor(log),
                  py: 0.25,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  lineHeight: 1.5,
                  fontWeight: log.includes('[ERROR]') ? 'bold' : 'normal',
                  borderLeft: log.includes('[ERROR]') ? '3px solid #f44336' :
                             log.includes('[WARNING]') ? '3px solid #ff9800' : 'none',
                  pl: log.includes('[ERROR]') || log.includes('[WARNING]') ? 1 : 0,
                  mb: 0.5
                }}
              >
                {log}
              </Box>
            ))}
            <div ref={logsEndRef} />
          </Box>
        ) : (
          <Box
            sx={{
              color: 'grey.500',
              textAlign: 'center',
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Box sx={{ opacity: 0.5, mb: 2 }}>
              <ClearIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
              Henüz log kaydı yok
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'inherit', mt: 1 }}>
              Test çalıştırıldığında loglar burada görüntülenecek
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TestExecutionLogs;
