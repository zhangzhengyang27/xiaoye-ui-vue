from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    print('=== 检查 Button 相关 icon 样式规则 ===')
    rules = page.evaluate('''() => {
        const result = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText && (
                        rule.selectorText.includes('.xy-btn') && rule.selectorText.includes('icon')
                    )) {
                        result.push(rule.cssText);
                    }
                }
            } catch (e) {}
        }
        return result;
    }''')
    for r in rules[:30]:
        print(r)

    browser.close()
