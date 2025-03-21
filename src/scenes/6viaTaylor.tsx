import {Circle, Latex, makeScene2D, Node, Ray, Rect} from '@motion-canvas/2d';
import {all, beginSlide, createRef, delay, easeInCubic, easeInOutExpo, makeRef, range, waitFor, waitUntil} from '@motion-canvas/core';
import { makeConfetti } from '../confetti';
import { backgroundColor } from '../vars';

export default makeScene2D(function* (view) {
  const mainTex = createRef<Latex>()
  view.add(<>
    <Latex
      ref={mainTex}
      opacity={0}
      fontSize={100}
      fill={'#fff'}
      tex={'{{e}}^{{z}}{{=}}\\sum_{n=0}^{\\infty}{{\\frac}}{{{z}}^{{n}}}{{{n}}{{!}}}'}
    />
  </>)

  yield* mainTex().opacity(1, 1)

  yield* beginSlide('viaTaylor')

  yield* all(
    mainTex().scale(0.6, 1),
    mainTex().tex('{{e}}^{{z}}{{=}} 1 + {{z}} + {{\\frac}}{{{z}}^{{2}}}{{{2}}{{!}}} + {{\\frac}}{{{z}}^{{3}}}{{{3}}{{!}}} + {{\\frac}}{{{z}}^{{4}}}{{{4}}{{!}}} + {{\\frac}}{{{z}}^{{5}}}{{{5}}{{!}}} + {...}', 1)
  )
  yield* beginSlide('viaTaylor_long')
  
  yield* mainTex().tex('{{e}}^{{{i\\varphi}}}{{=}} 1 + {{i\\varphi}} + {{\\frac}}{{{(i\\varphi)}}^{{2}}}{{{2}}{{!}}} + {{\\frac}}{{{(i\\varphi)}}^{{3}}}{{{3}}{{!}}} + {{\\frac}}{{{(i\\varphi)}}^{{4}}}{{{4}}{{!}}} + {{\\frac}}{{{(i\\varphi)}}^{{5}}}{{{5}}{{!}}} + {...}', 1)
  
  yield* beginSlide('viaTaylor_inset_i')

  const arrows: Circle[] = []
  const iCircleLabels: Latex[] = []
  const iCircle = createRef<Rect>()
  const iCycleEquations = createRef<Rect>()

  const radius = 250
  view.add(<>
    <Rect y={150} ref={iCircle}>
      <Ray
        stroke={'#88888a'}
        lineWidth={5}
        endArrow
        arrowSize={15}
        fromY={radius * 1.4}
        toY={-radius * 1.4}
      />
      <Ray
        stroke={'#88888a'}
        lineWidth={5}
        endArrow
        arrowSize={15}
        fromX={-radius * 1.4}
        toX={radius * 1.4}
      />
      <Rect
        fill={backgroundColor}
        layout
        padding={10}
        x={radius}
      >
        <Latex
          tex={'1'}
          fill={'#fff'}
          fontSize={50}
        />
      </Rect>
      <Rect
        fill={backgroundColor}
        layout
        padding={10}
        y={-radius}
      >
        <Latex
          tex={'i'}
          fill={'#fff'}
          fontSize={50}
        />
      </Rect>
      <Rect
        fill={backgroundColor}
        layout
        padding={10}
        x={-radius}
      >
        <Latex
          tex={'-1'}
          fill={'#fff'}
          fontSize={50}
        />
      </Rect>
      <Rect
        fill={backgroundColor}
        layout
        padding={10}
        y={radius}
      >
        <Latex
          tex={'-i'}
          fill={'#fff'}
          fontSize={50}
        />
      </Rect>
      {range(4).map(i => <Node>
        <Circle
          ref={makeRef(arrows, i)}
          width={radius * 2}
          height={radius * 2}
          stroke={'#a8f'}
          lineWidth={8}
          startArrow
          lineCap={'round'}
          arrowSize={20}
          start={0.03 + 0.25 * i}
          end={0.22 + 0.25 * i}
        />
        <Latex
          ref={makeRef(iCircleLabels, i)}
          fill={'#a8f'}
          x={(radius + 50) * Math.cos(0.25 * i * Math.PI * 2 + 0.25 * Math.PI)}
          y={(radius + 50) * Math.sin(0.25 * i * Math.PI * 2 + 0.25 * Math.PI)}
          tex={'\\cdot i'}
        />
      </Node>)}
    </Rect>
    <Rect
      layout
      direction={'column'}
      gap={20}
      x={350}
      y={150}
      ref={iCycleEquations}
      opacity={0}
    >
      <Latex
        tex={'i^1=i'}
        fill={'#fff'}
        fontSize={50}
      />
      <Latex
        tex={'i^2=-1'}
        fill={'#fff'}
        fontSize={50}
      />
      <Latex
        tex={'i^3=-i'}
        fill={'#fff'}
        fontSize={50}
      />
      <Latex
        tex={'i^4=1'}
        fill={'#fff'}
        fontSize={50}
      />
      <Latex
        tex={'i^5=i'}
        fill={'#fff'}
        fontSize={50}
      />
    </Rect>
  </>)
  
  yield* all(
    mainTex().scale(0.6, 1, easeInOutExpo),
    mainTex().top({
      x: 0,
      y: -view.height() / 2 + 100
    }, 1, easeInOutExpo),
    iCircle().opacity(0).opacity(1, 1, easeInOutExpo),
    ...arrows.map(arrow => {
      const start = arrow.start()
      arrow.start(arrow.end())

      return all(
        delay(0.5, arrow.start(start, 1, easeInOutExpo))
      )
    }),
    ...iCircleLabels.map(label => {
      label.opacity(0)
      return delay(0.5, label.opacity(1, 1, easeInOutExpo))
    }),
  )

  yield* beginSlide('viaTaylor_inset_cycle_1')

  yield* all(
    iCircle().x(-200, 1),
    iCycleEquations().opacity(1, 1, easeInOutExpo),
  )

  yield* beginSlide('viaTaylor_inset_cycle_2')

  yield* all(
    iCircle().opacity(0, 1, easeInOutExpo),
    iCycleEquations().opacity(0, 1, easeInOutExpo),
    mainTex().y(0, 1, easeInOutExpo),
  )
  mainTex().tex('{{e}}^{i\\varphi}{{=}} 1 + i\\varphi {{+}} {{\\frac}}{({{i}}{{\\varphi}}){{^2}}}{{{2}}{{!}}} + {{\\frac}}{({{i}}{{\\varphi}}){{^3}}}{{{3}}{{!}}} + {{\\frac}}{({{i}}{{\\varphi}}){{^4}}}{{{4}}{{!}}} + {{\\frac}}{({{i}}{{\\varphi}}){{^5}}}{{{5}}{{!}}} + {...}')
  yield* mainTex().tex('{{e}}^{i\\varphi}{{=}} 1 + i\\varphi {{+}} {{\\frac}}{-{{\\varphi}}{{^2}}}{{{2}}{{!}}} + {{\\frac}}{{{-i}}{{\\varphi}}{{^3}}}{{{3}}{{!}}} + {{\\frac}}{{{}}{{\\varphi}}{{^4}}}{{{4}}{{!}}} + {{\\frac}}{{{i}}{{\\varphi}}{{^5}}}{{{5}}{{!}}} + {...}', 1)
  
  mainTex().tex('e^{i\\varphi}= 1 + i\\varphi {{+}} \\frac{{{-}}\\varphi^2}{2!} {{+}} \\frac{{{-}}i\\varphi^3}{3!} + \\frac{\\varphi^4}{4!} + \\frac{i\\varphi^5}{5!} {{+}} {{{...}}}')
  yield* mainTex().tex('e^{i\\varphi}= 1 + i\\varphi {{-}} \\frac{{{}}\\varphi^2}{2!} {{-}} \\frac{{{}}i\\varphi^3}{3!} + \\frac{\\varphi^4}{4!} + \\frac{i\\varphi^5}{5!} {{-}} {{{...}}}', 1)
  

  yield* beginSlide('viaTaylor_inset_cycle_3')

  mainTex().tex('e^{i\\varphi}= 1 {{+ i\\varphi}} {{- \\frac{\\varphi^2}{2!}}} {{- \\frac{i\\varphi^3}{3!}}} {{+ \\frac{\\varphi^4}{4!}}} {{+ \\frac{i\\varphi^5}{5!}}} - {{{...}}}')
  yield* mainTex().tex('e^{i\\varphi}= 1 {{- \\frac{\\varphi^2}{2!}}} {{+ \\frac{\\varphi^4}{4!}}} - {{{...}}} {{+ i\\varphi}} {{- \\frac{i\\varphi^3}{3!}}} {{+ \\frac{i\\varphi^5}{5!}}} - {{{...}}}', 1)
  
  mainTex().tex('e^{i\\varphi}= 1 {{- \\frac{\\varphi^2}{2!}}} {{+ \\frac{\\varphi^4}{4!}}} - {{{...}}} + {{i}}{{\\varphi -}} {{\\frac}}{{{i}}{{\\varphi^3}}}{{{3!}}} {{+}} {{\\frac}}{{{i}}{{\\varphi^5}}}{{{5!}}} {{-}} {{{...}}}')
  yield* mainTex().tex('e^{i\\varphi}= 1 {{- \\frac{\\varphi^2}{2!}}} {{+ \\frac{\\varphi^4}{4!}}} - {{{...}}} + {{i}} \\left({{\\varphi -}} {{\\frac}}{ {{\\varphi^3}}}{{{3!}}} {{+}} {{\\frac}}{ {{\\varphi^5}}}{{{5!}}} {{-}} {{{...}}}{{\\right)}}', 1)

  mainTex().tex('e^{i\\varphi}= 1 {{- \\frac{\\varphi^2}{2!}}} {{+ \\frac{\\varphi^4}{4!}}} - {{{...}}} + {{i}}\\left({{\\varphi}} {{- \\frac{\\varphi^3}{3!}}} {{+ \\frac{\\varphi^5}{5!}}} {{-}} {{{...}}}\\right)')
  yield* all(
    mainTex().scale(0.4, 1),
    mainTex().tex('e^{i\\varphi}= 1 {{- \\frac{\\varphi^2}{2!}}} {{+ \\frac{\\varphi^4}{4!}}} {{- \\frac{\\varphi^6}{6!}}} {{+ \\frac{\\varphi^8}{8!}}} - {{{...}}} + {{i}}\\left({{\\varphi}} {{- \\frac{\\varphi^3}{3!}}} {{+ \\frac{\\varphi^5}{5!}}} {{- \\frac{\\varphi^7}{7!}}} {{+ \\frac{\\varphi^9}{9!}}} {{-}} {{{...}}}\\right)', 1)
  )

  yield* beginSlide('viaTaylor_inset_cycle_4')

  const sinSeries = createRef<Latex>()
  const cosSeries = createRef<Latex>()

  view.add(<>
    <Latex
      ref={sinSeries}
      tex={'\\sin(\\varphi) = \\varphi - \\frac{\\varphi^3}{3!} + \\frac{\\varphi^5}{5!} - \\frac{\\varphi^7}{7!} + \\frac{\\varphi^9}{9!} - ...'}
      fill={'#fff'}
      fontSize={50}
      y={0}
    />
    <Latex
      ref={cosSeries}
      tex={'\\cos(\\varphi) = 1 - \\frac{\\varphi^2}{2!} + \\frac{\\varphi^4}{4!} - \\frac{\\varphi^6}{6!} + \\frac{\\varphi^8}{8!} - ...'}
      fill={'#fff'}
      fontSize={50}
      y={200}
    />
  </>)

  yield* all(
    mainTex().y(-300, 1, easeInOutExpo),
    sinSeries().opacity(0).opacity(1, 1, easeInOutExpo),
    cosSeries().opacity(0).opacity(1, 1, easeInOutExpo),
  )

  yield* beginSlide('viaTaylor_inset_cycle_5')

  mainTex().tex('{{e^{i\\varphi}}} {{=}} 1 - \\frac{\\varphi^2}{2!} + \\frac{\\varphi^4}{4!} - \\frac{\\varphi^6}{6!} + \\frac{\\varphi^8}{8!} - {...} {{+}} {{i}}\\left(\\varphi - \\frac{\\varphi^3}{3!} + \\frac{\\varphi^5}{5!} - \\frac{\\varphi^7}{7!} + \\frac{\\varphi^9}{9!} - {...}\\right)')
  yield* all(
    mainTex().tex('{{e^{i\\varphi}}} {{=}} \\cos({{\\varphi}}){{+}}{{i}}\\cdot \\sin({{\\varphi}})', 1),
    mainTex().scale(0.8, 1, easeInOutExpo),
  )

  mainTex().tex('{{e}}^{{{i}}{{\\varphi}}} {{=}} \\cos({{\\varphi}}){{+}}{{i}}\\cdot \\sin({{\\varphi}})'),
  yield* all(
    mainTex().tex('{{e}}^{{{i}}{{\\varphi}}} {{=}} \\cos({{\\varphi}}){{+}}{{i}}\\cdot \\sin({{\\varphi}})', 1),
    mainTex().scale(1, 1, easeInOutExpo),
    mainTex().y(0, 1, easeInOutExpo),
    sinSeries().opacity(0, 1, easeInOutExpo),
    cosSeries().opacity(0, 1, easeInOutExpo),
  )

  yield* beginSlide('viaTaylor_inset_cycle_6')

  yield* makeConfetti(view, 0.3);

  yield* beginSlide('viaTaylor_confetti')

  mainTex().tex('{{e}}^{i{{\\varphi}}}{{=}}\\cos({{\\varphi}})+{{i}}\\cdot \\sin({{\\varphi}})')
  yield* mainTex().tex('{{e}}^{i{{\\pi}}}{{=}}\\cos({{\\pi}})+{{i}}\\cdot \\sin({{\\pi}})', 1)
  
  yield* beginSlide('viaTaylor_to_identity_1')
  
  mainTex().tex('{{e}}^{i{{\\pi}}}{{=}}\\cos(\\pi){{+}}{{i}}\\cdot \\sin(\\pi)')
  yield* mainTex().tex('{{e}}^{i{{\\pi}}}{{=}}-{{1}}{{+}}{{i}}{{0}}', 1)
  
  yield* beginSlide('viaTaylor_to_identity_2')

  yield* mainTex().tex('{{e}}^{i{{\\pi}}}{{+}}{{1}}{{=}}{{0}}', 1)
  
  yield* beginSlide('viaTaylor_to_identity_3')

  yield* makeConfetti(view, 3)

  yield* beginSlide('viaTaylor_to_identity_confetti')

  yield* view.y(-view.height() / 2, .5, easeInCubic);
});