import { MappedPixelsData } from './image-as-falling-particles'
import { ParticleBaseOptions } from '../particle-base'

export interface FallingParticleOptions extends Pick<ParticleBaseOptions, 'canvas' | 'ctx'> {
	pixelsData: MappedPixelsData
}

export class FallingParticle {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	velosity: number
	pixelsData: MappedPixelsData = []
	cellIdx: number
	rowIdx: number
	x: number
	y: number
	size: number = 2
	speed: number = 0

	constructor(opt: FallingParticleOptions) {
		this.canvas = opt.canvas
		this.ctx = this.canvas.getContext('2d')!
		this.x = Math.random() * opt.canvas.width
		this.y = 0
		this.cellIdx = Math.floor(this.x)
		this.rowIdx = this.y
		this.pixelsData = opt.pixelsData
		this.size = Math.random() + 1
		this.velosity = Math.random() * 0.5
	}

	draw() {
		if (this.pixelsData[this.rowIdx] && this.pixelsData[this.rowIdx][this.cellIdx]) {
			this.ctx.fillStyle = this.pixelsData[this.rowIdx][this.cellIdx][1]
		}
		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
		this.ctx.closePath()
		this.ctx.fill()
	}

	update() {
		this.cellIdx = Math.floor(this.x)
		this.rowIdx = Math.floor(this.y)
		if (this.pixelsData[this.rowIdx] && this.pixelsData[this.rowIdx][this.cellIdx]) {
			this.speed = this.pixelsData[this.rowIdx][this.cellIdx][0]
		}
		const movement = 2.5 - this.speed + this.velosity

		this.y += movement
		// this.x += movement * -0.5

		if (this.y >= this.canvas.height) {
			this.y = 0
			this.x = Math.random() * this.canvas.width
		}

		if (this.x >= this.canvas.width) {
			this.x = 0
			this.y = Math.random() * this.canvas.height
		}
	}
}
