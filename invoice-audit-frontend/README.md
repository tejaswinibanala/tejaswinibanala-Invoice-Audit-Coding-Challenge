# Pharmacy Invoice Audit – Frontend

A React + TypeScript app that uploads a pharmacy invoice (Excel), sends it to the backend for validation against a trusted reference list, and displays discrepancies in a clean, responsive dashboard.

## Features

- File upload (drag-and-drop or button) for `.xlsx`/`.xls`
- Sends file to backend and receives structured discrepancy data
- Dashboard sections for Unit Price, Formulation, Strength, and Payer discrepancies
- Summary totals and “Est. Overcharge” with professional upward-trend SVG icon
- Tailwind CSS styling, responsive UI, accessible semantics
- Dynamic page titles via custom `useTitle` hook

## Tech Stack

- React 18 + TypeScript (Create React App)
- Tailwind CSS
- HTTP: `fetch` (multipart/form-data)
- Testing: Jest + React Testing Library

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Install & Run
```bash
cd invoice-audit-frontend
npm install
npm start
# App runs at http://localhost:3000
```

Backend should be running at http://localhost:3001 (see backend README).

## Testing

```bash
# Run tests once
npm test -- --watchAll=false

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

- `src/setupTests.ts` configures the testing environment (adds `jest-dom`, mocks browser APIs like `matchMedia` and `ResizeObserver`). Keep this file for stable tests.
- Integration tests mock `fetch` and `useTitle` to simulate API responses and avoid side-effects.

## Project Structure

```
src/
├─ components/
│  ├─ FileUpload.tsx          # Upload UI, drag/drop, posts file to backend
│  └─ ResultsDashboard.tsx    # Dashboard that renders discrepancy sections
├─ hooks/
│  └─ useTitle.ts             # Sets and restores document title
├─ __tests__/                 # Frontend integration tests
│  └─ integration.test.tsx
├─ components/__tests__/      # Component tests
│  ├─ FileUpload.test.tsx
│  └─ ResultsDashboard.test.tsx
├─ testDataFactory.ts         # Dynamic test data (no hardcoded drugs)
├─ types.ts                   # Shared app types
├─ index.css                  # Tailwind base/styles
├─ index.tsx                  # React entry
└─ App.tsx                    # App shell, state, routing between pages
```

## How It Works

1. User selects or drops an Excel file in `FileUpload`.
2. Frontend POSTs to `POST http://localhost:3001/api/upload` with `FormData`.
3. Backend parses Excel, fetches reference list, validates discrepancies, returns JSON.
4. App renders `ResultsDashboard` with categorized results and totals.

## Conventions

- No Vite; CRA is used as requested.
- No `React.FC` usage; standard function components.
- Icons and headers match the provided design: `$` for Unit Price, pill/capsule for Formulation, warning triangle for Strength, users/group for Payer, upward-trend SVG for “Est. Overcharge”.
- Headers like “Drug Name” use normal case unless specified.

## Notes

- `coverage/` (if generated) isn’t required and can be deleted/ignored.
- The app relies on the backend endpoint and the MockAPI referenced there.

