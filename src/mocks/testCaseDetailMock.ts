import { TestCase } from '../types';

export const testCaseDetailMock: TestCase = {
  id: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
  title: 'Test Case 1',
  description: 'Description for Test Case 1',
  status: 'active',
  priority: 'medium',
  createdBy: 'John Doe',
  createdAt: '2023-04-28T01:03:00.000Z',
  updatedAt: '2023-04-28T01:03:00.000Z',
  tags: ['login', 'authentication', 'tag-0'],
  projectId: 'project-1',
  steps: [
    {
      id: 'step-1',
      order: 1,
      action: 'navigate',
      target: 'https://example.com',
      description: 'Navigate to example.com',
      expectedResult: 'Page loads successfully',
      type: 'automated'
    },
    {
      id: 'step-2',
      order: 2,
      action: 'click',
      target: '#login-button',
      description: 'Click on login button',
      expectedResult: 'Login form appears',
      type: 'automated'
    },
    {
      id: 'step-3',
      order: 3,
      action: 'type',
      target: '#username',
      value: 'testuser',
      description: 'Enter username',
      expectedResult: 'Username is entered in the field',
      type: 'automated'
    },
    {
      id: 'step-4',
      order: 4,
      action: 'type',
      target: '#password',
      value: 'password123',
      description: 'Enter password',
      expectedResult: 'Password is entered in the field',
      type: 'automated'
    },
    {
      id: 'step-5',
      order: 5,
      action: 'click',
      target: '#submit-button',
      description: 'Click submit button',
      expectedResult: 'User is logged in and redirected to dashboard',
      type: 'automated'
    }
  ]
};
