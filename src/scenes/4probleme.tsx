import { Circle, Latex, Line, makeScene2D, Ray, Rect, Txt } from '@motion-canvas/2d';
import { all, beginSlide, createRef, createSignal, delay, easeInCubic, easeInOutExpo, easeOutCubic } from '@motion-canvas/core';
import { titleFont } from '../vars';
import { CoordinateSystem } from '../components/CoordinateSystem';

export default makeScene2D(function* (view) {
  // const title = createRef<Txt>();

  // view.add(
  //   <Txt
  //     ref={title}
  //     fill={'#fff'}
  //     fontSize={150}
  //     fontWeight={700}
  //     fontFamily={titleFont}
  //   />
  // );

  // yield* title().text('').text('PROBLEME & SCHWIERIGKEITEN', 1);
  // yield* beginSlide('probleme');

  const mulLatex = createRef<Latex>()

  view.add(<>
    <Latex
      ref={mulLatex}
      fontSize={64}
      fill={'#fff'}
      tex={'{{z_1}}{{ \\cdot }}{{z_2}} = {{r_1}}{{ \\text{cis} }}({{\\varphi_1}}){{ \\cdot }}{{r_2}}{{ \\text{cis} }}({{\\varphi_2}})'}
    />
  </>)

  yield* all(
    // title().fontSize(80, 1.5, easeInOutExpo),
    // title().topLeft({
    //   x: -view.width() / 2 + 50,
    //   y: -view.height() / 2 + 40
    // }, 1.5, easeInOutExpo),

    // delay(0.5, all(
      mulLatex().opacity(0).opacity(1, 1, easeInOutExpo),
    // ))
  )

  yield* beginSlide('probleme_multiplikation_simplified_1');

  yield* all(
    mulLatex().tex('{{z_1}} \\cdot {{z_2}} = {{r_1}}{{r_2}} \\cdot {{ \\text{cis} }}({{\\varphi_1}} + {{\\varphi_2}}{{)}}', 1),
    mulLatex().scale(1, 1, easeOutCubic),
  )
  
  yield* beginSlide('probleme_multiplikation_simplified_2');

  const coords1 = createRef<CoordinateSystem>()
  const coords2 = createRef<CoordinateSystem>()
  const unit = view.width() / 10

  const z1 = createSignal({ r: 1.5, phi: Math.PI / 3 })
  const z2 = createSignal({ r: 2, phi: Math.PI * 0.75 })

  const coordsScale = createSignal(1)
  const coordsRotation = createSignal(0)

  const z1Dot = createRef<Circle>()
  const z2Dot = createRef<Circle>()
  const z2DotGhost = createRef<Circle>()

  const zOne = createRef<Circle>()

  const transformContents = createRef<Rect>()
  const transformLine = createRef<Rect>()

  view.add(<>
    <CoordinateSystem
      ref={coords1}
      width={'100%'}
      height={'100%'}
      stroke={'#fff4'}
      inbetweens={true}
      start={0.5}
      end={0.5}
      inbetweensStroke={'#fff1'}
      spacing={unit}
    />
    <CoordinateSystem
      ref={coords2}
      width={'100%'}
      height={'100%'}
      stroke={'#fff4'}
      scale={coordsScale}
      rotation={() => -coordsRotation() / Math.PI * 180}
      inbetweens={true}
      start={0.5}
      end={0.5}
      inbetweensStroke={'#fff1'}
      spacing={unit}
    />

    <Rect ref={transformContents} opacity={0}>
      <Line
        ref={transformLine}
        lineJoin={'round'}
        stroke={'#2da'}
        lineWidth={6}
        endArrow={true}
        arrowSize={16}
        end={0}
        opacity={() => coordsRotation() / z1().phi > 0.95 ? 0 : 1}
        start={() => Math.min(0.95, coordsRotation() / z1().phi)}
        lineCap={'round'}
        points={() => {
          const fromRot = 0
          const toRot = z1().phi

          const fromScale = 1
          const toScale = z1().r

          function lerp (from: number, to: number, t: number) {
            return from + (to - from) * t
          }

          function getPoint(radius: number, rotation: number) {
            return {
              x: radius * Math.cos(rotation) * unit,
              y: radius * -Math.sin(rotation) * unit
            }
          }

          return Array.from({ length: 20 }).map((_, i, s) => getPoint(lerp(fromScale, toScale, i / (s.length - 1)), lerp(fromRot, toRot, i / (s.length - 1))))
        }}
      />

      <Line
        lineJoin={'round'}
        stroke={'#2da'}
        lineWidth={6}
        endArrow={true}
        arrowSize={16}
        end={() => Math.max(0, coordsRotation() / z1().phi - 0.05 / coordsScale())}
        lineCap={'round'}
        points={() => {
          const fromRot = z2().phi
          const toRot = z1().phi + z2().phi

          const fromScale = z2().r
          const toScale = z1().r * z2().r

          function lerp (from: number, to: number, t: number) {
            return from + (to - from) * t
          }

          function getPoint(radius: number, rotation: number) {
            return {
              x: radius * Math.cos(rotation) * unit,
              y: radius * -Math.sin(rotation) * unit
            }
          }

          return Array.from({ length: 20 }).map((_, i, s) => getPoint(lerp(fromScale, toScale, i / (s.length - 1)), lerp(fromRot, toRot, i / (s.length - 1))))
        }}
      />

      <Circle
        width={unit}
        height={unit}
        stroke={'#ff9'}
        lineWidth={4}
        start={() => 1 - z1().phi / (Math.PI * 2)}
      >
        <Latex
          x={() => Math.cos(z1().phi / 2) * unit * 0.33}
          y={() => -Math.sin(z1().phi / 2) * unit * 0.33}
          fontSize={30}
          fill={'#ff9'}
          tex={'\\varphi_1'}
        />
      </Circle>

      <Circle
        width={unit * 1.2}
        height={unit * 1.2}
        stroke={'#9f9'}
        lineWidth={4}
        start={() => 1 - z2().phi / (Math.PI * 2)}
      >
        <Latex
          x={() => Math.cos((z2().phi + z1().phi) / 2) * unit * 0.37}
          y={() => -Math.sin((z2().phi + z1().phi) / 2) * unit * 0.37}
          fontSize={30}
          fill={'#9f9'}
          tex={'\\varphi_2'}
        />
      </Circle>

      <Circle
        width={unit * 1.2}
        height={unit * 1.2}
        stroke={'#ff9'}
        lineWidth={4}
        end={() => 1 - z2().phi / (Math.PI * 2)}
        start={() => 1 - z2().phi / (Math.PI * 2) - coordsRotation() / (Math.PI * 2)}
      >
        <Latex
          opacity={() => coordsRotation() / z1().phi}
          x={() => Math.cos(z2().phi + coordsRotation() / 2) * unit * 0.37}
          y={() => -Math.sin(z2().phi + coordsRotation() / 2) * unit * 0.37}
          fontSize={30}
          fill={'#ff9'}
          tex={'\\varphi_1'}
        />
      </Circle>

      <Ray
        fromX={0}
        toX={() => z1().r * Math.cos(z1().phi) * unit}
        fromY={0}
        toY={() => z1().r * -Math.sin(z1().phi) * unit}
        stroke={'#a8f'}
        lineWidth={6}
        lineCap={'round'}
        lineDash={[10, 10]}
      />
      <Circle
        ref={z1Dot}
        x={() => z1().r * Math.cos(z1().phi) * unit}
        y={() => z1().r * -Math.sin(z1().phi) * unit}
        width={24}
        height={24}
        fill={'#fff'}
      >
        <Latex
          fontSize={40}
          fill={'#fff'}
          bottomLeft={() => ({ x: z1Dot().width() / 2 + 10, y: z1Dot().height() / 2 - 10 })}
          tex={'z_1'}
        />
      </Circle>

      <Ray
        fromX={0}
        toX={() => z2().r * Math.cos(z2().phi) * unit}
        fromY={0}
        toY={() => z2().r * -Math.sin(z2().phi) * unit}
        stroke={'#888'}
        lineWidth={6}
        lineCap={'round'}
        lineDash={[10, 10]}
      />
      <Circle
        ref={z2DotGhost}
        x={() => z2().r * Math.cos(z2().phi) * unit}
        y={() => z2().r * -Math.sin(z2().phi) * unit}
        width={24}
        height={24}
        fill={'#888'}
      >
        <Latex
          fontSize={40}
          fill={'#888'}
          bottomRight={() => ({ x: -z2Dot().width() / 2 - 10, y: z2Dot().height() / 2 - 10 })}
          tex={'z_2'}
        />
      </Circle>

      <Ray
        fromX={0}
        toX={() => z2().r * coordsScale() * Math.cos(z2().phi + coordsRotation()) * unit}
        fromY={0}
        toY={() => z2().r * coordsScale() * -Math.sin(z2().phi + coordsRotation()) * unit}
        stroke={'#a8f'}
        lineWidth={6}
        lineCap={'round'}
        lineDash={[10, 10]}
      />
      <Circle
        ref={z2Dot}
        x={() => z2().r * coordsScale() * Math.cos(z2().phi + coordsRotation()) * unit}
        y={() => z2().r * coordsScale() * -Math.sin(z2().phi + coordsRotation()) * unit}
        width={24}
        height={24}
        fill={'#fff'}
      >
        <Latex
          fontSize={40}
          fill={'#fff'}
          bottomRight={() => ({ x: -z2Dot().width() / 2 - 10, y: z2Dot().height() / 2 - 10 })}
          tex={'z_2'}
        />
      </Circle>

      <Circle
        ref={zOne}
        x={() => unit * coordsScale() * Math.cos(coordsRotation())}
        y={() => unit * coordsScale() * -Math.sin(coordsRotation())}
        width={24}
        height={24}
        fill={'#fff'}
      >
        <Latex
          fontSize={40}
          fill={'#fff'}
          topLeft={() => ({ x: zOne().width() / 2 + 10, y: zOne().height() / 2 + 10 })}
          tex={() => `(${(coordsScale() * Math.cos(coordsRotation())).toFixed(2)}, ${(coordsScale() * Math.sin(coordsRotation())).toFixed(2)}i)`}
        />
      </Circle>
    </Rect>
  </>)

  yield* all(
    coords1().end(1, 1),
    coords2().end(1, 1),
    coords1().start(0, 1),
    coords2().start(0, 1),
    mulLatex().bottomLeft({
      x: -view.width() / 2 + 50,
      y: view.height() / 2 - 50
    }, 1),
    transformContents().opacity(0).opacity(1, 1),
  )

  coords2().width(view.width() * 2)
  coords2().height(view.width() * 2)

  yield* beginSlide('probleme_multiplikation_transformation_1');

  yield* transformLine().end(0.95, 1, easeInOutExpo);

  yield* beginSlide('probleme_multiplikation_transformation_2');
  yield* all(
    coordsRotation(() => z1().phi, 2, easeInOutExpo),
    coordsScale(() => z1().r, 2, easeInOutExpo),
    z2Dot().childAs<Latex>(0).tex('z_{{2}}').tex('z_{{\\text{res}}}', 2, easeInOutExpo),
  )

  yield* beginSlide('probleme_multiplikation_transformation_3');

  yield* z2({ r: 1, phi: Math.PI * 1.1 }, 1, easeInOutExpo)
  yield* z2({ r: 1.5, phi: Math.PI * 0.5 }, 1, easeInOutExpo)
  yield* z1({ r: 1, phi: Math.PI * 0.1 }, 1, easeInOutExpo)
  yield* z1({ r: 1, phi: Math.PI * 0.3 }, 1, easeInOutExpo)

  yield* beginSlide('probleme_multiplikation_transformation_4');

  mulLatex().tex('z_1 \\cdot z_2 = r_1r_2 \\cdot \\text{cis}(\\varphi_1 + \\varphi_2)', 1),
  yield* all(
    coords1().opacity(0, 1),
    coords2().opacity(0, 1),
    transformContents().opacity(0, 1),
    mulLatex().middle(0, 1),
    mulLatex().tex('z^n=(r \\cdot \\text{cis}(\\varphi))^n', 1)
  )

  mulLatex().tex('{{z}}{{^n}}{{=}}{{\\left(}}{{r}} \\cdot {{ \\text{cis} }}{{(}}{{\\varphi}}{{)}}\\right)^{{n}}')
  yield* mulLatex().tex('{{z}}{{^n}}{{=}}{{r}}^{{n}} \\cdot {{ \\text{cis} }}{{(}}{{n}}{{\\varphi}}{{)}}', 1);

  yield* beginSlide('probleme_potenz');

  yield* mulLatex().tex('{{z}}{{_1}} \\cdot {{z}}{{_2}} = {{r}}{{_1}}{{ \\text{cis} }}({{\\varphi}}{{_1}}{{)}} \\cdot {{r}}{{_2}}{{ \\text{cis} }}({{\\varphi}}{{_2}})', 1);

  yield* beginSlide('probleme_multiplikation_1');
  
  mulLatex().tex('{{z_1 \\cdot z_2}}{{=}}{{r_1}}{{\\text{cis}}}{{(}}{{\\varphi_1}}{{)}} \\cdot {{r_2}}{{\\text{cis}}}({{\\varphi_2}})'),
  yield* all(
    mulLatex().scale(.8, 1, easeInCubic),
    mulLatex().tex('{{z_1 \\cdot z_2}}{{=}}{{r_1}}{{(}}{{\\cos}}{{(}}{{\\varphi_1}}{{)}} {{+}} {{i}} {{\\sin}}{{(}}{{\\varphi_1}}{{)}}{{)}} \\cdot {{r_2}}({{\\cos}}({{\\varphi_2}}{{)}} {{+}} {{i}} {{\\sin}}({{\\varphi_2}}{{)}})', 1),
  ),
  yield* all(
    mulLatex().scale(.6, 1, easeOutCubic),
    mulLatex().tex('{{z_1 \\cdot z_2}}{{=}}{{r_1}}{{r_2}}({{\\cos}}({{\\varphi_1}}){{\\cos}}({{\\varphi_2}}{{)}} - {{\\sin}}({{\\varphi_1}}){{\\sin}}({{\\varphi_2}}{{)}} {{+}} {{i}} ({{\\cos}}({{\\varphi_1}}){{\\sin}}({{\\varphi_2}}{{)}} + {{\\sin}}({{\\varphi_1}}){{\\cos}}({{\\varphi_2}}{{)}}{{)}})', 1),
  )

  yield* beginSlide('probleme_multiplikation_2');

  yield* all(
    mulLatex().tex('{{z_1 \\cdot z_2}}{{=}}{{r_1}}{{r_2}}({{\\cos}}({{\\varphi_1}} + {{\\varphi_2}}{{)}} {{+}} {{i}} {{\\sin}}({{\\varphi_1}} + {{\\varphi_2}}{{)}})', 1),
    mulLatex().scale(.8, 1, easeInCubic),
  )

  yield* all(
    mulLatex().tex('{{z_1 \\cdot z_2}} = {{r_1}}{{r_2}}{{\\cdot}}{{\\text{cis}}}{{(}}{{\\varphi_1}} + {{\\varphi_2}}{{)}}', 1),
    mulLatex().scale(1, 1, easeOutCubic),
  )

  yield* beginSlide('probleme_multiplikation_3');

  const title2 = createRef<Txt>();

  view.add(<>
    <Txt
      ref={title2}
      fill={'#fff'}
      fontSize={150}
      fontWeight={700}
      fontFamily={titleFont}
      textAlign={'center'}
    />
  </>)

  yield* all(
    mulLatex().opacity(0, 1),
    // title().opacity(0, 1),
    title2().text('POLARE DARSTELLUNG OHNE\nTRIGONOMETRISCHE FUNKTIONEN?', 1.5, easeInOutExpo),
  );

  mulLatex().remove();
  // title().remove();

  yield* beginSlide('probleme_mögliche_lösung');

  yield* view.y(-view.height() / 2, .5, easeInCubic);
});