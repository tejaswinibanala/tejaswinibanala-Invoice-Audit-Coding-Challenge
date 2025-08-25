# Testing Documentation

This document outlines the comprehensive testing strategy for the Pharmacy Data Discrepancy Analysis application.

## Overview

The application uses Jest as the primary testing framework with:
- **Frontend**: React Testing Library for component testing
- **Backend**: Supertest for API integration testing

## Test Structure

```
├── invoice-audit-frontend/
│   ├── src/
│   │   ├── components/__tests__/
│   │   │   ├── ResultsDashboard.test.tsx    # Component unit tests
│   │   │   └── FileUpload.test.tsx          # Component unit tests
│   │   └── __tests__/
│   │       └── integration.test.tsx         # Integration tests
│   └── jest.config.js                       # Jest configuration
├── invoice-audit-backend/
│   ├── src/__tests__/
│   │   ├── validationService.test.ts        # Business logic unit tests
│   │   ├── integration.test.ts              # API integration tests
│   │   └── setup.ts                         # Test setup
│   └── jest.config.js                       # Jest configuration
└── TESTING.md                               # This file
```

## Running Tests

### Frontend Tests

```bash
cd invoice-audit-frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Backend Tests

```bash
cd invoice-audit-backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## Test Categories

### 1. Frontend Unit Tests

#### ResultsDashboard Component
- **Component Rendering**: Verifies component renders without crashing
- **Summary Display**: Tests summary card information display
- **Table Rendering**: Validates all discrepancy tables render correctly
- **Data Formatting**: Tests currency and percentage formatting
- **User Interactions**: Tests reset button functionality
- **Edge Cases**: Handles empty data and mixed data types

#### FileUpload Component
- **File Selection**: Tests file input handling
- **Drag & Drop**: Validates drag and drop functionality
- **File Validation**: Tests file type and size validation
- **Upload Process**: Tests file upload workflow
- **Error Handling**: Tests various error scenarios
- **User Experience**: Tests loading states and feedback

### 2. Frontend Integration Tests

#### Complete User Workflow
- **File Upload to Results**: End-to-end workflow testing
- **State Management**: Component state preservation
- **API Integration**: Mocked backend communication
- **Error Recovery**: Network and API error handling
- **Performance**: Loading states and user feedback

### 3. Backend Unit Tests

#### Validation Service
- **Price Discrepancy Logic**: >10% overcharge validation
- **Formulation Matching**: Ignores packaging details in brackets
- **Strength Normalization**: Removes units, spaces, commas
- **Payer Matching**: Case-insensitive space removal
- **Summary Calculations**: Correct totals and overcharge amounts
- **Edge Cases**: Unknown drugs, empty data

### 4. Backend Integration Tests

#### API Endpoints
- **Health Check**: `/health` endpoint validation
- **File Upload**: `/api/upload` endpoint testing
- **Error Handling**: Various error scenarios
- **End-to-End Workflow**: Complete Excel processing pipeline

## Test Data

### Mock Discrepancy Data
```typescript
const mockDiscrepancies: DiscrepancyData = {
  priceDiscrepancies: [
    {
      drugName: 'Aspirin',
      recordedValue: 0.55,
      expectedValue: 0.45,
      discrepancyType: 'price',
      overcharge: 0.10,
      percentage: 22.22
    }
  ],
  // ... other discrepancy types
  summary: {
    totalPriceDiscrepancies: 1,
    totalFormulationIssues: 0,
    totalStrengthErrors: 0,
    totalPayerMismatches: 0,
    totalIssues: 1,
    totalOvercharge: 0.10
  }
};
```

### Mock Reference Drugs
```typescript
const mockReferenceDrugs: ReferenceDrug[] = [
  {
    id: 1,
    drugName: 'Aspirin',
    unitPrice: 0.50,
    standardUnitPrice: 0.45,
    formulation: 'Tablet',
    strength: '100mg',
    payer: 'Medicare'
  }
];
```

## Business Logic Testing

### Price Discrepancy Validation
- ✅ **>10% Overcharge**: Flags discrepancies above threshold
- ✅ **≤10% Overcharge**: Ignores acceptable variations
- ✅ **Percentage Calculation**: Accurate overcharge percentages
- ✅ **Currency Formatting**: Proper dollar sign display

### Formulation Discrepancy Validation
- ✅ **Packaging Ignored**: `Tablet (10mL)` matches `Tablet`
- ✅ **Core Mismatch**: `Capsule` vs `Tablet` flagged
- ✅ **Case Insensitive**: Handles mixed case variations

### Strength Discrepancy Validation
- ✅ **Unit Removal**: `100mg` vs `100` matches
- ✅ **Comma Handling**: `10,000 IU` vs `10000 IU` matches
- ✅ **Slash Normalization**: `5/325mg` vs `5mg/325mg` matches
- ✅ **Space Removal**: `100 mg` vs `100mg` matches

### Payer Discrepancy Validation
- ✅ **Space Normalization**: `Medi Care` vs `Medicare` matches
- ✅ **Case Insensitive**: `BLUE CROSS` vs `Blue Cross` matches
- ✅ **Exact Mismatch**: Different payers flagged correctly

## Test Coverage Goals

- **Frontend Components**: >90% coverage
- **Business Logic**: >95% coverage
- **API Endpoints**: >90% coverage
- **Error Handling**: >85% coverage

## Mocking Strategy

### Frontend Mocks
- **useTitle Hook**: Prevents document title changes during tests
- **Axios**: Mocks API calls for integration testing
- **File API**: Mocks file upload functionality

### Backend Mocks
- **External Services**: Mocks MockAPI calls
- **File System**: Mocks Excel file processing
- **Console Methods**: Reduces test noise

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd invoice-audit-frontend && npm ci
          cd ../invoice-audit-backend && npm ci
      - name: Run frontend tests
        run: cd invoice-audit-frontend && npm run test:ci
      - name: Run backend tests
        run: cd invoice-audit-backend && npm run test:ci
```

## Best Practices

### Test Organization
- Use descriptive test names with `describe` and `it` blocks
- Group related tests logically
- Test both happy path and edge cases
- Mock external dependencies consistently

### Assertions
- Test one concept per test
- Use specific assertions (`toBe`, `toHaveLength`, etc.)
- Verify both positive and negative cases
- Test error conditions and recovery

### Performance
- Keep tests fast and focused
- Use `beforeEach` for setup, `afterEach` for cleanup
- Mock heavy operations (API calls, file I/O)
- Avoid testing implementation details

## Troubleshooting

### Common Issues

1. **Test Environment**: Ensure `jsdom` is configured for React tests
2. **Mock Imports**: Verify mock paths match actual import paths
3. **Async Operations**: Use `waitFor` for asynchronous assertions
4. **File Mocks**: Ensure file mock configurations are correct

### Debug Commands
```bash
# Run specific test file
npm test -- --testPathPattern=ResultsDashboard

# Run tests with verbose output
npm test -- --verbose

# Run tests in debug mode
npm test -- --detectOpenHandles
```

## Future Enhancements

- **Visual Regression Testing**: Screenshot comparison tests
- **Performance Testing**: Load testing for API endpoints
- **Accessibility Testing**: Automated a11y compliance checks
- **Cross-browser Testing**: Browser compatibility validation
