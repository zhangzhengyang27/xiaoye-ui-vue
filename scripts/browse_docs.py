from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page_errors = []
    console_messages = []

    page.on('console', lambda msg: console_messages.append(f'[{msg.type}] {msg.text}'))
    page.on('pageerror', lambda exc: page_errors.append(str(exc)))

    try:
        page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
        page.wait_for_timeout(3000)

        page.screenshot(path='/tmp/docs_button_full.png', full_page=True)
        page.screenshot(path='/tmp/docs_button_viewport.png')

        print('=== 页面标题 ===')
        print(page.title())
        print()

        print('=== Page Errors ===')
        for e in page_errors:
            print(e)
        if not page_errors:
            print('(无)')
        print()

        print('=== Console Errors/Warnings ===')
        for m in console_messages:
            if m.startswith('[error]') or m.startswith('[warning]'):
                print(m)
        if not any(m.startswith('[error]') or m.startswith('[warning]') for m in console_messages):
            print('(无)')
        print()

        # 表格检查
        print('=== 表格检查 ===')
        tables = page.locator('.doc-content table').all()
        print(f'文档内表格数量: {len(tables)}')
        if tables:
            first_table = tables[0]
            print(f'第一个表格行数: {first_table.locator("tr").count()}')
            th_styles = first_table.locator('th').first.evaluate('''el => {
                const cs = getComputedStyle(el);
                return {
                    borderTop: cs.borderTop,
                    borderBottom: cs.borderBottom,
                    borderRight: cs.borderRight,
                    padding: cs.padding,
                    backgroundColor: cs.backgroundColor,
                    fontWeight: cs.fontWeight,
                };
            }''')
            print('表头 th 样式:')
            for k, v in th_styles.items():
                print(f'  {k}: {v}')
        print()

        # Demo 插件检查
        print('=== Demo 插件尺寸检查 ===')
        first_demo = page.locator('.example').first
        if first_demo.count() > 0:
            showcase = first_demo.locator('.example-showcase').first
            op_btns = first_demo.locator('.op-btns').first
            print('example 容器:', first_demo.evaluate('''el => { const r = el.getBoundingClientRect(); return { width: r.width, height: r.height }; }'''))
            print('example-showcase:', showcase.evaluate('''el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { width: r.width, height: r.height, padding: cs.padding }; }'''))
            print('op-btns:', op_btns.evaluate('''el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { width: r.width, height: r.height, padding: cs.padding }; }'''))
        print()

    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()
        page.screenshot(path='/tmp/docs_error.png', full_page=True)
    finally:
        browser.close()
