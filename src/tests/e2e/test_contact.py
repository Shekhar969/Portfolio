import allure
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://shekharrawal.com.np"


@allure.title("Verify contact page loads successfully")
@allure.description(
    "Verify that the contact page opens at the expected URL "
    "and displays the main heading."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Contact Page")
@allure.feature("Contact Page Loading")
def test_contact_page_loads(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    with allure.step("Verify the contact page URL"):
        expect(page).to_have_url(f"{BASE_URL}/contact")

    with allure.step("Verify the main heading"):
        expect(
            page.get_by_role("heading", name="Get in touch.")
        ).to_be_visible()


@allure.title("Verify contact form fields are visible")
@allure.description(
    "Verify that the Name, Email, Subject, and Message fields "
    "are visible and accessible on the contact page."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Contact Form")
@allure.feature("Form Fields")
def test_contact_form_fields_visible(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    for field in ["Name", "Email", "Subject", "Message"]:
        with allure.step(f"Verify {field} field is visible"):
            expect(page.get_by_label(field, exact=True)).to_be_visible()


@allure.title("Verify contact form accepts user input")
@allure.description(
    "Verify that users can enter and retain values in all contact "
    "form fields before submitting the form."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Contact Form")
@allure.feature("Form Input")
def test_contact_form_accepts_input(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    with allure.step("Enter contact form details"):
        page.get_by_label("Name", exact=True).fill("Test User")
        page.get_by_label("Email", exact=True).fill("test@example.com")
        page.get_by_label("Subject", exact=True).fill("Test subject")
        page.get_by_label("Message", exact=True).fill(
            "This is a test message."
        )

    with allure.step("Verify entered form values"):
        expect(
            page.get_by_label("Name", exact=True)
        ).to_have_value("Test User")

        expect(
            page.get_by_label("Email", exact=True)
        ).to_have_value("test@example.com")

        expect(
            page.get_by_label("Subject", exact=True)
        ).to_have_value("Test subject")

        expect(
            page.get_by_label("Message", exact=True)
        ).to_have_value("This is a test message.")


@pytest.mark.skip(
    reason="Character-limit behavior is currently not required for sending."
)
@allure.title("Verify contact form character limits")
@allure.description(
    "Verify the maximum allowed character lengths for the Name, Email, "
    "Subject, and Message fields."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Contact Form")
@allure.feature("Input Validation")
def test_contact_form_character_limits(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    with allure.step("Verify Name field character limit"):
        expect(
            page.get_by_label("Name", exact=True)
        ).to_have_attribute("maxlength", "100")

    with allure.step("Verify Email field character limit"):
        expect(
            page.get_by_label("Email", exact=True)
        ).to_have_attribute("maxlength", "254")

    with allure.step("Verify Subject field character limit"):
        expect(
            page.get_by_label("Subject", exact=True)
        ).to_have_attribute("maxlength", "150")

    with allure.step("Verify Message field character limit"):
        message = page.get_by_label("Message", exact=True)
        message.fill("x" * 5001)
        expect(message).to_have_value("x" * 5000)


@allure.title("Verify contact form message character counter")
@allure.description(
    "Verify that the message character counter displays the initial count "
    "and updates correctly as the user types."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Contact Form")
@allure.feature("Character Counter")
def test_contact_form_message_counter(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    message = page.get_by_label("Message", exact=True)

    with allure.step("Verify the initial character counter"):
        expect(page.get_by_text("0/2000", exact=True)).to_be_visible()

    with allure.step("Enter a message"):
        message.fill("Hello Playwright")

    with allure.step("Verify the updated character counter"):
        expect(page.get_by_text("16/2000", exact=True)).to_be_visible()


@allure.title("Verify email field input type")
@allure.description(
    "Verify that the contact form Email field uses the HTML email input "
    "type to support browser-level validation."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Contact Form")
@allure.feature("Email Validation")
def test_contact_email_field_type(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    with allure.step("Verify Email field input type"):
        expect(
            page.get_by_label("Email", exact=True)
        ).to_have_attribute("type", "email")


@allure.title("Verify contact page social links")
@allure.description(
    "Verify that the GitHub, LinkedIn, and Email links are visible "
    "on the contact page."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Contact Page")
@allure.feature("Social Links")
def test_contact_social_links(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    for name in ["GitHub", "LinkedIn", "Email"]:
        with allure.step(f"Verify {name} link is visible"):
            expect(
                page.get_by_role("link", name=name, exact=True)
            ).to_be_visible()


@allure.title("Verify contact form submit button")
@allure.description(
    "Verify that the Send message button is visible and accessible "
    "on the contact form."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Contact Form")
@allure.feature("Form Submission")
def test_contact_form_submit_button(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    with allure.step("Verify Send message button is visible"):
        expect(
            page.get_by_role(
                "button", name="Send message", exact=True
            )
        ).to_be_visible()


@allure.title("Verify contact form rejects invalid email")
@allure.description(
    "Verify that the Email field rejects an invalid email address "
    "through native browser email validation."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Contact Form")
@allure.feature("Email Validation")
def test_contact_form_rejects_invalid_email(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    email = page.get_by_label("Email", exact=True)

    with allure.step("Enter an invalid email address"):
        email.fill("invalid-email")

    with allure.step("Verify the email field uses email validation"):
        expect(email).to_have_attribute("type", "email")

    with allure.step("Verify the invalid email fails browser validation"):
        assert not email.evaluate(
            "el => el.validity.valid"
        ), "Invalid email should fail browser email validation"


@allure.title("Verify contact page footer navigation")
@allure.description(
    "Verify that the footer navigation is visible and contains "
    "the expected Home, Projects, Contact, and Resume links."
)
@allure.severity(allure.severity_level.NORMAL)
@allure.suite("Footer")
@allure.feature("Footer Navigation")
def test_contact_footer_loaded(page: Page):
    with allure.step("Navigate to the contact page"):
        page.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded")

    footer = page.get_by_role("navigation", name="Footer")

    with allure.step("Verify footer navigation is visible"):
        expect(footer).to_be_visible()

    for name in ["Home", "Projects", "Contact", "Resume"]:
        with allure.step(f"Verify {name} footer link is visible"):
            expect(
                footer.get_by_role("link", name=name, exact=True)
            ).to_be_visible()
