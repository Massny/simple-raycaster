const degreesToRadians = (degree: number) => {
  return (Math.PI * degree)/180
}

type pointCoordinates = {x: number, y: number}

const drawLine = (point1: pointCoordinates, point2: pointCoordinates, cssColor: string, canvasContext: CanvasRenderingContext2D) => {
  canvasContext.strokeStyle = cssColor;
  canvasContext.beginPath();
  canvasContext.moveTo(point1.x, point1.y);
  canvasContext.lineTo(point2.x, point2.y);
  canvasContext.stroke();
}


export { degreesToRadians, drawLine }