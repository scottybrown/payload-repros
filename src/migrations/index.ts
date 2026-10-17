import * as migration_20261017_014912_posts from './20261017_014912_posts';

export const migrations = [
  {
    up: migration_20261017_014912_posts.up,
    down: migration_20261017_014912_posts.down,
    name: '20261017_014912_posts'
  },
];
