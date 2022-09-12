import { ImageParticle } from './image-particle'
import { MouseData } from '../shared.types'

export interface ImageAsParticlesOptions {
	image: string
	root: string
	mouseRadius?: number
}

export class ImageAsParticles {
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	image: HTMLImageElement
	particles: ImageParticle[] = []
	root: string
	mouseRadius: number

	mouse: MouseData = {
		x: 0,
		y: 0,
		radius: 0,
	}

	constructor({ image, root, mouseRadius }: ImageAsParticlesOptions) {
		this.image = new Image()
		this.image.src = image
		this.root = root
		this.mouseRadius = mouseRadius || 80

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
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].draw()
			this.particles[i].update()
		}

		window.requestAnimationFrame(this.animate)
	}

	handleMouseMove(e: MouseEvent): void {
		this.mouse.x = e.x - this.canvas.offsetLeft
		this.mouse.y = e.y - this.canvas.offsetTop
	}

	handleMouseLeave(): void {
		this.mouse.x = 0
		this.mouse.y = 0
		this.mouse.radius = 0
	}

	handleMouseEnter(): void {
		this.mouse.radius = this.mouseRadius
	}

	init() {
		const root = document.querySelector(this.root || 'body')!
		root.appendChild(this.canvas)
		this.animate()
	}

	prepare() {
		this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
		const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		// const pixelsData = this.mapImagePixelsBrightnessAndColor(imageData)

		for (let y = 0, y2 = imageData.height; y < y2; y += 4) {
			for (let x = 0, x2 = imageData.width; x < x2; x += 4) {
				const red = imageData.data[y * 4 * imageData.width + x * 4]
				const green = imageData.data[y * 4 * imageData.width + x * 4 + 1]
				const blue = imageData.data[y * 4 * imageData.width + x * 4 + 2]
				const color = `rgb(${red},${green},${blue})`
				const opacityIdx = y * 4 * imageData.width + x * 4 + 3
				if (imageData.data[opacityIdx] > 128) {
					this.particles.push(
						new ImageParticle({
							x: x,
							y: y,
							color,
							ctx: this.ctx,
							mouse: this.mouse,
							canvas: this.canvas,
						})
					)
				}
			}
		}

		this.canvas.addEventListener('mousemove', this.handleMouseMove)
		this.canvas.addEventListener('mouseleave', this.handleMouseLeave)
		this.canvas.addEventListener('mouseenter', this.handleMouseEnter)
	}

	remove() {
		this.canvas.removeEventListener('mousemove', this.handleMouseMove)
		this.canvas.removeEventListener('mouseleave', this.handleMouseLeave)
		this.canvas.removeEventListener('mouseenter', this.handleMouseEnter)
	}
}
