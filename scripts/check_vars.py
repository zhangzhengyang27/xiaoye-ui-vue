from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    print('=== CSS 变量检查 ===')
    html = page.locator('html').first
    vars_to_check = [
        '--el-fill-color',
        '--el-fill-color-light',
        '--el-fill-color-lighter',
        '--fill-color',
        '--fill-color-light',
        '--border-color',
        '--bg-color',
    ]
    for var in vars_to_check:
        val = html.evaluate(f'el => getComputedStyle(el).getPropertyValue("{var}")')
        print(f'{var}: {val}')

    print('\n=== 表格实际选择器和样式 ===')
    first_th = page.locator('.doc-content table th').first
    print('th 元素:', first_th.evaluate('''el => {
        return {
            tag: el.tagName,
            class: el.className,
            parentClass: el.parentElement?.className,
            parentTag: el.parentElement?.tagName,
            computedBg: getComputedStyle(el).backgroundColor,
            computedParentBg: getComputedStyle(el.parentElement).backgroundColor,
        };
    }'''))

    print('\n=== 检查是否有样式覆盖了表头背景 ===')
    print(first_th.evaluate('''el => {
        const styles = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText && rule.selectorText.includes('table') && rule.cssText.includes('background-color')) {
                        styles.push(rule.cssText);
                    }
                }
            } catch (e) {}
        }
        return styles.slice(0, 10);
    }'''))

    browser.close()
