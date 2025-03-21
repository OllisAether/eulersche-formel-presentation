import { Circle, makeScene2D, Txt, Ray, Camera, Latex, Rect, Node } from '@motion-canvas/2d'
import { all, beginSlide, createRef, createSignal, delay, easeInCubic, easeInOutCirc, easeInOutCubic, easeInOutExpo, easeOutExpo, loop, map, spawn, tween, useTransition, waitFor } from '@motion-canvas/core'
import { CoordinateSystem } from '../components/CoordinateSystem'
import { backgroundColor, latexFont, monoFont, titleFont } from '../vars'

export default makeScene2D(function* (view) {
  const unit = view.width() / 8
  const line = createRef<Ray>()

  const rotation = createSignal(0)
  const rotationDeg = createSignal(() => -rotation() / (Math.PI * 2) * 360)
  const cosRot = createSignal(() => Math.cos(rotation()) * unit)
  const sinRot = createSignal(() => -Math.sin(rotation()) * unit)

  const coords = createRef<CoordinateSystem>()
  const unitCircle = createRef<Node>()
  const title = createRef<Txt>()
  const titleTex = createRef<Latex>()

  // Preload fonts
  const fontLoader = <Rect>
    <Txt
      fontWeight={700}
      fill={backgroundColor}
      fontFamily={titleFont}
    >FONT LOADER...</Txt>
    <Txt
      fill={backgroundColor}
      fontFamily={monoFont}
    >FONT LOADER...</Txt>
  </Rect>
  view.add(fontLoader)

  yield* fontLoader.opacity(0, 0.5)

  yield* beginSlide('beforeStart')

  fontLoader.remove()

  view.add(
    <>
      <CoordinateSystem
        ref={coords}
        width={'200%'}
        x={-view.width() / 4}
        height={'100%'}
        spacing={unit}
        stroke={'#fff2'}
        lineWidth={1}
      >
        <Rect ref={unitCircle} width={unit * 10} height={unit * 10} opacity={0}>

          <Circle
            width={unit / 2}
            height={unit / 2}
            startAngle={rotationDeg}
            stroke={'#ff9'}
            lineWidth={4}
          />

          <Ray
            fromX={0}
            fromY={0}
            toX={() => cosRot() - 2 * Math.sign(cosRot())}
            toY={0}
            lineWidth={6}
            stroke={'#f44'}
            lineCap={'round'}
          />
          <Ray
            fromX={cosRot}
            fromY={0}
            toX={cosRot}
            toY={sinRot}
            lineWidth={3}
            stroke={'#f44'}
            lineDash={[10, 10]}
            lineCap={'round'}
          />
          <Ray
            fromX={0}
            fromY={0}
            toY={() => sinRot() - 2 * Math.sign(sinRot())}
            toX={0}
            lineWidth={6}
            stroke={'#4f4'}
            lineCap={'round'}
          />
          <Ray
            fromX={0}
            fromY={sinRot}
            toX={cosRot}
            toY={sinRot}
            lineWidth={3}
            stroke={'#4f4'}
            lineDash={[10, 10]}
            lineCap={'round'}
          />

          <Latex
            x={createSignal(() => Math.cos(rotation() / 2) * unit / 6.5)}
            y={createSignal(() => -Math.sin(rotation() / 2) * unit / 6.5)}
            fontSize={30}
            fill={'#ff9'}
            tex={'\\varphi'}
          />

          <Circle
            width={unit * 2}
            height={unit * 2}
            lineWidth={4}
            stroke={'#fff'}
          />
          <Ray
            ref={line}
            fromX={0}
            fromY={0}
            toX={unit}
            toY={0}
            rotation={rotationDeg}
            lineWidth={6}
            stroke={'#a8f'}
            lineCap={'round'}
            end={1}
          />
          <Circle
            x={cosRot}
            y={sinRot}
            width={unit / 10}
            height={unit / 10}
            fill={'#fff'}
            stroke={backgroundColor}
            lineWidth={6}
          />
        </Rect>

      </CoordinateSystem>
      <Txt
        ref={title}
        x={unit * 1.5}
        y={unit * -0.2}
        fontSize={180}
        fill="#fff"
        fontWeight={700}
        fontFamily={titleFont}
        opacity={0}
        textAlign={'center'}
      >
        EULER'SCHE FORMEL
      </Txt>
      <Latex
        ref={titleTex}
        x={unit * 1.5}
        y={unit * 0.5}
        fontSize={40}
        opacity={0}
        fill="#fff"
        tex={['e', '^{i', '\\varphi', '}', '=', '\\cos', '\\varphi', '+', 'i', '\\sin', '\\varphi']}
      />
    </>
  )

  const author = createRef<Txt>()
  view.add(
    <Txt
      ref={author}
      fontSize={30}
      fill="#fff"
      fontFamily={monoFont}
      x={view.width() / 2 - 180}
      y={view.height() / 2 - 50}
      textAlign={'center'}
      opacity={0}
    >
      von Oliver Renz
    </Txt>
  )

  coords().end(0.5),
  coords().start(0.5),
  
  yield delay(0.5, loop(() => tween(10, (v) => rotation(v * Math.PI * 2))))
  yield* all(
    coords().end(1, 1),
    coords().start(0, 1),
    delay(0.5, unitCircle().opacity(1, 0.5)),
    delay(0.5, author().opacity(1, .5)),
    delay(1, coords().x(0).x(-view.width() / 3.33, 1, easeInOutExpo)),
    delay(1.5, all(
      title().y(unit * 0.5).y(0, 1.5, easeOutExpo),
      title().opacity(1, 0.5),
      delay(0.2, all(
        titleTex().y(unit).y(unit * 0.5, 1.5, easeOutExpo),
        titleTex().opacity(1, 0.5)
      ))
    ))
  )

  yield* beginSlide('titleSlide')

  yield* all(
    coords().opacity(0, 0.5),
    title().text('EULER\'SCHE IDENTITÄT', 0.5),
    title().top({ x: 0, y: -view.height() / 2 + 100 }, 1),
    title().scale(0.5, 1),
    titleTex().middle(0, 1),
    titleTex().tex(['e', '^{i', '\\pi', '}', '+', '1=0'], 1),
    titleTex().scale(3, 1)
  )

  yield* beginSlide('titleSlide_eulers-identity')

  yield* all(
    titleTex().tex('e^{i\\varphi}=\\cos\\varphi+i\\sin\\varphi', 1),
    titleTex().x(unit * 1.5, 1),
    titleTex().y(unit * 0.5, 1),
    titleTex().scale(1, 1),

    title().text('EULER\'SCHE FORMEL', 1),
    title().x(unit * 1.5, 1),
    title().y(unit * -0.2, 1),
    title().scale(1, 1),

    coords().opacity(1, 1),
  )

  yield* beginSlide('titleSlide_eulers-identity_end')

  yield* view.y(-view.height(), 0.5, easeInCubic)
})