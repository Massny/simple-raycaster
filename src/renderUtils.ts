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

const renderBuffer = (data: IGameData) => {
  const {renderData, screenWidth, screenHeight, canvasContext: screenCanvasContext} = data
  if(!renderData.imageData) return

  const canvas = new OffscreenCanvas(screenWidth, screenHeight)
  canvas.getContext('2d')?.putImageData(renderData.imageData,0,0)
  screenCanvasContext.drawImage(canvas,0,0)


}

export { initializeBuffer, drawPixel, drawLine, renderBuffer }