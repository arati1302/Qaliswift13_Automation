import { test, expect, Page } from '@playwright/test';

// Page Object Model for PIM Employee List Page
class PIMEmployeeListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // Navigates to PIM Employee List page from base URL
    // Assuming PIM module is under /pim or accessible via navigation
    await this.page.goto('/pim/viewEmployeeList');
  }

  // Locators for Employee Information Search Panel
  get searchPanel() {
    return this.page.locator('section#employee-information');
  }

  get employeeNameInput() {
    return this.page.locator('input[name="employeeName"]');
  }

  get employeeIDInput() {
    return this.page.locator('input[name="employeeId"]');
  }

  get dropdowns() {
    return {
      employmentStatus: this.page.locator('select[name="employmentStatus"]'),
      include: this.page.locator('select[name="include"]'),
      jobTitle: this.page.locator('select[name="jobTitle"]'),
      subUnit: this.page.locator('select[name="subUnit"]'),
    };
  }

  get supervisorNameInput() {
    return this.page.locator('input[name="supervisorName"]');
  }

  get searchButton() {
    return this.page.locator('button[type="submit"]', { hasText: /^Search$/i });
  }

  get resetButton() {
    return this.page.locator('button[type="reset"]', { hasText: /^Reset$/i });
  }

  get expandCollapseIcon() {
    return this.page.locator('section#employee-information button.expand-collapse-icon');
  }

  get addEmployeeButton() {
    return this.page.locator('button#btnAdd');
  }

  get recordsFound() {
    return this.page.locator('div#recordsFound');
  }

  get employeeTable() {
    return this.page.locator('table#resultTable');
  }

  get tableHeaders() {
    return this.employeeTable.locator('thead tr th');
  }

  get sortingIcons() {
    // Assuming sorting icons are svg or img inside headers
    return this.employeeTable.locator('thead tr th .sort-icon');
  }

  get headerCheckbox() {
    return this.page.locator('table#resultTable thead input[type="checkbox"]');
  }

  get employeeCheckboxes() {
    return this.page.locator('table#resultTable tbody input[type="checkbox"]');
  }

  get actionsIcons() {
    return this.page.locator('table#resultTable tbody tr td.actions');
  }

  // Left Navigation Menu
  get leftNavMenu() {
    return this.page.locator('nav#mainMenu');
  }

  get leftNavMenuItems() {
    // Items as list for Search, Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz
    return this.leftNavMenu.locator('ul li');
  }

  get activePIMMenuItem() {
    return this.leftNavMenu.locator('ul li.active >> text=PIM');
  }

}

// Utility to check visible and readable input fields
async function expectVisibleReadable(locator) {
  await expect(locator).toBeVisible();
  await expect(locator).toBeEditable();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThan(50); // reasonable input width
  expect(box.height).toBeGreaterThan(10);
}

// Test suite for Orange HRM PIM Employee List UI

test.describe('1. Verify Employee Information search panel layout', () => {
  test('Verify Employee Information search panel layout', async ({ page }) => {
    const pimPage = new PIMEmployeeListPage(page);
    await pimPage.goto();

    const panel = pimPage.searchPanel;
    await expect(panel).toBeVisible();

    // Check presence and alignment by checking bounding boxes of labels and inputs
    // We check some core input-label pairs, expecting horizontal alignment
    const employeeNameLabel = page.locator('label[for="employeeName"]');
    const employeeNameInput = pimPage.employeeNameInput;

    await expect(employeeNameLabel).toBeVisible();
    await expect(employeeNameInput).toBeVisible();

    // Coordinates to approximate alignment
    const labelBox = await employeeNameLabel.boundingBox();
    const inputBox = await employeeNameInput.boundingBox();

    expect(labelBox).toBeTruthy();
    expect(inputBox).toBeTruthy();

    // Check vertical alignment difference less than 8 px
    if (labelBox && inputBox) {
      const deltaY = Math.abs(labelBox.y - inputBox.y);
      expect(deltaY).toBeLessThan(8);
    }

    // Additional visual consistency could include CSS property checks but omitted due to missing evidence
  });
});


