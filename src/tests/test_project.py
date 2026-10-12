from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np"


def test_projects_page_loads(page: Page):
    page.goto(f"{BASE_URL}/projects")

    expect(page).to_have_url(f"{BASE_URL}/projects")
    expect(page.get_by_role("heading", name="my projects.")).to_be_visible()


def test_project_search_loaded(page: Page):
    page.goto(f"{BASE_URL}/projects")

    expect(page.get_by_role("searchbox", name="Search projects")).to_be_visible()


def test_category_filters_loaded(page: Page):
    page.goto(f"{BASE_URL}/projects")

    filters = page.get_by_role("group", name="Filter by category")
    expect(filters).to_be_visible()

    buttons = filters.get_by_role("button")
    expect(buttons.first).to_be_visible()
    assert buttons.count() > 0, "No category filters found"


def test_projects_are_displayed(page: Page):
    page.goto(f"{BASE_URL}/projects")

    projects = page.locator("article")
    expect(projects.first).to_be_visible()
    assert projects.count() > 0, "No projects are displayed"

    for i in range(projects.count()):
        project = projects.nth(i)
        expect(project).to_be_visible()

        # Every project must have a heading
        expect(project.get_by_role("heading").first).to_be_visible()


def test_project_search_filters_results(page: Page):
    page.goto(f"{BASE_URL}/projects", wait_until="domcontentloaded")

    search = page.get_by_role("searchbox", name="Search projects")
    expect(search).to_be_visible()

    projects = page.locator("article")

    # Wait for at least one project card to appear.
    expect(projects.first).to_be_visible(timeout=15000)

    initial_count = projects.count()
    assert initial_count > 0, "No project cards found"

    # Search for a term that should match nothing.
    search.fill("zzunmatchedproject12345")
    expect(projects).to_have_count(0)

    # Clear the search and verify that projects return.
    search.fill("")
    expect(projects.first).to_be_visible()
    expect(projects).to_have_count(initial_count)


def test_category_filter_works(page: Page):
    page.goto(f"{BASE_URL}/projects")

    filters = page.get_by_role("group", name="Filter by category")
    category_buttons = filters.get_by_role("button")

    # Test a category dynamically, without assuming any project names
    for i in range(1, category_buttons.count()):
        button = category_buttons.nth(i)
        button.click()

        expect(button).to_have_attribute("aria-pressed", "true")

        # Either matching projects or a legitimate empty state is acceptable
        # The page should not crash or show broken UI.
        expect(filters).to_be_visible()

        # Reset to All before testing the next category
        filters.get_by_role("button", name="All", exact=True).click()
        expect(filters.get_by_role("button", name="All")).to_have_attribute(
            "aria-pressed", "true"
        )


def test_projects_footer_loaded(page: Page):
    page.goto(f"{BASE_URL}/projects")

    footer = page.get_by_role("navigation", name="Footer")
    expect(footer).to_be_visible()

    for link_name in [
        "Home", "Projects", "Contact", "Resume",
        "GitHub", "LinkedIn", "Email"
    ]:
        expect(
            footer.get_by_role("link", name=link_name, exact=True)
        ).to_be_visible()


def test_project_page_privacy_and_copyright(page: Page):
    page.goto(f"{BASE_URL}/projects")

    expect(
        page.get_by_text("© 2026 Shekhar", exact=True)
    ).to_be_visible()

    expect(
        page.get_by_role("link", name="Privacy", exact=True)
    ).to_be_visible()