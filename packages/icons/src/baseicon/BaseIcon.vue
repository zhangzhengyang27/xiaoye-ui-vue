<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'BaseIcon' });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<BaseIconProps>();

useBaseIcon(props);
</script>
