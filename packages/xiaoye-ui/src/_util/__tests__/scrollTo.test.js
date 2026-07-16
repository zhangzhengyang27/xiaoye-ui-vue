import scrollTo from '../scrollTo';

describe('Test ScrollTo function', () => {
  let dateNowMock;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    dateNowMock = vi
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 1000);
  });

  afterEach(() => {
    dateNowMock.mockRestore();
  });

  it('test scrollTo', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
    });

    scrollTo(1000);

    vi.runAllTimers();
    expect(window.pageYOffset).toBe(1000);

    scrollToSpy.mockRestore();
  });

  it('test callback - option', async () => {
    const cbMock = vi.fn();
    scrollTo(1000, {
      callback: cbMock,
    });
    vi.runAllTimers();
    expect(cbMock).toHaveBeenCalledTimes(1);
  });

  it('test getContainer - option', async () => {
    const div = document.createElement('div');
    scrollTo(1000, {
      getContainer: () => div,
    });
    vi.runAllTimers();
    expect(div.scrollTop).toBe(1000);
  });
});
