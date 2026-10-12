from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np/"

def test_homepage_loading(page: Page):
    page.goto(BASE_URL)

    expect(page).to_have_url(BASE_URL)
    expect(page.get_by_role("heading", name="hi Shekhar here.")).to_be_visible()


def test_resume_link(page: Page):
    page.goto(BASE_URL)
    resume_link = page.get_by_role("navigation", name="Main").get_by_role("link", name="Resume")

    expect(resume_link).to_be_visible()
    expect(resume_link).to_have_attribute("href", "/resume")


def test_resume_opens_page(page: Page):
    page.goto(BASE_URL)
    page.get_by_role("navigation", name="Main").get_by_role("link", name="Resume").click()

    expect(page).to_have_url("https://shekharrawal.com.np/resume")

def test_photos_loaded(page: Page):
    page.goto(BASE_URL)

    photos = page.get_by_role("group", name="Photos of Shekhar").locator("img")
    expect(photos.first).to_be_attached()

    for i in range(photos.count()):
        photo = photos.nth(i)
        photo.evaluate("""img => img.decode()""")
        assert photo.evaluate("img => img.naturalWidth > 0"), f"Photo {i + 1} failed to load"

def test_education_headings_loaded(page: Page):
    page.goto(BASE_URL)

    page.get_by_role("tab", name="Education").click()
    for heading in ["Siddhanath Science Campus","Little Buddha Academy","Mahakali Modern Public School",]:
        expect(page.get_by_role("heading", name=heading)).to_be_visible()

def test_experience_headings_loaded(page: Page):
    page.goto(BASE_URL)

    for heading in ["Grow","Kayo badger","Dipshikha Dhitopatra Karobar Co. Pvt"]:
        expect(page.get_by_role("heading", name=heading)).to_be_visible()

def test_featured_projects_loaded(page: Page):
    page.goto(BASE_URL)

    projects = page.locator("article")
    expect(projects.first).to_be_visible()

    expect(page.get_by_role("heading", name="featured projects")).to_be_visible()

def test_footer_loaded(page: Page):
    page.goto(BASE_URL)

    footer = page.get_by_role("navigation", name="Footer")
    expect(footer).to_be_visible()
    for link in ["Home", "Projects", "Contact", "Resume","GitHub", "LinkedIn", "Email"]:
        expect(footer.get_by_role("link", name=link)).to_be_visible()

def test_footer_copyright_and_privacy(page: Page):
    page.goto(BASE_URL)

    expect(page.get_by_text("© 2026 Shekhar", exact=True)).to_be_visible()
    expect(page.get_by_role("link", name="Privacy", exact=True)).to_be_visible()

def test_theme_toggle(page: Page):
    page.goto(BASE_URL)

    button = page.locator('button[aria-label^="Switch to"]')
    expect(button).to_be_visible()

    initial_label = button.get_attribute("aria-label")
    button.click()

    expect(button).to_have_attribute(
        "aria-label",
        "Switch to dark mode"
        if initial_label == "Switch to light mode"
        else "Switch to light mode"
    )

    button.click()
    expect(button).to_have_attribute("aria-label", initial_label)