import os
import allure
import pytest
from dotenv import load_dotenv
from playwright.sync_api import Page, expect
from playwright.async_api import async_playwright

load_dotenv()

BASE_URL = "https://shekharrawal.com.np/"

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


def test_admin_login(page: Page):
    assert ADMIN_EMAIL, "ADMIN_EMAIL is missing from .env"
    assert ADMIN_PASSWORD, "ADMIN_PASSWORD is missing from .env"

    page.goto(BASE_URL + "/admin/login")
    page.get_by_label("Email").press_sequentially(ADMIN_EMAIL, delay=20)
    page.get_by_label("Password").press_sequentially(ADMIN_PASSWORD, delay=20)
    page.locator('[type="submit"]').click()

    expect(page).not_to_have_url("/admin")

    page.get_by_role("link", name="Projects", exact=True).click()
    expect(page).to_have_url(BASE_URL + "admin/projects")

    page.get_by_role("button", name="New Project").click()

    page.locator('input[name="title"]').press_sequentially(
        "My new test project", delay=20
    )
    page.get_by_label("Slug (web address)").clear()
    page.get_by_label("Slug (web address)").press_sequentially(
        "my-new-test-project", delay=20
    )
    page.locator('input[name="subtitle"]').press_sequentially(
        "Intelligent Image Analysis", delay=20
    )
    page.get_by_label("Summary", exact=True).press_sequentially(
        "An AI-powered application for image classification and visual analysis.",
        delay=20,
    )

    page.get_by_label("Web", exact=True).check()
    page.get_by_label("Frontend", exact=True).check()
    page.get_by_label("Backend", exact=True).check()
    page.get_by_label("AI", exact=True).check()
    page.get_by_label("Computer Vision", exact=True).check()
    page.get_by_label("Hardware", exact=True).check()
    page.get_by_label("IoT", exact=True).check()
    page.get_by_label("Open Source", exact=True).check()
    page.get_by_label("Academic", exact=True).check()
    page.get_by_label("Academic", exact=True).uncheck()

    page.get_by_label("Technologies", exact=True).press_sequentially(
        "React, Tailwind CSS, Firebase", delay=20
    )
    page.get_by_label("Year", exact=True).press_sequentially("2026", delay=20)

    page.get_by_label("Status", exact=True).select_option(label="Planned")

    page.get_by_label("GitHub link", exact=True).press_sequentially(
        "https://github.com/example/ai-vision-test-project", delay=20
    )
    page.get_by_label("Live demo link", exact=True).press_sequentially(
        "https://example.com/ai-vision-test-project", delay=20
    )
    page.get_by_label("Hover preview video (optional)", exact=True).press_sequentially(
        "/videos/ai-vision-preview.mp4", delay=20
    )

    page.get_by_label("Extra links (optional)", exact=True).press_sequentially(
        "API Documentation | https://example.com/api-docs\n"
        "Source (UI) | https://github.com/example/ai-vision-ui",
        delay=2,
    )

    page.get_by_label("Screenshots", exact=True).press_sequentially(
        "/images/ai-vision-dashboard.webp | AI vision dashboard\n"
        "/images/ai-vision-results.webp | Image analysis results",
        delay=2,
    )

    page.get_by_label("The problem", exact=True).press_sequentially(
        "Manual image inspection is time-consuming and difficult to scale. "
        "Users need a simple way to analyze images and review classification results.",
        delay=2,
    )

    page.get_by_label("Goals", exact=True).press_sequentially(
        "1. Build an intuitive image analysis interface.\n"
        "2. Integrate AI-based image classification.\n"
        "3. Display clear and understandable prediction results.",
        delay=2,
    )

    page.get_by_label("The solution", exact=True).press_sequentially(
        "Develop a web application that accepts images, processes them through "
        "an AI classification pipeline, and presents the results in a clear dashboard.",
        delay=2,
    )

    page.get_by_label("Architecture steps", exact=True).press_sequentially(
        "User uploads an image.\n"
        "Frontend validates the image.\n"
        "Backend processes the image.\n"
        "AI model generates predictions.\n"
        "Frontend displays the results.",
        delay=2,
    )

    page.get_by_label("Implemented features", exact=True).press_sequentially(
        "1. Responsive dashboard interface.\n"
        "2. Image upload interface.\n"
        "3. Classification result display.",
        delay=2,
    )

    page.get_by_label("Planned features", exact=True).press_sequentially(
        "1. Batch image processing.\n"
        "2. Prediction history.\n"
        "3. Exportable analysis reports.",
        delay=2,
    )

    page.get_by_label("Implementation", exact=True).press_sequentially(
        "The application uses a component-based frontend, a backend API for image "
        "processing, and an AI model for classification. The interface presents "
        "predictions and supporting information to the user.",
        delay=2,
    )

    page.get_by_label("Challenges", exact=True).press_sequentially(
        "1. Handling different image sizes and formats.\n"
        "2. Keeping image processing responsive.\n"
        "3. Presenting model predictions clearly.",
        delay=2,
    )

    page.get_by_label("Trade-offs", exact=True).press_sequentially(
        "1. Prioritized a simple interface over advanced customization.\n"
        "2. Focused on single-image processing before batch processing.\n"
        "3. Deferred prediction history to a future release.",
        delay=2,
    )

    page.get_by_label("Results", exact=True).press_sequentially(
        "The initial project provides a foundation for image analysis, with a "
        "clear workflow for submitting images and viewing classification results.",
        delay=2,
    )

    page.get_by_label("Lessons learned", exact=True).press_sequentially(
        "1. Validate user inputs early.\n"
        "2. Separate image processing from presentation logic.\n"
        "3. Communicate AI predictions in an understandable format.",
        delay=2,
    )

    page.get_by_label("Future work", exact=True).press_sequentially(
        "1. Add batch processing support.\n"
        "2. Improve model evaluation and monitoring.\n"
        "3. Add user accounts and analysis history.",
        delay=20,
    )

    page.locator('input[name="featured"]').check()
    page.locator('input[name="published"]').check()

    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(1000)
    page.reload()


