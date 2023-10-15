let bombsNum = 25,
    isGameOver = false,
    isStarted = false,
    flags = 0,
    clicks = 0,
    minute = 0,
    second = 0,
    cron
const grid = document.querySelector('.grid'),
    items = [], isLeftEdge = (i) => i % width === 0, 
    isRightEdge = (i) => i % width === width - 1,
    width = 10,
    message = document.createElement('div'),
    resetBtn = document.createElement('button')

resetBtn.classList.add('reset')
resetBtn.innerHTML = 'New game'
message.classList.add('message')

createBoard()

resetBtn.addEventListener('click', () => {
    location.reload()
})

function updateTimer() {
    second += 1
      if (second == 60) {
        second = 0;
        minute++;
      }
      if (minute == 60) {
        minute = 0;
      }
      document.querySelector('.minutes').innerText = returnData(minute)
      document.querySelector('.seconds').innerText = returnData(second)
}

function startTimer() {
    stopTimer()
    cron = setInterval(() => { updateTimer(); }, 1000)
}

function stopTimer() {
    clearInterval(cron);
}

function returnData(input) {
    return input >= 10 ? input : `0${input}`
}

function createBoard() {
    const bombs = Array(bombsNum).fill('bomb'),
        emptyCells = Array(width * width - bombsNum).fill('empty'),
        gameBoard = emptyCells.concat(bombs).sort(() => Math.random() - .5)

    for (let i = 0; i < width * width; i++) {
        const item = document.createElement('div')
        item.classList.add('grid-item', gameBoard[i])
        item.setAttribute('id', i)
        grid.appendChild(item)
        items.push(item)
    }

    grid.addEventListener('mouseup', (e) => {
        clicks++
        if (!isStarted) {
            startTimer()
            isStarted = true
        }
        if (e.button == 0 && e.target.classList.contains('grid-item')) {
            processCell(e.target, e.target.id)
        }
        else if (e.button == 2 && e.target.classList.contains('grid-item')) {
            e.preventDefault()
            addFlag(e.target)
        }
    })

    for (let i = 0; i < items.length; i++) {
        let neighborsNum = 0
        const isCellEmpty = items[i].classList.contains('empty')

        if (isCellEmpty && i > 0 && !isLeftEdge(i) && hasBomb(items, i - 1)) neighborsNum++
        if (isCellEmpty && i > 9 && !isRightEdge(i) && hasBomb(items, i + 1 - width)) neighborsNum++
        if (isCellEmpty && i > 10 && hasBomb(items, i - width)) neighborsNum++
        if (isCellEmpty && !isLeftEdge(i) && i > 11 && hasBomb(items, i - 1 - width)) neighborsNum++
        if (isCellEmpty && !isRightEdge(i) && i < 88 && hasBomb(items, i + 1 + width)) neighborsNum++
        if (isCellEmpty && i < 89 && hasBomb(items, i + width)) neighborsNum++
        if (isCellEmpty && !isLeftEdge(i) && i < 90 && hasBomb(items, i - 1 + width)) neighborsNum++
        if (isCellEmpty && !isRightEdge(i) && i < 98 && hasBomb(items, i + 1)) neighborsNum++
        items[i].setAttribute('data-neighbors', neighborsNum)
    }
}

function hasBomb(arr, str) {
    return arr[str].classList.contains('bomb')
}

function processCell(item, i) {
    if (isGameOver) return
    if (item.classList.contains('checked') || item.classList.contains('flag')) return
    if (item.classList.contains('bomb')) gameOver()
    else {
        const total = item.getAttribute('data-neighbors')
        if (total > 0) {
            item.innerHTML = total
            item.classList.add('checked')
            return
        }
        checkSquare(i)
        
    }
    item.classList.add('checked')
}

function addFlag(item) {
    if (isGameOver) return
    if (!item.classList.contains('flag') && !item.classList.contains('checked') && flags < bombsNum) {
        item.classList.add('flag')
        flags++
        item.innerHTML = '🚩'
        isGameWon()
    } else if (item.classList.contains('flag')) {
        item.innerHTML = ''
        item.classList.remove('flag')
        flags--
    }
}


function checkSquare(i) {
    setTimeout(() => {
        if (i > 0 && !isLeftEdge(i)) {
            
            const newItem = document.getElementById(+i - 1)
            processCell(newItem, i - 1)
        }
        if (i > 9 && !isRightEdge(i)) {
            const newItem = document.getElementById(+i + 1 - width)
            processCell(newItem, +i + 1 - width)
        }
        if (i > 10) {
            const newItem = document.getElementById(+i - width)
            processCell(newItem, +i - width)
        }
        if (i > 11 && !isLeftEdge(i)) {
            const newItem = document.getElementById(+i - 1 - width)
            processCell(newItem, +i - 1 - width)            
        }
        if (i < 98 && !isRightEdge(i)) {
            const newItem = document.getElementById(+i + 1)
            processCell(newItem, +i + 1)    
        }
        if (i < 90 && !isLeftEdge(i)) {
            const newItem = document.getElementById(+i - 1 + width)
            processCell(newItem, +i - 1 + width)                
        }
        if (i < 88 && !isRightEdge(i)) {
            const newItem = document.getElementById(+i + 1 + width)
            processCell(newItem, +i + 1 + width)                
        }       
        if (i < 89) {
            const newItem = document.getElementById(+i + width)
            processCell(newItem, +i + width)                
        }                
    }, 1)
}

function isGameWon() {
    let matches = 0
    items.forEach((el) => {
        if (el.classList.contains('bomb') && el.classList.contains('flag')) {
            matches++
        }
    })
    if (matches === bombsNum) {
        alert('You win!')
        isGameOver = true
    }
}

function gameOver() {
    isGameOver = true
    localStorage.setItem("time", minute + 'm ' + second + 's')
    localStorage.setItem("clicks", clicks)
    stopTimer()
    isStarted = false
    items.forEach((el) => {
        if (el.classList.contains('bomb')) el.innerHTML = '💣'
    })
    setTimeout(() => {
        message.innerHTML = 'YOU LOSE! \n Wanna try again?'
        grid.innerHTML = ''
        grid.append(message, resetBtn)
    }, 5000)

}

