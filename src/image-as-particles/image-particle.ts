import { ParticleBase, ParticleBaseOptions } from '../particle-base'
import { MouseData } from '../shared.types'

export interface ImageParticleOptions extends ParticleBaseOptions {
	mouse: MouseData
}

export class ImageParticle extends ParticleBase {
	mouse: MouseData
	density: number
	baseX: number
	baseY: number

	constructor(opt: ImageParticleOptions) {
		super(opt)

		this.mouse = opt.mouse
		this.density = Math.random() * 30 + 1
		this.baseX = opt.x
		this.baseY = opt.y
	}

	draw() {
		this.ctx.fillStyle = this.color
		super.draw()
	}

	update() {
		const dx = this.mouse.x - this.x
		const dy = this.mouse.y - this.y
		// Circle collision detection
		// const distance = Math.hypot(dx, dy)
		const distance = Math.sqrt(dx * dx + dy * dy)
		// calculate color using distance
		const forceDirectionX = dx / distance
		const forceDirectionY = dy / distance
		const maxDistance = this.mouse.radius
		let force = (maxDistance - distance) / maxDistance
		if (force < 0) force = 0
		const directionX = forceDirectionX * force * this.density * 0.6
		const directionY = forceDirectionY * force * this.density * 0.6
		if (distance < maxDistance) {
			this.x -= directionX
			this.y -= directionY
		} else {
			if (this.x !== this.baseX) {
				const dx = this.x - this.baseX
				this.x -= dx * 0.1
			}
			if (this.y !== this.baseY) {
				const dy = this.y - this.baseY
				this.y -= dy * 0.1
			}
		}
	}
}
