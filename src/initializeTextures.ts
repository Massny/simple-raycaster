import IGameData from "./types/IGameData"
import textureData from "./types/ITextureUtils"

const textures : textureData[] = [ 
  {
    name: 'mossy',
    colourArray: null,
    size: null
  },
  {
    name: 'greystone',
    colourArray: null,
    size: null
  },
  {
    name: 'wood',
    colourArray: null,
    size: null
  },
  {
    name: 'colorstone',
    colourArray: null,
    size: null
  },
  {
    name: 'eagle',
    colourArray: null,
    size: null
  }
]

// Parse image into ImageData object
const getTextureData = (image: HTMLImageElement) => {
  const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight)

  const context = canvas.getContext('2d')
  if(!context) throw new Error('Failed to create canvas context, when initilizing textures');

  context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  return context.getImageData(0,0,image.naturalWidth, image.naturalHeight).data

}

// Asynchronically load textures
const initializeTextures = async (data: IGameData) => {
  for(let i in textures){
    const imageElement = document.createElement('img')
    imageElement.src = `./textures/${textures[i].name}.png`
    imageElement.style.display = 'none'
    await imageElement.decode()
    document.body.appendChild(imageElement);
    textures[i].colourArray = getTextureData(imageElement)
    textures[i].size = imageElement.naturalHeight
    data.textures = textures
  }
}

export default initializeTextures