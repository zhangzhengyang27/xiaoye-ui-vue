from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto('http://127.0.0.1:5173/components/button.html', wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(2000)

    first_demo = page.locator('.example').first
    showcase = first_demo.locator('.example-showcase').first
    space = showcase.locator('.xy-space').first

    print('=== example 容器尺寸 ===')
    print(first_demo.evaluate('''el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
            width: r.width,
            height: r.height,
            padding: cs.padding,
            margin: cs.margin,
            border: cs.border,
            boxSizing: cs.boxSizing,
        };
    }'''))

    print('\n=== example-showcase 尺寸 ===')
    print(showcase.evaluate('''el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
            width: r.width,
            height: r.height,
            padding: cs.padding,
            margin: cs.margin,
            backgroundColor: cs.backgroundColor,
        };
    }'''))

    print('\n=== a-space 尺寸 ===')
    print(space.evaluate('''el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
            width: r.width,
            height: r.height,
            margin: cs.margin,
            padding: cs.padding,
            marginBottom: cs.marginBottom,
        };
    }'''))

    print('\n=== a-space 内第一个 button 尺寸 ===')
    first_btn = space.locator('button').first
    print(first_btn.evaluate('''el => {
        const r = el.getBoundingClientRect();
        return { width: r.width, height: r.height };
    }'''))

    print('\n=== op-btns 尺寸 ===')
    op_btns = first_demo.locator('.op-btns').first
    print(op_btns.evaluate('''el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
            width: r.width,
            height: r.height,
            padding: cs.padding,
            margin: cs.margin,
        };
    }'''))

    print('\n=== 检查 example-showcase 内部是否有额外空元素 ===')
    children = showcase.evaluate('''el => {
        return Array.from(el.children).map(c => ({
            tag: c.tagName,
            class: c.className,
            height: c.getBoundingClientRect().height,
        }));
    }''')
    for c in children:
        print(c)

    browser.close()
