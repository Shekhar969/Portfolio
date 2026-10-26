import allure
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np/"


@allure.title("Verify portfolio server is active")
@allure.description("Check that the homepage returns a successful HTTP response.")
@allure.severity(allure.severity_level.BLOCKER)
@allure.suite("Website Availability")
@allure.feature("Server Health")
@allure.tag("Smoke", "API", "Availability")
def test_is_server_active(page: Page):
    response = page.goto(BASE_URL, timeout=30000)

    assert response is not None, "No server response"
    assert response.status < 400, f"HTTP error: {response.status}"


@allure.title("Verify homepage loads")
@allure.description("Check page title, body, and main content.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Homepage")
@allure.feature("Page Loading")
@allure.tag("Smoke", "UI", "Functional")
def test_homepage_loads(page: Page):
    page.goto(BASE_URL)

    expect(page).to_have_title("Shekhar | Quality Assurance")
    expect(page.locator("body")).to_be_visible()
    expect(page.locator("main#main")).to_be_attached()


@allure.title("Verify navbar components load")
@allure.description(
    "Verify main navigation visibility, link destinations, active page state, "
    "and theme toggle functionality."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Navigation")
@allure.feature("Navbar")
@allure.tag("Smoke", "UI", "Navigation", "Functional")
def test_navbar_loads(page: Page):
    with allure.step("Navigate to the homepage"):
        page.goto(BASE_URL)

    navbar = page.get_by_role("navigation", name="Main")

    with allure.step("Verify main navigation is visible"):
        expect(navbar).to_be_visible()

    expected_links = {
        "Home": "/",
        "Projects": "/projects",
        "Contact": "/contact",
        "Resume": "/resume",
    }

    with allure.step("Verify navigation links and destinations"):
        for name, href in expected_links.items():
            with allure.step(f"Verify {name} link"):
                link = navbar.get_by_role(
                    "link", name=name, exact=True
                )
                expect(link).to_be_visible()
                expect(link).to_have_attribute("href", href)

    with allure.step("Verify Home is the active navigation link"):
        home_link = navbar.get_by_role(
            "link", name="Home", exact=True
        )
        expect(home_link).to_have_attribute("aria-current", "page")


@allure.title("Verify hero header loads")
@allure.description("Check heading, introduction, resume and contact links.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Homepage")
@allure.feature("Header")
@allure.tag("Smoke", "UI", "Content", "Functional")
def test_header_loads(page: Page):
    page.goto(BASE_URL)

    expect(
        page.get_by_role("heading", name="hi Shekhar here.")
    ).to_be_visible()

    expect(
        page.get_by_text("QA by profession, full-stack by passion.")
    ).to_be_visible()

    expect(
        page.get_by_role(
            "link", name="Questions or opportunities? Send a message"
        )
    ).to_be_visible()

    expect(
        page.locator('a[href="/personal/doc/Shekhar_Rawal_Resume.pdf"]')
    ).to_be_visible()


@allure.title("Verify profile photos load")
@allure.description("Check the profile carousel and image loading.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Homepage")
@allure.feature("Profile Images")
@allure.tag("Regression", "UI", "Images")
def test_profile_images_load(page: Page):
    page.goto(BASE_URL)

    carousel = page.get_by_role("group", name="Photos of Shekhar")
    expect(carousel).to_be_visible()

    image = carousel.locator(
        'img[alt="Shekhar, photo 1 of 4"]'
    )
    expect(image).to_be_visible()

    image.evaluate("(img) => img.decode()")

    assert image.evaluate(
        "(img) => img.complete && img.naturalWidth > 0"
    ), "Profile image did not load"


@allure.title("Verify work experience section")
@allure.description("Check work experience entries and technology details.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Experience")
@allure.feature("Work Section")
@allure.tag("Regression", "UI", "Content")
def test_work_experience_loads(page: Page):
    page.goto(BASE_URL)

    expect(
        page.get_by_role("tab", name="Work")
    ).to_be_visible()

    expect(
        page.get_by_role("heading", name="Grow", exact=True)
    ).to_be_visible()

    expect(
        page.get_by_role("heading", name="Kayo badger", exact=True)
    ).to_be_visible()

    expect(page.get_by_text("Playwright", exact=True)).to_be_visible()


@allure.title("Verify Education tab works")
@allure.description("Check that the Education tab can be selected.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Experience")
@allure.feature("Education Section")
@allure.tag("Regression", "UI", "Functional", "Interaction")
def test_education_tab(page: Page):
    page.goto(BASE_URL)

    education_tab = page.get_by_role("tab", name="Education")
    expect(education_tab).to_be_visible()

    education_tab.click()

    expect(education_tab).to_have_attribute("aria-selected", "true")

    panel = page.locator(
        '[role="tabpanel"][aria-labelledby$="-tab-education"]'
    )
    expect(panel).to_be_visible()


@allure.title("Verify featured projects load")
@allure.description("Check AttendanceSNSC, Argus and project navigation.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Projects")
@allure.feature("Featured Projects")
@allure.tag("Smoke", "UI", "Content", "Functional")
def test_featured_projects_load(page: Page):
    page.goto(BASE_URL)

    expect(
        page.get_by_role("heading", name="featured projects")
    ).to_be_visible()

    expect(
        page.get_by_role("link", name="AttendanceSNSC")
    ).to_be_visible()

    expect(
        page.get_by_role("link", name="Argus", exact=True)
    ).to_be_visible()

    expect(
        page.get_by_role("link", name="view more")
    ).to_be_visible()


@allure.title("Verify project external links")
@allure.description("Check project website and GitHub destinations.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Projects")
@allure.feature("Project Links")
@allure.tag("Regression", "Navigation", "External Links")
def test_project_links(page: Page):
    page.goto(BASE_URL)

    expect(
        page.locator('a[href="https://snsc.shekharrawal.com.np/"]')
    ).to_have_count(1)

    expect(
        page.locator(
            'a[href="https://github.com/Shekhar969/AttendanceSNSC"]'
        )
    ).to_be_visible()

    expect(
        page.locator('a[href="https://github.com/Shekhar969/Argus"]')
    ).to_have_count(2)


@allure.title("Verify footer loads")
@allure.description("Check footer content, navigation and social links.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Layout")
@allure.feature("Footer")
@allure.tag("Regression", "UI", "Navigation", "Content")
def test_footer_loads(page: Page):
    page.goto(BASE_URL)

    footer = page.locator("footer")
    footer.scroll_into_view_if_needed()

    expect(footer).to_be_visible()
    expect(footer.get_by_text("Building useful software.")).to_be_visible()
    expect(footer.get_by_text("© 2026 Shekhar", exact=False)).to_be_visible()

    footer_nav = footer.get_by_role("navigation", name="Footer")

    for name in [
        "Home", "Projects", "Experience",
        "Education", "Resume", "Contact"
    ]:
        with allure.step(f"Verify footer link: {name}"):
            expect(
                footer_nav.get_by_role("link", name=name, exact=True)
            ).to_be_visible()

    expect(footer.get_by_role("link", name="privacy")).to_be_visible()
    expect(footer.get_by_role("link", name="GitHub")).to_be_visible()
    expect(footer.get_by_role("link", name="LinkedIn")).to_be_visible()


@allure.title("Verify theme toggle works")
@allure.description("Check that the theme toggle changes the document theme.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("UI Components")
@allure.feature("Theme Toggle")
@allure.tag("Regression", "UI", "Functional", "Interaction")
def test_theme_toggle(page: Page):
    page.goto(BASE_URL)

    html = page.locator("html")
    original_theme = html.evaluate(
        "(el) => el.classList.contains('dark')"
    )

    button_name = (
        "Switch to light mode"
        if original_theme
        else "Switch to dark mode"
    )

    page.get_by_role("button", name=button_name).click()

    new_theme = html.evaluate(
        "(el) => el.classList.contains('dark')"
    )

    assert new_theme != original_theme, "Theme did not change"


@allure.title("Verify important portfolio routes")
@allure.description("Check that internal pages return successful responses.")
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Routing")
@allure.feature("Route Availability")
@allure.tag("Smoke", "Regression", "Routing", "Availability")
@pytest.mark.parametrize(
    "route",
    [
        "/",
        "/projects",
        "/contact",
        "/resume",
        "/experience",
        "/education",
        "/privacy",
    ],
)
def test_internal_routes(page: Page, route: str):
    with allure.step(f"Navigate to {route}"):
        response = page.goto(
            f"https://shekharrawal.com.np{route}",
            timeout=30000,
        )

    assert response is not None, f"No response for {route}"
    assert response.status < 400, (
        f"{route} returned HTTP {response.status}"
    )
    expect(page.locator("body")).to_be_visible()


@allure.title("Verify homepage images are not broken")
@allure.description("Check that rendered main-content images loaded successfully.")
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("UI Components")
@allure.feature("Image Loading")
@allure.tag("Regression", "UI", "Images", "Reliability")
def test_images_load(page: Page):
    page.goto(BASE_URL)

    page.wait_for_function(
        """() => Array.from(document.querySelectorAll("main img"))
            .every(img => img.complete)""",
        timeout=30000,
    )

    broken_images = page.locator("main img").evaluate_all(
        """images => images
            .filter(img => img.naturalWidth === 0)
            .map(img => img.currentSrc || img.src)"""
    )

    assert not broken_images, f"Broken images: {broken_images}"