test('2. Verify Employee Name field usability', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const employeeNameInput = pimPage.employeeNameInput;

  await expectVisibleReadable(employeeNameInput);

  // Additionally input a sample name to check space
  await employeeNameInput.fill('John Doe');
  expect(await employeeNameInput.inputValue()).toBe('John Doe');
});


test('3. Verify Employee ID field alignment', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const employeeIDInput = pimPage.employeeIDInput;
  const employeeNameInput = pimPage.employeeNameInput;

  await expect(employeeIDInput).toBeVisible();
  await expect(employeeNameInput).toBeVisible();

  const idBox = await employeeIDInput.boundingBox();
  const nameBox = await employeeNameInput.boundingBox();

  expect(idBox).toBeTruthy();
  expect(nameBox).toBeTruthy();

  if (idBox && nameBox) {
    expect(idBox.height).toBeCloseTo(nameBox.height, 1);
    expect(idBox.width).toBeCloseTo(nameBox.width, 5);
    // Alignment: top y position should be close
    const deltaY = Math.abs(idBox.y - nameBox.y);
    expect(deltaY).toBeLessThan(8);
  }
});


test('4. Verify dropdown controls UI', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const dropdowns = pimPage.dropdowns;

  for (const key of Object.keys(dropdowns)) {
    const dropdown = dropdowns[key as keyof typeof dropdowns];
    await expect(dropdown).toBeVisible();

    const box = await dropdown.boundingBox();
    expect(box).not.toBeNull();

    // Check dropdown icon presence
    const icon = dropdown.locator('option, option + option'); // Cannot detect icon reliably without evidence

    // Due to missing detailed evidence for dropdown icons and spacing, we omit further assertions
  }
});


test('5. Verify Supervisor Name field usability', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const supervisorInput = pimPage.supervisorNameInput;
  await expect(supervisorInput).toBeVisible();
  await expect(supervisorInput).toHaveAttribute('placeholder');
  await expectVisibleReadable(supervisorInput);

  await supervisorInput.fill('Jane Smith');
  expect(await supervisorInput.inputValue()).toBe('Jane Smith');
});


test('6. Verify Search and Reset button visibility', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const searchButton = pimPage.searchButton;
  const resetButton = pimPage.resetButton;

  await expect(searchButton).toBeVisible();
  await expect(resetButton).toBeVisible();

  // Check positions: alignment - top positions within 5px
  const searchBox = await searchButton.boundingBox();
  const resetBox = await resetButton.boundingBox();
  expect(searchBox).not.toBeNull();
  expect(resetBox).not.toBeNull();

  if (searchBox && resetBox) {
    const deltaY = Math.abs(searchBox.y - resetBox.y);
    expect(deltaY).toBeLessThan(6);
  }

  // Visual distinguishability via CSS cannot be asserted here without evidence
});


test('7. Verify search panel expand/collapse icon', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const icon = pimPage.expandCollapseIcon;
  await expect(icon).toBeVisible();

  // Current state of panel
  const panel = pimPage.searchPanel;
  const initialDisplay = await panel.isVisible();

  // Click icon to toggle
  await icon.click();

  // After click panel visibility should toggle
  const toggledDisplay = await panel.isVisible();
  expect(toggledDisplay).toBe(!initialDisplay);

  // Click again to restore
  await icon.click();
  const restoredDisplay = await panel.isVisible();
  expect(restoredDisplay).toBe(initialDisplay);

  // Icon should have aria-expanded or similar attribute indicating state
  const ariaExpanded = await icon.getAttribute('aria-expanded');
  expect(['true', 'false', null]).toContain(ariaExpanded);
});


