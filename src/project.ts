import {makeProject} from '@motion-canvas/core';
import canvasConfetti from 'canvas-confetti';

import './fonts.css';

import titel from './scenes/1titel?scene';
import wiederholdung from './scenes/3wiederholdung?scene';
import probleme from './scenes/4probleme?scene';
import inhalt from './scenes/2inhalt?scene';
import end from './scenes/99end?scene';
import viaLimit from './scenes/5viaLimit?scene';
import viaTaylor from './scenes/6viaTaylor?scene';
import reason from './scenes/7reason?scene';
import summary from './scenes/8summary?scene';

export default makeProject({
  scenes: [
    titel,
    inhalt,
    wiederholdung,
    probleme,
    viaLimit,
    viaTaylor,
    reason,
    summary,
    end
  ]
});
