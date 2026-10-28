
import allure
from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np/"


@allure.title("Verify homepage loads successfully")
@allure.description(
    "Check that the homepage opens at the expected URL and displays the main heading."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Homepage")
@allure.feature("Homepage Loading")
@allure.label("category", "Homepage")
def test_homepage_loading(page: Page):
    page.goto(BASE_URL)

    expect(page).to_have_url(BASE_URL)
    expect(
        page.get_by_role("heading", name="hi Shekhar here.")
    ).to_be_visible()


@allure.title("Verify resume navigation link")
@allure.description(
    "Check that the Resume link is visible in the main navigation and points to the correct route."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Navigation")
@allure.feature("Resume Navigation")
@allure.label("category", "Navigation")
def test_resume_link(page: Page):
    page.goto(BASE_URL)

    resume_link = (
        page.get_by_role("navigation", name="Main")
        .get_by_role("link", name="Resume")
    )

    expect(resume_link).to_be_visible()
    expect(resume_link).to_have_attribute("href", "/resume")


@allure.title("Verify resume page opens")
@allure.description(
    "Check that clicking the Resume navigation link opens the resume page."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Navigation")
@allure.feature("Resume Navigation")
@allure.label("category", "Navigation")
def test_resume_opens_page(page: Page):
    page.goto(BASE_URL)

    page.get_by_role(
        "navigation", name="Main"
    ).get_by_role("link", name="Resume").click()

    expect(page).to_have_url(
        "https://shekharrawal.com.np/resume"
    )


@allure.title("Verify homepage photos load")
@allure.description(
    "Check that the photo gallery is attached to the page and each image loads successfully."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Homepage")
@allure.feature("Photo Gallery")
@allure.label("category", "Photo Gallery")
def test_photos_loaded(page: Page):
    page.goto(BASE_URL)

    photos = page.get_by_role(
        "group", name="Photos of Shekhar"
    ).locator("img")

    expect(photos.first).to_be_attached()

    for i in range(photos.count()):
        photo = photos.nth(i)

        with allure.step(f"Verify photo {i + 1} loads"):
            photo.evaluate("img => img.decode()")

            assert photo.evaluate(
                "img => img.naturalWidth > 0"
            ), f"Photo {i + 1} failed to load"


@allure.title("Verify education headings")
@allure.description(
    "Check that all expected education institution headings are visible after selecting the Education tab."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Homepage")
@allure.feature("Education Section")
@allure.label("category", "Education")
def test_education_headings_loaded(page: Page):
    page.goto(BASE_URL)

    page.get_by_role("tab", name="Education").click()

    for heading in [
        "Siddhanath Science Campus",
        "Little Buddha Academy",
        "Mahakali Modern Public School",
    ]:
        with allure.step(f"Verify education heading: {heading}"):
            expect(
                page.get_by_role("heading", name=heading)
            ).to_be_visible()


@allure.title("Verify work experience headings")
@allure.description(
    "Check that all expected work experience entries are visible on the homepage."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Homepage")
@allure.feature("Work Experience Section")
@allure.label("category", "Work Experience")
def test_experience_headings_loaded(page: Page):
    page.goto(BASE_URL)

    for heading in [
        "Grow",
        "Kayo badger",
        "Dipshikha Dhitopatra Karobar Co. Pvt",
    ]:
        with allure.step(f"Verify experience heading: {heading}"):
            expect(
                page.get_by_role("heading", name=heading)
            ).to_be_visible()


@allure.title("Verify featured projects section")
@allure.description(
    "Check that the featured projects section and at least one project card are visible."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Homepage")
@allure.feature("Featured Projects")
@allure.label("category", "Projects")
def test_featured_projects_loaded(page: Page):
    page.goto(BASE_URL)

    projects = page.locator("article")

    expect(projects.first).to_be_visible()
    expect(
        page.get_by_role("heading", name="featured projects")
    ).to_be_visible()


@allure.title("Verify footer navigation links")
@allure.description(
    "Check that the footer navigation is visible and contains all expected navigation and social links."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Footer")
@allure.feature("Footer Navigation")
@allure.label("category", "Footer")
def test_footer_loaded(page: Page):
    page.goto(BASE_URL)

    footer = page.get_by_role("navigation", name="Footer")
    expect(footer).to_be_visible()

    for link in [
        "Home",
        "Projects",
        "Contact",
        "Resume",
        "GitHub",
        "LinkedIn",
        "Email",
    ]:
        with allure.step(f"Verify footer link: {link}"):
            expect(
                footer.get_by_role("link", name=link)
            ).to_be_visible()


@allure.title("Verify footer copyright and privacy link")
@allure.description(
    "Check that the footer displays the copyright notice and that the privacy link is visible and points to the correct route."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Footer")
@allure.feature("Copyright and Privacy")
@allure.label("category", "Footer")
def test_footer_copyright_and_privacy(page: Page):
    page.goto(BASE_URL)

    footer = page.locator("footer")

    with allure.step("Verify copyright notice"):
        expect(
            footer.locator("p").filter(
                has_text="© 2026 Shekhar"
            )
        ).to_be_visible()

    with allure.step("Verify privacy link visibility"):
        privacy_link = footer.get_by_role(
            "link", name="privacy", exact=True
        )
        expect(privacy_link).to_be_visible()

    with allure.step("Verify privacy link destination"):
        expect(privacy_link).to_have_attribute(
            "href", "/privacy"
        )


@allure.title("Verify theme toggle functionality")
@allure.description(
    "Check that the theme toggle switches between light and dark modes and can return to its initial state."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Appearance")
@allure.feature("Theme Toggle")
@allure.label("category", "Appearance")
def test_theme_toggle(page: Page):
    page.goto(BASE_URL)

    button = page.locator(
        'button[aria-label^="Switch to"]'
    )
    expect(button).to_be_visible()

    initial_label = button.get_attribute("aria-label")

    with allure.step("Toggle theme"):
        button.click()

        expected_label = (
            "Switch to dark mode"
            if initial_label == "Switch to light mode"
            else "Switch to light mode"
        )

        expect(button).to_have_attribute(
            "aria-label", expected_label
        )

    with allure.step("Restore initial theme"):
        button.click()
        expect(button).to_have_attribute(
            "aria-label", initial_label
        )
