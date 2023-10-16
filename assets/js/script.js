let bombsNum = localStorage.getItem('bombs') ? +localStorage.getItem('bombs') : 5,
    isGameOver = false,
    isStarted = false,
    flags = 0,
    clicks = 0,
    minute = 0,
    second = 0,
    userName,
    cron
const grid = document.querySelector('.grid'),
    items = [], isLeftEdge = (i) => i % width === 0, 
    isRightEdge = (i) => i % width === width - 1,
   // sortStorage = () => 
    width = 10,
    message = document.createElement('div'),
    resetBtn = document.createElement('button'),
    modalInfo = document.querySelector(".modal-rules"),
    modalRecords = document.querySelector(".modal-records"),
    // closeModalBtn = document.querySelectorAll(".btn-close"),
    overlay = document.querySelector(".overlay"),
    infoBtn = document.querySelector(".rules"),
    recordsBtn = document.querySelector(".records"),
    settingsBtn = document.querySelector(".settings"),
    modalName = document.querySelector('.modal-name'),
    modalSettings = document.querySelector('.modal-settings'),
    nameForm = document.querySelector('.auth-form'),
    nameTmp = document.querySelector('.name-tmp'), 
    logout = document.querySelector('.logout .save-name'),
    bombsForm = document.querySelector('.bombs-form'),
    bombsAmount = document.querySelector('.bombs-amount'),
    flagsAmount = document.querySelector('.flags-amount')

bombsAmount.innerHTML = 'There are ' + bombsNum + ' bombs'
flagsAmount.innerHTML = 'Flags left: ' + bombsNum
resetBtn.classList.add('reset')
resetBtn.innerHTML = 'New game'
message.classList.add('message')

createBoard()
authListener()

function authListener() {
    nameForm.addEventListener('submit', (e) => {
    
        e.preventDefault()
        modalName.classList.add("hidden")
        user = e.target.elements.userName.value
        localStorage.setItem('currentUser', user)
        nameTmp.innerHTML = user
        
    })
}

bombsForm.addEventListener('submit', (e) => {
    e.preventDefault() 
    localStorage.setItem('bombs', e.target.elements.bombs.value)
   // bombsNum = e.target.elements.bombs.value
    location.reload()
})

logout.addEventListener('click', (e) => {
    localStorage.removeItem('currentUser')
    location.reload()
})

settingsBtn.addEventListener('click', () => {
    openModal(modalSettings)
    if (!isGameOver) {
        const input = modalSettings.querySelector('.name-form'), 
              error = modalSettings.querySelector('.error')
        error.innerHTML = "You can't change bombs amount during the game"
        document.querySelector('.save-bombs').disabled = true
        input.bombs.disabled = true
    }
})

infoBtn.addEventListener('click', () => {
    openModal(modalInfo)
})


recordsBtn.addEventListener('click', () => {
    openModal(modalRecords)
    
    if (localStorage.length > 0) {
        const list = modalRecords.querySelector('.records-list')
        for (let i = 0; i <= 10; i++) {
            list.innerHTML = ''
            const records = JSON.parse(localStorage.getItem('game'))
            records.forEach((el) => {
                const li = document.createElement('li')
                li.innerHTML = el.user + ': ' + el.bombs + ' bombs, '  + el.minutes + 'm ' + el.seconds + 's, ' + el.clicksNum + ' clicks'
                list.appendChild(li)
            })
        }
    }

})

if (!localStorage.getItem('currentUser')) {
    modalName.classList.remove('hidden')
} else {
    user = localStorage.getItem('currentUser')
    nameTmp.innerHTML = user
}

function compareStats(a, b) {
    const minDiff = a.minutes - b.minutes, secDiff = a.seconds - b.seconds, 
        clickDiff = a.clicks - b.clicks, bombsDiff = b.bombs - a.bombs
    if (bombsDiff !== 0) return bombsDiff
    if (bombsDiff === 0 && minDiff === 0 && secDiff !== 0) return secDiff
    else if (minDiff === 0 && secDiff === 0 && bombsDiff === 0 && clickDiff !== 0) return clickDiff
    return minDiff;
  }

function openModal (modal) {
    modal.classList.remove("hidden")
    closeModal(modal)
}

function closeModal (modal) {
    modal.querySelector('.btn-close').addEventListener('click', () => {
        modal.classList.add("hidden")
    })
  }

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

    grid.addEventListener("contextmenu", e => e.preventDefault());

    for (let i = 0; i < items.length; i++) {
        let neighborsNum = 0
        const isCellEmpty = items[i].classList.contains('empty')

        if (isCellEmpty && i > 0 && !isLeftEdge(i) && hasBomb(items, i - 1)) neighborsNum++
        if (isCellEmpty && i > 9 && !isRightEdge(i) && hasBomb(items, i + 1 - width)) neighborsNum++
        if (isCellEmpty && i > 10 && hasBomb(items, i - width)) neighborsNum++
        if (isCellEmpty && !isLeftEdge(i) && i >= 11 && hasBomb(items, i - 1 - width)) neighborsNum++
        if (isCellEmpty && !isRightEdge(i) && i <= 98 && hasBomb(items, i + 1)) neighborsNum++
        if (isCellEmpty && !isLeftEdge(i) && i <= 90 && hasBomb(items, i - 1 + width)) neighborsNum++
        if (isCellEmpty && !isRightEdge(i) && i <= 88 && hasBomb(items, i + 1 + width)) neighborsNum++
        if (isCellEmpty && i < 89 && hasBomb(items, i + width)) neighborsNum++

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
        console.log(bombsNum - flags)
        flagsAmount.innerHTML = 'Flags left: ' + (bombsNum - flags)
        isGameWon()
    } else if (item.classList.contains('flag')) {
        item.innerHTML = ''
        item.classList.remove('flag')
        flags--
        flagsAmount.innerHTML = 'Flags left: ' + (bombsNum - flags)
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
        if (i >= 10) {
            const newItem = document.getElementById(+i - width)
            processCell(newItem, +i - width)
        }
        if (i >= 11 && !isLeftEdge(i)) {
            const newItem = document.getElementById(+i - 1 - width)
            processCell(newItem, +i - 1 - width)            
        }
        if (i < 99 && !isRightEdge(i)) {
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
        isGameOver = true
        let userArr = localStorage.getItem('game') ? JSON.parse(localStorage.getItem('game')) : ''
        if (userArr) {
            userArr.push(createRecord(clicks, minute, second, user, bombsNum))
        } else {
            userArr = [createRecord(clicks, minute, second, user, bombsNum)]
        }
        userArr.sort(compareStats)
        if (userArr.length > 10) userArr = userArr.slice(0, 10) 
        localStorage.setItem('game', JSON.stringify(userArr))
        stopTimer()
        setTimeout(() => {
            message.innerHTML = 'YOU WIN! \n Wanna try again?'
            const stats = document.createElement('p')
            stats.classList.add('stats')
            stats.innerHTML =  bombsNum + ' detected' + '<br>' + 'Finished in ' + minute + 'm ' + second + 's ' + '<br>' + 'Within ' + clicks + ' clicks'
            //if ()
            message.appendChild(stats)
            grid.innerHTML = ''
            grid.append(message, resetBtn)
        }, 3000)
    }
}

function createRecord(clicks, min, sec, user, bombs) {
    return {
        clicksNum: clicks,
        minutes: min,
        seconds: sec,
        user: user,
        bombs: bombs
    }
}

function gameOver() {
    isGameOver = true

    // localStorage.setItem("time", minute + 'm ' + second + 's')
    // localStorage.setItem("clicks", clicks)
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

