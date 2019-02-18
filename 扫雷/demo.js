//点击开始游戏 =》 动态生成100个小格
// leftClick 没有雷 =》显示数字（台标当前小格为中心的8个格雷 ）
// rightClick 标记状态取反

var startBtn = document.getElementById('btn');
var alertBox = document.getElementById('alertBox');
var box = document.getElementsByClassName("box")[0]
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var flagBox = document.getElementsByClassName('flagBox')[0]
var minesNum, mineOver, block;
var mineMap = []
var startGameBool = true

bindEvent();
function bindEvent() {
  startBtn.onclick = function () {
    if (startGameBool) {
      box.style.display = "block"
      flagBox.style.display = "block"
      init()
      startGameBool = false
    }
  }
  box.oncontextmenu = function () {
    return false
  }
  box.onmousedown = function (e) {
    var event = e.target
    if (e.which == 1) {
      leftClick(event);
    } else if (e.which == 3) {
      rightClick(event)
    }
  }
  closeBtn.onclick = function () {
    alertBox.style.display = "none";
    flagBox.style.display = "none";
    box.style.display = "none";
    box.innerHTML = null;
    startGameBool = true
  }
}

function init() {
  minesNum = 10;
  mineOver = 10;
  score.innerHTML = mineOver
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var con = document.createElement("div")
      con.classList.add('block');
      con.setAttribute('id', i + '-' + j)
      box.appendChild(con);
      mineMap.push({ mine: 0 })
    }
  }
  block = document.getElementsByClassName('block');
  while (minesNum) {
    var mineIndex = Math.floor(Math.random() * 100)
    if (mineMap[mineIndex].mine === 0) {
      block[mineIndex].classList.add('isLei')
      minesNum--
    }

  }
}

function leftClick(dom) {
  if(dom.classList.contains('flag')){
    return
  }

  var isLei = document.getElementsByClassName('isLei');
  if (dom && dom.classList.contains('isLei')) {
    console.log("gameOver")
    for (var i = 0; i < isLei.length; i++) {
      isLei[i].classList.add('show')
    }
    setTimeout(function () {
      alertBox.style.display = "block"
      alertImg.style.backgroundImage = 'url("img/over.jpg")'
    }, 800)
  } else {
    var n = 0;
    // 点击的地方
    var posArr = dom && dom.getAttribute("id").split('-');
    var posX = posArr && +posArr[0];
    var posY = posArr && +posArr[1];
    dom && dom.classList.add('num')
    // 计算周围有多少雷
    for (var i = posX - 1; i <= posX + 1; i++) {
      for (var j = posY - 1; j <= posY + 1; j++) {
        // if(i>100) break
        var aroundBox = document.getElementById(i + '-' + j)
        if (aroundBox && aroundBox.classList.contains("isLei")) {
          n++
        }
      }
  }
  dom && (dom.innerHTML = n)
  if (n == 0) {
    for (var i = posX - 1; i <= posX + 1; i++) {
      for (var j = posY - 1; j <= posY + 1; j++) {
        var nearBox = document.getElementById(i + '-' + j);
        if (nearBox && nearBox.length != 0) {
          if (!nearBox.classList.contains('check')) {
            nearBox.classList.add('check')
            leftClick(nearBox)
          }
        }
      }
    }
  }
  }
}

function rightClick(dom) {
  if (dom && dom.classList.contains('num')) {
    return
  }
  dom.classList.toggle('flag')
  if (dom.classList.contains('isLei') && dom.classList.contains('flag')) {
    mineOver--;
  }
  if (dom.classList.contains("isLei") && !dom.classList.contains('flag')) {
    mineOver++;
  }
  score.innerHTML = mineOver
  if (mineOver == 0) {
    alertBox.style.display = "block"
    alertImg.style.backgroundImage = 'url("img/success.png")'
  }
}