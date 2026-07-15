const OLD_NODE_ENV = process.env.NODE_ENV;
process.env.NODE_ENV = 'development';
const xiaoyeUI = require('..');

describe('xiaoye-ui', () => {
  afterAll(() => {
    process.env.NODE_ENV = OLD_NODE_ENV;
  });

  it('exports modules correctly', () => {
    expect(Object.keys(xiaoyeUI)).toMatchSnapshot();
  });
});
