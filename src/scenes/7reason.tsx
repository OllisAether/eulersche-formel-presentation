import {Circle, Latex, makeScene2D, Ray, Rect, Txt} from '@motion-canvas/2d';
import { all, beginSlide, createRef, createSignal, delay, easeInCubic, easeInOutBack, easeInOutExpo, waitFor } from '@motion-canvas/core';
import { titleFont } from '../vars';
import { CoordinateSystem } from '../components/CoordinateSystem';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>()

  view.add(<>
    <Txt
      ref={title}
      fontSize={200}
      fontWeight={700}
      fontFamily={titleFont}
      fill={'#fff'}
    />
  </>)

  yield* title().text('WARUM?', 1)

  // yield* waitFor(0.5)

  const coords = createRef<CoordinateSystem>()

  const unit = view.width() / 8

  const phi = createSignal(0)
  const phiLatex = createRef<Rect>()

  view.add(<>
    <CoordinateSystem
      ref={coords}
      opacity={0}
      width={'100%'}
      height={'150%'}
      stroke={'#fff2'}
      spacing={unit}
    >
      <Circle
        width={unit * 2}
        height={unit * 2}
        stroke={'#fff8'}
        lineWidth={4}
      />
      <Ray
        fromX={0}
        fromY={0}
        toX={() => unit * Math.cos(phi())}
        toY={() => unit * -Math.sin(phi())}
        stroke={'#a8f'}
        lineCap={'round'}
        lineWidth={6}
        lineDash={[10, 10]}
      />
      <Circle
        width={unit * 2}
        height={unit * 2}
        stroke={'#ff9'}
        start={() => 1.008 - Math.min(1, phi() / (2 * Math.PI))}
        rotation={() => Math.min(0, -phi() * 180 / Math.PI + 360)}
        lineWidth={8}
        startArrow
        lineCap={'round'}
        arrowSize={18}
      />
      <Latex
        ref={phiLatex}
        fill={'#ff9'}
        x={() => unit * 1.6 * Math.cos(phi() / 2)}
        y={() => unit * 1.25 * -Math.sin(phi() / 2)}
        fontSize={40}
        tex={() => `\\varphi = ${(phi() / Math.PI).toFixed(2)}\\pi`}
      />
      <Circle
        width={24}
        height={24}
        fill={'#fff'}
        lineWidth={4}
        x={() => unit * Math.cos(phi())}
        y={() => unit * -Math.sin(phi())}
      />
    </CoordinateSystem>
  </>)

  yield* all(
    title().fontSize(80, 1.5, easeInOutExpo),
    title().topLeft({
      x: -view.width() / 2 + 50,
      y: -view.height() / 2 + 40
    }, 1.5, easeInOutExpo),
    delay(0.5, coords().opacity(1, 1, easeInOutExpo))
  )

  yield* phi(0.25 * Math.PI, 1)

  yield* beginSlide('reason_coords')

  const mainTex = createRef<Latex>()
  view.add(<>
    <Latex
      ref={mainTex}
      tex={'{{f}}{{(x)}}{{=}}{{e^x}}'}
      fill={'#fff'}
      fontSize={120}
    />
  </>)

  yield* all(
    coords().opacity(0, 1, easeInOutExpo),
    mainTex().opacity(0).opacity(1, 1, easeInOutExpo)
  )

  yield* mainTex().tex('{{f}}\'{{(x)}}{{=}}\\frac{d}{dx}{{e^x}}', 1)
  yield* mainTex().tex('\\frac{d}{dx}{{e^x}}{{=}}{?}', 1)
  
  yield* beginSlide('reason_e-definition1')
  yield* mainTex().tex('\\frac{d}{dx}{{e^x}}={{e^x}}', 1)
  
  yield* beginSlide('reason_e-definition2')

  mainTex().tex('\\frac{d}{dx}{{e^}}{ {{x}} }={{e^x}}')
  yield* mainTex().tex('\\frac{d}{dx}{{e^}}{ {{a}} {{x}} }={{{?}}}', 1)
  
  yield* beginSlide('reason_e-definition3')

  yield* mainTex().tex('\\frac{d}{dx}{{e^}}{ {{a}} {{x}} }={{a}}{{e^}}{ {{a}}{{x}} }', 1)
  
  yield* beginSlide('reason_e-rate1')
  
  yield* mainTex().tex('\\frac{d}{dx}{{e^}}{ {{i}} {{x}} }={{i}}{{e^}}{ {{i}}{{x}} }', 1)
  
  yield* beginSlide('reason_e-rate2')
  
  coords().y(100)
  phiLatex().remove()

  phi(0)
  
  coords().insert(<>
    <Ray
      fromX={unit}
      fromY={0}
      toX={unit}
      toY={-unit}
      rotation={() => -phi() * 180 / Math.PI}
      stroke={'#f44'}
      lineCap={'round'}
      lineWidth={8}
      endArrow
      arrowSize={20}
    />
  </>, coords().children.length - 1)

  yield* all(
    coords().opacity(1, 1, easeInOutExpo),
    mainTex().scale(0.6, 1, easeInOutExpo),
    mainTex().y(-360, 1, easeInOutExpo),
  )

  yield* beginSlide('reason_e-rate3')

  yield* phi(0.25 * Math.PI, 3)
  
  yield* beginSlide('reason_e-rate4')
  
  yield* phi(10.25 * Math.PI, 3)
  phi(2.25 * Math.PI)
  yield* phi(.25 * Math.PI, 2)

  yield* beginSlide('reason_e-rate5')

  yield* view.y(-view.height() / 2, .5, easeInCubic);
});