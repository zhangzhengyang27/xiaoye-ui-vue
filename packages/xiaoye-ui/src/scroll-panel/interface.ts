import type { ExtractPropTypes } from 'vue';

export const scrollPanelProps = () => ({
  step: { type: Number, default: 5 },
});

export type ScrollPanelProps = Partial<ExtractPropTypes<ReturnType<typeof scrollPanelProps>>>;
