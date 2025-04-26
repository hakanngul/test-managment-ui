// Helper functions for generating realistic test data
export function getFeatureDescription(feature: string): string {
  switch (feature) {
    case 'Authentication': return 'log in, register, and reset passwords';
    case 'Search': return 'find products, filter results, and sort listings';
    case 'Checkout': return 'add items to cart, enter payment details, and complete purchases';
    case 'User Profile': return 'view and edit personal information, manage preferences, and track orders';
    case 'Admin Panel': return 'manage users, view reports, and configure system settings';
    case 'Reporting': return 'generate reports, export data, and visualize metrics';
    case 'Notifications': return 'receive alerts, manage notification preferences, and view message history';
    default: return 'use core application features';
  }
}

export function getStepDescription(feature: string, stepIndex: number): string {
  const steps: Record<string, string[]> = {
    'Authentication': [
      'Navigate to the login page',
      'Enter valid credentials',
      'Click the login button',
      'Verify user is redirected to dashboard',
      'Check that user-specific content is displayed'
    ],
    'Search': [
      'Navigate to the search page',
      'Enter search criteria',
      'Apply filters',
      'Sort results',
      'Verify correct items are displayed'
    ],
    'Checkout': [
      'Add items to cart',
      'Proceed to checkout',
      'Enter shipping information',
      'Enter payment details',
      'Complete purchase'
    ],
    'User Profile': [
      'Navigate to profile page',
      'Edit personal information',
      'Save changes',
      'Verify changes are persisted',
      'Log out and log back in to confirm'
    ],
    'Admin Panel': [
      'Log in as admin',
      'Navigate to user management',
      'Create a new user',
      'Edit user permissions',
      'Verify changes take effect'
    ],
    'Reporting': [
      'Navigate to reports section',
      'Select report parameters',
      'Generate report',
      'Export data',
      'Verify exported data matches displayed data'
    ],
    'Notifications': [
      'Trigger a notification event',
      'Verify notification appears',
      'Click on notification',
      'Verify redirection to correct page',
      'Mark notification as read'
    ]
  };

  const defaultSteps = [
    'Navigate to the feature',
    'Interact with the UI element',
    'Verify expected behavior',
    'Test edge cases',
    'Clean up test data'
  ];

  const featureSteps = steps[feature] || defaultSteps;
  return featureSteps[stepIndex % featureSteps.length];
}

export function getExpectedResult(feature: string, stepIndex: number): string {
  const results: Record<string, string[]> = {
    'Authentication': [
      'Login page is displayed with username and password fields',
      'Credentials are accepted without errors',
      'System processes the login request',
      'Dashboard page is loaded with user-specific data',
      'User name appears in the header and personalized content is visible'
    ],
    'Search': [
      'Search interface is displayed with all filter options',
      'Search query is processed without errors',
      'Filter options are applied to the results',
      'Results are reordered according to sort criteria',
      'Only items matching search criteria are displayed'
    ],
    'Checkout': [
      'Items are added to cart with correct quantities and prices',
      'Checkout page displays with order summary',
      'Shipping form accepts and validates the information',
      'Payment form accepts and validates the information',
      'Order confirmation page is displayed with order number'
    ],
    'User Profile': [
      'Profile page loads with current user information',
      'Form accepts new information without validation errors',
      'System displays success message after saving',
      'Profile page shows updated information',
      'Updated information persists across sessions'
    ],
    'Admin Panel': [
      'Admin dashboard loads with all management options',
      'User management interface displays with list of users',
      'New user form accepts and validates information',
      'Permission editor saves changes successfully',
      'User can access features according to assigned permissions'
    ],
    'Reporting': [
      'Report interface loads with all parameter options',
      'Parameter form accepts valid inputs',
      'Report is generated and displayed correctly',
      'Data is exported in the selected format',
      'Exported data contains all displayed information'
    ],
    'Notifications': [
      'System creates the notification correctly',
      'Notification appears in the notification center',
      'System registers the click event',
      'Related content page is loaded',
      'Notification is marked as read and removed from unread list'
    ]
  };

  const defaultResults = [
    'Feature page loads correctly',
    'System responds to the interaction',
    'System state changes as expected',
    'System handles edge cases gracefully',
    'System returns to initial state'
  ];

  const featureResults = results[feature] || defaultResults;
  return featureResults[stepIndex % featureResults.length];
}

export function getPrerequisites(feature: string): string {
  switch (feature) {
    case 'Authentication': return 'Valid user credentials must exist in the system';
    case 'Search': return 'Product catalog must be populated with searchable items';
    case 'Checkout': return 'User must be logged in with items in cart and valid payment method';
    case 'User Profile': return 'User account must exist with editable profile information';
    case 'Admin Panel': return 'Admin user with appropriate permissions must exist';
    case 'Reporting': return 'System must have data available for reporting period';
    case 'Notifications': return 'Notification system must be enabled and configured';
    default: return 'Application must be deployed and accessible';
  }
}

// Helper functions for UI
export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'passed': return 'success';
    case 'failed': return 'error';
    case 'pending': return 'warning';
    case 'blocked': return 'default';
    case 'completed': return 'success';
    case 'running': return 'info';
    case 'queued': return 'warning';
    case 'cancelled': return 'default';
    case 'active': return 'success';
    case 'draft': return 'warning';
    case 'archived': return 'default';
    case 'available': return 'success';
    case 'busy': return 'warning';
    case 'offline': return 'error';
    default: return 'default';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
}

export function formatDate(dateString: string | null) {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
