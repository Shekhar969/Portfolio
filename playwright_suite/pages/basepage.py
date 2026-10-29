
from config import BASE_URL, DEFAULT_TIMEOUT_MS


class BasePage:
    path = "/"

    def __init__(self, page):
        self.page = page

    def open(self):
        self.page.goto(
            f"{BASE_URL}{self.path}",
            timeout=DEFAULT_TIMEOUT_MS
        )
        return self

    def goto(self):
        return self.open()

    @property
    def url(self):
        return self.page.url

    def body_text(self):
        return self.page.locator("body").inner_text()

    def screenshot(self, path):
        self.page.screenshot(path=path)
