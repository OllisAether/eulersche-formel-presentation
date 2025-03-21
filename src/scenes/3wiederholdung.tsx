import { Circle, Latex, Line, makeScene2D, Ray, Rect, Txt } from '@motion-canvas/2d'
import { all, beginSlide, cancel, createEffect, createRef, createSignal, delay, easeInCubic, easeInExpo, easeInOutExpo, easeOutExpo, loop, sequence, useRandom, waitFor } from '@motion-canvas/core'
import { CoordinateSystem } from '../components/CoordinateSystem'
import { latexFont, monoFont, titleFont } from '../vars'

// Donkey
export default makeScene2D(function* (view) {
  const title = createRef<Txt>()

  view.add(
    <>
      <Txt
        ref={title}
        fill={'#fff'}
        fontSize={150}
        fontWeight={700}
        fontFamily={titleFont}
      />
    </>
  )

  yield* title().text('WAS SOLLTEN WIR KÖNNEN?', 1)

  yield* beginSlide('wiederholung')

  const zLatex = createRef<Latex>()

  view.add(<Latex
    ref={zLatex}
    fill={'#fff'}
    fontSize={120}
    tex={'z=x+iy'}
    opacity={0}
  />)

  yield* all(
    zLatex().opacity(1, 1),
    title().fontSize(80, 1.5, easeInOutExpo),
    title().text('WIEDERHOLUNG', 1.5, easeInOutExpo),
    title().topLeft({
      x: -view.width() / 2 + 50,
      y: -view.height() / 2 + 40
    }, 1.5, easeInOutExpo),
  )

  yield* beginSlide('wiederholung_complex_numbers')

  const unit = view.width() / 9

  const coords = createRef<CoordinateSystem>()
  const axisX = createRef<Ray>()
  const axisY = createRef<Ray>()
  const imLabel = createRef<Txt>()
  const reLabel = createRef<Txt>()

  view.add(<>
    <CoordinateSystem
      ref={coords}
      width={'100%'}
      height={'100%'}
      spacing={unit}
      stroke={'#fff4'}
    >
      <Ray
        ref={axisX}
        fromX={-view.width() / 2}
        fromY={0}
        toX={view.width() / 2}
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
        fromY={view.height() / 2}
        toX={0}
        toY={-view.height() / 2}
        stroke={'#484'}
        lineWidth={4}
        endArrow
        arrowSize={10}
        end={0}
      />
    </CoordinateSystem>

    <Txt
      ref={reLabel}
      fill={'#844'}
      fontSize={40}
      fontWeight={700}
      fontFamily={monoFont}
    >
      Reale Achse
    </Txt>
    <Txt
      ref={imLabel}
      fill={'#484'}
      fontSize={40}
      fontWeight={700}
      fontFamily={monoFont}
    >
      Imaginäre Achse
    </Txt>
  </>)

  reLabel().opacity(0)
  reLabel().topRight({
    x: view.width() / 2 - 24,
    y: 12
  })
  imLabel().opacity(0)
  imLabel().topLeft({
    x: 24,
    y: -view.height() / 2 + 12
  })

  yield* all(
    zLatex().opacity(0, 1),
    delay(0.5, all(
      axisX().end(1, 1),
      axisY().end(1, 1),

      delay(0.25, all(
        coords().end(0.5).end(1, 1),
        coords().start(0.5).start(0, 1),

        delay(0.5, all(
          reLabel().opacity(1, 0.5),
          imLabel().opacity(1, 0.5),
        ))
      ))
    ))
  )
  
  zLatex().remove()

  // yield* beginSlide('wiederholung_polarkoordinaten_grid')

  const zRe = createSignal(0)
  const zIm = createSignal(0)

  const zReUnit = createSignal(() => unit * zRe())
  const zImUnit = createSignal(() => unit * -zIm())

  const zTex = createSignal(() => ['z=', zRe().toFixed(2), Math.sign(zIm()) === -1 ? '' : '+', zIm().toFixed(2), 'i'])

  const dot = createRef<Circle>()
  const dotLatex = createRef<Latex>()
  const line = createRef<Line>()

  view.add(<>
    <Line
      ref={line}
      stroke={'#a8f'}
      lineWidth={6}
      lineDash={[10, 10]}
      lineCap={'round'}
      points={[
        { x: 0, y: 0 },
        createSignal(() => ({ x: zReUnit(), y: 0 })),
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
    >
      <Latex
        ref={dotLatex}
        fill={'#fff'}
        fontSize={40}
        tex={zTex}
      />
    </Circle>
  </>)
  
  dotLatex().bottomLeft({ x: 16, y: -16 })

  yield* all(
    reLabel().text('Re', 1),
    reLabel().topRight({
      x: view.width() / 2 - 24,
      y: 12
    }, 1),
    imLabel().text('Im', 1),
    imLabel().topLeft({
      x: 24,
      y: -view.height() / 2 + 12
    }, 1),
    dot().opacity(0).opacity(1, 1),
    dotLatex().opacity(0).opacity(1, 1)
  )

  const random = useRandom(1001023)

  yield* loop(2, (i) => all(
    zRe(random.nextFloat(-2, 2), 1, easeInOutExpo),
    zIm(random.nextFloat(-2, 2), 1, easeInOutExpo),
  ))

  yield* all(
    zRe(0, 1.5, easeInOutExpo),
    zIm(0, 1.5, easeInOutExpo),
  )
  yield* beginSlide('wiederholung_polarkoordinaten_move_dot')

  yield* all(
    zRe(1, 1.5, easeInOutExpo),
    zIm(0, 1.5, easeInOutExpo),
  )

  const labels = createRef<Rect>()

  const radius = createSignal(1)
  const rotation = createSignal(0)
  createEffect(() => {
    zRe(Math.cos(rotation()) * radius())
    zIm(Math.sin(rotation()) * radius())
  })

  line().points([
    { x: 0, y: 0 },
    createSignal(() => ({ x: zReUnit(), y: zImUnit() }))
  ])

  const formula = createRef<Rect>()
  const formulaLatex = createRef<Latex>()

  view.add(<>
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

    <Rect
      ref={formula}
      width={createSignal(() => formulaLatex().width() + 64)}
      height={createSignal(() => formulaLatex().height() + 32)}
      radius={16}
      fill={'#221d2f'}
      stroke={'#a8f'}
      lineWidth={4}
    >
      <Latex
        ref={formulaLatex}
        fontSize={48}
        fill={'#fff'}
        tex={['z=r\\cdot', '\\bigl(cos(\\varphi)+i\\cdot sin(\\varphi)\\bigl)']}
      />
    </Rect>
  </>)

  formula().opacity(0)

  yield* all(
    rotation(Math.PI * 0.26, 2, easeInOutExpo),
    labels().opacity(0).opacity(1, 2, easeInOutExpo),

    sequence(1.5,
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
    ),
  )

  yield* beginSlide('wiederholung_polarkoordinaten_unit_circle')

  yield* all(
    formula().opacity(1, 1.5),
    formula().y(0).y(unit * 1.5, 1.5, easeOutExpo)
  )

  yield* beginSlide('wiederholung_polarkoordinaten_formula')

  yield* all(
    formulaLatex().tex(['z=r\\cdot', '\\text{cis}(\\varphi)'], 1),
  )

  yield* beginSlide('wiederholung_polarkoordinaten_cis_formula')

  yield* view.y(-view.height() / 2, .5, easeInCubic)
})