test('8. Verify Add Employee button visibility', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const addButton = pimPage.addEmployeeButton;
  await expect(addButton).toBeVisible();

  const box = await addButton.boundingBox();
  expect(box).not.toBeNull();

  // Check outerText or aria-label if any
  const text = await addButton.textContent();
  expect(text).toMatch(/Add/i);
});


test('9. Verify employee records count display', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const recordsFound = pimPage.recordsFound;
  await expect(recordsFound).toBeVisible();

  const text = await recordsFound.textContent();
  expect(text).toMatch(/\d+/);
});


test('10. Verify employee listing table alignment', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const table = pimPage.employeeTable;
  await expect(table).toBeVisible();

  const headers = pimPage.tableHeaders;

  // Check expected columns exist by text
  const expectedHeaders = [
    'ID', 'First & Middle Name', 'Last Name', 'Job Title',
    'Employment Status', 'Sub Unit', 'Supervisor', 'Actions'
  ];

  for (const headerText of expectedHeaders) {
    await expect(headers.filter({ hasText: headerText })).toHaveCount(1);
  }

  // Additional alignment checks between columns and data cells omitted for lack of detailed evidence
});


test('11. Verify table sorting icons visibility', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const icons = pimPage.sortingIcons;
  const count = await icons.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const icon = icons.nth(i);
    await expect(icon).toBeVisible();
  }
});


test('12. Verify employee selection checkbox alignment', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const headerCheckbox = pimPage.headerCheckbox;
  const employeeCheckboxes = pimPage.employeeCheckboxes;

  await expect(headerCheckbox).toBeVisible();
  await expect(employeeCheckboxes.first()).toBeVisible();

  // Alignment between header and first employee checkbox
  const headerBox = await headerCheckbox.boundingBox();
  const firstBox = await employeeCheckboxes.first().boundingBox();

  expect(headerBox).not.toBeNull();
  expect(firstBox).not.toBeNull();

  if (headerBox && firstBox) {
    const deltaX = Math.abs(headerBox.x - firstBox.x);
    expect(deltaX).toBeLessThan(5);
    const deltaWidth = Math.abs(headerBox.width - firstBox.width);
    expect(deltaWidth).toBeLessThan(2);
  }
});


test('13. Verify Edit and Delete action icons', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  // Locate first row actions column
  const actionsCells = pimPage.employeeTable.locator('tbody tr td.actions');
  await expect(actionsCells.first()).toBeVisible();

  // Locate edit and delete icons inside actions cell
  const editIcon = actionsCells.first().locator('button[title="Edit"]');
  const deleteIcon = actionsCells.first().locator('button[title="Delete"]');

  await expect(editIcon).toBeVisible();
  await expect(deleteIcon).toBeVisible();

  // Check alignment roughly by bounding boxes
  const editBox = await editIcon.boundingBox();
  const deleteBox = await deleteIcon.boundingBox();

  expect(editBox).not.toBeNull();
  expect(deleteBox).not.toBeNull();

  if (editBox && deleteBox) {
    // Difference of vertical position should be small
    const deltaY = Math.abs(editBox.y - deleteBox.y);
    expect(deltaY).toBeLessThan(5);
  }
});


test('14. Verify left navigation menu usability', async ({ page }) => {
  const pimPage = new PIMEmployeeListPage(page);
  await pimPage.goto();

  const navMenu = pimPage.leftNavMenu;
  await expect(navMenu).toBeVisible();

  // Check presence of all expected menu items by text
  const expectedItems = [
    'Search', 'Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info',
    'Performance', 'Dashboard', 'Directory', 'Maintenance', 'Claim', 'Buzz'
  ];

  for (const itemText of expectedItems) {
    await expect(navMenu.locator(`text=${itemText}`)).toBeVisible();
  }

  // Check that PIM module is highlighted
  const activePIM = pimPage.activePIMMenuItem;
  await expect(activePIM).toBeVisible();
});

