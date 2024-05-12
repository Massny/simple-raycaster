import IGameData from "./types/IGameData"
import IPressedKeys from "./types/IKeys"


// Setup eventListeners to accurately detect key pressess using pressedKey property
const pressedKeys: IPressedKeys = {
  a: false,
  s: false,
  w: false,
  d: false
}

const initializeMovement = (data : IGameData) => {
  data.pressedKeys = pressedKeys

  window.addEventListener('keyup', (e) => {
    if(e.key.toLowerCase() == 'w'){
      pressedKeys.w = false
    }
    if(e.key.toLowerCase() == 'a'){
      pressedKeys.a = false
    }
    if(e.key.toLowerCase() == 's'){
      pressedKeys.s = false
    }
    if(e.key.toLowerCase() == 'd'){
      pressedKeys.d = false
    }
  })

  window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() == 'w'){
      pressedKeys.w = true
    }
    if(e.key.toLowerCase() == 'a'){
      pressedKeys.a = true
    }
    if(e.key.toLowerCase() == 's'){
      pressedKeys.s = true
    }
    if(e.key.toLowerCase() == 'd'){
      pressedKeys.d = true
    }

  })
}

export default(initializeMovement)