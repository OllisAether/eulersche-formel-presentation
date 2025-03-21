import { CanvasStyleSignal, canvasStyleSignal, Grid, GridProps, initial, PossibleCanvasStyle, resolveCanvasStyle, signal } from '@motion-canvas/2d'
import { map, SignalValue, SimpleSignal } from '@motion-canvas/core'

export interface CoordinateSystemProps extends GridProps {
  inbetweens?: SignalValue<boolean>;
  inbetweensStroke?: SignalValue<PossibleCanvasStyle>;
}

export class CoordinateSystem extends Grid {
  @initial(false)
  @signal()
  public declare readonly inbetweens: SimpleSignal<boolean, this>;

  @canvasStyleSignal()
  public declare readonly inbetweensStroke: CanvasStyleSignal<this>;

  public constructor(props: CoordinateSystemProps) {
    super(props);
  }

  override drawShape(context: CanvasRenderingContext2D) {
    context.save()
    this.applyStyle(context)
    this.drawRipple(context)

    const spacing = this.spacing()
    const size = this.computedSize().scale(0.5)
    const steps = size.div(spacing).floored

    for (let x = -steps.x; x <= steps.x; x++) {
      const [from, to] = this.mapPoints2(-size.height, size.height)

      context.beginPath()

      context.save()
      if (x === 0) {
        context.lineWidth = context.lineWidth * 4
      }

      context.moveTo(spacing.x * x, from)
      context.lineTo(spacing.x * x, to)

      context.stroke()

      context.restore()
    }

    for (let y = -steps.y; y <= steps.y; y++) {
      const [from, to] = this.mapPoints2(-size.width, size.width)

      context.beginPath()

      context.save()
      if (y === 0) {
        context.lineWidth = 4
      }

      context.moveTo(from, spacing.y * y)
      context.lineTo(to, spacing.y * y)

      context.stroke()
      context.restore()
    }

    if (this.inbetweens()) {
      context.save()
      context.lineWidth = 1
      context.strokeStyle = resolveCanvasStyle(this.inbetweensStroke(), context);

      for (let x = -steps.x - 1; x <= steps.x; x++) {
        const [from, to] = this.mapPoints2(-size.height, size.height)

        context.beginPath()

        context.moveTo(spacing.x * x + spacing.x / 2, from)
        context.lineTo(spacing.x * x + spacing.x / 2, to)
 
        context.stroke()
      }

      for (let y = -steps.y - 1; y <= steps.y; y++) {
        const [from, to] = this.mapPoints2(-size.width, size.width)

        context.beginPath()

        context.moveTo(from, spacing.y * y + spacing.y / 2)
        context.lineTo(to, spacing.y * y + spacing.y / 2)

        context.stroke()
      }

      context.restore()
    }

    context.restore()
  }

  protected mapPoints2(start: number, end: number): [number, number] {
    let from = map(start, end, this.start())
    let to = map(start, end, this.end())

    if (to < from) {
      [from, to] = [to, from]
    }

    return [from, to]
  }
}