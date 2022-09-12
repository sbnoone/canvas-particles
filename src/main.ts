import './style.css'
import rubicksCubeWebp from './assets/rubicks_cube.webp'

import { TextParticles } from './text-particles/text-particles'
import { ImageAsFallingParticles } from './image-as-falling-particles/image-as-falling-particles'
import { ImageAsParticles } from './image-as-particles/image-as-particles'

const textParticles = new TextParticles({ text: 'HELLO !', root: '#app' })
// textParticles.init()
const imageParticles = new ImageAsFallingParticles({ image: rubicksCubeWebp, root: '#app' })
// imageParticles.init()
const cubeParticles = new ImageAsParticles({ image: rubicksCubeWebp, root: '#app' })
// cubeParticles.init()
