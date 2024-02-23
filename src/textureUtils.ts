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

const initializeTextures = async (textureArray: textureData[]) => {
  for(let i in textureArray){
    const imageElement = document.createElement('img')
    imageElement.src = `./textures/${textureArray[i].name}.png`
    imageElement.style.display = 'none'
    await imageElement.decode()
    document.body.appendChild(imageElement);
    textureArray[i].colourArray = getTextureData(imageElement)
    textureArray[i].size = imageElement.naturalHeight
  }
}

const getTextureData = (image: HTMLImageElement) => {
  const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight)

  const context = canvas.getContext('2d')
  if(!context) throw new Error('Failed to create canvas context, when initilizing textures');

  context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  const textureData = context?.getImageData(0,0,image.naturalWidth, image.naturalHeight).data
  const colourArray = []

  for(let i=0;i<textureData?.length;i+=4){
    colourArray.push([textureData[i], textureData[i+1], textureData[i+2]])
  }

  return colourArray
}

export {textures, initializeTextures}