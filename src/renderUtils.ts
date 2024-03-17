import IGameData from "./types/IGameData";

type pointCoordinates = { x: number, y: number }

const initializeBuffer = (data: IGameData) => {
  const { canvasContext, screenWidth, screenHeight } = data

  data.renderData.imageData = canvasContext.getImageData(0, 0, screenWidth, screenHeight)
  data.renderData.buffer = data.renderData.imageData.data
}

const drawPixel = (data: IGameData, point: pointCoordinates, colour: number[]) => {
  if (!data.renderData.buffer) {
    throw new Error('render buffer does not exist');
  }
  const { x, y } = point

  const index = 4 * (x + y * data.screenWidth)
  data.renderData.buffer[index] = colour[0]
  data.renderData.buffer[index + 1] = colour[1]
  data.renderData.buffer[index + 2] = colour[2]
  data.renderData.buffer[index + 3] = colour[3]
}

const drawLine = (data: IGameData, point1: pointCoordinates, point2: pointCoordinates, colour: number[]) => {
  const { x: x1, y: y1 } = point1
  const { y: y2 } = point2

  for (let i = y1; i < y2; i++) {
    drawPixel(data, { x: x1, y: i }, colour)
  }
}

const drawTexture = (data: IGameData, textureType: number, x: number, wallX: number, upperObjectEdge: number, lowerObjectEdge: number, wallSide: number) => {
  const { textures, screenHeight } = data
  if (!textures) throw new Error('textures not initialized')
  if (textureType >= textures.length || textureType < 0 || !textures[textureType].size || !textures[textureType].colourArray) {
    throw new Error('texture is missing')
    // TODO Make a default texture and use it if one is missing
    // Placholder code:
    // const colour = [51, 204, 51,255]
    // wallSide == 1 ? drawLine(data, {x: x, y: upperObjectEdge-1}, {x: x, y: lowerObjectEdge+1}, colour.map((value) => (value >> 1))) : drawLine(data, {x: x, y: upperObjectEdge+1}, {x: x, y: lowerObjectEdge}, colour)
  }

  const texture = textures[textureType]
  if (!texture.size || !texture.colourArray) {
    throw new Error(`texture ${texture.name} is found, but data is missing`)
  }

  let currentUpperEdge = upperObjectEdge - 1

  // Get the vertical stripe to draw
  const y = Math.floor(wallX * texture.size)

  // Calculate "step", that is the amount of pixels each color of the texture will occupy
  const step = (lowerObjectEdge - upperObjectEdge) / texture.size

  // Detect, whether the upperEdge is beyond the rendered screen height (whether it is underflowing)
  // If it is, adjust it using a stepOffset to avoid unneeded computations and performence loss
  let stepOffset = 0
  if (currentUpperEdge < 0) {
    stepOffset = Math.floor((-currentUpperEdge / step) - 1)
    currentUpperEdge += stepOffset * step
  }

  for (let i = stepOffset; i < texture.size; i++) {
    // If the lowerEdge overflows the screenHeight, end the loop
    if (currentUpperEdge > screenHeight) break

    // Calculate the index of corresponding texture pixel and draw the correct colour
    const index = (4 * (i * texture.size + y))
    const currentColour = [texture.colourArray[index], texture.colourArray[index + 1], texture.colourArray[index + 2], texture.colourArray[index + 3]]
    // If wallSide == 1 dim the current colour by dividing its RGB values by 2
    if (wallSide == 1) {
      currentColour[0] = currentColour[0] >> 1
      currentColour[1] = currentColour[1] >> 1
      currentColour[2] = currentColour[2] >> 1
    }

    // Handle overflow and underflow of y coordinates in relation to screen height
    const y1 = Math.floor(currentUpperEdge) > 0 ? Math.floor(currentUpperEdge) : 0
    const y2 = Math.floor(currentUpperEdge + step + (i >= 7 ? 1 : 0)) < screenHeight ? Math.floor(currentUpperEdge + step + (i >= 7 ? 1 : 0)) : screenHeight
    drawLine(data, { x: x, y: y1 }, { x: x, y: y2 }, currentColour)

    currentUpperEdge += step
  }


}

const renderBuffer = (data: IGameData) => {
  const { renderData, screenWidth, screenHeight, canvasContext: screenCanvasContext } = data
  if (!renderData.imageData) return

  const canvas = new OffscreenCanvas(screenWidth, screenHeight)
  canvas.getContext('2d')?.putImageData(renderData.imageData, 0, 0)
  screenCanvasContext.drawImage(canvas, 0, 0)


}

export { initializeBuffer, drawPixel, drawLine, renderBuffer, drawTexture }