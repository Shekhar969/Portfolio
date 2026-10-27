import os
import uuid

import allure
import pytest
from dotenv import load_dotenv
from playwright.sync_api import Page, expect
from playwright.async_api import async_playwright

load_dotenv()

BASE_URL = "https://shekharrawal.com.np"

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

# Use the actual routes from the supplied admin navigation.
ADMIN_PATHS = [
    "/admin",
    "/admin/projects",
    "/admin/experience",
    "/admin/education",
    "/admin/messages",
    "/admin/settings",
]


@pytest.fixture(scope="function")
def admin_page(page: Page):
    """Authenticate and provide a page ready for admin tests."""

    assert ADMIN_EMAIL, "ADMIN_EMAIL environment variable is missing"
    assert ADMIN_PASSWORD, "ADMIN_PASSWORD environment variable is missing"

    with allure.step("Open admin login page"):
        page.goto(f"{BASE_URL}/admin/login", wait_until="domcontentloaded")

    with allure.step("Enter admin credentials"):
        page.get_by_label("Email", exact=True).fill(ADMIN_EMAIL)
        page.get_by_label("Password", exact=True).fill(ADMIN_PASSWORD)

    with allure.step("Sign in"):
        page.get_by_role("button", name="Sign in", exact=True).click()
        expect(page).not_to_have_url(f"{BASE_URL}/admin/login", timeout=15000)

    return page


@allure.title("Verify all admin routes load")
@allure.description(
    "Authenticate as an administrator and verify that every admin "
    "section loads its expected page heading."
)
@allure.severity(allure.severity_level.CRITICAL)
@allure.suite("Admin Navigation")
@allure.feature("Admin Routes")
@allure.story("All admin pages are accessible")
@allure.tag("admin", "navigation", "smoke")
def test_all_admin_routes_load(admin_page: Page):
    expected_headings = {
        "/admin": "Dashboard",
        "/admin/projects": "Projects",
        "/admin/experience": "Experience",
        "/admin/education": "Education",
        "/admin/messages": "Messages",
        "/admin/settings": "Settings",
    }

    for path in ADMIN_PATHS:
        with allure.step(f"Verify {path} loads"):
            response = admin_page.goto(
                f"{BASE_URL}{path}",
                wait_until="domcontentloaded",
            )

            assert response is not None, f"No HTTP response for {path}"
            assert response.status < 400, (
                f"{path} returned HTTP {response.status}"
            )

            expect(admin_page).to_have_url(f"{BASE_URL}{path}")
            expect(
                admin_page.get_by_role(
                    "heading",
                    name=expected_headings[path],
                    exact=True,
                )
            ).to_be_visible(timeout=10000)

@pytest.mark.skip("Throwing an error for sync async bhole harxu")
@allure.title("Check Firestore Listen API")
async def test_firestore_api():

    url = "7gnUbfEfiZac7HGG9dEktzGKUWy1"

    async with async_playwright() as p:
        request = await p.request.new_context()

        try:
            response = await request.get(url, timeout=10000)

            body = await response.text()

            print("\nStatus Code:", response.status)
            print("Response:", body[:2000])

            with allure.step("Verify API response"):
                assert response.status < 500, (
                    f"Server error: {response.status}"
                )

        finally:
            await request.dispose()