def test_new_test_project_check(page: Page):
    page.goto(BASE_URL + "/projects")

    expect(
        page.get_by_role("heading", name="my projects.", exact=True)
    ).to_be_visible(timeout=10000)

    project = page.get_by_role(
        "link", name="My new test project", exact=True
    )

    expect(project).to_be_visible(timeout=10000)
    expect(project).to_have_attribute(
        "href", "/projects/my-new-test-project"
    )

    expect(
        page.get_by_text("Intelligent Image Analysis", exact=True)
    ).to_be_visible()


def test_delete_new_project(page: Page):
    assert ADMIN_EMAIL, "ADMIN_EMAIL is missing from .env"
    assert ADMIN_PASSWORD, "ADMIN_PASSWORD is missing from .env"

    page.goto(BASE_URL + "/admin/login")
    page.get_by_label("Email").press_sequentially(ADMIN_EMAIL, delay=20)
    page.get_by_label("Password").press_sequentially(ADMIN_PASSWORD, delay=20)
    page.locator('[type="submit"]').click()

    expect(page).not_to_have_url("/admin")

    page.get_by_role("link", name="Projects", exact=True).click()
    expect(page).to_have_url(BASE_URL + "admin/projects")

    project = page.locator("li").filter(
        has=page.get_by_text("My new test project", exact=True)
    )

    expect(project).to_be_visible()
    project.get_by_role("button", name="Delete", exact=True).click()

    expect(
        page.get_by_role("heading", name="Delete this project?", exact=True)
    ).to_be_visible()

    page.get_by_role("button", name="Delete", exact=True).last.click()

    expect(
        page.get_by_text("My new test project", exact=True)
    ).to_have_count(0)

    page.reload()
    page.wait_for_timeout(4000)
    
def test_new_test_project_delete_check(page: Page):
    page.goto(BASE_URL + "/projects")

    expect(
        page.get_by_role("heading", name="my projects.", exact=True)
    ).to_be_visible(timeout=10000)

    project = page.get_by_role(
        "link", name="My new test project", exact=True
    )

    expect(
        page.get_by_text("Intelligent Image Analysis", exact=True)
    ).not_to_be_visible()

    page.reload()
    page.wait_for_timeout(3000)