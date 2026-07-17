from playwright.sync_api import sync_playwright
import sys

BASE_URL = 'http://127.0.0.1:5173'
PAGES = [
    '/guide/llm',
    '/llms.txt',
    '/llms-full.txt',
]

errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for path in PAGES:
        page = browser.new_page()
        url = f'{BASE_URL}{path}'
        print(f'Checking {url}')
        response = page.goto(url, wait_until='networkidle', timeout=60000)

        if response is None or response.status >= 400:
            errors.append(f'[{path}] HTTP {response.status if response else "no response"}')
            page.close()
            continue

        content = page.locator('body pre').inner_text() if path.endswith('.txt') else page.locator('body').inner_text()
        print(f'  status: {response.status}, length: {len(content)}')

        if path == '/guide/llm':
            if 'llms.txt' not in content or 'llms-full.txt' not in content:
                errors.append(f'[{path}] missing LLM file references')
        elif path.endswith('.txt'):
            if len(content) < 1000:
                errors.append(f'[{path}] content too short')

        page.close()

    browser.close()

print('\n--- Result ---')
if errors:
    for e in errors:
        print('ERROR:', e)
    sys.exit(1)
else:
    print('All LLM docs are accessible and valid.')
