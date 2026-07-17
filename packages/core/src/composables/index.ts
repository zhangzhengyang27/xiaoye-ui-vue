// Core composables
import type { PropType } from 'vue';

export interface BaseIconProps {
  size?: string | number;
  strokeWidth?: string | number;
  fill?: string;
  spin?: boolean;
}

export const baseIconProps = {
  size: [String, Number] as PropType<string | number>,
  strokeWidth: [String, Number] as PropType<string | number>,
  fill: String,
  spin: Boolean,
};

export function useBaseIcon(props: BaseIconProps) {
  const pti = () => {
    const attrs: Record<string, any> = {};
    if (props.size) attrs.width = attrs.height = String(props.size);
    if (props.fill) attrs.fill = props.fill;
    if (props.strokeWidth) attrs['stroke-width'] = String(props.strokeWidth);
    return attrs;
  };
  return { pti };
}
