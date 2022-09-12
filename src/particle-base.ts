export interface ParticleBaseOptions {
	x: number
	y: number
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	color: CanvasFillStrokeStyles['fillStyle']
}

export class ParticleBase {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	color: CanvasFillStrokeStyles['fillStyle']
	x: number
	y: number
	size: number = 2
	speed: number = 0

	constructor(opt: ParticleBaseOptions) {
		this.x = opt.x
		this.y = opt.y
		this.ctx = opt.ctx
		this.canvas = opt.canvas
		this.color = opt.color || '#fff'
	}

	draw() {
		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
		this.ctx.closePath()
		this.ctx.fill()
	}
}
