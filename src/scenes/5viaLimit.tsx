import {Circle, Latex, Line, makeScene2D, Node, Ray, Rect, Txt} from '@motion-canvas/2d';
import {all, beginSlide, createEffect, createRef, createSignal, easeInCubic, easeInOutCubic, easeInOutExpo, linear, loop, makeRef, Random, range, Reference, sequence, useRandom, Vector2, waitFor, waitUntil} from '@motion-canvas/core';
import { backgroundColor, monoFont, titleFont } from '../vars';
import { CoordinateSystem } from '../components/CoordinateSystem';
import { makeConfetti } from '../confetti';

export default makeScene2D(function* (view) {
  const mainTex = createRef<Latex>()
  const eulerText = createRef<Txt>()

  view.add(<>
    <Latex
      ref={mainTex}
      fontSize={100}
      fill={'#fff'}
      tex={'{{e}}'}
    />

    <Txt
      ref={eulerText}
      fontSize={120}
      fill={'#fff'}
      fontWeight={700}
      fontFamily={monoFont}
    >
      uler'sche Zahl
    </Txt>
  </>)

  const eulerTextLeft = eulerText().left()
  eulerText().text('')
  eulerText().x(50)

  yield* mainTex().scale(0).scale(2, 1)

  yield* all(
    mainTex().right(eulerTextLeft.addX(50), 1),
    eulerText().text('uler\'sche Zahl', 1),
  )

  yield* beginSlide('viaLimit')

  const secondaryTex = createRef<Latex>()
  view.add(<Latex
    ref={secondaryTex}
    fontSize={100}
    fill={'#fff'}
    tex={'{{e}}'}
    scale={2}
  />)

  secondaryTex().right(eulerTextLeft.addX(50)),

  yield* all(
    eulerText().text('\xa0', 1),
    eulerText().x(100, 1),
    mainTex().x(0, 1),
    mainTex().y(-200, 1),
    mainTex().scale(1, 1),
    mainTex().tex('{{e}}{{=\\lim_{n\\to\\infty}}}{{\\left(1+}}{{\\frac}}{{{1}}}{{{n}}}{{\\right)^n}}', 1),
    secondaryTex().x(0, 1),
    secondaryTex().y(200, 1),
    secondaryTex().scale(1, 1),
    secondaryTex().tex('{{e}}{{=\\sum_{n=0}^{\\infty}}}{{\\frac}}{{{1}}}{{{n!}}}', 1)
  )

  eulerText().remove()

  yield* beginSlide('viaLimit_formel')

  yield* all(
    mainTex().tex('{{e}}^{x}{{=\\lim_{n\\to\\infty}}}{{\\left(1+}}{{\\frac}}{{{x}}}{{{n}}}{{\\right)^n}}', 1),
    secondaryTex().tex('{{e}}^{x}{{=\\sum_{n=0}^{\\infty}}}{{\\frac}}{{{x^n}}}{{{n!}}}', 1)
  )

  yield* beginSlide('viaLimit_formel_x')


  yield* all(
    mainTex().y(0, 1, easeInOutExpo),
    secondaryTex().opacity(0, 1, easeInOutExpo)
  )

  secondaryTex().remove()

  yield* beginSlide('viaLimit_formel_lim')

  yield* mainTex().tex('{{e}}^{i\\varphi}{{=\\lim_{n\\to\\infty}}}{{\\left(1+}}\\frac{i\\varphi}{n}{{\\right)^n}}', 0.5)

  yield* beginSlide('viaLimit_formel_i')

  function pow(re: number, im: number, n: number) {
    let _re = re
    let _im = im

    for (let i = 1; i < n; i++) {
      const __re = _re * re - _im * im
      const __im = _re * im + _im * re

      _re = __re
      _im = __im
    }

    return { re: _re, im: _im }
  }

  function pointsOfLimit(_n: number, phi: number): Vector2[] {
    const points: Vector2[] = []

    for (let n = 1; n <= _n; n++) {
      let { re, im } = pow(1, phi / _n, n)

      // only add every 5th point
      if (_n > 50 && n % Math.floor(_n / 50) !== 0 && n !== _n) {
        continue
      }
      points.push(new Vector2(re, im))
    }

    return points
  }

  const unit = view.width() / 8
  const coords = createRef<CoordinateSystem>()

  view.add(<>
    <CoordinateSystem
      ref={coords}
      width={'100%'}
      height={'100%'}
      spacing={unit}
      stroke={'#fff4'}
    >

    </CoordinateSystem>
  </>)

  const pointRef = createRef<Circle>()
  const linesRef: Line[] = []

  const phi = createSignal(1)
  const n = createSignal(1)

  let lastN = 0
  const pointsEffect = createEffect(() => {
    const _n = Math.floor(n())
    const _points = pointsOfLimit(_n, phi())

    if (_n === lastN) {
      for (let i = 0; i < _points.length; i++) {
        const isLast = i === _points.length - 1
        const p = _points[i]
        const last = _points[i - 1] ?? new Vector2(1, 0)

        if (isLast) {
          const point = pointRef()
          point.x(unit * p.x)
          point.y(unit * -p.y)
        }

        const line = linesRef[i]
        line.points([
          { x: unit * last.x, y: unit * -last.y },
          { x: unit * p.x, y: unit * -p.y }
        ])
      }
      return
    }
    lastN = _n

    pointRef()?.remove()

    linesRef.forEach(l => l.remove())
    linesRef.length = 0

    for (let i = 0; i < _points.length; i++) {
      const isLast = i === _points.length - 1
      const p = _points[i]
      const last = _points[i - 1] ?? new Vector2(1, 0)

      if (isLast) {
        const point = <Circle
          width={unit * 0.1}
          height={unit * 0.1}
          x={unit * p.x}
          y={unit * -p.y}
          fill={'#fff'}
        /> as Circle
        pointRef(point)
      }

      const line = <Line
        stroke={'#a8f'}
        lineWidth={8}
        lineCap={'round'}
        endArrow={_n <= 40}
        arrowSize={16}
        points={[
          { x: unit * last.x, y: unit * -last.y },
          { x: unit * p.x, y: unit * -p.y }
        ]}
      /> as Line

      linesRef.push(line)
    }

    coords().add(linesRef)
    coords().add(pointRef())
  })

  const nTex = createRef<Latex>()
  const nTexContainer = createRef<Rect>()
  const phiTex = createRef<Latex>()
  const phiTexContainer = createRef<Rect>()

  coords().add(<>
    <Rect
      ref={nTexContainer}
      width={() => nTex().width() + 40}
      height={() => nTex().height() + 40}
      fill={backgroundColor}
    >
      <Latex
        ref={nTex}
        fontSize={40}
        fill={'#fff'}
        tex={() => `n=${Math.floor(n())}`}
      />
    </Rect>
    <Rect
      ref={phiTexContainer}
      width={() => phiTex().width() + 40}
      height={() => phiTex().height() + 40}
      fill={backgroundColor}
      y={75}
    >
      <Latex
        ref={phiTex}
        fontSize={40}
        fill={'#fff'}
        tex={() => `{{\\varphi=}}${phi().toFixed(2)}`}
      />
    </Rect>
  </>)

  yield* all(
    mainTex().bottomLeft({
      x: -view.width() / 2 + 70,
      y: view.height() / 2 - 50
    }, 1, easeInOutExpo),
    mainTex().scale(0.6, 1, easeInOutExpo),

    coords().start(0.5).start(0, 1),
    coords().end(0.5).end(1, 1),
    nTexContainer().opacity(0).opacity(1, 1),
    phiTexContainer().opacity(0).opacity(1, 1),
    pointRef().opacity(0).opacity(1, 1),
    ...linesRef.map(l => l.opacity(0).opacity(1, 1)),
  )

  yield* beginSlide('viaLimit_limit')

  yield* n(10, 1, linear)

  yield* beginSlide('viaLimit_limit_n5')

  yield* phi(3, 1)

  yield* beginSlide('viaLimit_limit_phi3')

  yield* n(1000, 1, easeInOutCubic)

  pointsEffect()
  pointRef().remove()
  linesRef.forEach(l => l.remove())

  const phiAngleCircle = createRef<Circle>()
  coords().add(<>
    <Circle
      ref={phiAngleCircle}
      width={2 * unit}
      height={2 * unit}
      lineWidth={8}
      start={() => 1 - (phi() / Math.PI / 2)}
      lineCap={'round'}
      stroke={'#a8f'}
    />
    <Circle
      width={0.1 * unit}
      height={0.1 * unit}
      x={() => Math.cos(phi()) * unit}
      y={() => -Math.sin(phi()) * unit}
      fill={'#fff'}
    />
  </>)

  yield* beginSlide('viaLimit_limit_n1000')

  yield* phi(3.5, 1)

  yield* beginSlide('viaLimit_limit_phi_3_5')

  yield* phi(Math.PI, 4)

  yield* beginSlide('viaLimit_limit_phi_pi')

  yield* loop(6, (i) => {
    phiTex().tex(`{{\\varphi=}}${phi().toFixed(i + 2)}`)
    return waitFor(0.2)
  })

  yield* beginSlide('viaLimit_limit_phi_pi_precise')

  yield* phiTex().tex('{{\\varphi=}}{{\\pi}}', 1)

  yield* beginSlide('viaLimit_limit_phi_label_pi')

  yield* n(Number.MAX_SAFE_INTEGER, 1, easeInCubic)
  nTex().tex('n={{\\infty}}')

  yield* waitFor(1)

  yield* all(
    phiTexContainer().bottom({
      x: 0,
      y: view.height() / 2 - 50
    }, 1),
    phiTex().tex(`{{\\varphi=}}{{${(phi() / Math.PI).toFixed(2)}}}{{\\pi}}`, 1),
    nTexContainer().opacity(0, 1)
  )

  let phiEffect = createEffect(() => {
    phiTex().tex(`{{\\varphi=}}{{${(phi() / Math.PI).toFixed(2)}}}{{\\pi}}`)
  })

  yield* beginSlide('viaLimit_limit_phi_label_number_pi')

  yield* phi(Math.PI * 2, 1)
  phiAngleCircle().start(0)

  phiEffect()
  yield* phiTex().tex(`{{\\varphi=}}{{0.00}}{{\\pi}}`, 1)
  phi(0)

  phiEffect = createEffect(() => {
    phiTex().tex(`{{\\varphi=}}{{${(phi() / Math.PI).toFixed(2)}}}{{\\pi}}`)
  })

  const phiAngleRay = createRef<Ray>()
  const phiAngleArc = createRef<Circle>()
  const phiLatex = createRef<Latex>()
  coords().insert(<>
    <Latex
      ref={phiLatex}
      tex={'\\varphi'}
      fontSize={30}
      fill={'#ff9'}
      x={() => Math.cos(phi() / 2) * unit * 0.25}
      y={() => -Math.sin(phi() / 2) * unit * 0.25}
      opacity={0}
    />
    <Circle
      ref={phiAngleArc}
      width={0.75 * unit}
      height={0.75 * unit}
      lineWidth={6}
      start={() => 1 - (phi() / Math.PI / 2)}
      lineCap={'round'}
      stroke={'#ff9'}
      opacity={0}
    />
  </>, coords().children().indexOf(phiAngleCircle()))
  coords().insert(<>
    <Ray
      ref={phiAngleRay}
      fromX={0}
      fromY={0}
      toX={() => Math.cos(phi()) * unit}
      toY={() => -Math.sin(phi()) * unit}

      lineWidth={8}
      stroke={'#a8f'}
      lineCap={'round'}
    />
  </>, coords().children().indexOf(phiAngleCircle()) + 1)

  yield* all(
    phiAngleCircle().stroke('#fff', 1),
    phiAngleCircle().lineWidth(4, 1),
    phiAngleRay().start(1).start(0, 1),
  )
  phiAngleArc().opacity(1)
  yield* all(
    phi(Math.PI * 0.3, 1),
    phiLatex().opacity(1, 1),
  )

  yield* beginSlide('viaLimit_to_polar')

  yield* sequence(1.5,
    phi(Math.PI * 1.25, 1.5, easeInOutExpo),
    phi(Math.PI * 1.75, 1.5, easeInOutExpo),
    phi(Math.PI * .3, 1.5, easeInOutExpo),
  )

  yield* beginSlide('viaLimit_to_polar_example_phi')

  yield* all(
    mainTex().middle(Vector2.zero, 1),
    mainTex().scale(1, 1),
    coords().start(0.5, 1),
    coords().end(0.5, 1),
    coords().opacity(0, 1),
  )

  yield* beginSlide('viaLimit_to_polarform_1')

  yield* mainTex().tex('{{e}}^{i\\varphi}{{=}}\\cos({{\\varphi}})+{{i}}\\cdot \\sin({{\\varphi}})', 1)
  
  yield* beginSlide('viaLimit_to_polarform_2')

  yield* makeConfetti(view, 0.3)

  yield* beginSlide('viaLimit_to_polarform_confetti')

  yield* view.y(-view.height() / 2, .5, easeInCubic)
});