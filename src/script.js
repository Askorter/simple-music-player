var playerStatus = false;
var mousemove = false;
var beforemove = false;
var player = document.getElementById("player");
var list = document.getElementById("video-list");
var videoName = document.getElementById("video-name");
var button = document.getElementById("controls");
/* var pbutton = document.getElementById("progress-button")
    var progress = document.getElementById('progress-bar')
    var volumeUp = document.getElementById('volume-up')
    var volumeDown = document.getElementById('volume-down') */
var durationNow = document.getElementById("duration-now");
var durationAll = document.getElementById("duration-all");
var volume = document.getElementById("volume");
var progressBar = document.getElementById("strip");
var progressWidget = document.getElementById("widget");
var volumeBar = document.getElementById("volume-bar");
var volumeWidget = document.getElementById("volume-widget");
var controls = document.querySelector(".controls-bar");
var volumes = document.querySelector(".volumes");
let lyric = document.querySelector(".song-lyric");
let lyricButton = document.querySelector(".lyric-button");
var startTime = new Date();
var curTime = 0;
var playingIndex = 0;
let lyricShow = false;

function getName(index) {
  var name = document.querySelectorAll(".song-name")[index].innerHTML;
  videoName.innerHTML = decodeURIComponent(name);
}

function showVideoList(videoList) {
  for (let i = 0; i < 20; i++) {
    let a = document.createElement("div");
    a.style.cursor = "pointer";
    a.className = "song-item";
    let albumPic = document.createElement("span");
    let songName = document.createElement("span");
    let songAuthor = document.createElement("span");
    let albumName = document.createElement("span");
    let container = document.createElement("div");
    let songInfo = document.createElement("span");
    albumPic.className = "album-pic";
    songName.className = "song-name";
    songAuthor.className = "song-author";
    albumName.className = "album-name";
    container.className = "song-info-container";
    songInfo.className = "song-info-container-bottom";
    albumPic.style.backgroundImage = `url(${videoList[i].picUrl})`;
    songName.innerHTML = videoList[i].songName;
    songAuthor.innerHTML = videoList[i].author;
    albumName.innerHTML = videoList[i].albumName;
    container.appendChild(songName);
    songInfo.appendChild(songAuthor);
    songInfo.appendChild(albumName);
    container.appendChild(songInfo);
    a.appendChild(albumPic);
    a.appendChild(container);
    a.setAttribute("id", videoList[i].id);
    list.appendChild(a);
  }
  let a = document.querySelectorAll(".song-item");
  a.forEach((item, index) => {
    item.addEventListener("click", () => {
      fetchData(
        `https://api.imjad.cn/cloudmusic?type=song&id=${videoList[index].id}`,
        function(data) {
          player.src = data.data[0].url;
          player.load();
          player.play();
          playingIndex = index;
        }
      );
    });
  });
}

function control() {
  if (playerStatus == false) {
    player.play();
    playerStatus = true;
    beforemove = true;
  } else {
    player.pause();
    playerStatus = false;
    beforemove = false;
  }
}

function changeImg() {
  if (playerStatus == false) {
    button.style.backgroundImage = "url(src/img/play.png)";
  } else {
    button.style.backgroundImage = "url(src/img/pause.png)";
  }
}

function jump() {
  var time = progress.value;
  if (time >= 0 && time <= player.duration) {
    console.log(player.duration);
    player.currentTime = time;
    player.play();
    playerStatus = true;
    changeImg();
  }
}

function volumeU() {
  if (player.volume >= 0 && player.volume < 1) {
    player.volume = player.volume + 0.1;
  }
}

function volumeD() {
  if (player.volume > 0 && player.volume <= 1) {
    player.volume = player.volume - 0.1;
  }
}

function emptied(player) {
  durationNow.innerHTML = "0:00";
  durationAll.innerHTML =
    parseInt(player.duration / 60) +
    ":" +
    (player.duration % 60 > 10
      ? parseInt(player.duration % 60)
      : "0" + parseInt(player.duration % 60));
  getName(playingIndex);
  volume.innerHTML = player.volume.toFixed(1);
}

function changeWidget() {
  let e = event || window.event;
  let time = 0;
  if (e.clientX < progressBar.offsetLeft + 5) {
    progressWidget.style.left = "-5px";
    time = 0;
  } else if (e.clientX > progressBar.offsetLeft + 200) {
    progressWidget.style.left = "195px";
    time = 200;
  } else {
    progressWidget.style.left =
      e.clientX - progressBar.offsetLeft - distL - 5 + "px";
    time = e.clientX - progressBar.offsetLeft - distL;
  }
  player.currentTime = (time / 200) * player.duration;
}

function syncWidget() {
  progressWidget.style.left =
    (player.currentTime / player.duration) * 200 - 5 + "px";
}

function changeProgress() {
  let e = event || window.event;
  distL = e.clientX - progressBar.offsetLeft - progressWidget.offsetLeft;
  player.pause();
  document.addEventListener("mousemove", changeWidget);
  mousemove = true;
}

function changeVolume() {
  let e = event || window.event;
  let volume = 0;
  if (e.clientX <= volumeBar.offsetLeft + 5) {
    volumeWidget.style.left = "-5px";
    volume = 0;
  } else if (e.clientX > volumeBar.offsetLeft + 50) {
    volumeWidget.style.left = "45px";
    volume = 50;
  } else {
    volumeWidget.style.left =
      e.clientX - volumeBar.offsetLeft - distV - 5 + "px";
    volume = e.clientX - volumeBar.offsetLeft - distV;
  }
  player.volume = volume / 50 > 0 ? volume / 50 : 0;
}

