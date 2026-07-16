const OLD_NODE_ENV = process.env.NODE_ENV;

describe('xiaoye-ui', () => {
  let xiaoyeUI;

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    xiaoyeUI = await import('..');
  });

  afterAll(() => {
    process.env.NODE_ENV = OLD_NODE_ENV;
  });

  it('exports modules correctly', () => {
    expect(Object.keys(xiaoyeUI)).toMatchSnapshot();
  });
});
