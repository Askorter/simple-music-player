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
let timeList = [];
let lastLight = 0;
let songList = [];
let begin = 0;
let end = 0;

function getName(index) {
    var name = document.querySelectorAll(".song-name")[index].innerHTML;
    videoName.innerHTML = decodeURIComponent(name);
}

function showVideoList(videoList, begin, end) {
    for (let i = begin; i < end; i++) {
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
    for (let i = begin; i < end; i++) {
        a[i].addEventListener("click", () => {
            fetchData(
                `https://api.imjad.cn/cloudmusic?type=song&id=${videoList[i].id}`,
                function(data) {
                    document.querySelector('#video-info').style.visibility = 'visible';
                    player.src = data.data[0].url;
                    player.load();
                    player.play();
                    playingIndex = i;
                }
            );
        });
    }
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
        (player.duration % 60 > 10 ?
            parseInt(player.duration % 60) :
            "0" + parseInt(player.duration % 60));
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

function preSong() {
    if (playingIndex == 0) {
        return;
    } else {
        fetchData(
            `https://api.imjad.cn/cloudmusic?type=song&id=${songList[playingIndex-1].id}`,
            function(data) {
                player.src = data.data[0].url;
                player.load();
                player.play();
                playingIndex--;
            }
        );
    }
}

function nextSong() {
    if (playingIndex == end - 1) {
        return;
    } else {
        fetchData(
            `https://api.imjad.cn/cloudmusic?type=song&id=${songList[playingIndex + 1].id}`,
            function(data) {
                player.src = data.data[0].url;
                player.load();
                player.play();
                playingIndex++;
            }
        );
    }
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

let pre = document.querySelector('.pre-song');
let next = document.querySelector('.next-song');
pre.addEventListener('click', preSong);
next.addEventListener('click', nextSong);
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
        (player.duration % 60 > 10 ?
            parseInt(player.duration % 60) :
            "0" + parseInt(player.duration % 60));
    let lyric = document.querySelector(".lyric-container");
    lyric.innerHTML = '';
    let songId = document.querySelectorAll('.song-item')[playingIndex].id;
    showLyric(songId);
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
            (player.currentTime % 60 > 10 ?
                parseInt(player.currentTime % 60) :
                "0" + parseInt(player.currentTime % 60));
        startTime = new Date();
        syncWidget();
    }
    asyncLyric();
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
        (player.currentTime % 60 > 10 ?
            parseInt(player.currentTime % 60) :
            "0" + parseInt(player.currentTime % 60));
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
    showVideoList(songList, 0, 10);
    document.querySelector('.skeleton').style.display = 'none';
    end = 10;
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

function showLyric(id) {
    let lyric = document.querySelector(".lyric-container");
    let list = document.querySelector(".video-list");
    let url = `https://api.imjad.cn/cloudmusic?type=lyric&id=${id}`;
    fetchData(url, (data) => {
        let songLyric = data.lrc.lyric;
        songLyric = songLyric.split('\n');
        timeList = [];
        songLyric.forEach(item => {
                if (!item) {
                    return;
                }
                let p = document.createElement('p');
                //console.log(item)
                let temp = item.split(']')
                if (isNaN(temp[0].slice(1).split(':')[0] * 60 + temp[0].slice(1).split(':')[1])) {
                    return;
                }
                p.innerHTML = temp[1];
                lyric.appendChild(p);
                timeList.push(temp[0].slice(1));
            })
            //console.log(timeList)
        timeList = timeList.map(item => {
            let temp = item.split(':');
            return temp[0] * 60 + temp[1] * 1;
        });
        lyric.style.transform = 'rotateY(-180deg)';
    })
}

lyricButton.addEventListener("click", function() {
    if (lyricShow == false) {
        let i = 200;
        let time = setInterval(() => {
            if (i >= 0) {
                lyric.style.right = -i + '%';
                i = i - 20;
            } else {
                clearTimeout(time);
            }
        }, 20);
        lyricShow = true;
        document.querySelector('#video-list').style.visibility = 'hidden';
    } else {
        let i = 0;
        let time = setInterval(() => {
            if (i <= 200) {
                lyric.style.right = -i + '%';
                i = i + 20;
            } else {
                clearTimeout(time);
            }
        }, 20);
        lyricShow = false;
        document.querySelector('#video-list').style.visibility = 'visible';
    }
    //console.log(timeList);
});

function asyncLyric() {
    let lyricContainer = document.querySelector('.lyric-container');
    if (lyricContainer.innerHTML != '') {
        let nowTime = player.currentTime;
        for (let i = 0; i < timeList.length - 1; i++) {
            if (nowTime >= timeList[i] && nowTime < timeList[i + 1]) {
                //console.log(nowTime, timeList[i], lyric.scrollTop)
                let top = document.querySelectorAll('.lyric-container p')[i];
                let last = document.querySelectorAll('.lyric-container p')[lastLight];
                //console.log(top)
                if (lastLight == i) {} else {
                    top.classList.add('high-light');
                    last.classList.remove('high-light');
                    lastLight = i;
                }

                if (top.offsetTop > 250) {
                    lyric.scrollTop = top.offsetTop - 250;
                } else {
                    lyric.scrollTop = 0;
                }
            } else if (nowTime < timeList[0]) {
                lyric.scrollTop = 0;
                let top = document.querySelectorAll('.lyric-container p')[0];
                let last = document.querySelectorAll('.lyric-container p')[lastLight];
                if (lastLight != 0) {
                    last.classList.remove('high-light');
                }
                top.classList.add('high-light');
                lastLight = 0;
            } else if (nowTime > timeList[timeList.length - 1]) {
                let top = document.querySelectorAll('.lyric-container p')[timeList.length - 1];
                let last = document.querySelectorAll('.lyric-container p')[lastLight];
                top.classList.add('high-light');
                if (lastLight != timeList.length - 1) {
                    last.classList.remove('high-light');
                }
                lastLight = timeList.length - 1;
            }
            //console.log(lyric.scrollTop, nowTime, timeList[i])
        }
    }

}

let moreButton = document.querySelector('.more-button');
moreButton.addEventListener('click', () => {
    begin = end;
    end = end + 10;
    showVideoList(songList, begin, end);
})