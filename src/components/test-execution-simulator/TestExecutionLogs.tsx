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

  // Log satırının türüne göre renk ve stil belirle
  const getLogStyle = (log: string) => {
    // Zaman damgasını ve log türünü ayır
    const timeStampMatch = log.match(/^(\d{2}:\d{2}:\d{2})/);
    const logTypeMatch = log.match(/\[(INFO|ERROR|WARNING)\]/);

    const timeStamp = timeStampMatch ? timeStampMatch[1] : '';
    const logType = logTypeMatch ? logTypeMatch[1] : '';
    const logContent = log.replace(/^\d{2}:\d{2}:\d{2}\s+\[(INFO|ERROR|WARNING)\]\s*/, '');

    // Log türüne göre renk belirle
    let color = '#A9B7C6'; // Varsayılan renk
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    let fontWeight = 'normal';

    if (logType === 'ERROR') {
      color = '#FF5252';
      backgroundColor = 'rgba(255, 82, 82, 0.1)';
      borderColor = '#FF5252';
      fontWeight = 'bold';
    } else if (logType === 'WARNING') {
      color = '#FFC107';
      backgroundColor = 'rgba(255, 193, 7, 0.1)';
      borderColor = '#FFC107';
    } else if (logType === 'INFO') {
      color = '#64B5F6';
    }

    return {
      color,
      backgroundColor,
      borderColor,
      fontWeight,
      timeStamp,
      logType,
      logContent
    };
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '500px', // Sabit yükseklik
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
          fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: '0.85rem',
          position: 'relative',
          height: 'calc(100% - 80px)', // Header yüksekliğini çıkararak
          borderRadius: 0
        }}
      >
        {logs.length > 0 ? (
          <Box sx={{ p: 1 }}>
            {logs.map((log, index) => {
              const logStyle = getLogStyle(log);

              return (
                <Box
                  key={index}
                  sx={{
                    py: 0.5,
                    px: 1,
                    mb: 0.5,
                    borderRadius: '4px',
                    backgroundColor: logStyle.backgroundColor,
                    borderLeft: `3px solid ${logStyle.borderColor}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    {/* Zaman Damgası */}
                    <Box
                      component="span"
                      sx={{
                        color: '#607D8B',
                        mr: 1.5,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        minWidth: '70px'
                      }}
                    >
                      {logStyle.timeStamp}
                    </Box>

                    {/* Log Türü */}
                    {logStyle.logType && (
                      <Box
                        component="span"
                        sx={{
                          color: logStyle.color,
                          backgroundColor: logStyle.backgroundColor ? 'rgba(0,0,0,0.2)' : 'transparent',
                          px: 1,
                          py: 0.2,
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          mr: 1.5,
                          minWidth: '60px',
                          textAlign: 'center'
                        }}
                      >
                        {logStyle.logType}
                      </Box>
                    )}
                  </Box>

                  {/* Log İçeriği */}
                  <Box
                    sx={{
                      color: logStyle.color,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.5,
                      fontWeight: logStyle.fontWeight,
                      pl: 2
                    }}
                  >
                    {logStyle.logContent}
                  </Box>
                </Box>
              );
            })}
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
            <Typography variant="body2" sx={{ fontFamily: 'inherit', color: '#A9B7C6' }}>
              Henüz log kaydı yok
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'inherit', mt: 1, color: '#607D8B' }}>
              Test çalıştırıldığında loglar burada görüntülenecek
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TestExecutionLogs;
