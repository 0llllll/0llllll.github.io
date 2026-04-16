// ====================== main.js ======================

// ==================== 粒子背景系统 ====================
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isAnimating = true;
let animationFrameId = null;

let geometry, position, positionArray, velocity, velocityArray;
const count = 200;

function initParticles() {
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * count), 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(2 * count), 1));

    position = geometry.getAttribute('position');
    positionArray = position.array;
    velocity = geometry.getAttribute('velocity');
    velocityArray = velocity.array;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    for (let i = 0; i < count; i++) {
        const x = Math.random() * 800 - 400;
        const y = Math.random() * 800 - 400;
        const z = Math.random() * 400 - 200;

        positionArray[6 * i]     = x;
        positionArray[6 * i + 1] = y;
        positionArray[6 * i + 2] = z;
        positionArray[6 * i + 3] = x;
        positionArray[6 * i + 4] = y;
        positionArray[6 * i + 5] = z;

        velocityArray[2 * i]     = 0;
        velocityArray[2 * i + 1] = 0;
    }

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    scene.add(new THREE.LineSegments(geometry, material));

    window.addEventListener('resize', resize);
    document.body.addEventListener('pointermove', onPointerMove);

    animate();
}

function resize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
}

function animate() {
    if (!isAnimating) return;

    for (let i = 0; i < count; i++) {
        velocityArray[2 * i] += 0.015;
        velocityArray[2 * i + 1] += 0.015;

        positionArray[6 * i + 2] += velocityArray[2 * i] + 0.03;
        positionArray[6 * i + 5] += velocityArray[2 * i + 1];

        if (positionArray[6 * i + 2] > 200) {
            const z = Math.random() * 200 - 200;
            positionArray[6 * i + 2] = z;
            positionArray[6 * i + 5] = z;
            velocityArray[2 * i] = velocityArray[2 * i + 1] = 0;
        }
    }

    position.needsUpdate = true;
    render();
    animationFrameId = requestAnimationFrame(animate);
}

function render() {
    if (!camera || !renderer) return;
    camera.position.x += (-mouseX * 0.1 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function onPointerMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isAnimating = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
        isAnimating = true;
        if (scene && camera && renderer) animate();
    }
});

// ==================== 全局功能 ====================
let currentPage = 2;

window.onload = function () {
    toggleTheme('dark');
    loadMusicPlayer();
    switchPageTo(2);

    preloadImages([
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/000.jpg',
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/222.JPG',
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/111.JPG'
    ]);

    // 动态加载 Three.js（和原来完全一致）
    const loadParticles = () => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js";
        script.onload = () => {
            initParticles();        // ← 改成 initParticles()
        };
        document.body.appendChild(script);
    };

    if (window.requestIdleCallback) {
        requestIdleCallback(loadParticles);
    } else {
        setTimeout(loadParticles, 300);
    }
};

function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ====================== 页面切换 ======================
function switchPageTo(page) {
    if (page < 1 || page > 3) return;
    currentPage = page;
    const pages = document.querySelector('.pages');
    pages.style.transform = `translateX(-${(page - 1) * 100}%)`;

    document.querySelectorAll('.bullet').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.page) === page);
    });
}

// ====================== 主题 & 背景 ======================
function toggleTheme(theme) {
    const canvas = document.getElementById('shuicheCanvas');
    if (theme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        document.body.style.background = 'url("https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/000.jpg") center/cover fixed';
        document.documentElement.style.setProperty('--fg', 'black');
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        document.body.style.background = 'black';
        document.documentElement.style.setProperty('--fg', 'white');
    }
    canvas.style.display = 'block';
}

function switchBackground(url) {
    document.body.style.background = `url('${url}') center/cover fixed`;
    document.body.classList.add('light');
    document.documentElement.style.setProperty('--fg', 'black');
    document.getElementById('shuicheCanvas').style.display = 'block';
}

