
from playwright.sync_api import APIRequestContext

def test_projects_homepage(playwright):
    request = playwright.request.new_context()

    response = request.get("https://shekharrawal.com.np")

    print("Status Code:", response.status)

    assert response.status == 200

    request.dispose()

def test_projects_projects(playwright):
    url = "https://shekharrawal.com.np/projects"

    api_request_context: APIRequestContext = (playwright.request.new_context())

    try:
        response = api_request_context.get(url)

        print("Status Code:", response.status)
        print("Response URL:", response.url)
        print("Response Body:", response.text())

        assert response.status == 200, (
            f"Expected status 200, but got {response.status}"
        )

    finally:
        api_request_context.dispose()
