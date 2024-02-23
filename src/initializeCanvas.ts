const initializeCanvas = (gameWidth: number, gameHeight: number): HTMLCanvasElement => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas width='${gameWidth}' height='${gameHeight}' style='width: ${gameWidth}px; height: ${gameHeight}px; background-color: #242424; margin: 0 auto;'>
    
  </canvas>
`

  return document.querySelector<HTMLCanvasElement>('canvas') as HTMLCanvasElement
}

export default initializeCanvas