// ====================== 其他功能 ======================
function toggleReward() {
    const gif = document.getElementById('neko-gif');
    const qr = document.getElementById('reward-qr');
    const textOld = document.getElementById('text-original');
    const textNew = document.getElementById('text-new');

    if (gif.style.opacity !== '0') {
        gif.style.opacity = '0';
        textOld.style.opacity = '0';
        qr.style.opacity = '1';
        qr.style.pointerEvents = 'auto';
        textNew.style.opacity = '1';
        textNew.style.pointerEvents = 'auto';
    } else {
        qr.style.opacity = '0';
        qr.style.pointerEvents = 'none';
        textNew.style.opacity = '0';
        textNew.style.pointerEvents = 'none';
        gif.style.opacity = '1';
        textOld.style.opacity = '1';
    }
}

// 按钮悬停效果
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle, .day-toggle').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.2)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });
});

// vCard 下载
document.getElementById('download-vcf').addEventListener('click', function(e) {
    e.preventDefault();
    const vcfUrl = 'https://raw.githubusercontent.com/0llllll/0llllll.github.io/main/x.vcf';
    fetch(vcfUrl)
        .then(res => res.text())
        .then(text => {
            const link = document.createElement('a');
            link.href = 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(text);
            link.download = 'contact.vcf';
            link.click();
        })
        .catch(() => window.location.href = vcfUrl);
});

// 微信复制
new ClipboardJS('#wechatBtn', {
    text: () => "lllIIllllIIlIII"
}).on('success', () => {
    alert('👉微信号复制成功,即将前往 微信WeChat !');
    window.location.href = 'weixin://';
}).on('error', () => {
    alert('复制失败,请手动输入 lllIIllllIIlIII');
    window.location.href = 'weixin://dl/scan';
});

const avatarSound = new Audio("https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/Neko%3ACat.wav");
avatarSound.volume = 0.35;

// ====================== music-player.js ======================

