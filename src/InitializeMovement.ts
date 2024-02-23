import IGameData from "./types/IGameData"

const initializeMovement = (data : IGameData) => {
  const {map} = data
  const moveSpeed = 0.2
  const rotationSpeed = 0.05

  window.addEventListener('keydown', (e) => {
    if(e.key == 'w'){
      if(map[Math.floor(data.position.x+data.direction.x * moveSpeed)][Math.floor(data.position.y)] == 0)
        data.position.x += data.direction.x * moveSpeed
      if(map[Math.floor(data.position.x)][Math.floor(data.position.y+data.direction.y* moveSpeed)] == 0)
        data.position.y += data.direction.y * moveSpeed
      // console.log(data.position.x, data.position.y)
    }

    if(e.key == 's'){
      if(map[Math.floor(data.position.x-data.direction.x * moveSpeed)][Math.floor(data.position.y)] == 0)
        data.position.x -= data.direction.x * moveSpeed
        if(map[Math.floor(data.position.x)][Math.floor(data.position.y-data.direction.y* moveSpeed)] == 0)
        data.position.y -=  data.direction.y * moveSpeed
        // console.log(data.position.x, data.position.y)
    }

    if(e.key == 'd'){
      const oldDirection = data.direction.x
      data.direction.x = data.direction.x * Math.cos(-rotationSpeed) - data.direction.y * Math.sin(-rotationSpeed);
      data.direction.y = oldDirection * Math.sin(-rotationSpeed) + data.direction.y * Math.cos(-rotationSpeed);

      const oldPlaneX = data.plane.x
      data.plane.x = data.plane.x * Math.cos(-rotationSpeed) - data.plane.y * Math.sin(-rotationSpeed);
      data.plane.y = oldPlaneX * Math.sin(-rotationSpeed) + data.plane.y * Math.cos(-rotationSpeed);
    }

    if(e.key == 'a'){
      const oldDirection = data.direction.x
      data.direction.x = data.direction.x * Math.cos(rotationSpeed) - data.direction.y * Math.sin(rotationSpeed);
      data.direction.y = oldDirection * Math.sin(rotationSpeed) + data.direction.y * Math.cos(rotationSpeed);

      const oldPlaneX = data.plane.x
      data.plane.x = data.plane.x * Math.cos(rotationSpeed) - data.plane.y * Math.sin(rotationSpeed);
      data.plane.y = oldPlaneX * Math.sin(rotationSpeed) + data.plane.y * Math.cos(rotationSpeed);
    }

  })
}

export default(initializeMovement)