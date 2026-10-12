import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np"


def test_contact_page_loads(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    expect(page).to_have_url(f"{BASE_URL}/contact")
    expect(page.get_by_role("heading", name="Get in touch.")).to_be_visible()


def test_contact_form_fields_visible(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    for field in ["Name", "Email", "Subject", "Message"]:
        expect(page.get_by_label(field, exact=True)).to_be_visible()


def test_contact_form_accepts_input(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    page.get_by_label("Name", exact=True).fill("Test User")
    page.get_by_label("Email", exact=True).fill("test@example.com")
    page.get_by_label("Subject", exact=True).fill("Test subject")
    page.get_by_label("Message", exact=True).fill("This is a test message.")

    expect(page.get_by_label("Name", exact=True)).to_have_value("Test User")
    expect(page.get_by_label("Email", exact=True)).to_have_value(
        "test@example.com"
    )
    expect(page.get_by_label("Subject", exact=True)).to_have_value(
        "Test subject"
    )
    expect(page.get_by_label("Message", exact=True)).to_have_value(
        "This is a test message."
    )

@pytest.mark.skip(reason="User can type n number of words but there is a limit for sending")
def test_contact_form_character_limits(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    expect(page.get_by_label("Name", exact=True)).to_have_attribute(
        "maxlength", "100"
    )
    expect(page.get_by_label("Email", exact=True)).to_have_attribute(
        "maxlength", "254"
    )
    expect(page.get_by_label("Subject", exact=True)).to_have_attribute(
        "maxlength", "150"
    )

    message = page.get_by_label("Message", exact=True)
    message.fill("x" * 5001)
    expect(message).to_have_value("x" * 5000)
    


def test_contact_form_message_counter(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    message = page.get_by_label("Message", exact=True)
    counter = page.get_by_text("0/2000", exact=True)

    expect(counter).to_be_visible()

    message.fill("Hello Playwright")
    expect(page.get_by_text("16/2000", exact=True)).to_be_visible()


def test_contact_email_field_type(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    expect(page.get_by_label("Email", exact=True)).to_have_attribute(
        "type", "email"
    )


def test_contact_social_links(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    for name in ["GitHub", "LinkedIn", "Email"]:
        expect(
            page.get_by_role("link", name=name, exact=True)
        ).to_be_visible()


def test_contact_form_submit_button(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    expect(
        page.get_by_role("button", name="Send message", exact=True)
    ).to_be_visible()


def test_contact_form_rejects_invalid_email(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    email = page.get_by_label("Email", exact=True)
    email.fill("invalid-email")

    expect(email).to_have_attribute("type", "email")
    assert email.evaluate(
        "el => !el.validity.valid"
    ), "Invalid email should fail browser email validation"


def test_contact_footer_loaded(page: Page):
    page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    footer = page.get_by_role("navigation", name="Footer")
    expect(footer).to_be_visible()

    for name in ["Home", "Projects", "Contact", "Resume"]:
        expect(
            footer.get_by_role("link", name=name, exact=True)
        ).to_be_visible()