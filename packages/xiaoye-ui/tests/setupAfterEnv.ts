import { defaultConfig } from '../src/theme/internal';

// Not use dynamic hashed for test env since version will change hash dynamically.
defaultConfig.hashed = false;
