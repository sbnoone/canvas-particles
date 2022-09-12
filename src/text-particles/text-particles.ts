import { ImageParticle } from '../image-as-particles/image-particle'
import { MouseData } from '../shared.types'

export interface TextParticlesOptions {
	text: string
	root: string
	font?: string
	color?: CanvasFillStrokeStyles['fillStyle']
	canvasWidth?: number
	canvasHeight?: number
	mouseRadius?: number
}

export class TextParticles {
	text: string
	particles: ImageParticle[] = []
	canvasWidth?: number
	canvasHeight?: number
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	root: string
	color?: CanvasFillStrokeStyles['fillStyle']
	font?: string
	mouseRadius: number

	mouse: MouseData = {
		x: 0,
		y: 0,
		radius: 0,
	}

	constructor({
		text,
		root,
		color,
		font,
		canvasWidth,
		canvasHeight,
		mouseRadius,
	}: TextParticlesOptions) {
		this.text = text
		this.root = root
		this.color = color
		this.font = font
		this.mouseRadius = mouseRadius || 80
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.animate = this.animate.bind(this)
		this.connectParticles = this.connectParticles.bind(this)
		this.handleMouseEnter = this.handleMouseEnter.bind(this)

		const canvas = document.createElement('canvas')
		canvas.width = canvasWidth || 800
		canvas.height = canvasHeight || 600
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!

		this.prepare()
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].draw()
			this.particles[i].update()
		}
		// this.connectParticles()
		window.requestAnimationFrame(this.animate)
	}

	connectParticles() {
		for (let a = 0; a < this.particles.length; a++) {
			for (let b = a; b < this.particles.length; b++) {
				const dx = this.particles[a].x - this.particles[b].x
				const dy = this.particles[a].y - this.particles[b].y
				const distance = Math.hypot(dx, dy)

				if (distance < 30) {
					const alpha = 1 - distance / 30
					this.ctx.strokeStyle = `rgba(255,255,255,${alpha})`
					this.ctx.lineWidth = 2
					this.ctx.beginPath()
					this.ctx.moveTo(this.particles[a].x, this.particles[a].y)
					this.ctx.lineTo(this.particles[b].x, this.particles[b].y)
					this.ctx.stroke()
				}
			}
		}
	}

	handleMouseEnter(): void {
		this.mouse.radius = this.mouseRadius
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

	init() {
		const root = document.querySelector(this.root || 'body')!
		root.appendChild(this.canvas)
		this.animate()
	}

	prepare() {
		this.ctx.fillStyle = this.color || 'white'
		this.ctx.font = this.font || '100px Verdana'
		this.ctx.fillText(this.text, 0, 100)
		this.canvas.width = this.ctx.measureText(this.text).width
		this.canvas.height = 100
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.font = this.font || '100px Verdana'
		this.ctx.fillText(this.text, 0, 100)

		const text = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

		for (let y = 0, y2 = text.height; y < y2; y++) {
			const rowIdx = y * 4 * text.width + 3
			for (let x = 0, x2 = text.width; x < x2; x++) {
				const opacityIdx = rowIdx + x * 4
				if (text.data[opacityIdx] > 128) {
					this.particles.push(
						new ImageParticle({
							x: x,
							y: y,
							ctx: this.ctx,
							mouse: this.mouse,
							canvas: this.canvas,
							color: '#fff',
						})
					)
				}
			}
		}

		this.canvas.addEventListener('mouseenter', this.handleMouseEnter)
		this.canvas.addEventListener('mousemove', this.handleMouseMove)
		this.canvas.addEventListener('mouseleave', this.handleMouseLeave)
	}

	remove() {
		this.canvas.remove()
		this.canvas.removeEventListener('mouseenter', this.handleMouseEnter)
		this.canvas.removeEventListener('mousemove', this.handleMouseMove)
		this.canvas.removeEventListener('mouseleave', this.handleMouseLeave)
	}
}
