import textureData from "./ITextureUtils";
import IPressedKeys from "./IKeys";

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
  textures: null | textureData[];
  renderData: {
    buffer: null | Uint8ClampedArray
    imageData: null | ImageData
  },
  pressedKeys: null | IPressedKeys;
}

export default IGameData