window.onload = function() {
  fetchData(
    `https://api.imjad.cn/cloudmusic?type=playlist&id=105817338`,
    handlerSongData
  );
};
volumeBar.addEventListener("click", function() {
  let e = event || window.event;
  let volume = e.clientX - volumeBar.offsetLeft;
  volumeWidget.style.left = volume - 5 + "px";
  player.volume = volume / 50;
});

volumeWidget.addEventListener("mousedown", function() {
  let e = event || window.event;
  distV = e.clientX - volumeBar.offsetLeft - volumeWidget.offsetLeft;
  document.addEventListener("mousemove", changeVolume);
});
progressBar.addEventListener("click", function() {
  let e = event || window.event;
  let time = e.clientX - progressBar.offsetLeft;
  progressWidget.style.left = time - 5 + "px";
  player.currentTime = (time / 200) * player.duration;
});

progressWidget.addEventListener("mousedown", changeProgress);
document.addEventListener("mouseup", function() {
  if (playerStatus == false && mousemove == true && beforemove == true) {
    player.play();
    mousemove = false;
  }
  document.removeEventListener("mousemove", changeWidget);
  document.removeEventListener("mousemove", changeVolume);
});
controls.addEventListener("mouseleave", function() {
  if (playerStatus == false && mousemove == true && beforemove == true) {
    player.play();
    mousemove = false;
  }
  document.removeEventListener("mousemove", changeWidget);
  document.removeEventListener("mousemove", changeVolume);
});
// volumes.addEventListener("mouseleave", function() {
//     if (playerStatus == false && mousemove == true && beforemove == true) {
//         player.play()
//         mousemove = false
//     }
//     document.removeEventListener('mousemove', changeWidget)
//     document.removeEventListener('mousemove', changeVolume)
// })
player.addEventListener("durationchange", function() {
  durationNow.innerHTML = "0:00";
  durationAll.innerHTML =
    parseInt(player.duration / 60) +
    ":" +
    (player.duration % 60 > 10
      ? parseInt(player.duration % 60)
      : "0" + parseInt(player.duration % 60));
});
player.addEventListener("emptied", function() {
  playerStatus = false;
  changeImg();
  getName(playingIndex);
  progressWidget.style.left = "-5px";
});
player.addEventListener("timeupdate", function() {
  curTime = new Date();
  if (curTime - startTime > 900 || player.currentTime == player.duration) {
    durationNow.innerHTML =
      parseInt(player.currentTime / 60) +
      ":" +
      (player.currentTime % 60 > 10
        ? parseInt(player.currentTime % 60)
        : "0" + parseInt(player.currentTime % 60));
    startTime = new Date();
    syncWidget();
  }
});
player.addEventListener("playing", function() {
  playerStatus = true;
  changeImg();
});
player.addEventListener("pause", function() {
  playerStatus = false;
  changeImg();
});
player.addEventListener("volumechange", function() {
  volume.innerHTML = player.volume.toFixed(1);
});
player.addEventListener("seeked", function() {
  durationNow.innerHTML =
    parseInt(player.currentTime / 60) +
    ":" +
    (player.currentTime % 60 > 10
      ? parseInt(player.currentTime % 60)
      : "0" + parseInt(player.currentTime % 60));
});

button.addEventListener("click", control);
// pbutton.addEventListener('click', jump)
/* volumeUp.addEventListener('click', volumeU)
    volumeDown.addEventListener('click', volumeD) */

function dragenter() {
  let e = event || window.event;
  e.preventDefault();
}

function dragover() {
  let e = event || window.event;
  e.preventDefault();
}

// list.addEventListener("click", function() {
//   lyric.style.display = "block";
//   list.style.display = "none";
// });

// lyric.addEventListener("click", function() {
//   list.style.display = "block";
//   lyric.style.display = "none";
// });

function handlerSongData(data) {
  let songList = [];
  data.playlist.tracks.forEach((value, index, arr) => {
    songList.push({
      songName: value.name,
      albumName: value.al.name,
      picUrl: value.al.picUrl,
      author: value.ar[0].name
    });
  });
  data.playlist.trackIds.forEach((value, index) => {
    songList[index].id = value.id;
  });
  showVideoList(songList);
}

function fetchData(url, success) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    // 状态发生变化时，函数被回调
    if (xhr.readyState === 4) {
      // 成功完成
      // 判断响应结果:
      if (xhr.status === 200) {
        // 成功，通过responseText拿到响应的文本:
        return success(JSON.parse(xhr.responseText));
      } else {
        // 失败，根据响应码判断失败原因:
        return fail(xhr.status);
      }
    } else {
      // HTTP请求还在继续...
    }
  };
  xhr.open("get", url);
  xhr.send(null);
}

function showLyric() {
  let lyric = document.querySelector(".song-lyric");
  let list = document.querySelector(".video-list");
  let id = document.querySelectorAll(".so");
  let url = `https://api.imjad.cn/cloudmusic?type=lyric&id=${id}`;
}

lyricButton.addEventListener("click", function() {
  if (lyricShow == false) {
    list.classList.remove("turn-over-front-one");
    lyric.classList.remove("turn-over-front-two");
    list.classList.add("turn-over-back-one");
    lyric.classList.add("turn-over-back-two");
    list.style.pointerEvents = "none";
    lyric.style.pointerEvents = "auto";
    lyricShow = true;
  } else {
    list.classList.remove("turn-over-back-one");
    lyric.classList.remove("turn-over-back-two");
    list.classList.add("turn-over-front-one");
    lyric.classList.add("turn-over-front-two");
    list.style.pointerEvents = "auto";
    lyric.style.pointerEvents = "none";
    lyricShow = false;
  }
});
