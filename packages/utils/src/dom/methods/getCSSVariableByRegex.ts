export default function getCSSVariableByRegex(
  variableRegex: RegExp,
): { name: string | undefined; value: string | undefined } | null {
  for (const sheet of Array.from(document?.styleSheets)) {
    try {
      for (const rule of Array.from(sheet?.cssRules || [])) {
        for (const property of (rule as CSSStyleRule)?.style) {
          if (variableRegex.test(property)) {
            return {
              name: property,
              value: (rule as CSSStyleRule).style.getPropertyValue(property).trim(),
            };
          }
        }
      }
    } catch {}
  }

  return null;
}
