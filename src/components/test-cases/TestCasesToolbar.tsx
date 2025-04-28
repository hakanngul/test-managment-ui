import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { TestCaseStatus, TestCasePriority, TestCaseCategory } from '../../models/interfaces/ITestCase';

interface TestCasesToolbarProps {
  selectedCount: number;
  selectedTestCases: string[]; // Seçili test case ID'leri
  onNewTestCase: () => void;
  onDeleteTestCases: () => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  filters: {
    status: TestCaseStatus[];
    priority: TestCasePriority[];
    category: TestCaseCategory[];
    automated: boolean | undefined;
    tags: string[];
  };
  onFilterChange: (filters: {
    status: TestCaseStatus[];
    priority: TestCasePriority[];
    category: TestCaseCategory[];
    automated: boolean | undefined;
    tags: string[];
  }) => void;
}

const TestCasesToolbar: React.FC<TestCasesToolbarProps> = ({
  selectedCount,
  selectedTestCases,
  onNewTestCase,
  onDeleteTestCases,
  onSearchChange,
  searchTerm,
  filters,
  onFilterChange
}) => {
  const navigate = useNavigate();
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);

  // Filtre menüsünü aç
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Filtre menüsünü kapat
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Durum filtresini güncelle
  const handleStatusFilterChange = (status: TestCaseStatus) => {
    const newStatus = [...filters.status];
    const index = newStatus.indexOf(status);

    if (index === -1) {
      newStatus.push(status);
    } else {
      newStatus.splice(index, 1);
    }

    const newFilters = { ...filters, status: newStatus };
    onFilterChange(newFilters);
    updateActiveFilterCount(newFilters);
  };

  // Öncelik filtresini güncelle
  const handlePriorityFilterChange = (priority: TestCasePriority) => {
    const newPriority = [...filters.priority];
    const index = newPriority.indexOf(priority);

    if (index === -1) {
      newPriority.push(priority);
    } else {
      newPriority.splice(index, 1);
    }

    const newFilters = { ...filters, priority: newPriority };
    onFilterChange(newFilters);
    updateActiveFilterCount(newFilters);
  };

  // Kategori filtresini güncelle
  const handleCategoryFilterChange = (category: TestCaseCategory) => {
    const newCategory = [...filters.category];
    const index = newCategory.indexOf(category);

    if (index === -1) {
      newCategory.push(category);
    } else {
      newCategory.splice(index, 1);
    }

    const newFilters = { ...filters, category: newCategory };
    onFilterChange(newFilters);
    updateActiveFilterCount(newFilters);
  };

  // Otomasyon filtresini güncelle
  const handleAutomatedFilterChange = (automated: boolean | undefined) => {
    const newFilters = { ...filters, automated };
    onFilterChange(newFilters);
    updateActiveFilterCount(newFilters);
  };

  // Aktif filtre sayısını güncelle
  const updateActiveFilterCount = (newFilters: typeof filters) => {
    let count = 0;
    if (newFilters.status.length > 0) count++;
    if (newFilters.priority.length > 0) count++;
    if (newFilters.category.length > 0) count++;
    if (newFilters.automated !== undefined) count++;
    if (newFilters.tags.length > 0) count++;
    setActiveFilterCount(count);
  };

  // Tüm filtreleri temizle
  const handleClearFilters = () => {
    const newFilters = {
      status: [],
      priority: [],
      category: [],
      automated: undefined,
      tags: []
    };
    onFilterChange(newFilters);
    setActiveFilterCount(0);
  };

  // Durum adını formatla
  const formatStatus = (status: TestCaseStatus): string => {
    switch (status) {
      case TestCaseStatus.ACTIVE: return 'Aktif';
      case TestCaseStatus.DRAFT: return 'Taslak';
      case TestCaseStatus.DEPRECATED: return 'Kullanım Dışı';
      case TestCaseStatus.ARCHIVED: return 'Arşivlenmiş';
      default: return status;
    }
  };

  // Öncelik adını formatla
  const formatPriority = (priority: TestCasePriority): string => {
    switch (priority) {
      case TestCasePriority.LOW: return 'Düşük';
      case TestCasePriority.MEDIUM: return 'Orta';
      case TestCasePriority.HIGH: return 'Yüksek';
      case TestCasePriority.CRITICAL: return 'Kritik';
      default: return priority;
    }
  };

  // Kategori adını formatla
  const formatCategory = (category: TestCaseCategory): string => {
    switch (category) {
      case TestCaseCategory.FUNCTIONAL: return 'Fonksiyonel';
      case TestCaseCategory.REGRESSION: return 'Regresyon';
      case TestCaseCategory.INTEGRATION: return 'Entegrasyon';
      case TestCaseCategory.PERFORMANCE: return 'Performans';
      case TestCaseCategory.SECURITY: return 'Güvenlik';
      case TestCaseCategory.USABILITY: return 'Kullanılabilirlik';
      case TestCaseCategory.ACCEPTANCE: return 'Kabul';
      case TestCaseCategory.SMOKE: return 'Smoke';
      case TestCaseCategory.EXPLORATORY: return 'Keşif';
      default: return category;
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedCount > 0 && {
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        })
      }}
    >
      <Box sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Sol Taraf: Seçim Bilgisi veya Arama/Filtre */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          mr: 2
        }}>
          {selectedCount > 0 ? (
            <Typography
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selectedCount} seçildi
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Test case ara..."
                size="small"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: searchTerm && (
                    <IconButton
                      size="small"
                      onClick={() => onSearchChange('')}
                      sx={{ p: 0.5 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )
                }}
              />

              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
                  {activeFilterCount > 0 && (
                    <Chip
                      label={`${activeFilterCount} filtre aktif`}
                      onDelete={handleClearFilters}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>

                <Tooltip title="Filtrele">
                  <IconButton onClick={handleFilterClick} size="small">
                    <FilterListIcon />
                    {activeFilterCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {activeFilterCount}
                      </Box>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>

        {/* Sağ Taraf: İşlem Butonları */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedCount > 0 ? (
            <>
              <Tooltip title="Sil">
                <IconButton onClick={onDeleteTestCases} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Düzenle">
                <IconButton
                  color="primary"
                  onClick={() => {
                    // Şimdilik alert gösterelim (gerçek uygulamada navigate kullanılacak)
                    alert(`Seçili test case'ler düzenleniyor...`);
                    // Tek bir test case seçiliyse düzenleme sayfasına yönlendir
                    if (selectedCount === 1) {
                      const selectedId = selectedTestCases[0];
                      // Şimdilik alert gösterelim (gerçek uygulamada navigate kullanılacak)
                      alert(`Test case ${selectedId} düzenleniyor...`);
                      // navigate(`/test-cases/${selectedId}/edit`);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/test-cases/new')}
              sx={{
                height: 40,
                px: 3,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              Yeni Test Case
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtre Menüsü */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: 250, maxHeight: 500 }
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Durum</Typography>
        </MenuItem>
        {Object.values(TestCaseStatus).map((status) => (
          <MenuItem key={status} onClick={() => handleStatusFilterChange(status)}>
            <Checkbox checked={filters.status.includes(status)} />
            <ListItemText primary={formatStatus(status)} />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem disabled>
          <Typography variant="subtitle2">Öncelik</Typography>
        </MenuItem>
        {Object.values(TestCasePriority).map((priority) => (
          <MenuItem key={priority} onClick={() => handlePriorityFilterChange(priority)}>
            <Checkbox checked={filters.priority.includes(priority)} />
            <ListItemText primary={formatPriority(priority)} />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem disabled>
          <Typography variant="subtitle2">Kategori</Typography>
        </MenuItem>
        {Object.values(TestCaseCategory).map((category) => (
          <MenuItem key={category} onClick={() => handleCategoryFilterChange(category)}>
            <Checkbox checked={filters.category.includes(category)} />
            <ListItemText primary={formatCategory(category)} />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem disabled>
          <Typography variant="subtitle2">Otomasyon</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAutomatedFilterChange(true)}>
          <Checkbox checked={filters.automated === true} />
          <ListItemText primary="Otomatize" />
        </MenuItem>
        <MenuItem onClick={() => handleAutomatedFilterChange(false)}>
          <Checkbox checked={filters.automated === false} />
          <ListItemText primary="Manuel" />
        </MenuItem>
        <MenuItem onClick={() => handleAutomatedFilterChange(undefined)}>
          <Checkbox checked={filters.automated === undefined} />
          <ListItemText primary="Tümü" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleClearFilters}>
          <Typography color="primary">Tüm filtreleri temizle</Typography>
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

export default TestCasesToolbar;
