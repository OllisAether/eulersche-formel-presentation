import {Img, Latex, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import { monoFont, titleFont } from '../vars';
import { all, beginSlide, createRef, delay, easeInCubic, easeInOutExpo, easeOutBack, easeOutExpo, waitFor } from '@motion-canvas/core';

import thumb1 from '../assets/thumb1.jpg';
import thumb2 from '../assets/thumb2.jpg';
import { makeConfetti } from '../confetti';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(<>
    <Txt
      ref={title}
      fontSize={200}
      fontWeight={700}
      fontFamily={titleFont}
      fill={'#fff'}
    />
  </>);

  yield* all(
    title().text('WAS SOLLTE ICH MIR MERKEN?', 1.5, easeOutExpo),
  )

  yield* beginSlide('summary');

  const formulas = createRef<Rect>();
  
  view.add(<Rect
    layout
    ref={formulas}
    direction={'column'}
    alignItems={'center'}
    justifyContent={'center'}
    gap={50}
    y={50}
    stroke={'#a8f'}
    lineWidth={6}
    radius={24}
    padding={100}
    fill={'#a8f0'}
    opacity={0}
  >
    <Txt
      fill={'#fff'}
      fontSize={50}
      fontFamily={monoFont}
    >
      Euler'sche Formel
    </Txt>
    <Latex
      fill={'#fff'}
      fontSize={80}
      tex={'e^{i\\varphi}=\\cos(\\varphi)+i\\sin(\\varphi)'}
    />

    <Txt
      fill={'#fff'}
      fontSize={50}
      fontFamily={monoFont}
      marginTop={150}
    >
      Euler'sche Identität
    </Txt>
    <Latex
      fill={'#fff'}
      fontSize={80}
      tex={'e^{i\\pi}+1=0'}
    />
  </Rect>)

  yield* all(
    title().fontSize(80, 1.5, easeInOutExpo),
    title().text('ZUSAMMENFASSUNG', 1.5, easeInOutExpo),
    title().topLeft({
      x: -view.width() / 2 + 50,
      y: -view.height() / 2 + 40
    }, 1.5, easeInOutExpo),
    delay(0.5, all(
      formulas().opacity(1, 1, easeInOutExpo),
      formulas().start(1).start(0, 3, easeInOutExpo),
      delay(2, formulas().fill('#a8f2', 1)),
    ))
  )

  yield* beginSlide('summary_formulas');

  const questionTitle = createRef<Txt>();

  view.add(<Txt
    ref={questionTitle}
    fontSize={300}
    fill={'#fff'}
    fontWeight={700}
    fontFamily={titleFont}
    opacity={0}
  >
    FRAGEN?
  </Txt>)

  yield* all(
    title().opacity(0.2, 1, easeInOutExpo),
    formulas().opacity(0.2, 1, easeInOutExpo),
    questionTitle().opacity(1, 1, easeInOutExpo),
  )

  yield* beginSlide('summary_questions');

  yield* view.y(-view.height() / 2, .5, easeInCubic);
});