function loadMusicPlayer() {
    let indexSong = 0;
    let isLocked = false;
    let songsLength = null;
    let selectedSong = null;
    let songIsPlayed = false;
    let progress_elmnt = null;
    let songName_elmnt = null;
    let sliderImgs_elmnt = null;
    let singerName_elmnt = null;
    let progressBar_elmnt = null;
    let musicPlayerInfo_elmnt = null;
    let progressBarIsUpdating = false;
    let broadcastGuarantor_elmnt = null;

    const root = document.querySelector("#root");
    const mainAudio = document.getElementById('mainAudio');

    // 保存播放状态
    function savePlaybackState() {
        if (!selectedSong) return;
        const playbackState = {
            currentSongIndex: indexSong,
            isPlaying: !selectedSong.paused,
            volume: selectedSong.volume,
            currentTime: selectedSong.currentTime
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(playbackState));
    }

    // 恢复播放状态
    function restorePlaybackState() {
        try {
            const savedState = localStorage.getItem('musicPlayerState');
            if (!savedState) return;
            const playbackState = JSON.parse(savedState);

            if (playbackState.currentSongIndex !== undefined &&
                playbackState.currentSongIndex >= 0 &&
                playbackState.currentSongIndex <= songsLength) {

                indexSong = playbackState.currentSongIndex;

                broadcastGuarantor_elmnt.classList.remove("click");
                songIsPlayed = false;

                updateInfo(songName_elmnt, songs[indexSong].songName);
                updateInfo(singerName_elmnt, songs[indexSong].artist);
                setProperty(sliderImgs_elmnt, "--index", -indexSong);

                if (playbackState.currentTime !== undefined) {
                    mainAudio.dataset.savedTime = playbackState.currentTime;
                }
                if (playbackState.volume !== undefined) {
                    mainAudio.volume = playbackState.volume;
                }

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: songs[indexSong].songName,
                        artist: songs[indexSong].artist,
                        artwork: [{ src: songs[indexSong].files.cover, sizes: '512x512', type: 'image/jpeg' }]
                    });
                }
            }
        } catch (e) {
            console.error("Error restoring playback state:", e);
        }
    }

    // 切换歌曲
    function handleChangeMusic({ isPrev = false, playListIndex = null }) {
        if (isLocked) return;
        let newIndex;
        if (playListIndex !== null) {
            newIndex = playListIndex;
        } else {
            newIndex = isPrev ? (indexSong - 1) : (indexSong + 1);
        }
        if (newIndex < 0) newIndex = songsLength;
        if (newIndex > songsLength) newIndex = 0;
        if (newIndex === indexSong) return;

        mainAudio.pause();
        indexSong = newIndex;

        if (songIsPlayed) {
            mainAudio.src = songs[indexSong].files.song;
            mainAudio.load();
            mainAudio.addEventListener('loadedmetadata', () => {
                mainAudio.play().catch(e => console.log("Play failed:", e));
                savePlaybackState();
            }, { once: true });
        } else {
            mainAudio.removeAttribute('src');
            setProperty(progressBar_elmnt, "--width", "0%");
            delete mainAudio.dataset.savedTime;
            savePlaybackState();
        }

        setProperty(sliderImgs_elmnt, "--index", -indexSong);
        updateInfo(songName_elmnt, songs[indexSong].songName);
        updateInfo(singerName_elmnt, songs[indexSong].artist);

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songs[indexSong].songName,
                artist: songs[indexSong].artist,
                artwork: [{ src: songs[indexSong].files.cover, sizes: '512x512', type: 'image/jpeg' }]
            });
        }
    }

    // 播放/暂停核心逻辑
    function handlePlayMusic() {
        if (!mainAudio.getAttribute('src')) {
            mainAudio.src = songs[indexSong].files.song;
            mainAudio.load();
            mainAudio.addEventListener('loadedmetadata', () => {
                if (mainAudio.dataset.savedTime) {
                    mainAudio.currentTime = parseFloat(mainAudio.dataset.savedTime);
                    delete mainAudio.dataset.savedTime;
                }
                mainAudio.play().catch(e => console.log("Play failed:", e));
            }, { once: true });

            this.classList.add("click");
            songIsPlayed = true;
            savePlaybackState();
            return;
        }

        if (mainAudio.currentTime === mainAudio.duration && mainAudio.duration > 0) {
            handleChangeMusic({});
            return;
        }

        this.classList.toggle("click");
        songIsPlayed = !songIsPlayed;
        mainAudio.paused ? mainAudio.play() : mainAudio.pause();
        savePlaybackState();
    }

    function updateTheProgressBar() {
        if (isNaN(this.duration) || this.duration === 0) return;
        const progressBarWidth = (this.currentTime / this.duration) * 100;
        setProperty(progressBar_elmnt, "--width", `${progressBarWidth}%`);

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setPositionState({
                duration: this.duration,
                playbackRate: this.playbackRate,
                position: this.currentTime
            });
        }
    }

    function handleSongEnded() {
        if (songIsPlayed) handleChangeMusic({});
    }

    function handleScrub(e) {
        e.preventDefault();
        if (!selectedSong.getAttribute('src') || isNaN(selectedSong.duration) || selectedSong.duration === 0) return;

        let clientX = e.clientX;
        if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;

        const progressOffsetLeft = progress_elmnt.getBoundingClientRect().left;
        const progressWidth = progress_elmnt.offsetWidth;
        const duration = selectedSong.duration;
        selectedSong.currentTime = (clientX - progressOffsetLeft) / progressWidth * duration;
    }

    // ==================== 歌曲列表 ====================
    const songs = [
        {
            "artist": "SCSI-9",
            "songName": "Senorita Tristeza",
            "files": { "song": "https://qxx.me/music/Senorita Tristeza.mp3", "cover": "https://qxx.me/music/Senorita%20Tristeza.JPG" },
            "duration": "5:53"
        },
        {
            "artist": "Paradox Interactive",
            "songName": "Be Happy",
            "files": { "song": "https://qxx.me/music/Be Happy.mp3", "cover": "https://qxx.me/music/Be%20Happy.jpg" },
            "duration": "3:22"
        },
        {
            "artist": "Flower Face",
            "songName": "Jupiter",
            "files": { "song": "https://qxx.me/music/Jupiter.mp3", "cover": "https://qxx.me/music/Jupiter.jpg" },
            "duration": "4:31"
        },
        {
            "artist": "La Femme",
            "songName": "Le jardin",
            "files": { "song": "https://qxx.me/music/Le jardin.mp3", "cover": "https://qxx.me/music/Le%20jardin.JPG" },
            "duration": "4:00"
        },
        {
            "artist": "Still Corners",
            "songName": "Crying",
            "files": { "song": "https://qxx.me/music/Crying.mp3", "cover": "https://qxx.me/music/Crying.JPG" },
            "duration": "3:28"
        },
        {
            "artist": "Marvel83'",
            "songName": "Alone With You",
            "files": { "song": "https://qxx.me/music/Alone With You.mp3", "cover": "https://qxx.me/music/Alone With You.JPG" },
            "duration": "4:53"
        },
        {
            "artist": "Timecop1983",
            "songName": "Nightfall",
            "files": { "song": "https://qxx.me/music/Nightfall.mp3", "cover": "https://qxx.me/music/Nightfall.JPG" },
            "duration": "4:40"
        },
        {
            "artist": "Lazer Boomerang",
            "songName": "R3cover",
            "files": { "song": "https://qxx.me/music/R3cover.mp3", "cover": "https://qxx.me/music/R3cover.JPG" },
            "duration": "3:34"
        }
    ];

    // ==================== 创建播放器 UI ====================
    const musicPlayer = document.createElement("div");
    musicPlayer.className = "music-player flex-column";

    const slider = document.createElement("div");
    slider.className = "slider center";
    slider.onclick = handleResizeSlider;

    const sliderContent = document.createElement("div");
    sliderContent.className = "slider__content center";

    const playlistButton = document.createElement("button");
    playlistButton.className = "music-player__playlist-button center button";
    playlistButton.innerHTML = '<i class="icon-playlist"></i>';

    const broadcastGuarantor = document.createElement("button");
    broadcastGuarantor.className = "music-player__broadcast-guarantor center button";
    broadcastGuarantor.onclick = handlePlayMusic;
    broadcastGuarantor.innerHTML = '<i class="icon-play"></i><i class="icon-pause"></i>';

    const sliderImgs = document.createElement("div");
    sliderImgs.className = "slider__imgs flex-row";

    songs.forEach((song, index) => {
        const img = document.createElement("img");
        img.src = song.files.cover;
        img.alt = song.songName;
        img.className = "img lazy-placeholder";
        if (index === 0) img.loading = "eager";
        else img.loading = "lazy";
        sliderImgs.appendChild(img);
    });

    sliderContent.append(playlistButton, broadcastGuarantor, sliderImgs);

    const sliderControls = document.createElement("div");
    sliderControls.className = "slider__controls center";

    // 上一首
    const prevButton = document.createElement("button");
    prevButton.className = "slider__switch-button flex-row button";
    prevButton.onclick = () => handleChangeMusic({ isPrev: true });
    prevButton.innerHTML = '<i class="icon-back"></i>';

    // 歌曲信息
    const musicInfo = document.createElement("div");
    musicInfo.className = "music-player__info text_trsf-cap";
    musicInfo.innerHTML = `
        <div>
            <div class="music-player__singer-name"><div>${songs[0].songName}</div></div>
        </div>
        <div>
            <div class="music-player__subtitle"><div>${songs[0].artist}</div></div>
        </div>
    `;

    // 下一首
    const nextButton = document.createElement("button");
    nextButton.className = "slider__switch-button flex-row button";
    nextButton.onclick = () => handleChangeMusic({ isPrev: false });
    nextButton.innerHTML = '<i class="icon-next"></i>';

    const progress = document.createElement("div");
    progress.className = "progress center";
    progress.onpointerdown = (e) => { handleScrub(e); progressBarIsUpdating = true; };
    progress.innerHTML = `
        <div class="progress__wrapper">
            <div class="progress__bar"></div>
        </div>
    `;

    sliderControls.append(prevButton, musicInfo, nextButton, progress);
    slider.append(sliderContent, sliderControls);

    // 播放列表
    const playlist = document.createElement("ul");
    playlist.className = "music-player__playlist list";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "music-player__song";
        li.onclick = () => handleChangeMusic({ playListIndex: index });
        li.innerHTML = `
            <div class="flex-row _align_center">
                <img src="${song.files.cover}" class="img music-player__song-img lazy-placeholder" loading="lazy">
                <div class="music-player__playlist-info text_trsf-cap">
                    <b class="text_overflow">${song.songName}</b>
                    <div class="flex-row _justify_space-btwn">
                        <span class="music-player__subtitle">${song.artist}</span>
                        <span class="music-player__song-duration">${song.duration}</span>
                    </div>
                </div>
            </div>
        `;
        playlist.appendChild(li);
    });

    musicPlayer.append(slider, playlist);
    root.innerHTML = '';
    root.appendChild(musicPlayer);

    // ==================== 初始化变量 ====================
    songsLength = songs.length - 1;

    progress_elmnt = document.querySelector(".progress");
    sliderImgs_elmnt = document.querySelector(".slider__imgs");
    songName_elmnt = document.querySelector(".music-player__singer-name");
    musicPlayerInfo_elmnt = document.querySelector(".music-player__info");
    singerName_elmnt = document.querySelector(".music-player__subtitle");
    progressBar_elmnt = document.querySelector(".progress__bar");
    broadcastGuarantor_elmnt = document.querySelector(".music-player__broadcast-guarantor");
    selectedSong = mainAudio;

    // 事件监听
    mainAudio.addEventListener('timeupdate', updateTheProgressBar);
    mainAudio.addEventListener('ended', handleSongEnded);

    function handleResizeSlider({ target }) {
        if (isLocked) return;
        if (target.closest(".music-player__info")) {
            this.classList.add("resize");
            setProperty(this, "--controls-animate", "down running");
        } else if (target.closest(".music-player__playlist-button")) {
            this.classList.remove("resize");
            setProperty(this, "--controls-animate", "up running");
        }
    }

    // 字幕滚动控制
    function controlSubtitleAnimation(parent, child) {
        if (child.classList.contains("animate")) return;
        const element = child.firstChild;
        if (child.clientWidth > parent.clientWidth) {
            child.appendChild(element.cloneNode(true));
            child.classList.add("animate");
        }
        setProperty(child.parentElement, "width", `${element.clientWidth}px`);
    }

    function setProperty(target, prop, value = "") {
        target.style.setProperty(prop, value);
    }

    function updateInfo(target, value) {
        while (target.firstChild) target.removeChild(target.firstChild);
        const div = document.createElement("div");
        div.textContent = value;
        target.appendChild(div);
        target.classList.remove("animate");
        controlSubtitleAnimation(musicPlayerInfo_elmnt, target);
    }

    controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
    controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);

    setTimeout(restorePlaybackState, 100);

    // Media Session
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songs[0].songName,
            artist: songs[0].artist,
            artwork: [{ src: songs[0].files.cover, sizes: '512x512', type: 'image/jpeg' }]
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => handleChangeMusic({ isPrev: true }));
        navigator.mediaSession.setActionHandler('nexttrack', () => handleChangeMusic({ isPrev: false }));
        navigator.mediaSession.setActionHandler('play', () => {
            if (!mainAudio.getAttribute('src')) broadcastGuarantor_elmnt.click();
            else mainAudio.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => mainAudio.pause());
        navigator.mediaSession.setActionHandler('seekto', (d) => {
            if (d.seekTime != null && mainAudio.getAttribute('src')) mainAudio.currentTime = d.seekTime;
        });
    }

    // 窗口大小调整
    function handleResize() {
        const vH = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vH", `${vH}px`);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // 其他事件
    window.addEventListener("pointerup", () => { if (progressBarIsUpdating) progressBarIsUpdating = false; });
    window.addEventListener("pointermove", (e) => {
        if (progressBarIsUpdating) handleScrub(e);
    });
}