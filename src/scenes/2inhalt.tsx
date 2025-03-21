import { Circle, Latex, Line, makeScene2D, Node, Ray, Rect, Txt } from '@motion-canvas/2d';
import { all, beginSlide, cancel, chain, createEffect, createRef, createSignal, delay, easeInCubic, easeInOutExpo, easeOutCubic, easeOutExpo, linear, loop, makeRef, range, sequence, Vector2, waitFor, waitUntil } from '@motion-canvas/core';
import { backgroundColor, monoFont, titleFont } from '../vars';
import { CoordinateSystem } from '../components/CoordinateSystem';

export default makeScene2D(function* (view) {
  const subjects = [
    'Wiederholung',
    'Probleme & Schwierigkeiten',
    'Eulersche Zahl',
    'Herleitung mit Grenzwert',
    'Herleitung mit Taylorreihe',
    'Die Eulersche Identität',
  ]

  const titles: Rect[] = []

  const highlight = createRef<Rect>()
  const layout = createRef<Rect>()

  const split = 0.56
  view.add(<>
    <Rect
      ref={highlight}
      width={view.width() * (1 - split) - 80 + 32}
      height={64}
      fill={'#a8f2'}
      radius={16}
      opacity={0}
      stroke={'#a8f8'}
      lineWidth={3}
    ></Rect>
    <Rect
      ref={layout}
      width={view.width() * split - 40}
      height={view.height() - 64}
      right={{x: view.width() / 2 - 32, y: 0}}
      fill={'rgb(9, 8, 11)'}
      stroke={'#fff1'}
      lineWidth={2}
      radius={16}
      clip
    >
      <Txt
        bottomLeft={() => ({
          x: (-view.width() * split + 100) / 2,
          y: (view.height() - 32) / 2
        })}
        opacity={0.05}
        fill={'#fff'}
        fontSize={200}
        fontWeight={700}
        fontFamily={titleFont}
      >
        VORSCHAU
      </Txt>
    </Rect>
    <Rect
      width={view.width() * (1 - split) - 40}
      height={view.height() - 64}
      left={{x: -view.width() / 2 + 32, y: 0}}
      layout
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {subjects.map((subject, i) => <>
        <Rect
          ref={makeRef(titles, i)}
          width={'100%'}
          layout
          direction={'row'}
          justifyContent={'start'}
          alignItems={'start'}
          marginBottom={50}
          opacity={0}
        >
          <Txt
            fill={'#fff'}
            fontSize={40}
            fontFamily={monoFont}
            marginRight={16}
          >{(i + 1).toString()}.</Txt>
          <Txt
            fill={'#fff'}
            fontSize={40}
            fontFamily={monoFont}
            textWrap
          >{subject}</Txt>
        </Rect>
      </>)}
    </Rect>
  </>);

  yield* all(
    layout().left({x: view.width() / 2, y: 0}).right({x: view.width() / 2 - 32, y: 0}, 1, easeOutExpo),
    ...titles.map((title, i) => delay(i * 0.1, all(
      title.opacity(0).opacity(0.3, 0.5),
    ))),
  )

  function* hightlight (i: number) {
    if (i === 0) {
      highlight().left({
        x: -view.width() / 2 + 16,
        y: titles[i].middle().y
      })
      highlight().height(titles[i].height() + 32)
    }

    yield* all(
      ...(i === 0 ? [
        highlight().opacity(1, 0.5),
      ] : [
        highlight().left({
          x: -view.width() / 2 + 16,
          y: titles[i].middle().y
        }, 0.5),
        highlight().height(titles[i].height() + 32, 0.5),
      ]),
      ...titles.filter((_, j) => j !== i).map((title) => title.opacity(0.3, 0.5)),
      titles[i].opacity(1, 0.5)
    );
  }

  yield* beginSlide('inhalt_0')

  let unit = view.width() / 9

  const coords = createRef<CoordinateSystem>()
  const axisX = createRef<Ray>()
  const axisY = createRef<Ray>()
  const imLabel = createRef<Txt>()
  const reLabel = createRef<Txt>()

  layout().add(<>
    <CoordinateSystem
      ref={coords}
      width={'100%'}
      height={'100%'}
      spacing={unit}
      stroke={'#fff4'}
    >
      <Ray
        ref={axisX}
        fromX={-layout().width() / 2}
        fromY={0}
        toX={layout().width() / 2}
        toY={0}
        stroke={'#844'}
        lineWidth={4}
        endArrow
        arrowSize={10}
        end={0}
      />
      <Ray
        ref={axisY}
        fromX={0}
        fromY={layout().height() / 2}
        toX={0}
        toY={-layout().height() / 2}
        stroke={'#484'}
        lineWidth={4}
        endArrow
        arrowSize={10}
        end={0}
      />
      <Txt
        ref={reLabel}
        fill={'#844'}
        fontSize={40}
        fontWeight={700}
        fontFamily={monoFont}
      >
        Re
      </Txt>
      <Txt
        ref={imLabel}
        fill={'#484'}
        fontSize={40}
        fontWeight={700}
        fontFamily={monoFont}
      >
        Im
      </Txt>
    </CoordinateSystem>
  </>)

  reLabel().opacity(0)
  reLabel().topRight({
    x: layout().width() / 2 - 24,
    y: 12
  })
  imLabel().opacity(0)
  imLabel().topLeft({
    x: 24,
    y: -layout().height() / 2 + 12
  })


  const zRe = createSignal(0)
  const zIm = createSignal(0)

  const zReUnit = createSignal(() => unit * zRe())
  const zImUnit = createSignal(() => unit * -zIm())

  const dot = createRef<Circle>() 
  const line = createRef<Line>()

  const labels = createRef<Rect>()

  const radius = createSignal(1)
  const rotation = createSignal(0)
  createEffect(() => {
    zRe(Math.cos(rotation()) * radius())
    zIm(Math.sin(rotation()) * radius())
  })

  const recap = createRef<Rect>()
  layout().add(<Rect ref={recap} opacity={0}>
    <Line
      ref={line}
      stroke={'#a8f'}
      lineWidth={6}
      lineDash={[10, 10]}
      lineCap={'round'}
      points={[
        { x: 0, y: 0 },
        createSignal(() => ({ x: zReUnit(), y: zImUnit() }))
      ]}
    />
    <Circle
      ref={dot}
      width={unit * 0.1}
      height={unit * 0.1}
      x={zReUnit}
      y={zImUnit}
      fill={'#fff'}
    />
    <Circle
      width={unit / 2}
      height={unit / 2}
      stroke={'#ff9'}
      start={createSignal(() => 1 - rotation() / Math.PI / 2)}
      lineWidth={4}
    />

    <Rect ref={labels}>
      <Latex
        x={createSignal(() => Math.cos(rotation() + 0.2) * unit * radius() / 2)}
        y={createSignal(() => -Math.sin(rotation() + 0.2) * unit * radius() / 2)}
        fontSize={30}
        fill={'#a8f'}
        tex={'r'}
      />

      <Latex
        x={createSignal(() => Math.cos(rotation() / 2) * unit / 6.5)}
        y={createSignal(() => -Math.sin(rotation() / 2) * unit / 6.5)}
        fontSize={30}
        fill={'#ff9'}
        tex={'\\varphi'}
      />
    </Rect>
  </Rect>)

  yield* all(
    hightlight(0),
    axisX().end(1, 1),
    axisY().end(1, 1),

    delay(0.5, all(
      coords().end(0.5).end(1, 1),
      coords().start(0.5).start(0, 1),

      delay(0.5, all(
        reLabel().opacity(1, 0.5),
        imLabel().opacity(1, 0.5),
      )),

      rotation(Math.PI * 0.26, 2, easeInOutExpo),
      labels().opacity(0).opacity(1, 2, easeInOutExpo),
      recap().opacity(1, 0.5), 
    ))
  )

  const loopRPhi = loop(Infinity, () => sequence(1.5,
    all(
      radius(1, 1.5, easeInOutExpo),
      rotation(Math.PI * 0.35, 1.5, easeInOutExpo)
    ),
    all(
      radius(1.8, 1.5, easeInOutExpo),
      rotation(Math.PI * 1.25, 1.5, easeInOutExpo)
    ),
    all(
      radius(1, 1.5, easeInOutExpo),
      rotation(Math.PI * 0.25, 1.5, easeInOutExpo),
    ),
  ))

  yield loopRPhi

  yield* beginSlide('inhalt_1')

  const problems = createRef<Rect>()
  const problemsTex = createRef<Latex>()
  layout().add(<Rect ref={problems} opacity={0}>
    <Latex
      ref={problemsTex}
      fontSize={30}
      fill={'#fff'}
      tex={'{{z_1}} \\cdot {{z_2}} = {{r_1}}\\text{cis}({{\\varphi_1}}) \\cdot {{r_2}}\\text{cis}({{\\varphi_2}})'}
    />
  </Rect>)

  const problemLoop = loop(Infinity, function* () {
    yield* all(
      problemsTex().scale(.8, 1, easeInCubic),
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}(\\cos({{\\varphi_1}}) + i \\sin({{\\varphi_1}})) \\cdot {{r_2}}(\\cos({{\\varphi_2}}) + i \\sin({{\\varphi_2}}))', 1),
    )

    yield* all(
      problemsTex().scale(.6, 1, easeOutCubic),
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}}(\\cos({{\\varphi_1}})\\cos({{\\varphi_2}}) - \\sin({{\\varphi_1}})\\sin({{\\varphi_2}}) + i(\\cos({{\\varphi_1}})\\sin({{\\varphi_2}}) + \\sin({{\\varphi_1}})\\cos({{\\varphi_2}})))', 1),
    )

    yield* all(
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}}(\\cos({{\\varphi_1}} + {{\\varphi_2}}) + i \\sin({{\\varphi_1}} + {{\\varphi_2}}))', 1),
      problemsTex().scale(.8, 1, easeInCubic),
    )

    yield* all(
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}} \\cdot {{\\text{cis}}}({{\\varphi_1}} + {{\\varphi_2}}{{)}}', 1),
      problemsTex().scale(1, 1, easeOutCubic),
    )

    yield* all(
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}}(\\cos({{\\varphi_1}} + {{\\varphi_2}}) + i \\sin({{\\varphi_1}} + {{\\varphi_2}}))', 1),
      problemsTex().scale(.8, 1, easeInCubic),
    )

    yield* all(
      problemsTex().scale(.6, 1, easeOutCubic),
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}}(\\cos({{\\varphi_1}})\\cos({{\\varphi_2}}) - \\sin({{\\varphi_1}})\\sin({{\\varphi_2}}) + i(\\cos({{\\varphi_1}})\\sin({{\\varphi_2}}) + \\sin({{\\varphi_1}})\\cos({{\\varphi_2}})))', 1),
    )

    yield* all(
      problemsTex().scale(.8, 1, easeInCubic),
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}(\\cos({{\\varphi_1}}) + i \\sin({{\\varphi_1}})) \\cdot {{r_2}}(\\cos({{\\varphi_2}}) + i \\sin({{\\varphi_2}}))', 1)
    )

    yield* all(
      problemsTex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}\\text{cis}({{\\varphi_1}}) \\cdot {{r_2}}\\text{cis}({{\\varphi_2}})', 1),
      problemsTex().scale(1, 1, easeOutCubic),
    );
  })

  yield* all(
    hightlight(1),
    recap().opacity(0, 0.5),
    coords().end(0.5, 1),
    coords().start(0.5, 1),
    axisX().end(0, 1),
    axisY().end(0, 1),
    reLabel().opacity(0, 0.5),
    imLabel().opacity(0, 0.5),
    labels().opacity(0, 0.5),
    delay(0.5,
      problems().opacity(1, 0.5),
    )
  )
  recap().remove()
  cancel(loopRPhi)

  yield* waitFor(0.5)
  yield problemLoop

  yield* beginSlide('inhalt_2')

  const eFormula = createRef<Latex>()

  const limTex = '{{e}}{{=}}\\lim_{{{n}} \\to {{\\infty}}} \\left({{1}}{{+}}\\frac{{{1}}}{{{n}}}\\right)^n'
  const sumTex = '{{e}}{{=}}\\sum_{{{n}}{{=}}{{0}}}^{{\\infty}} \\frac{{{1}}}{{{n}}!}'

  layout().add(<>
    <Latex
      ref={eFormula}
      opacity={0}
      tex={limTex}
      fontSize={80}
      fill={'#fff'}
    />
  </>)

  yield* all(
    hightlight(2),
    eFormula().opacity(1, 0.5),
    problems().opacity(0, 0.5),
  )

  cancel(problemLoop)
  problems().remove()

  const eLoop = loop(Infinity, () => chain(
    waitFor(1),
    eFormula().tex(sumTex, 1),
    waitFor(1),
    eFormula().tex(limTex, 1),
  ))
  yield eLoop

  yield* beginSlide('inhalt_3')

  unit = view.width() / 15

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

  layout().add(<>
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

  const phi = createSignal(Math.PI)
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
  </>)

  const nLoop = delay(0.5, loop(Infinity, () => chain(
    n(50, 2, easeInCubic),
    waitFor(1),
    n(1, 2, easeOutCubic),
    waitFor(1),
  )))

  yield nLoop

  yield* all(
    coords().start(0.5).start(0, 1),
    coords().end(0.5).end(1, 1),
    nTexContainer().opacity(0).opacity(1, 1),
    pointRef().opacity(0).opacity(1, 1),
    ...linesRef.map(l => l.opacity(0).opacity(1, 1)),
    hightlight(3),
    eFormula().opacity(0, 0.5),
  )

  cancel(eLoop)

  yield* beginSlide('inhalt_4')

  const arrows: Circle[] = []
  const iCircleLabels: Latex[] = []
  const iCircle = createRef<Rect>()
  const taylorTex = createRef<Latex>()


  const iRadius = 250
  layout().add(<>
    <Latex
      ref={taylorTex}
      fill={'#fff'}
      fontSize={30}
      y={-300}
      tex={'{{e}}^{{{ix}}}{{=}} 1 + {{ix}} + {{\\frac}}{{{(ix)}}^{{2}}}{{{2}}{{!}}} + {{\\frac}}{{{(ix)}}^{{3}}}{{{3}}{{!}}} + {{\\frac}}{{{(ix)}}^{{4}}}{{{4}}{{!}}} + {{\\frac}}{{{(ix)}}^{{5}}}{{{5}}{{!}}} + {...}'}
    />
    <Rect y={150} ref={iCircle}>
      <Ray
        stroke={'#88888a'}
        lineWidth={5}
        endArrow
        arrowSize={15}
        fromY={iRadius * 1.4}
        toY={-iRadius * 1.4}
      />
      <Ray
        stroke={'#88888a'}
        lineWidth={5}
        endArrow
        arrowSize={15}
        fromX={-iRadius * 1.4}
        toX={iRadius * 1.4}
      />
      <Rect
        fill={backgroundColor}
        layout
        padding={10}
        x={iRadius}
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
        y={-iRadius}
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
        x={-iRadius}
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
        y={iRadius}
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
          width={iRadius * 2}
          height={iRadius * 2}
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
          x={(iRadius + 50) * Math.cos(0.25 * i * Math.PI * 2 + 0.25 * Math.PI)}
          y={(iRadius + 50) * Math.sin(0.25 * i * Math.PI * 2 + 0.25 * Math.PI)}
          tex={'\\cdot i'}
        />
      </Node>)}
    </Rect>
  </>)

  yield* all(
    coords().opacity(0, 1),
    taylorTex().opacity(0).opacity(1, 1, easeInOutExpo),

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
    hightlight(4),
  )

  pointsEffect()
  cancel(nLoop)
  coords().remove()

  yield* beginSlide('inhalt_5')

  const eIdentity = createRef<Latex>()
  layout().add(<>
    <Latex
      ref={eIdentity}
      opacity={0}
      tex={'e^{i\\pi} + 1 = 0'}
      fontSize={80}
      fill={'#fff'}
    />
  </>)

  yield* all(
    iCircle().opacity(0, 0.5),
    taylorTex().opacity(0, 0.5), 
    eIdentity().opacity(1, 0.5),
    hightlight(5)
  )

  taylorTex().remove()
  iCircle().remove()

  yield* beginSlide('inhalt_6')

  yield* view.y(-view.height() / 2, .5, easeInCubic)
});