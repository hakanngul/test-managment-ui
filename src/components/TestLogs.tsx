import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button, Divider } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import { TestLog, LogLevel } from '../services/websocket/types';

interface TestLogsProps {
  logs: TestLog[];
  onClearLogs: () => void;
}

/**
 * Test loglarını gösteren bileşen
 */
const TestLogs: React.FC<TestLogsProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState('');
  const [logLevel, setLogLevel] = useState<string>('all');
  const listRef = useRef<any>(null);
  
  // Logları filtrele
  const filteredLogs = logs.filter(log => {
    // Log seviyesine göre filtrele
    if (logLevel !== 'all' && log.level.toLowerCase() !== logLevel.toLowerCase()) {
      return false;
    }
    
    // Arama terimine göre filtrele
    if (filter && !log.message.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Yeni log geldiğinde otomatik olarak aşağı kaydır
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(filteredLogs.length - 1);
    }
  }, [filteredLogs.length]);
  
  // Log satırı bileşeni
  const LogRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const log = filteredLogs[index];
    return (
      <Box
        style={style}
        sx={{
          py: 0.5,
          px: 1,
          borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
          backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          color: 
            log.level === LogLevel.ERROR ? 'error.main' :
            log.level === LogLevel.WARNING ? 'warning.main' : 'inherit',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
          {new Date(log.timestamp).toLocaleTimeString()}
        </Box>
        <Box 
          component="span" 
          sx={{ 
            fontWeight: 'bold',
            color: 
              log.level === LogLevel.ERROR ? 'error.main' :
              log.level === LogLevel.WARNING ? 'warning.main' :
              log.level === LogLevel.INFO ? 'info.main' : 'text.primary',
            mr: 1
          }}
        >
          [{log.level}]
        </Box>
        <Box component="span">
          {log.message}
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Test Logları
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          color="secondary"
          onClick={onClearLogs}
        >
          Logları Temizle
        </Button>
      </Box>
      
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', gap: 2 }}>
        <TextField
          label="Loglarda Ara"
          variant="outlined"
          size="small"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Log Seviyesi</InputLabel>
          <Select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            label="Log Seviyesi"
          >
            <MenuItem value="all">Tüm Seviyeler</MenuItem>
            <MenuItem value="info">INFO</MenuItem>
            <MenuItem value="warning">WARNING</MenuItem>
            <MenuItem value="error">ERROR</MenuItem>
            <MenuItem value="debug">DEBUG</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {filteredLogs.length > 0 ? (
          <List
            ref={listRef}
            height={300}
            width="100%"
            itemCount={filteredLogs.length}
            itemSize={30}
          >
            {LogRow}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              {filter || logLevel !== 'all' ? 'Filtreye uygun log bulunamadı' : 'Henüz log yok'}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 1, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Toplam: {filteredLogs.length} log
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {filter || logLevel !== 'all' ? `Filtrelendi: ${filteredLogs.length}/${logs.length}` : ''}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TestLogs;
