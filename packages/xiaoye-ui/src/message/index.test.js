import { vi } from 'vitest';
import { asyncExpect } from '../../tests/utils';
import message, { getInstance } from '..';
import { SmileOutlined } from '@xiaoye-ui/icons';

describe('message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.outerHTML = '';
  });

  afterEach(() => {
    message.destroy();
  });

  afterEach(() => {
    message.destroy();
    vi.useRealTimers();
  });

  it('should be able to config top', async () => {
    message.config({
      top: '100px',
    });
    message.info('whatever');
    await asyncExpect(() => {
      expect(document.querySelectorAll('.xy-message')[0].style.top).toBe('100px');
    });
  });
  it('should be able to config getContainer', () => {
    message.config({
      getContainer: () => {
        const div = document.createElement('div');
        div.className = 'custom-container';
        document.body.appendChild(div);
        return div;
      },
    });
    message.info('whatever');
    expect(document.querySelectorAll('.custom-container').length).toBe(1);
  });

  it('should be able to config maxCount', async () => {
    message.config({
      maxCount: 5,
    });
    for (let i = 0; i < 10; i += 1) {
      message.info('test');
    }
    message.info('last');
    await Promise.resolve();
    vi.runAllTimers();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(5);
    expect(document.querySelectorAll('.xy-message-notice')[4].textContent).toBe('last');
  });

  it('should be able to hide manually', async () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(2);
    hide1();
    vi.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(1);
    hide2();
    vi.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(0);
  });

  it('should be able to destroy globally', async () => {
    message.info('whatever', 0);
    message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.xy-message').length).toBe(1);
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(2);
    message.destroy();
    expect(document.querySelectorAll('.xy-message').length).toBe(0);
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(0);
  });

  it('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  it('should have the default duration when using the onClose arguments', async () => {
    vi.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    await new Promise(resolve => {
      message.info('whatever', () => {
        // calculate the approximately duration value
        const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
        expect(aboutDuration).toBe(defaultDuration);
        resolve();
      });
    });
  });

  it('should be called like promise', async () => {
    vi.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    await message.info('whatever');
    // calculate the approximately duration value
    const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
    expect(aboutDuration).toBe(defaultDuration);
  });

  it('should hide message correctly', async () => {
    const hide = message.loading('Action in progress..', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(1);
    hide();
    await Promise.resolve();
    vi.runAllTimers();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(0);
  });
  it('should allow custom icon', async () => {
    message.open({ content: 'Message', icon: <SmileOutlined /> });
    await Promise.resolve();
    expect(document.querySelectorAll('.anticon-smile').length).toBe(1);
  });

  it('should have no icon', async () => {
    message.open({ content: 'Message' });
    await Promise.resolve();
    expect(document.querySelectorAll('.xy-message-notice .anticon').length).toBe(0);
  });
  it('should destroy messages correctly', async () => {
    message.loading('Action in progress1..', 0);
    message.loading('Action in progress2..', 0);
    setTimeout(() => message.destroy(), 1000);
    await Promise.resolve();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(2);
    vi.runAllTimers();
    expect(document.querySelectorAll('.xy-message-notice').length).toBe(0);
  });
});
