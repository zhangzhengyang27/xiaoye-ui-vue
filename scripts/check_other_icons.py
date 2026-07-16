from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    # 检查 input 组件
    page.goto('http://127.0.0.1:5173/components/input.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    print('=== Input 页面 ===')
    print('标题:', page.title())

    # 检查 input 中的 xyicon
    icons = page.locator('.xy-input .xyicon').all()
    print(f'input 中 xyicon 数量: {len(icons)}')

    # 检查 select 组件
    page.goto('http://127.0.0.1:5173/components/select.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    print('\n=== Select 页面 ===')
    print('标题:', page.title())
    icons = page.locator('.xy-select .xyicon').all()
    print(f'select 中 xyicon 数量: {len(icons)}')

    # 检查 alert 组件
    page.goto('http://127.0.0.1:5173/components/alert.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    print('\n=== Alert 页面 ===')
    print('标题:', page.title())
    icons = page.locator('.xy-alert .xyicon').all()
    print(f'alert 中 xyicon 数量: {len(icons)}')

    browser.close()
