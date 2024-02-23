import textureData from "./ITextureUtils";

interface IGameData{
  screenWidth: number;
  screenHeight: number;
  fov: number;
  position: {
    x: number;
    y: number;
  };
  direction: {
    x: number;
    y: number;
  };
  plane: {
    x: number;
    y: number;
  };
  frameRate: number;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  map: number[][];
  textures: textureData[];
  renderData: {
    buffer: null | number[]
    imageData: null | ImageData
  }
}

export default IGameData