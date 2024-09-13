import { checkBuildEnvironment } from './core/Environment';
import { gameInit } from './core/Game';

checkBuildEnvironment();
gameInit().catch(console.error);
