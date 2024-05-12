import IGameData from "./types/IGameData";

type pointCoordinates = { x: number, y: number }

// Initialise the buffer, used to draw the current screen state on canvas
// The buffer is an Uint8ClampedArray, of the size of (screenWidth x screenHeight) * 4 (for R,G,B,A, see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData),
//  representing pixels on the canvas. 
// The buffer used with putImageData method on canvas context is much faster than drawing vertical stripes
const initializeBuffer = (data: IGameData) => {
  const { canvasContext, screenWidth, screenHeight } = data

  data.renderData.imageData = canvasContext.getImageData(0, 0, screenWidth, screenHeight)
  data.renderData.buffer = data.renderData.imageData.data
}

// Set one pixel of the buffer to specified colour
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

// Set a vertical stripe of pixels to specified colour
const drawLine = (data: IGameData, point1: pointCoordinates, point2: pointCoordinates, colour: number[]) => {
  const { x: x1, y: y1 } = point1
  const { y: y2 } = point2

  for (let i = y1; i < y2; i++) {
    drawPixel(data, { x: x1, y: i }, colour)
  }
}

const drawTexture = (data: IGameData, textureType: number, x: number, wallX: number, upperWallEdge: number, lowerWallEdge: number, wallSide: number) => {
  const { textures, screenHeight } = data
  if (!textures) throw new Error('textures not initialized')
  if (textureType >= textures.length || textureType < 0 || !textures[textureType].size || !textures[textureType].colourArray) {
    throw new Error('texture is missing')
    // TODO Make a default texture and use it if one is missing
    // Placholder code:
    // const colour = [51, 204, 51,255]
    // wallSide == 1 ? drawLine(data, {x: x, y: upperWallEdge-1}, {x: x, y: lowerWallEdge+1}, colour.map((value) => (value >> 1))) : drawLine(data, {x: x, y: upperWallEdge+1}, {x: x, y: lowerWallEdge}, colour)
  }

  const texture = textures[textureType]
  if (!texture.size || !texture.colourArray) {
    throw new Error(`texture ${texture.name} is found, but data is missing`)
  }

  let currentUpperEdge = upperWallEdge - 1

  // Get the vertical stripe to draw
  const y = Math.floor(wallX * texture.size)

  // Calculate "step", that is the amount of pixels each color of the texture should occupy
  const step = (lowerWallEdge - upperWallEdge) / texture.size

  // Detect, whether the upperEdge is beyond the rendered screen height (whether it is underflowing)
  // If it is, adjust it using a stepOffset to avoid unneeded computations and performence loss
  let stepOffset = 0
  if (currentUpperEdge < 0) {
    stepOffset = Math.floor((-currentUpperEdge / step) - 1)
    currentUpperEdge += stepOffset * step
  }

  // Painting loop
  for (let i = stepOffset; i < texture.size; i++) {
    // If the lowerEdge overflows the screenHeight, end the loop
    if (currentUpperEdge > screenHeight) break

    // Calculate the index of corresponding texture pixel and draw the correct colour
    const index = (4 * (i * texture.size + y))
    const currentColour = [texture.colourArray[index], texture.colourArray[index + 1], texture.colourArray[index + 2], texture.colourArray[index + 3]]
    // If wallSide == 1 dim the current colour by dividing its RGB values by 2. Purely estetical.
    if (wallSide == 1) {
      currentColour[0] = currentColour[0] >> 1
      currentColour[1] = currentColour[1] >> 1
      currentColour[2] = currentColour[2] >> 1
    }

    // Handle overflow and underflow of y coordinates in relation to screen height
    const y1 = Math.floor(currentUpperEdge) > 0 ? Math.floor(currentUpperEdge) : 0
    const y2 = Math.floor(currentUpperEdge + step) < screenHeight ? Math.floor(currentUpperEdge + step) : screenHeight
    drawLine(data, { x: x, y: y1 }, { x: x, y: y2 }, currentColour)

    currentUpperEdge += step
  }


}

// Render buffer onto the canvas
const renderBuffer = (data: IGameData) => {
  const { renderData, screenWidth, screenHeight, canvasContext: screenCanvasContext } = data
  // TODO: add error throwing and handling
  if (!renderData.imageData) return

  const canvas = new OffscreenCanvas(screenWidth, screenHeight)
  canvas.getContext('2d')?.putImageData(renderData.imageData, 0, 0)
  screenCanvasContext.drawImage(canvas, 0, 0)


}

export { initializeBuffer, drawPixel, drawLine, renderBuffer, drawTexture }