import IGameData from "./types/IGameData"
import { drawLine } from "./util"

const rayCaster = (data: IGameData) => {
  const {screenWidth, screenHeight, position, direction, plane, canvasContext, map, textures} = data

  // Iterate through all "vertical stripes" (that is, all pixels of screenWidth)
  for(let x = 0; x <data.screenWidth; x++){
    

    // Map each pixel to the value in range [-1, 1], which is it's position relative to the camera,
    // where -1 is the leftmost camera pixel and 1 is the rightmost one
    const cameraX = 2*x/screenWidth - 1
    
    // Compute direction of the Ray using our calculated cameraX pixel position in the cartesian plane
    // Given that the plane is defined as a distance from the middle to the edge of the screen, we can 
    // simply multiply it by cameraX and add to the direction of the player
    const rayDirection = {
      x: direction.x + plane.x * cameraX,
      y: direction.y + plane.y * cameraX
    }

    // Setting up variables needed for DDA algorithm
    // https://www.geeksforgeeks.org/dda-line-generation-algorithm-computer-graphics/ - explanation of algorithm goals
    // https://lodev.org/cgtutor/raycasting.html - explanation of below implementation
    // https://lodev.org/cgtutor/images/raycasthit.gif - for reference what we are trying to accomplish using DDA algorithm \\
    // https://lodev.org/cgtutor/images/raycastdelta.gif  - for geometrical reference\\

    // The current square of the map ray happens to be in (only the square of our grid, not exact position)
    const gridPosition = {
      x: Math.floor(position.x),
      y: Math.floor(position.y)
    }

    // deltaDist is the distance between two points of our ray's crossings with the "gridlines", which is always constant
    // deltaDistX = sqrt(1 + (rayDirectionY * rayDirectionY) / (rayDirectionX * rayDirectionX)) from pythogoras, 
    // which in our case can be simplified to
    // deltaDistX = abs(|rayDirection| / rayDirectionX), where rayDirection is length of the vector of direction (rayDirectionX, rayDirectionY)
    // Because DDA algorithm does not care about the actual distance, but only ratio between deltaDistX and deltaDistY,
    // and |rayDirection| is a costant, we can further simplify it to 
    // deltaDistX = abs(1 / rayDirX) 

    const rayLength = Math.sqrt(Math.pow(rayDirection.x,2) + Math.pow(rayDirection.y,2))
    const deltaDist = {
      x: rayDirection.x == 0 ? Infinity : Math.abs(rayLength/rayDirection.x),
      y: rayDirection.y == 0 ? Infinity : Math.abs(rayLength/rayDirection.y)
    }
    
    // Step in traversing the grid (our two-dimensional map array)
    const step = {
      x: 1,
      y: 1
    }

    // The starting distance from the actual position to the point where ray crosses the "gridline"
    const sideDist ={
      x: (gridPosition.x + 1 - position.x) * deltaDist.x,
      y: (gridPosition.y + 1 - position.y) * deltaDist.y,
    }
    // Change the initial step and sideDistance if direction is < 0
    if (rayDirection.x < 0)
    {
      step.x = -1;
      sideDist.x = (position.x - gridPosition.x) * deltaDist.x;
    }
    if (rayDirection.y < 0)
    {
      step.y = -1;
      sideDist.y = (position.y - gridPosition.y) * deltaDist.y;
    }

  
    let foundWall = false
    let wallSide = 0 // If DDA hits the wall while incrementing the Y coordinate, it means either N or S side (1),
                     // otherwise its E or W side (0)

    while(!foundWall){
      // Jump to next square in the map grid, either in x-direction or in y-direction

      if (sideDist.x < sideDist.y)
      {
        sideDist.x += deltaDist.x;
        gridPosition.x += step.x;
        wallSide = 0;
      }
      else
      {
        sideDist.y += deltaDist.y;
        gridPosition.y += step.y;
        wallSide = 1;
      }
      
      // Check if ray has hit a wall
      // console.log(gridPosition)
      if (map[gridPosition.x][gridPosition.y] > 0) 
        foundWall = true;
    }

    // After the wall is found, the distance to it has to be calculated, to know how high the walls should be
    // In our ipmlementation it is basically taking the already-computed sideDistance and substracting deltaDistance once
    const wallDistance = wallSide == 0 ? (sideDist.x - deltaDist.x) * 1/rayLength : (sideDist.y - deltaDist.y)* 1/rayLength

    // The longer the distance, the lower the wall should be rendered, therefore we need the inverse of this value to
    // accurately represent wall relative size. We then scale it by the screenHeight, to get its height in pixels and proceed to draw it
    // with corresponding colour

    // The center of the wall should be at the center of the screen, so we need to divide screenHeight and lineHeight by 2, to properly
    // find upper and lower "edges" of the wall

    const wallHeight = Math.floor((1/wallDistance)*screenHeight)
    let upperEdge = screenHeight - Math.floor((screenHeight/2 + wallHeight/2))
    const upperEdgeWithOverflow = upperEdge // For textures
    if(upperEdge < 0)
      upperEdge = 0
    
    let lowerEdge = screenHeight - Math.floor((screenHeight/2 - wallHeight/2))
    const lowerEdgeWithOverflow = lowerEdge // For textures
    if(lowerEdge > screenHeight)
      lowerEdge = screenHeight  
    
      
    let wallX = wallSide == 0 ? position.y + wallDistance * rayDirection.y : position.x + wallDistance * rayDirection.x
    wallX -= Math.floor(wallX)

    const textureIndex = map[gridPosition.x][gridPosition.y] -1
    if(textureIndex >= textures.length || textureIndex < 0 || !textures[textureIndex].size || !textures[textureIndex].colourArray ){
      wallSide == 0 ? drawLine({x: x, y: upperEdge-1}, {x: x, y: lowerEdge+1}, '#33cc33', canvasContext) : drawLine({x: x, y: upperEdge+1}, {x: x, y: lowerEdge}, '#009900', canvasContext)
    } else {
      const texture = textures[textureIndex]
      if(!texture.size || !texture.colourArray) return

      const column = Math.floor(wallX*texture.size)
      let currentUpper = upperEdgeWithOverflow-1
      const step = (lowerEdgeWithOverflow-upperEdgeWithOverflow)/texture.size
      for(let i = 0;i<texture.size;i++){
        const currentColour = wallSide == 1 ? texture.colourArray[i*texture.size + column].map((colour) => (colour >> 1)) : texture.colourArray[i*texture.size + column]
        drawLine({x: x, y: Math.floor(currentUpper)}, {x:x, y: Math.floor(currentUpper + step + (i==7 ? 1: 0))}, `rgb(${currentColour[0]}, ${currentColour[1]}, ${currentColour[2]})`, canvasContext)
        currentUpper += step
      }
    }



    drawLine({x: x, y: 0}, {x: x, y: upperEdge}, 'blue', canvasContext)
    
    drawLine({x: x, y: lowerEdge}, {x: x, y: screenHeight-1}, 'gray', canvasContext)
  }
}

export default rayCaster