import { FallingParticle } from './falling-particle'

export interface ImageAsFallingParticlesOptions {
	root: string
	image: string
}

export type RelativeBrightness = number
export type ParticleColor = string
export type MappedPixelsData = [RelativeBrightness, ParticleColor][][]

export class ImageAsFallingParticles {
	image: HTMLImageElement
	particles: FallingParticle[] = []
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	root: string
	particlesCount: number = 500

	constructor({ image, root }: ImageAsFallingParticlesOptions) {
		this.root = root
		this.image = new Image()
		this.image.src = image

		const canvas = document.createElement('canvas')
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!
		this.image.onload = () => {
			canvas.width = this.image.width
			canvas.height = this.image.height
			this.prepare()
			this.image.onload = null
		}

		this.animate = this.animate.bind(this)
	}

	animate() {
		this.ctx.globalAlpha = 0.05
		this.ctx.fillStyle = 'black'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.globalAlpha = 0.2
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update()
			this.ctx.globalAlpha = this.particles[i].speed * 0.5
			this.particles[i].draw()
		}

		window.requestAnimationFrame(this.animate)
		// if (isTabActive) window.requestAnimationFrame(animate)
	}

	init() {
		const root = document.querySelector(this.root || 'body')!
		root.appendChild(this.canvas)
		this.animate()
	}

	private prepare() {
		this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
		const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
		const pixelsData = this.mapImagePixelsBrightnessAndColor(imageData)
		for (let i = 0; i < this.particlesCount; i++) {
			this.particles.push(new FallingParticle({ canvas: this.canvas, ctx: this.ctx, pixelsData }))
		}
	}

	remove() {
		this.canvas.remove()
	}

	private mapImagePixelsBrightnessAndColor(imageData: ImageData): MappedPixelsData {
		const result: MappedPixelsData = []
		for (let y = 0; y < this.canvas.height; y++) {
			const rows: [number, string][] = []
			const stepY = y * this.canvas.width * 4
			const pixels = imageData.data
			for (let x = 0; x < this.canvas.width; x++) {
				const stepX = x * 4
				const red = pixels[stepY + stepX]
				const green = pixels[stepY + stepX + 1]
				const blue = pixels[stepY + stepX + 2]
				const brightness = this.calculateRelativeBrightness(red, green, blue)
				rows.push([brightness, `rgb(${red},${green},${blue})`])
			}
			result.push(rows)
		}
		return result
	}

	private calculateRelativeBrightness(red: number, green: number, blue: number): number {
		return Math.sqrt(red ** 2 * 0.299 + green ** 2 * 0.587 + blue ** 2 * 0.114) / 100
	}
}
