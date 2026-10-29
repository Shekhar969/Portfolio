from pages.basepage import BasePage

class AdminLoginPage(BasePage):
    path = "/admin/login"

    def login(self, email, password):
        self.page.locator('input[type="email"]').fill(email)
        self.page.locator('input[type="password"]').fill(password)
        self.page.locator('button[type="submit"]').click()
        return self
