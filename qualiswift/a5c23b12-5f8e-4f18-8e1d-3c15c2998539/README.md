# OrangeHRM Login Tests with Playwright

This project contains Playwright TypeScript tests to verify the login functionality of the OrangeHRM web application.

## Setup Instructions

1. Ensure you have Node.js (version 14 or higher) installed.
2. Clone the repository (if applicable) or place the test files in your project directory.
3. Install dependencies by running:

   ```bash
   npm install @playwright/test
   ```

4. To run the tests:

   ```bash
   npx playwright test
   ```

## Configuration

- The tests use `process.env.BASE_URL` as the base URL for the application under test.

- Provide valid credentials via environment variables:
  - `ORANGEHRM_USERNAME` for the valid username (e.g., `Admin`)
  - `ORANGEHRM_PASSWORD` for the valid password (e.g., `admin123`)

Example to run with environment variables:

```bash
BASE_URL=https://opensource-demo.orangehrmlive.com npm test
ORANGEHRM_USERNAME=Admin ORANGEHRM_PASSWORD=admin123 npx playwright test
```

## Test Artifacts

- Screenshots, videos, and traces are captured on test failures.

## Tests Implemented

- 1. Verify login page UI elements are displayed
- 2. Successful login with valid credentials
- 3. Verify error message is displayed for invalid credentials

## Notes

- Exact error message texts are checked by visible text presence as in the UI.
- Tests assume the login page URL is at root `/web/index.php/auth/login`.
- Missing validation on trimming and input length is out of scope as per requirements.

## Run this approved package locally
From this package directory: `npm install`, then `npx playwright install chromium`, then `npm run validate` and `npm test`. Set BASE_URL and the credential/data environment aliases referenced by the source before running. Dependencies are pinned; commit the generated package-lock.json after installation. No Qualiswift framework licence is needed for these basic dependencies.
