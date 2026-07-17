import type { App } from 'vue';
import Upload, { LIST_IGNORE } from './Upload';
import Dragger from './Dragger';
import { registerComponent } from '../_util/registerComponent';

export type { UploadProps, UploadListProps, UploadChangeParam, UploadFile } from './interface';

/* istanbul ignore next */
export const UploadDragger = Dragger;

export default Object.assign(Upload, {
  Dragger,
  LIST_IGNORE,
  install(app: App) {
    registerComponent(app, Upload);
    registerComponent(app, Dragger);
    return app;
  },
});
