from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    # 定位到 icon demo
    icon_demo = page.locator('.example').filter(has_text='Search').first
    print('=== icon demo 数量 ===', icon_demo.count())

    # 找带 Search 文字的按钮
    btn = icon_demo.locator('.xy-btn').filter(has_text='Search').first
    print('按钮 html:', btn.inner_html())
    print('按钮 class:', btn.get_attribute('class'))

    # 检查 computed style
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

    # 检查 button 内部子元素
    children = btn.evaluate('''el => {
        return Array.from(el.children).map(c => ({
            tag: c.tagName,
            class: c.className,
            display: getComputedStyle(c).display,
            flexDirection: getComputedStyle(c).flexDirection,
            alignItems: getComputedStyle(c).alignItems,
        }));
    }''')
    print('按钮内部子元素:', children)

    # 检查是否有全局样式污染 button
    print('\n=== 检查 button 相关样式规则 ===')
    print(page.evaluate('''() => {
        const rules = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText && (
                        rule.selectorText.includes('.xy-btn') ||
                        rule.selectorText.includes('button') && rule.cssText.includes('flex')
                    )) {
                        rules.push(rule.cssText);
                    }
                }
            } catch (e) {}
        }
        return rules.slice(0, 20);
    }'''))

    browser.close()
