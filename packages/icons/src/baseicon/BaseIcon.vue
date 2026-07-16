<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'BaseIcon' });

const props = defineProps<BaseIconProps>();

const { pti } = useBaseIcon(props);
</script>
