
import pytest
from config import ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL
from pages.page_admin_login import AdminLoginPage
from pages.page_admin_logout import AdminLogout
from pages.paths import ADMIN_PATHS

def test_admin_login(page):
    login = AdminLoginPage(page).goto()
    login.login(ADMIN_EMAIL, ADMIN_PASSWORD)

    page.wait_for_url("**/admin")
    assert "/admin" in page.url


def test_admin_login_wrong_password(page):
    login = AdminLoginPage(page).goto()
    login.login(ADMIN_EMAIL, "WrongPassword123!")

    assert "/admin/login" in page.url


def test_admin_logout(page):
    login = AdminLoginPage(page).goto()
    login.login(ADMIN_EMAIL, ADMIN_PASSWORD)

    logout = AdminLogout(page)
    logout.logout()

    assert "/admin/login" in page.url


@pytest.mark.parametrize("path", ADMIN_PATHS)
def test_unauthenticated_user_redirected_to_login(page, path):
    page.goto(f"{BASE_URL}{path}")
    page.wait_for_timeout(1000)
    assert "/admin/login" in page.url
