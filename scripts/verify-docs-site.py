from playwright.sync_api import sync_playwright
import sys

BASE_URL = 'http://127.0.0.1:5173'
PAGES = [
    '/',
    '/guide/',
    '/components/button.html',
    '/components/input.html',
    '/components/select.html',
]

errors = []
warnings = []

def log_console(msg, page_path):
    text = msg.text
    if msg.type == 'error':
        errors.append(f'[{page_path}] {text}')
    elif msg.type == 'warning':
        warnings.append(f'[{page_path}] {text}')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for path in PAGES:
        page = browser.new_page()
        page.on('console', lambda msg: log_console(msg, path))
        url = f'{BASE_URL}{path}'
        print(f'Navigating to {url}')
        page.goto(url, wait_until='networkidle', timeout=60000)
        page.wait_for_load_state('networkidle')

        title = page.title()
        print(f'  title: {title}')

        # Check for fatal VitePress errors
        if page.locator('text=RangeError').count() > 0:
            errors.append(f'[{path}] RangeError found on page')
        if page.locator('text=Cannot read').count() > 0:
            errors.append(f'[{path}] Runtime error found on page')

        # Check for xy- components rendering
        xy_count = page.locator('[class*="xy-"]').count()
        print(f'  xy- elements: {xy_count}')

        # Component pages: check demo containers
        if path.startswith('/components/'):
            demo_count = page.locator('.example').count()
            print(f'  demo blocks: {demo_count}')
            if demo_count < 3:
                errors.append(f'[{path}] demo blocks too few: {demo_count}')

        page.close()

    browser.close()

print('\n--- Verification Result ---')
if errors:
    print('Console / page errors:')
    for e in errors:
        print('  ERROR:', e)
else:
    print('No errors detected.')

if warnings:
    print('Warnings:')
    for w in warnings:
        print('  WARN:', w)
else:
    print('No warnings detected.')

sys.exit(1 if errors else 0)
