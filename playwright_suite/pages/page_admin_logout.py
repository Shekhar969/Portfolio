import config
from pages.basepage import BasePage

class AdminLogout(BasePage):
    path = "/admin"

    def logout(self):
        self.page.get_by_role("button",name="Sign out").click()
        self.page.wait_for_url("**/admin/login",timeout=config.DEFAULT_TIMEOUT_MS)

        return self
