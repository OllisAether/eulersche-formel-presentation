import { initial, Rect, Shape, ShapeProps, signal, View2D } from "@motion-canvas/2d";
import { loop, sequence, SimpleSignal, ThreadGenerator, usePlayback, useRandom, useThread, useTime, Vector2, waitFor } from "@motion-canvas/core";

let colors = [
  "#10b981",
  "#7c3aed",
  "#fbbf24",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#ef4444",
]

interface ConfettiPiece {
  position: Vector2,
  rotation: { x: number, y: number, z: number },
  color: string,
  shape: number,
  velocity: Vector2
  rotationVelocity: { x: number, y: number, z: number }
}

class Confetti extends Shape {
  @initial(false)
  @signal()
  public declare readonly playing: SimpleSignal<boolean, this>;

  constructor(props: ShapeProps) {
    super(props);
  }

  private startT = 0;
  private t = 0;
  private amount = 100;
  private pieces1: ConfettiPiece[] = [];
  private pieces2: ConfettiPiece[] = [];
  public draw(context: CanvasRenderingContext2D) {
    if (!this.playing()) return;
    
    context.save()

    this.drawConfetti(context, this.t, {
      origin: new Vector2(-context.canvas.width / 2, context.canvas.height / 2),
      angle: -Math.PI * 0.37,
      velocity: 2000,
    }, this.pieces1, this.amount)


    this.drawConfetti(context, this.t, {
      origin: new Vector2(context.canvas.width / 2, context.canvas.height / 2),
      angle: -Math.PI * (1 - .37),
      velocity: 2000,
    }, this.pieces2, this.amount)


    context.restore()
  }

  public drawConfetti(context: CanvasRenderingContext2D, t: number, {
    origin,
    angle,
    velocity,
    gravity = 2000,
    spreadStdDev = angle / 5
  }: {
    origin: Vector2
    angle: number
    velocity: number
    gravity?: number
    spreadStdDev?: number
  }, pieces: ConfettiPiece[], amount: number) {
    const random = useRandom()

    if (pieces.length === 0) {
      for (let i = 0; i < amount; i++) {
        const color = colors[random.nextInt(0 ,colors.length)]
        const r = random.gauss(angle, spreadStdDev)
        const v = random.gauss(velocity, velocity / 3)
        const position = origin
        const rotation = {
          x: random.nextFloat(0 ,Math.PI * 2),
          y: random.nextFloat(0 ,Math.PI * 2),
          z: random.nextFloat(0 ,Math.PI * 2)
        }
        const _velocity = new Vector2(
          Math.cos(r) * v,
          Math.sin(r) * v
        )
        const _rotationVelocity = {
          x: random.nextFloat(-Math.PI * 2, Math.PI * 2),
          y: random.nextFloat(-Math.PI * 2, Math.PI * 2),
          z: random.nextFloat(-Math.PI * 2, Math.PI * 2)
        }
        const shape = random.nextInt(0, 4)
        pieces.push({
          position,
          rotation,
          color,
          velocity: _velocity,
          shape,
          rotationVelocity: _rotationVelocity,
        })
      }
    }

    context.save()
    
    for(let i = 0; i < pieces.length; i++) {
      const piece = pieces[i]

      const friction = 0.9
      const pos = piece.position.add(
        piece.velocity.mul(t).mul(Math.pow(friction, t)).add(
          new Vector2(0, gravity * t * t * 0.5)
        )
      )

      const rot = {
        x: piece.rotation.x + piece.rotationVelocity.x * t,
        y: piece.rotation.y + piece.rotationVelocity.y * t,
        z: piece.rotation.z + piece.rotationVelocity.z * t
      }

      this.drawConfettiPiece(context, rot, pos, piece.color, piece.shape)
    }

    context.restore()
  }

  public drawConfettiPiece(context: CanvasRenderingContext2D, rotation: {
    x: number,
    y: number,
    z: number
  }, position: {
    x: number,
    y: number
  }, color: string, shape: number) {
    context.save()

    context.translate(position.x, position.y)
    const matrix = new DOMMatrix()
    matrix.rotateSelf(rotation.x / Math.PI * 180, rotation.y / Math.PI * 180, rotation.z / Math.PI * 180)
    context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f) 

    context.beginPath()

    switch(shape) {
      case 0:
        // Rectangle
        context.rect(-10, -5, 20, 10)
        break
      case 1:
        // Square
        context.rect(-5, -5, 10, 10)
        break
      case 2:
        // Circle
        context.arc(0, 0, 5, 0, Math.PI * 2)
        break
      case 3:
        // Triangle
        context.moveTo(0, -7)
        context.lineTo(7, 7)
        context.lineTo(-7, 7)
        break
    }

    context.closePath()

    context.fillStyle = color
    context.fill()

    context.restore()
  }

  public *play(): ThreadGenerator {
    this.playing(true);

    const thread = useThread();
    this.startT = thread.time();
    this.t = 0;

    const step = usePlayback().framesToSeconds(1);
    const targetTime = thread.time() + 3;
    while (targetTime - step > thread.fixed) {
      this.t = thread.time() - this.startT;
      yield;
    }
    thread.time(targetTime);
  }
}

export function* makeConfetti(rect: Rect, duration: number, interval: number = 0.1) {
  function* confetti () {
    const confetti = new Confetti({});
    rect.add(confetti);
    yield* confetti.play();
    confetti.remove();
  }
  yield* sequence(interval, ...Array.from({ length: duration / interval }, () => confetti()));
}
