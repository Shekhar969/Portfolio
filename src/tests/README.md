# Portfolio Website Automation Testing

This project automates the **Home, Projects, and Contact** pages of Shekhar Rawal's Portfolio using **Playwright, Pytest, and Allure**.

## Setup

Create and activate the virtual environment:

```
python3 -m venv .env
source .env/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
playwright install
```

## Verify Installation

```
python --version
pytest --version
playwright --version
allure --version
```

Verify Allure:

```
pytest --help | grep allure
```

You should see:

```
--alluredir=DIR
```

## Run Tests

Run all tests in headed mode and generate Allure results:

```
pytest --headed -s --alluredir=allure-results ./tests
```

Run tests in headless mode:

```
pytest --alluredir=allure-results ./tests
```

Run a specific test file:

```
pytest ./tests/test_home.py
pytest ./tests/test_projects.py
pytest ./tests/test_contact.py
```

## View Allure Report

Generate and open the Allure report:

```
allure serve allure-results
```

## Test Coverage

### Home Page

- Homepage loads successfully.
- Resume navigation link is visible and opens the resume page.
- Portfolio photos load successfully.
- Education section displays the expected institutions.
- Experience section displays the expected organizations.
- Featured projects are displayed.
- Footer navigation links are visible.
- Copyright and privacy link are displayed.
- Theme toggle switches between light and dark modes.

### Projects Page

- Projects page loads successfully.
- Project search field is visible.
- Category filters are displayed.
- Project cards are visible and contain headings.
- Project search filters results correctly.
- Clearing the search restores the original projects.
- Category filters can be selected and reset.
- Footer navigation links are visible.
- Copyright and privacy link are displayed.

### Contact Page

- Contact page loads successfully.
- Name, Email, Subject, and Message fields are visible.
- Contact form accepts user input.
- Character limit validation is checked (currently skipped).
- Message character counter updates correctly.
- Email field uses the correct input type.
- Invalid email addresses fail browser validation.
- GitHub, LinkedIn, and Email links are visible.
- Send message button is displayed.
- Footer navigation links are visible.

## Tech Stack

- **Python** — Programming language
- **Playwright** — Browser automation
- **Pytest** — Test framework
- **pytest-playwright** — Playwright integration for Pytest
- **Allure** — Test reporting

## Dependencies

Project dependencies are listed in `requirements.txt`.

Key packages:

```
pytest==9.1.1
playwright==1.63.0
pytest-playwright==0.10.0
allure-pytest==2.16.2
allure-python-commons==2.16.2
```

## Application

Portfolio Website: https://shekharrawal.com.np

- Home: https://shekharrawal.com.np/
- Projects: https://shekharrawal.com.np/projects
- Contact: https://shekharrawal.com.np/contact
- Resume: https://shekharrawal.com.np/resume

