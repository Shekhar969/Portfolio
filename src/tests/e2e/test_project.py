import allure
from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np"


@allure.title("Verify projects page loads successfully")
@allure.description("Verify the projects page URL and main heading.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Projects Page")
@allure.feature("Projects Page Loading")
@allure.tag("Smoke", "UI", "Navigation", "Functional")
def test_projects_page_loads(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    with allure.step("Verify the projects page URL"):
        expect(page).to_have_url(f"{BASE_URL}/projects")

    with allure.step("Verify the projects page heading"):
        expect(
            page.get_by_role("heading", name="my projects.")
        ).to_be_visible()


@allure.title("Verify project search field is visible")
@allure.description("Ensure the project search box is displayed and accessible.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Projects Page")
@allure.feature("Project Search")
@allure.tag("Regression", "UI", "Search", "Accessibility")
def test_project_search_loaded(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    with allure.step("Verify the project search field"):
        expect(
            page.get_by_role("searchbox", name="Search projects")
        ).to_be_visible()


@allure.title("Verify project category filters are displayed")
@allure.description("Check that the category filter group and its buttons are visible.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Projects Page")
@allure.feature("Category Filters")
@allure.tag("Regression", "UI", "Filters")
def test_category_filters_loaded(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    with allure.step("Verify the category filter group"):
        filters = page.get_by_role("group", name="Filter by category")
        expect(filters).to_be_visible()

    with allure.step("Verify category filter buttons exist"):
        buttons = filters.get_by_role("button")
        expect(buttons.first).to_be_visible()
        assert buttons.count() > 0, "No category filters found"


@allure.title("Verify project cards are displayed")
@allure.description("Ensure projects are visible and each project has a heading.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Projects Page")
@allure.feature("Project Listing")
@allure.tag("Smoke", "UI", "Content", "Functional")
def test_projects_are_displayed(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    with allure.step("Verify project cards are displayed"):
        projects = page.locator("article")
        expect(projects.first).to_be_visible()
        assert projects.count() > 0, "No projects are displayed"

    with allure.step("Verify each project has a visible heading"):
        for i in range(projects.count()):
            project = projects.nth(i)
            expect(project).to_be_visible()
            expect(project.get_by_role("heading").first).to_be_visible()


@allure.title("Verify project search filters results correctly")
@allure.description(
    "Verify that searching for a nonexistent project returns no results "
    "and clearing the search restores the original project list."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Projects Page")
@allure.feature("Project Search")
@allure.tag("Regression", "Functional", "Search", "Data Validation")
def test_project_search_filters_results(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects", wait_until="domcontentloaded")

    with allure.step("Verify the search field is visible"):
        search = page.get_by_role("searchbox", name="Search projects")
        expect(search).to_be_visible()

    projects = page.locator("article")

    with allure.step("Record the initial project count"):
        expect(projects.first).to_be_visible(timeout=15000)
        initial_count = projects.count()
        assert initial_count > 0, "No project cards found"

    with allure.step("Search for a nonexistent project"):
        search.fill("zzunmatchedproject12345")
        expect(projects).to_have_count(0)

    with allure.step("Clear the search and restore project results"):
        search.fill("")
        expect(projects.first).to_be_visible()
        expect(projects).to_have_count(initial_count)


@allure.title("Verify project category filters work")
@allure.description(
    "Test each category filter and verify that the selected state updates "
    "and the filter group remains visible."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Projects Page")
@allure.feature("Category Filters")
@allure.tag("Regression", "Functional", "UI", "Interaction")
def test_category_filter_works(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    filters = page.get_by_role("group", name="Filter by category")
    category_buttons = filters.get_by_role("button")

    with allure.step("Test each category filter"):
        for i in range(1, category_buttons.count()):
            button = category_buttons.nth(i)
            category_name = button.inner_text()

            with allure.step(f"Select category: {category_name}"):
                button.click()
                expect(button).to_have_attribute("aria-pressed", "true")
                expect(filters).to_be_visible()

            with allure.step("Reset the category filter to All"):
                all_button = filters.get_by_role(
                    "button", name="All", exact=True
                )
                all_button.click()
                expect(all_button).to_have_attribute(
                    "aria-pressed", "true"
                )


@allure.title("Verify projects footer and navigation links")
@allure.description(
    "Ensure the footer navigation is visible and all expected links exist."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Footer")
@allure.feature("Footer Navigation")
@allure.tag("Regression", "UI", "Navigation", "Content")
def test_projects_footer_loaded(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    with allure.step("Verify the footer navigation is visible"):
        footer = page.get_by_role("navigation", name="Footer")
        expect(footer).to_be_visible()

    with allure.step("Verify footer links"):
        for link_name in [
            "Home",
            "Projects",
            "Contact",
            "Resume",
            "GitHub",
            "LinkedIn",
            "Email",
        ]:
            with allure.step(f"Verify {link_name} footer link"):
                expect(
                    footer.get_by_role(
                        "link", name=link_name, exact=True
                    )
                ).to_be_visible()


@allure.title("Verify project page copyright and privacy link")
@allure.description(
    "Verify that the footer displays the copyright notice and a privacy "
    "link pointing to the privacy page."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Footer")
@allure.feature("Copyright and Privacy")
@allure.tag("Regression", "UI", "Content", "Navigation")
def test_project_page_privacy_and_copyright(page: Page):
    with allure.step("Navigate to the projects page"):
        page.goto(f"{BASE_URL}/projects")

    footer = page.locator("footer")

    with allure.step("Verify copyright notice"):
        expect(
            footer.locator("p").filter(has_text="© 2026 Shekhar")
        ).to_be_visible()

    with allure.step("Verify privacy link visibility"):
        privacy_link = footer.get_by_role(
            "link", name="privacy", exact=True
        )
        expect(privacy_link).to_be_visible()

    with allure.step("Verify privacy link destination"):
        expect(privacy_link).to_have_attribute("href", "/privacy")