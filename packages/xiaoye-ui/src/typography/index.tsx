import type { App, Plugin } from 'vue';
import Base from './Base';
import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';
import Typography from './Typography';
import { registerComponent } from '../_util/registerComponent';

export type { TypographyProps } from './Typography';

Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;
Typography.Link = Link;
Typography.Base = Base;

Typography.install = function (app: App) {
  registerComponent(app, Typography);
  registerComponent(app, Text);
  registerComponent(app, Title);
  registerComponent(app, Paragraph);
  registerComponent(app, Link);
  return app;
};

export {
  Text as TypographyText,
  Title as TypographyTitle,
  Paragraph as TypographyParagraph,
  Link as TypographyLink,
};

export default Typography as typeof Typography &
  Plugin & {
    readonly Text: typeof Text;
    readonly Title: typeof Title;
    readonly Paragraph: typeof Paragraph;
    readonly Link: typeof Link;
    readonly Base: typeof Base;
  };
