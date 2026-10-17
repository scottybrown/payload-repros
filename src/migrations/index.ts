import * as migration_20261017_025040_hosted from './20261017_025040_hosted';
import * as migration_20261017_033210_password_override from './20261017_033210_password_override';

export const migrations = [
  {
    up: migration_20261017_025040_hosted.up,
    down: migration_20261017_025040_hosted.down,
    name: '20261017_025040_hosted',
  },
  {
    up: migration_20261017_033210_password_override.up,
    down: migration_20261017_033210_password_override.down,
    name: '20261017_033210_password_override'
  },
];
