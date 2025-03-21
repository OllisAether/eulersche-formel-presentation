import {Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import { monoFont, titleFont } from '../vars';
import { all, beginSlide, createRef, delay, easeInOutExpo, easeOutBack, easeOutExpo, waitFor } from '@motion-canvas/core';

import thumb1 from '../assets/thumb1.jpg';
import thumb2 from '../assets/thumb2.jpg';
import { makeConfetti } from '../confetti';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  const sourcesLayout = createRef<Rect>();
  const source1 = createRef<Rect>();
  const source2 = createRef<Rect>();
  const source3 = createRef<Rect>();

  view.add(<>
    <Txt
      ref={title}
      fontSize={250}
      fontWeight={700}
      fontFamily={titleFont}
      fill={'#fff'}
    />
    <Rect
      ref={sourcesLayout}
      layout
      opacity={0}
      direction={'row'}
      alignItems={'start'}
      justifyContent={'center'}
      gap={100}
      y={-80}
    >
      <Rect
        ref={source1}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Img
          src={thumb1}
          width={view.width() * 0.3}
          radius={10}
          stroke={'#a8f4'}
          lineWidth={6}
        />
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#fff'}
          marginTop={30}
          textWrap
          width={view.width() * 0.3 - 20}
        >
          Euler's formula with introductory group theory
        </Txt>
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#fff8'}
          marginTop={5}
          width={view.width() * 0.3 - 20}
        >
          3Blue1Brown - @3blue1brown
          {'\n'}
          03. März 2017
        </Txt>
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#a8f'}
          marginTop={50}
          width={view.width() * 0.3 - 20}
        >
          https://youtu.be/mvmuCPvRoWQ
        </Txt>
      </Rect>
      <Rect
        ref={source2}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Img
          src={thumb2}
          width={view.width() * 0.3}
          radius={10}
          stroke={'#a8f4'}
          lineWidth={6}
        />
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#fff'}
          marginTop={30}
          textWrap
          width={view.width() * 0.3 - 20}
        >
          The Most Beautiful Equation
        </Txt>
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#fff8'}
          marginTop={5}
          width={view.width() * 0.3 - 20}
        >
          Digital Genius - @digitalgenius111
          {'\n'}
          22. Dezember 2023
        </Txt>
        <Txt
          fontFamily={monoFont}
          fontSize={20}
          fill={'#a8f'}
          marginTop={50}
          width={view.width() * 0.3 - 20}
        >
          https://youtu.be/ppRgvfIJsgU
        </Txt>
      </Rect>
    </Rect>

    <Rect
      ref={source3}
      y={view.height() / 2 - 200}
      layout
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      opacity={0}
    >
      <Txt
        fontFamily={monoFont}
        fontSize={30}
        fill={'#fff'}
        marginBottom={10}
      >
        Jan-Mark Iniotakis (29. April 2020)
      </Txt>
      <Txt
        fontFamily={monoFont}
        fontSize={25}
        fill={'#fff8'}
      >
        Mathemathik und ihre Anwendungen I - Komplexe Zahlen
      </Txt>
      <Txt
        fontFamily={monoFont}
        fontSize={30}
        fill={'#fff'}
        marginTop={50}
        marginBottom={10}
      >
        Eulersche Formel - Wikipedia
      </Txt>
      <Txt
        fontFamily={monoFont}
        fontSize={25}
        fill={'#fff8'}
      >
        Bearbeitungsstand: 31.01.2025, 13:23 UTC
      </Txt>
      <Txt
        fontFamily={monoFont}
        fontSize={25}
        fill={'#a8f'}
      >
        https://de.wikipedia.org/wiki/Eulersche_Formel
      </Txt>
    </Rect>
  </>);

  yield* all(
    title().text('ENDE', 1.5, easeOutExpo),
  )

  yield* makeConfetti(view, 0.3);

  yield* beginSlide('end');
  
  yield* all(
    title().scale(0.5, 1, easeInOutExpo),
    title().top({
      y: -view.height() / 2 + 20,
      x: 0
    }, 1, easeInOutExpo),
    title().text('QUELLEN', 1, easeInOutExpo),
    delay(0.4, all (
      sourcesLayout().opacity(1, .75),
      sourcesLayout().gap(1000).gap(200, .75, easeOutExpo),
      source3().opacity(1, .75),
    )),
  )

  yield* beginSlide('sources');
});