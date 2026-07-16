import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import * as Vue from 'vue';
import Upload from '..';
import { errorRequest, successRequest } from './requests';
import PropsTypes from '../../_util/vue-types';
import { uploadListProps } from '../interface';
import { sleep } from '../../../tests/utils';
import { h } from 'vue';

uploadListProps.items = PropsTypes.any;

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const fileList = [
  {
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
  },
  {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

describe('Upload List', () => {
  // jsdom not support `createObjectURL` yet. Let's handle this.
  const originCreateObjectURL = window.URL.createObjectURL;
  window.URL.createObjectURL = vi.fn(() => '');
  const originHTMLCanvasElementGetContext = window.HTMLCanvasElement.prototype.getContext;
  window.HTMLCanvasElement.prototype.getContext = vi.fn(() => '');
  afterAll(() => {
    window.URL.createObjectURL = originCreateObjectURL;
    window.HTMLCanvasElement.prototype.getContext = originHTMLCanvasElementGetContext;
  });
  it('should use file.thumbUrl for <img /> in priority', async () => {
    const props = {
      props: {
        defaultFileList: fileList,
        listType: 'picture',
        action: '',
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await Vue.nextTick();
    fileList.forEach((file, i) => {
      const linkNode = wrapper.findAll('.xy-upload-list-item-thumbnail')[i];
      const imgNode = wrapper.findAll('.xy-upload-list-item-thumbnail img')[i];
      expect(linkNode.attributes().href).toBe(file.url);
      expect(imgNode.attributes().src).toBe(file.thumbUrl);
    });
  });

  it('should remove correct item when uid is 0', async () => {
    const list = [
      {
        uid: 0,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
      {
        uid: 1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ];
    const props = {
      props: {
        defaultFileList: list,
        action: '',
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await sleep();
    expect(wrapper.findAll('.xy-upload-list-item').length).toBe(2);
    wrapper.findAll('.xy-upload-list-item')[0].find('.anticon-delete').trigger('click');
    await sleep(400);
    // wrapper.update();
    expect(wrapper.findAll('.xy-upload-list-item').length).toBe(1);
  });

  it.skip('should be uploading when upload a file', async () => {
    await new Promise(resolve => {
      const props = {
        props: {
          action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
          customRequest: successRequest,
          onChange: ({ file }) => {
            if (file.status === 'uploading') {
              expect(wrapper.html()).toMatchSnapshot();
              resolve();
            }
            if (file.status === 'done') {
              expect(wrapper.html()).toMatchSnapshot();
              resolve();
            }
          },
        },
        slots: {
          default: () => h('button', 'upload'),
        },
        sync: false,
      };
      const wrapper = mount(Upload, props);
      setTimeout(() => {
        const mockFile = new File(['foo'], 'foo.png', {
          type: 'image/png',
        });
        wrapper.findComponent({ name: 'ajaxUploader' }).vm.onChange({
          target: {
            files: [mockFile],
          },
        });
      }, 0);
    });
  });

  it.skip('handle error', async () => {
    await new Promise(resolve => {
      const props = {
        props: {
          action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
          customRequest: errorRequest,
        },
        listeners: {
          change: ({ file }) => {
            if (file.status !== 'uploading') {
              expect(wrapper.html()).toMatchSnapshot();
              resolve();
            }
          },
        },
        slots: {
          default: () => h('button', 'upload'),
        },
        sync: false,
      };
      const wrapper = mount(Upload, props);
      setTimeout(() => {
        const mockFile = new File(['foo'], 'foo.png', {
          type: 'image/png',
        });
        wrapper.findComponent({ name: 'ajaxUploader' }).vm.onChange({
          target: {
            files: [mockFile],
          },
        });
      }, 0);
    });
  });

  it.skip('does concat filelist when beforeUpload returns false', async () => {
    const handleChange = vi.fn();
    const props = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        defaultFileList: fileList,
        beforeUpload: () => false,
        onChange: handleChange,
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);

    await new Promise(resolve => setTimeout(resolve, 0));
    const mockFile = new File(['foo'], 'foo.png', {
      type: 'image/png',
    });
    wrapper.findComponent({ name: 'ajaxUploader' }).vm.onChange({
      target: {
        files: [mockFile],
      },
    });
    await Vue.nextTick();
    expect(wrapper.vm.sFileList.length).toBe(fileList.length + 1);
    expect(handleChange.mock.calls[0][0].fileList).toHaveLength(3);
  });

  // it('work with form validation', (done) => {
  //   let errors
  //   const TestForm = {
  //     methods: {
  //       handleSubmit () {
  //         const { validateFields } = this.form
  //         validateFields((err) => {
  //           errors = err
  //         })
  //       },
  //     },
  //     render () {
  //       const { getFieldDecorator } = this.form

  //       return (
  //         <Form onSubmit={this.handleSubmit}>
  //           <Form.Item>
  //             {getFieldDecorator('file', {
  //               valuePropname: 'fileList',
  //               getValueFromEvent: e => e.fileList,
  //               rules: [
  //                 {
  //                   required: true,
  //                   validator: (rule, value, callback) => {
  //                     if (!value || value.length === 0) {
  //                       callback('file required')
  //                     } else {
  //                       callback()
  //                     }
  //                   },
  //                 },
  //               ],
  //             })(
  //               <Upload
  //                 beforeUpload={() => false}
  //               >
  //                 <button>upload</button>
  //               </Upload>
  //             )}
  //           </Form.Item>
  //         </Form>
  //       )
  //     },
  //   }

  //   const App = Form.create()(TestForm)
  //   console.dir(App)
  //   const wrapper = mount(() => {
  //     return <App />
  //   })
  //   setTimeout(async () => {
  //     wrapper.find(Form).trigger('submit')
  //     expect(errors.file.errors).toEqual([{ message: 'file required', field: 'file' }])

  //     const mockFile = new File(['foo'], 'foo.png', {
  //       type: 'image/png',
  //     })
  //     wrapper.findComponent({ name: 'ajaxUploader' }).vm.onChange({
  //       target: {
  //         files: [mockFile],
  //       },
  //     })
  //     wrapper.find(Form).trigger('submit')
  //     expect(errors).toBeNull()
  //     done()
  //   }, 0)
  // })

  it('should support onPreview', async () => {
    const handlePreview = vi.fn();
    const props = {
      props: {
        defaultFileList: fileList,
        listType: 'picture-card',
        action: '',
        onPreview: handlePreview,
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await sleep(500);
    wrapper.findAll('.anticon-eye')[0].trigger('click');
    expect(handlePreview).toBeCalledWith(fileList[0]);
    wrapper.findAll('.anticon-eye')[1].trigger('click');
    expect(handlePreview).toBeCalledWith(fileList[1]);
  });

  it('should support onRemove', async () => {
    const handleRemove = vi.fn();
    const handleChange = vi.fn();
    const props = {
      props: {
        defaultFileList: fileList,
        listType: 'picture-card',
        action: '',
        onRemove: handleRemove,
        onChange: handleChange,
      },

      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.findAll('.anticon-delete')[0].trigger('click');
    expect(handleRemove).toBeCalledWith(fileList[0]);
    wrapper.findAll('.anticon-delete')[1].trigger('click');
    expect(handleRemove).toBeCalledWith(fileList[1]);
    await delay(0);
    expect(handleChange.mock.calls.length).toBe(2);
  });

  it.skip('should generate thumbUrl from file', async () => {
    const handlePreview = vi.fn();
    const newFileList = [...fileList];
    const newFile = { ...fileList[0], uid: -3, originFileObj: new File([], 'xxx.png') };
    delete newFile.thumbUrl;
    newFileList.push(newFile);
    const props = {
      props: {
        defaultFileList: newFileList,
        listType: 'picture-card',
        action: '',
        onPreview: handlePreview,
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newFile2 = { ...fileList[2], uid: -4, originFileObj: new File([], 'xxx.png') };
    newFileList.push(newFile2);
    wrapper.setProps({
      defaultFileList: [...newFileList],
    });
    await delay(200);
    expect(wrapper.vm.sFileList[2].thumbUrl).not.toBe(undefined);
  });

  it('should non-image format file preview', async () => {
    const list = [
      {
        name: 'not-image',
        status: 'done',
        uid: -3,
        url: 'https://cdn.xxx.com/aaa.zip',
        thumbUrl: 'data:application/zip;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
        originFileObj: new File([], 'aaa.zip'),
      },
      {
        name: 'image',
        status: 'done',
        uid: -4,
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: -5,
        url: 'https://cdn.xxx.com/aaa.xx',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: -6,
        url: 'https://cdn.xxx.com/aaa.png/xx.xx',
      },
      {
        name: 'image',
        status: 'done',
        uid: -7,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
      },
      {
        name: 'image',
        status: 'done',
        uid: -8,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
        thumbUrl: 'data:image/png;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
      },
      {
        name: 'image',
        status: 'done',
        uid: -9,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=123',
      },
      {
        name: 'image',
        status: 'done',
        uid: -10,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png#anchor',
      },
      {
        name: 'image',
        status: 'done',
        uid: -11,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=some.query.with.dot',
      },
    ];
    const props = {
      props: {
        defaultFileList: list,
        listType: 'picture',
        action: '',
      },
      slots: {
        default: () => h('button', 'upload'),
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
