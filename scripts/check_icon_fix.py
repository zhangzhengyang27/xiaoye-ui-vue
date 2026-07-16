from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page_errors = []
    page.on('pageerror', lambda exc: page_errors.append(str(exc)))

    page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(3000)

    page.screenshot(path='/tmp/docs_button_icon.png', full_page=True)

    print('=== Page Errors ===')
    for e in page_errors:
        print(e)
    if not page_errors:
        print('(无)')
    print()

    # 找到 icon demo
    icon_demo = page.locator('.example').filter(has_text='Search').first
    print('icon demo 数量:', icon_demo.count())

    if icon_demo.count() > 0:
        # 找带 Search 文字的按钮
        btn = icon_demo.locator('.xy-btn').filter(has_text='Search').first
        print('按钮 html:', btn.inner_html())
        print('按钮 class:', btn.get_attribute('class'))

        styles = btn.evaluate('''el => {
            const cs = getComputedStyle(el);
            return {
                display: cs.display,
                flexDirection: cs.flexDirection,
                alignItems: cs.alignItems,
                justifyContent: cs.justifyContent,
                height: cs.height,
                width: cs.width,
                padding: cs.padding,
                lineHeight: cs.lineHeight,
            };
        }''')
        print('按钮 computed style:', styles)

        # 检查内部 xy-btn-icon
        icon_span = btn.locator('.xy-btn-icon').first
        print('xy-btn-icon 数量:', icon_span.count())
        if icon_span.count() > 0:
            print('xy-btn-icon display:', icon_span.evaluate('el => getComputedStyle(el).display'))
            print('xy-btn-icon html:', icon_span.inner_html()[:100])

        # 检查文字 span
        text_span = btn.locator('span').filter(has_text='Search').first
        print('文字 span marginInlineStart:', text_span.evaluate('el => getComputedStyle(el).marginInlineStart'))

    # 检查相关 CSS 规则
    print('\n=== Button icon 相关样式规则 ===')
    rules = page.evaluate('''() => {
        const result = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText && rule.selectorText.includes('.xy-btn') && rule.selectorText.includes('icon')) {
                        result.push(rule.cssText);
                    }
                }
            } catch (e) {}
        }
        return result;
    }''')
    for r in rules[:20]:
        print(r)

    browser.close()
