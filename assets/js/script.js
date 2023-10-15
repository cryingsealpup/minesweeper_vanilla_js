let width = 10,
    bombsNum = 25,
    isGameOver = false
const grid = document.querySelector('.grid'),
    items = [], isLeftEdge = (i) => i % width === 0, 
    isRightEdge = (i) => i % width === width - 1

createBoard()


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
        item.addEventListener('click', () => {
            processCell(item, i)
        })
    }

    for (let i = 1; i < items.length; i++) {
        let neighborsNum = 0
        const isCellEmpty = items[i].classList.contains('empty')

        if (isCellEmpty && !isLeftEdge(i) && hasBomb(items, i - 1)) neighborsNum++
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
    if (item.classList.contains('bomb') || item.classList.contains('flag')) return
    if (item.classList.contains('bomb')) alert('Game over!')
    else {
        const total = item.getAttribute('data-neighbors')
        if (total > 0) {
            item.textContent = total
            item.classList.add('checked')
            return
        }
        checkSquare(i)
        
    }
    item.classList.add('checked')
}


function checkSquare(i) {
    setTimeout(() => {
        if (i > 0 && !isLeftEdge(i)) {
            
            const newItem = document.getElementById(i - 1)
            processCell(newItem, +newItem.id)
        }
        if (i > 9 && !isRightEdge(i)) {
            const newItem = document.getElementById(i + 1 - width)
            processCell(newItem, +newItem.id)
        }
        if (i > 10) {
            const newItem = document.getElementById(i - width)
            processCell(newItem, +newItem.id)
        }
        if (i > 11 && !isLeftEdge(i)) {
            const newItem = document.getElementById(i - 1 - width)
            processCell(newItem, +newItem.id)            
        }
        if (i < 98 && !isRightEdge(i)) {
            const newItem = document.getElementById(i + 1)
            processCell(newItem, +newItem.id)    
        }
        if (i < 90 && !isLeftEdge(i)) {
            const newItem = document.getElementById(i - 1 + width)
            processCell(newItem, +newItem.id)                
        }
        if (i < 88 && !isRightEdge(i)) {
            const newItem = document.getElementById(i + 1 + width)
            processCell(newItem, +newItem.id)                
        }       
        if (i < 89) {
            const newItem = document.getElementById(i + width)
            processCell(newItem, +newItem.id)                
        }                
    }, 5)
}