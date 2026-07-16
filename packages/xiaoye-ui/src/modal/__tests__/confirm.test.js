import Modal from '..';
import { sleep } from '../../../tests/utils';
const { confirm } = Modal;
vi.mock('../../_util/Portal');

describe('Modal.confirm triggers callbacks correctly', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  document.createDocumentFragment = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
  };
  afterEach(() => {
    errorSpy.mockReset();
    document.body.innerHTML = '';
    Modal.destroyAll();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  function $$(className) {
    return document.body.querySelectorAll(className);
  }

  function open(args) {
    vi.useFakeTimers();
    confirm({
      title: 'Want to delete these items?',
      content: 'some descriptions',
      ...args,
    });
    vi.runAllTimers();
    vi.useRealTimers();
  }

  it('trigger onCancel once when click on cancel button', async () => {
    const onCancel = vi.fn();
    const onOk = vi.fn();
    open({
      onCancel,
      onOk,
    });
    await sleep();
    // first Modal
    $$('.xy-btn')[0].click();
    expect(onCancel.mock.calls.length).toBe(1);
    expect(onOk.mock.calls.length).toBe(0);
  });

  it('trigger onOk once when click on ok button', async () => {
    const onCancel = vi.fn();
    const onOk = vi.fn();
    open({
      onCancel,
      onOk,
    });
    await sleep();
    // second Modal
    $$('.xy-btn-primary')[0].click();
    expect(onCancel.mock.calls.length).toBe(0);
    expect(onOk.mock.calls.length).toBe(1);
  });

  it('should allow Modal.comfirm without onCancel been set', async () => {
    open();
    await sleep();
    // Third Modal
    $$('.xy-btn')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should allow Modal.comfirm without onOk been set', async () => {
    open();
    await sleep();
    // Fourth Modal
    $$('.xy-btn-primary')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('ok only', async () => {
    open({ okCancel: false });
    await sleep();
    expect($$('.xy-btn')).toHaveLength(1);
    expect($$('.xy-btn')[0].innerHTML).toContain('OK');
  });

  it('allows extra props on buttons', async () => {
    open({
      okButtonProps: { disabled: true },
      cancelButtonProps: { 'data-test': 'baz' },
    });
    await sleep();
    expect($$('.xy-btn')).toHaveLength(2);
    expect($$('.xy-btn')[0].attributes['data-test'].value).toBe('baz');
    expect($$('.xy-btn')[1].disabled).toBe(true);
  });

  it('trigger onCancel once when click on cancel button', async () => {
    const onCancel = vi.fn();
    const onOk = vi.fn();
    await open({
      title: 'title',
      content: 'content',
      onCancel,
      onOk,
    });
    await sleep();
    $$('.xy-btn')[0].click();
    expect(onCancel.mock.calls.length).toBe(1);
    expect(onOk.mock.calls.length).toBe(0);
  });
});
