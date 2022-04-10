const rootStyles = getComputedStyle(document.querySelector(":root"))
let hexagonWidth = rootStyles.getPropertyValue("--hexagon-width")
let deltaY = parseInt(rootStyles.getPropertyValue("--deltaY"))
let visibleHexagonsAmount = parseInt(rootStyles.getPropertyValue("--visible-hexagons-amount"))

let battlesArray = getBattlesArray()

let currentBattleNumber = 2
let transitionIsOver = true

window.addEventListener("resize", event => {
    const width = event.target.innerWidth
    if (width < 481 && visibleHexagonsAmount == 5) {
        deltaY = parseInt(rootStyles.getPropertyValue("--deltaY"))
        visibleHexagonsAmount = parseInt(rootStyles.getPropertyValue("--visible-hexagons-amount"))
        battlesArray = getBattlesArray()
        for (let i = 0; i < hexagons.length; i++)
            hexagonInitialization(hexagons[i], i - (currentBattleNumber - 2))
    }
    if (width > 480 && visibleHexagonsAmount == 3) {
        deltaY = parseInt(rootStyles.getPropertyValue("--deltaY"))
        visibleHexagonsAmount = parseInt(rootStyles.getPropertyValue("--visible-hexagons-amount"))
        battlesArray = getBattlesArray()
        for (let i = 0; i < hexagons.length; i++)
            hexagonInitialization(hexagons[i], i - (currentBattleNumber - 2))
    }
    if (width < 1025 && hexagonWidth != " 92.16px") {
        hexagonWidth = rootStyles.getPropertyValue("--hexagon-width")
        for (let i = 0; i < hexagons.length; i++)
            hexagonInitialization(hexagons[i], i - (currentBattleNumber - 2))
    }
    if (width > 1024 && hexagonWidth != " 9vw") {
        hexagonWidth = rootStyles.getPropertyValue("--hexagon-width")
        for (let i = 0; i < hexagons.length; i++)
            hexagonInitialization(hexagons[i], i - (currentBattleNumber - 2))
    }
})

const hexagons = document.querySelectorAll(".hexagon")

function getBattlesArray() {
    return [
        { time: '21:00', date: { day: 17, month: 'апреля' }, css: { top: `calc(${50 - 2 * deltaY}% + 0.3 * 0.6 * ${hexagonWidth})`, left: `calc(${50 + 2 * deltaY}% - 0.3 * ${hexagonWidth})`, scale: 0.4 } },
        { time: '13:00', date: { day: 5, month: 'августа' }, css: { top: 50 - deltaY + "%", left: (50 + deltaY) + "%",  scale: 0.7 }},
        { time: '11:00', date: { day: 4, month: 'июля' }, css: { top: "50%", left: "50%",  scale: 1 } },
        { time: '19:00', date: { day: 26, month: 'июня' }, css: { top: 50 + deltaY + "%", left: 50 - deltaY + "%", scale: 0.7 } },
        { time: '17:00', date: { day: 10, month: 'мая' }, css: { top: `calc(${50 + 2 * deltaY}% - 0.3 * 0.6 * ${hexagonWidth})`, left: `calc(${50 - 2 * deltaY}% + 0.3 * ${hexagonWidth})`, scale: 0.4 } }
    ]
}

function hexagonInitialization(hexagon, index, battleNumber = 2) {
    if (index < (5 - visibleHexagonsAmount) / 2) {
        hexagon.style.top = -10 + "%"
        hexagon.style.left = 110 + "%"
        hexagon.style.transform = `translate(-50%, -50%) scale(0.4, 0.4)` 
    } else if (index > 4 - (5 - visibleHexagonsAmount) / 2 ) {
        hexagon.style.top = 110 + "%"
        hexagon.style.left = -10 + "%"
        hexagon.style.transform = `translate(-50%, -50%) scale(0.4, 0.4)` 
    } else {
        hexagon.style.top = battlesArray[index].css.top
        hexagon.style.left = battlesArray[index].css.left
        hexagon.style.transform = `translate(-50%, -50%) scale(${battlesArray[index].css.scale}, ${battlesArray[index].css.scale})` 
    }
}

function innerHexagonInitialization(hexagon, index) {
    let children = hexagon.children
    children[1].children[0].innerHTML = battlesArray[index].date.day
    children[1].children[1].innerHTML = battlesArray[index].date.month
    children[2].innerHTML = battlesArray[index].time
}

function openSideMenu(e) {
    document.querySelector(".header__list").style.right = "0"
    document.querySelector(".header__list").classList.add("header__list_active")
    document.querySelector(".header__close").style.right = 5 + "%"
}

function closeSideMenu(e) {
    document.querySelector(".header__list").style.right = -280 + "px"
    document.querySelector(".header__list").classList.remove("header__list_active")
    document.querySelector(".header__close").style.right = -280 + "px"
}

for (let i = 0; i < hexagons.length; i++) {
    hexagonInitialization(hexagons[i], i, currentBattleNumber)
    innerHexagonInitialization(hexagons[i], i)
    // вешаем слушатель событий на каждый гексагон
    hexagons[i].addEventListener("click", () => {
        currentBattleNumber = i
        for (let i = 0; i < hexagons.length; i++) {
            let nextPos = i - (currentBattleNumber - 2)
            hexagonInitialization(hexagons[i], nextPos, currentBattleNumber)
            if (i == currentBattleNumber) {
                hexagons[i].classList.remove("hide")
            } else {
                hexagons[i].classList.add("hide")
            }
        }
    })
}

// вешаем обработчик на событие прокрутки колесика мыши
window.addEventListener("wheel", event => {
    if (event.deltaY == -0 || document.querySelector(".header__list").classList.contains("header__list_active")) 
        return
    if (transitionIsOver) {
        if (currentBattleNumber == 0 && event.deltaY < -0.01 || currentBattleNumber == 4 && event.deltaY > 0)
            return 
        transitionIsOver = false
        let side = event.deltaY > 0 ? -1 : 1
        for (let i = 0; i < hexagons.length; i++) {
            let nextPos = i - (currentBattleNumber - 2) + side
            hexagonInitialization(hexagons[i], nextPos, currentBattleNumber, side)
                if (i == currentBattleNumber) {
                    hexagons[i].classList.add("hide")
                }
                if (i + side == currentBattleNumber) {
                    hexagons[i].classList.remove("hide")
                }
            }
        side == -1 ? currentBattleNumber++ : currentBattleNumber--
        setTimeout( () => transitionIsOver = true, 1000)       
    }
})

document.getElementById("burger").addEventListener("click", openSideMenu)

document.getElementById("close").addEventListener("click", closeSideMenu)

document.body.addEventListener("click", (event) => {
    const el = event.target
    // проверяем, что узел не является списоком или элементом списка
    const condition = el.classList.contains("header__list") || el.classList.contains("header__item") || (el.classList.contains("header__link") && el.parentNode.tagName == "LI")
    if (event.target.getAttribute("id") == "burger") {
        openSideMenu(event)
    } else if (document.querySelector(".header__list").classList.contains("header__list_active") && !condition) {
        closeSideMenu(event)
    }
})