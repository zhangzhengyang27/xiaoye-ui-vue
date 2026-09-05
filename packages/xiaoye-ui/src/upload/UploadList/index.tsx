import { LoadingOutlined, PaperClipOutlined, PictureTwoTone, FileTwoTone } from '@xiaoye-ui/icons';
import type { InternalUploadFile, UploadFile } from '../interface';
import { uploadListProps } from '../interface';
import { previewImage, isImageUrl } from '../utils';
import type { ButtonProps } from '../../button';
import Button from '../../button';
import ListItem from './ListItem';
import type { HTMLAttributes } from 'vue';
import {
  triggerRef,
  watch,
  computed,
  defineComponent,
  onMounted,
  shallowRef,
  watchEffect,
  TransitionGroup,
} from 'vue';
import { filterEmpty, initDefaultProps, isValidElement } from '../../_util/props-util';
import type { VueNode } from '../../_util/type';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getTransitionGroupProps } from '../../_util/transition';
import collapseMotion from '../../_util/collapseMotion';
import { openSafeWindow } from '../../_util/safeUrl';

const HackSlot = (_, { slots }) => {
  return filterEmpty(slots.default?.())[0];
};

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYUploadList',
  props: initDefaultProps(uploadListProps(), {
    listType: 'text', // or picture
    progress: {
      strokeWidth: 2,
      showInfo: false,
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: previewImage,
    isImageUrl,
    items: [],
    appendActionVisible: true,
  }),
  setup(props, { slots, expose }) {
    const callEvent = (fn: any, ...args: any[]) => {
      if (Array.isArray(fn)) {
        fn.forEach(f => f?.(...args));
      } else {
        fn?.(...args);
      }
    };
    const motionAppear = shallowRef(false);
    onMounted(() => {
      motionAppear.value = true;
    });
    const mergedItems = shallowRef<any[]>([]);

    // 记录已发起过缩略图预览的文件，避免在 props.items 上写标记（会改动父组件数据）
    const previewedUids = new Set<string>();
    const previewedFiles = new WeakSet<object>();

    const isPreviewed = (file: InternalUploadFile) =>
      file.uid != null ? previewedUids.has(String(file.uid)) : previewedFiles.has(file);

    const markPreviewed = (file: InternalUploadFile) => {
      if (file.uid != null) {
        previewedUids.add(String(file.uid));
      } else {
        previewedFiles.add(file);
      }
    };

    watch(
      () => props.items,
      (val = []) => {
        // 复制元素而非 slice 浅拷贝：后续写入 thumbUrl 只作用于副本，不污染 props.items，
        // 也就不会反过来触发下面的 deep watch，避免「监听源被自身修改」的循环
        mergedItems.value = val.map(file => ({ ...file }));
      },
      {
        immediate: true,
        deep: true,
      },
    );

    watchEffect(() => {
      if (props.listType !== 'picture' && props.listType !== 'picture-card') {
        return;
      }
      (props.items || []).forEach((file: InternalUploadFile) => {
        if (
          typeof document === 'undefined' ||
          typeof window === 'undefined' ||
          !(window as any).FileReader ||
          !(window as any).File ||
          !(file.originFileObj instanceof File || (file.originFileObj as Blob) instanceof Blob) ||
          file.thumbUrl !== undefined ||
          !props.previewFile ||
          isPreviewed(file)
        ) {
          return;
        }

        markPreviewed(file);

        props.previewFile(file.originFileObj as File).then((previewDataUrl: string) => {
          const thumbUrl = previewDataUrl || '';
          // 异步回调期间 mergedItems 可能已重建，按 uid 精确定位而非依赖索引
          const target = mergedItems.value.find(item => item.uid === file.uid);
          if (target && target.thumbUrl !== thumbUrl) {
            target.thumbUrl = thumbUrl;
            triggerRef(mergedItems);
          }
        });
      });
    });

    // ============================= Events =============================
    const onInternalPreview = (file: UploadFile, e?: Event) => {
      if (!props.onPreview) {
        return;
      }
      e?.preventDefault();
      return callEvent(props.onPreview, file);
    };

    const onInternalDownload = (file: UploadFile) => {
      if (typeof props.onDownload === 'function') {
        callEvent(props.onDownload, file);
      } else if (file.url) {
        // 协议白名单 + noopener，避免 javascript: 伪协议与反向标签劫持
        openSafeWindow(file.url);
      }
    };

    const onInternalClose = (file: UploadFile) => {
      callEvent(props.onRemove, file);
    };

    const internalIconRender = ({ file }: { file: UploadFile }) => {
      const iconRender = props.iconRender || slots.iconRender;
      if (iconRender) {
        return iconRender({ file, listType: props.listType });
      }
      const isLoading = file.status === 'uploading';
      const fileIcon =
        props.isImageUrl && props.isImageUrl(file) ? <PictureTwoTone /> : <FileTwoTone />;
      let icon: VueNode = isLoading ? <LoadingOutlined /> : <PaperClipOutlined />;
      if (props.listType === 'picture') {
        icon = isLoading ? <LoadingOutlined /> : fileIcon;
      } else if (props.listType === 'picture-card') {
        icon = isLoading ? props.locale.uploading : fileIcon;
      }
      return icon;
    };

    const actionIconRender = (opt: {
      customIcon: VueNode;
      callback: () => void;
      prefixCls: string;
      title?: string;
    }) => {
      const { customIcon, callback, prefixCls, title } = opt;
      const btnProps: ButtonProps & HTMLAttributes = {
        type: 'text',
        size: 'small',
        title,
        onClick: () => {
          callback();
        },
        class: `${prefixCls}-list-item-action`,
      };
      if (isValidElement(customIcon)) {
        return <Button {...btnProps} v-slots={{ icon: () => customIcon }} />;
      }
      return (
        <Button {...btnProps}>
          <span>{customIcon}</span>
        </Button>
      );
    };

    expose({
      handlePreview: onInternalPreview,
      handleDownload: onInternalDownload,
    });

    const { prefixCls, rootPrefixCls } = useConfigInject('upload', props);

    const listClassNames = computed(() => ({
      [`${prefixCls.value}-list`]: true,
      [`${prefixCls.value}-list-${props.listType}`]: true,
    }));
    const transitionGroupProps = computed(() => {
      const motion = {
        ...collapseMotion(`${rootPrefixCls.value}-motion-collapse`),
      };
      delete motion.onAfterAppear;
      delete motion.onAfterEnter;
      delete motion.onAfterLeave;
      const motionConfig = {
        ...getTransitionGroupProps(
          `${prefixCls.value}-${props.listType === 'picture-card' ? 'animate-inline' : 'animate'}`,
        ),
        class: listClassNames.value,
        appear: motionAppear.value,
      };
      return props.listType !== 'picture-card'
        ? {
            ...motion,
            ...motionConfig,
          }
        : motionConfig;
    });
    return () => {
      const {
        listType,
        locale,
        isImageUrl: isImgUrl,
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        removeIcon,
        previewIcon,
        downloadIcon,
        progress,
        appendAction,
        itemRender,
        appendActionVisible,
      } = props;
      const appendActionDom = appendAction?.();
      const items = mergedItems.value;
      return (
        <TransitionGroup {...transitionGroupProps.value} tag="div">
          {items.map(file => {
            const { uid: key } = file;
            return (
              <ListItem
                key={key}
                locale={locale}
                prefixCls={prefixCls.value}
                file={file}
                items={items}
                progress={progress}
                listType={listType}
                isImgUrl={isImgUrl}
                showPreviewIcon={showPreviewIcon}
                showRemoveIcon={showRemoveIcon}
                showDownloadIcon={showDownloadIcon}
                onPreview={onInternalPreview}
                onDownload={onInternalDownload}
                onClose={onInternalClose}
                removeIcon={removeIcon}
                previewIcon={previewIcon}
                downloadIcon={downloadIcon}
                itemRender={itemRender}
                v-slots={{
                  ...slots,
                  iconRender: internalIconRender,
                  actionIconRender,
                }}
              />
            );
          })}
          {appendAction ? (
            <HackSlot
              key="__xy_upload_appendAction"
              v-show={!!appendActionVisible}
              v-slots={{ default: () => appendActionDom }}
            ></HackSlot>
          ) : null}
        </TransitionGroup>
      );
    };
  },
});
