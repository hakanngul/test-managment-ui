import React from 'react';
import { Tabs, Tab } from '@mui/material';

interface TestCaseDetailTabsProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TestCaseDetailTabs: React.FC<TestCaseDetailTabsProps> = ({
  tabValue,
  onTabChange
}) => {
  return (
    <Tabs
      value={tabValue}
      onChange={onTabChange}
      sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab label="Details" />
      <Tab label="Test Steps" />
      <Tab label="History" />
      <Tab label="Related Issues" />
    </Tabs>
  );
};

export default TestCaseDetailTabs;
