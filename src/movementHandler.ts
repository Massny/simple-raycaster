import IGameData from "./types/IGameData"

// Allow fro player movement using pressedKey property
const movementHandler = (data: IGameData) => {
  const {pressedKeys, map, frameRate} = data;
  if(!pressedKeys) return;

  // Mock movespeed for now
  const moveSpeed = 0.005 * frameRate
  const rotationSpeed = 0.002 * frameRate

  // wall detection radius
  const radius = 0.2

  // The order of below statements matter!
  if(pressedKeys.w){
    // Move the player in the corresponding direction in one frame
    data.position.x += data.direction.x * moveSpeed

    // Handle the movement near the walls and corners
    const deltaX = Math.floor(data.position.x+Math.sign(data.direction.x)*radius)

    
    if(map[deltaX][Math.floor(data.position.y)] != 0
    || map[deltaX][Math.floor(data.position.y+radius) ] != 0
    || map[deltaX][Math.floor(data.position.y-radius) ] != 0 ){
      data.position.x -= data.direction.x* moveSpeed
    }
    
    // The same for y coordinate
    data.position.y += data.direction.y * moveSpeed

    const deltaY = Math.floor(data.position.y+Math.sign(data.direction.y)*radius)
    if(map[Math.floor(data.position.x)][deltaY] != 0
    || map[Math.floor(data.position.x+radius)][deltaY] != 0
    || map[Math.floor(data.position.x-radius)][deltaY] != 0 ){
      data.position.y -= data.direction.y * moveSpeed
    }
  }
  
  if(pressedKeys.s){
      data.position.x -= data.direction.x * moveSpeed

      if(map[Math.floor(data.position.x+Math.sign(data.direction.x)*radius*-1)][Math.floor(data.position.y)] != 0
      || map[Math.floor(data.position.x+Math.sign(data.direction.x)*radius*-1)][Math.floor(data.position.y+radius) ] != 0
      || map[Math.floor(data.position.x+Math.sign(data.direction.x)*radius*-1)][Math.floor(data.position.y-radius) ] != 0
      )
        data.position.x += data.direction.x* moveSpeed


      data.position.y -=  data.direction.y * moveSpeed

      if(map[Math.floor(data.position.x)][Math.floor(data.position.y+Math.sign(data.direction.y)*radius*-1)] != 0
      || map[Math.floor(data.position.x+radius)][Math.floor(data.position.y+Math.sign(data.direction.y)*radius*-1)] != 0
      || map[Math.floor(data.position.x-radius)][Math.floor(data.position.y+Math.sign(data.direction.y)*radius*-1)] != 0
      )
        data.position.y += data.direction.y * moveSpeed

  }
  
  // Multiply the direction vector by rotation matrix
  // https://en.wikipedia.org/wiki/Rotation_matrix
  if(pressedKeys.d){
    const oldDirection = data.direction.x
    data.direction.x = data.direction.x * Math.cos(-rotationSpeed) - data.direction.y * Math.sin(-rotationSpeed);
    data.direction.y = oldDirection * Math.sin(-rotationSpeed) + data.direction.y * Math.cos(-rotationSpeed);
  
    const oldPlaneX = data.plane.x
    data.plane.x = data.plane.x * Math.cos(-rotationSpeed) - data.plane.y * Math.sin(-rotationSpeed);
    data.plane.y = oldPlaneX * Math.sin(-rotationSpeed) + data.plane.y * Math.cos(-rotationSpeed);
  }
  
  if(pressedKeys.a){
    const oldDirection = data.direction.x
    data.direction.x = data.direction.x * Math.cos(rotationSpeed) - data.direction.y * Math.sin(rotationSpeed);
    data.direction.y = oldDirection * Math.sin(rotationSpeed) + data.direction.y * Math.cos(rotationSpeed);
  
    const oldPlaneX = data.plane.x
    data.plane.x = data.plane.x * Math.cos(rotationSpeed) - data.plane.y * Math.sin(rotationSpeed);
    data.plane.y = oldPlaneX * Math.sin(rotationSpeed) + data.plane.y * Math.cos(rotationSpeed);
  }
}

export default movementHandler