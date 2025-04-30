import React from 'react';
import { Chip } from '@mui/material';
import { Speed as SpeedIcon, WifiOff as WifiOffIcon } from '@mui/icons-material';

interface ConnectionStatusChipProps {
  connected: boolean;
  liveLabel?: string;
  disconnectedLabel?: string;
  size?: 'small' | 'medium';
  height?: number;
}

/**
 * WebSocket bağlantı durumunu gösteren Chip bileşeni
 * @param connected Bağlantı durumu
 * @param liveLabel Bağlantı varken gösterilecek etiket
 * @param disconnectedLabel Bağlantı yokken gösterilecek etiket
 * @param size Chip boyutu
 * @param height Chip yüksekliği
 */
const ConnectionStatusChip: React.FC<ConnectionStatusChipProps> = ({
  connected,
  liveLabel = 'Canlı',
  disconnectedLabel = 'Bağlantı Yok',
  size = 'small',
  height = 24
}) => {
  return connected ? (
    <Chip
      label={liveLabel}
      color="success"
      size={size}
      icon={<SpeedIcon />}
      sx={{ height }}
    />
  ) : (
    <Chip
      label={disconnectedLabel}
      color="error"
      size={size}
      icon={<WifiOffIcon />}
      sx={{ height }}
    />
  );
};

export default ConnectionStatusChip;
