var playerStatus = false
var mousemove = false
var beforemove = false
var player = document.getElementById('player')
var list = document.getElementById('video-list')
var videoName = document.getElementById('video-name')
var button = document.getElementById("controls")
    /* var pbutton = document.getElementById("progress-button")
    var progress = document.getElementById('progress-bar')
    var volumeUp = document.getElementById('volume-up')
    var volumeDown = document.getElementById('volume-down') */
var durationNow = document.getElementById('duration-now')
var durationAll = document.getElementById('duration-all')
var volume = document.getElementById('volume')
var progressBar = document.getElementById('strip')
var progressWidget = document.getElementById('widget')
var volumeBar = document.getElementById('volume-bar')
var volumeWidget = document.getElementById('volume-widget')
var startTime = new Date
var curTime = 0
var videoList = ["Rixton - Me and My Broken Heart", "Shawn", "Spontania,AZU - 同じ空みつめてるあなたに", "Steerner,Martell - Crystals", "The Script,will.i.am - Hall of Fame", "The Wanted - Glad You Came", "TheFatRat - Unity", "Thomas Bergersen - Immortal", "Timmy Trumpet - Nightmare (Original Mix)"]

function getName(player) {
    var name = player.src
    var namer = name.split('').reverse()
    name = name.slice(-namer.indexOf('/'), -4)
    videoName.innerHTML = decodeURIComponent(name)
}

function showVideoList() {
    for (let i = 0; i < videoList.length; i++) {
        let a = document.createElement('div')
        a.innerHTML = videoList[i]
        a.style.cursor = 'pointer'
        a.className = "list"
        a.addEventListener('click', function() {
            player.src = './src/mp3/' + videoList[i] + '.mp3'
            player.load()
        })
        list.appendChild(a)
    }
}

function control() {
    if (playerStatus == false) {
        player.play()
        playerStatus = true
        beforemove = true
    } else {
        player.pause()
        playerStatus = false
        beforemove = false
    }
}

function changeImg() {
    if (playerStatus == false) {
        button.style.backgroundImage = 'url(src/img/play.png)'
    } else {
        button.style.backgroundImage = 'url(src/img/pause.png)'
    }
}

function jump() {
    var time = progress.value
    if (time >= 0 && time <= player.duration) {
        console.log(player.duration)
        player.currentTime = time
        player.play()
        playerStatus = true
        changeImg()
    }
}

function volumeU() {
    if (player.volume >= 0 && player.volume < 1) {
        player.volume = player.volume + 0.1
    }

}

function volumeD() {
    if (player.volume > 0 && player.volume <= 1) {
        player.volume = player.volume - 0.1
    }
}

function emptied(player) {
    durationNow.innerHTML = '0:00'
    durationAll.innerHTML = parseInt(player.duration / 60) + ':' + (player.duration % 60 > 10 ? parseInt(player.duration % 60) : '0' + parseInt(player.duration % 60))
    getName(player)
    volume.innerHTML = player.volume.toFixed(1)
}

function changeWidget() {
    let e = event || window.event
    let time = 0
    if (e.clientX < progressBar.offsetLeft + 5) {
        progressWidget.style.left = '-5px'
        time = 0
    } else if (e.clientX > progressBar.offsetLeft + 200) {
        progressWidget.style.left = '195px'
        time = 200
    } else {
        progressWidget.style.left = e.clientX - progressBar.offsetLeft - distL - 5 + 'px'
        time = e.clientX - progressBar.offsetLeft - distL
    }
    player.currentTime = (time / 200 * player.duration)
}

function syncWidget() {
    progressWidget.style.left = player.currentTime / player.duration * 200 - 5 + 'px'
}

function changeProgress() {
    let e = event || window.event
    distL = e.clientX - progressBar.offsetLeft - progressWidget.offsetLeft
    player.pause()
    document.addEventListener('mousemove', changeWidget)
    mousemove = true
}

function changeVolume() {
    let e = event || window.event
    let volume = 0
    if (e.clientX <= volumeBar.offsetLeft + 5) {
        volumeWidget.style.left = '-5px'
        volume = 0
    } else if (e.clientX > volumeBar.offsetLeft + 50) {
        volumeWidget.style.left = '45px'
        volume = 50
    } else {
        volumeWidget.style.left = e.clientX - volumeBar.offsetLeft - distV - 5 + 'px'
        volume = e.clientX - volumeBar.offsetLeft - distV
    }
    player.volume = (volume / 50) > 0 ? (volume / 50) : 0
}

window.onload = function() {
    showVideoList()
    emptied(player)
}
volumeBar.addEventListener('click', function() {
    let e = event || window.event
    let volume = e.clientX - volumeBar.offsetLeft
    volumeWidget.style.left = volume - 5 + 'px'
    player.volume = volume / 50
})

volumeWidget.addEventListener('mousedown', function() {
    let e = event || window.event
    distV = e.clientX - volumeBar.offsetLeft - volumeWidget.offsetLeft
    document.addEventListener('mousemove', changeVolume)
})
progressBar.addEventListener('click', function() {
    let e = event || window.event
    let time = e.clientX - progressBar.offsetLeft
    progressWidget.style.left = time - 5 + 'px'
    player.currentTime = time / 200 * player.duration
})

progressWidget.addEventListener('mousedown', changeProgress)
document.addEventListener('mouseup', function() {
    if (playerStatus == false && mousemove == true && beforemove == true) {
        player.play()
        mousemove = false
    }
    document.removeEventListener('mousemove', changeWidget)
    document.removeEventListener('mousemove', changeVolume)
})
player.addEventListener('durationchange', function() {
    durationNow.innerHTML = '0:00'
    durationAll.innerHTML = parseInt(player.duration / 60) + ':' + (player.duration % 60 > 10 ? parseInt(player.duration % 60) : '0' + parseInt(player.duration % 60))
})
player.addEventListener('emptied', function() {
    playerStatus = false
    changeImg()
    getName(player)
    progressWidget.style.left = '-5px'
})
player.addEventListener('timeupdate', function() {
    curTime = new Date
    if (curTime - startTime > 900 || player.currentTime == player.duration) {
        durationNow.innerHTML = parseInt(player.currentTime / 60) + ':' + (player.currentTime % 60 > 10 ? parseInt(player.currentTime % 60) : '0' + parseInt(player.currentTime % 60))
        startTime = new Date
        syncWidget()
    }
})
player.addEventListener('playing', function() {
    playerStatus = true
    changeImg()
})
player.addEventListener('pause', function() {
    playerStatus = false
    changeImg()
})
player.addEventListener('volumechange', function() {
    volume.innerHTML = player.volume.toFixed(1)
})
player.addEventListener('seeked', function() {
    durationNow.innerHTML = parseInt(player.currentTime / 60) + ':' + (player.currentTime % 60 > 10 ? parseInt(player.currentTime % 60) : '0' + parseInt(player.currentTime % 60))
})

button.addEventListener('click', control)
    // pbutton.addEventListener('click', jump)
    /* volumeUp.addEventListener('click', volumeU)
    volumeDown.addEventListener('click', volumeD) */