const count = 200;
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isAnimating = true; 
let animationFrameId = null;

let geometry, position, positionArray, velocity, velocityArray;

// ================= 初始化 =================
function init() {
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

        positionArray[6 * i] = x;
        positionArray[6 * i + 1] = y;
        positionArray[6 * i + 2] = z;

        positionArray[6 * i + 3] = x;
        positionArray[6 * i + 4] = y;
        positionArray[6 * i + 5] = z;

        velocityArray[2 * i] = 0;
        velocityArray[2 * i + 1] = 0;
    }

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    window.addEventListener('resize', resize, false);
    document.body.addEventListener('pointermove', onPointerMove);

    anime();
}

function resize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
}

function anime() {
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
            velocityArray[2 * i] = 0;
            velocityArray[2 * i + 1] = 0;
        }
    }
    position.needsUpdate = true;
    render();
    animationFrameId = requestAnimationFrame(anime);
}

function render() {
    if (!camera || !renderer) return;
    camera.position.x += (-mouseX * 0.1 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isAnimating = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        if (!isAnimating) {
            isAnimating = true;
            if (scene && camera && renderer) {
                anime();
            }
        }
    }
});

function onPointerMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}
  
let currentPage = 2;

window.onload = function() {
    toggleTheme('dark');
    loadMusicPlayer();
    switchPageTo(2);

    preloadImages([
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/000.jpg',
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/222.JPG',
        'https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/111.JPG'
    ]);

    const loadParticles = () => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js";
        script.onload = () => {
            init();
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

function switchPageTo(page) {
    if (page < 1 || page > 3) return;
    currentPage = page;
    const pages = document.querySelector('.pages');
    pages.style.transform = `translateX(-${(page - 1) * 100}%)`;
    document.querySelectorAll('.bullet').forEach(b => b.classList.toggle('active', parseInt(b.dataset.page) === page));
}

let isPlaying = false;
const audio = document.getElementById('audioPlayer');
function togglePlay(button) {
    if (isPlaying) {
        audio.pause();
        button.classList.remove('playing');
        button.innerHTML = `
            <svg viewBox="0 0 16 16" fill="white">
                <path d="M3 13.1231V2.87688C3 1.42024 4.55203 0.520516 5.77196 1.26995L14.1114 6.39307C15.2962 7.12093 15.2962 8.87907 14.1114 9.60693L5.77196 14.73C4.55203 15.4795 3 14.5798 3 13.1231Z"/>
            </svg> Play`;
    } else {
        audio.play();
        button.classList.add('playing');
        button.innerHTML = `
            <svg viewBox="0 0 16 16" fill="white">
                <path d="M4 2H6V14H4V2ZM10 2H12V14H10V2Z"/>
            </svg> Pause`;
    }
    isPlaying = !isPlaying;
}

audio.addEventListener('ended', () => {
    isPlaying = false;
    const btn = document.querySelector('.play-btn');
    if (btn) {
        btn.classList.remove('playing');
        btn.innerHTML = `
            <svg viewBox="0 0 16 16" fill="white">
                <path d="M3 13.1231V2.87688C3 1.42024 4.55203 0.520516 5.77196 1.26995L14.1114 6.39307C15.2962 7.12093 15.2962 8.87907 14.1114 9.60693L5.77196 14.73C4.55203 15.4795 3 14.5798 3 13.1231Z"/>
            </svg> Play`;
    }
});

function toggleTheme(theme) {
    const canvas = document.getElementById('shuicheCanvas');
    if (theme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        if (renderer) renderer.setClearColor(0x000000, 0); 
        document.body.style.background = 'url("https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/000.jpg") center/cover fixed';
        document.documentElement.style.setProperty('--fg', 'black');
        canvas.style.display = 'block';
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        if (renderer) renderer.setClearColor(0x000000, 0); 
        document.body.style.background = 'black';
        document.documentElement.style.setProperty('--fg', 'white');
        canvas.style.display = 'block';
    }
}

function switchBackground(url) {
    document.body.style.background = `url('${url}') center/cover fixed`;
    document.body.classList.add('light');
    if (renderer) renderer.setClearColor(0x000000, 0); 
    document.documentElement.style.setProperty('--fg', 'black');
    document.getElementById('shuicheCanvas').style.display = 'block';
}

document.querySelectorAll('.theme-toggle, .day-toggle').forEach(button => {
    button.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.2)'; });
    button.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
    button.addEventListener('click', function() {
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 350);
    });
});
  
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

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            savePlaybackState();
        }
    });

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

    function restorePlaybackState() {
        try {
            const savedState = localStorage.getItem('musicPlayerState');
            if (!savedState) return;
            const playbackState = JSON.parse(savedState);
            if (playbackState.currentSongIndex !== undefined &&
                playbackState.currentSongIndex >= 0 &&
                playbackState.currentSongIndex <= songsLength) {
                
                indexSong = playbackState.currentSongIndex;
                
                // 【核心修改：只恢复UI，不赋予 src】
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

    mainAudio.addEventListener('pause', savePlaybackState);
    mainAudio.addEventListener('ended', savePlaybackState);
    window.addEventListener('beforeunload', savePlaybackState);

    function handleChangeMusic({ isPrev = false, playListIndex = null }) {
        if (isLocked) return;
        let newIndex;
        if (playListIndex || playListIndex === 0) {
            newIndex = playListIndex;
        } else {
            newIndex = isPrev ? (indexSong - 1) : (indexSong + 1);
        }
        if (newIndex < 0) { newIndex = songsLength; }
        else if (newIndex > songsLength) { newIndex = 0; }
        if (newIndex === indexSong) return;

        mainAudio.pause();
        indexSong = newIndex;

        // 【核心判断】：如果是播放中，直接加载新歌播放；如果是暂停切歌，彻底断掉连接！
        if (songIsPlayed) {
            mainAudio.src = songs[indexSong].files.song;
            mainAudio.load();
            mainAudio.addEventListener('loadedmetadata', () => {
                mainAudio.play().catch(e => console.log("Play failed:", e));
                savePlaybackState();
            }, { once: true });
        } else {
            mainAudio.removeAttribute('src'); // 断掉后台下载连接
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

    function handleResizeSlider({ target }) {
        if (isLocked) return;
        else if (target.classList.contains("music-player__info")) {
            this.classList.add("resize");
            setProperty(this, "--controls-animate", "down running");
            return;
        } else if (target.classList.contains("music-player__playlist-button")) {
            this.classList.remove("resize");
            setProperty(this, "--controls-animate", "up running");
            return;
        }
    }

    function handlePlayMusic() {
        // 【核心防御】：如果没有加载任何资源，说明是暂停时切的歌或者是刚进来，点击播放时才真正请求下载！
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
        const duration = this.duration;
        const currentTime = this.currentTime;
        const progressBarWidth = (currentTime / duration) * 100;
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
        if (songIsPlayed) {
            handleChangeMusic({});
        }
    }

    function handleScrub(e) {
        e.preventDefault();
        // 【防错机制】：如果没点击播放产生 src 时，禁止拖拽进度条引发报错
        if (!selectedSong.getAttribute('src') || isNaN(selectedSong.duration) || selectedSong.duration === 0) return;
        
        let clientX = e.clientX;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        }
        const progressOffsetLeft = progress_elmnt.getBoundingClientRect().left;
        const progressWidth = progress_elmnt.offsetWidth;
        const duration = selectedSong.duration;
        const currentTime = (clientX - progressOffsetLeft) / progressWidth;
        selectedSong.currentTime = currentTime * duration;
    }

    const songs =[
        {
            "bg": "#c9bea28f",
            "artist": "SCSI-9",
            "songName": "Senorita Tristeza",
            "files": {
                "song": "https://qxx.me/music/Senorita Tristeza.mp3",
                "cover": "https://qxx.me/music/Senorita%20Tristeza.JPG"
            },
            "duration": "5:53"
        },
        {
            "bg": "#0896eba1",
            "artist": "Paradox Interactive",
            "songName": "Be Happy",
            "files": {
                "song": "https://qxx.me/music/Be Happy.mp3",
                "cover": "https://qxx.me/music/Be%20Happy.jpg"
            },
            "duration": "3:22"
        },
        {
            "bg": "#ebbe03",
            "artist": "Flower Face",
            "songName": "Jupiter",
            "files": {
                "song": "https://qxx.me/music/Jupiter.mp3",
                "cover": "https://qxx.me/music/Jupiter.jpg"
            },
            "duration": "4:31"
        },
        {
            "bg": "#ffc382",
            "artist": "La Femme",
            "songName": "Le jardin",
            "files": {
                "song": "https://qxx.me/music/Le jardin.mp3",
                "cover": "https://qxx.me/music/Le%20jardin.JPG"
            },
            "duration": "4:00"
        },
        {
            "bg": "#ffcbdc",
            "artist": "Still Corners",
            "songName": "Crying",
            "files": {
                "song": "https://qxx.me/music/Crying.mp3",
                "cover": "https://qxx.me/music/Crying.JPG"
            },
            "duration": "3:28"
        },
        {
            "bg": "#44c16fb5",
            "artist": "Marvel83'",
            "songName": "Alone With You",
            "files": {
                "song": "https://qxx.me/music/Alone With You.mp3",
                "cover": "https://qxx.me/music/Alone With You.JPG"
            },
            "duration": "4:53"
        },
        {
            "bg": "#ff4545",
            "artist": "Timecop1983",
            "songName": "Nightfall",
            "files": {
                "song": "https://qxx.me/music/Nightfall.mp3",
                "cover": "https://qxx.me/music/Nightfall.JPG"
            },
            "duration": "4:40"
        },
        {
            "bg": "#e5e7e9",
            "artist": "Lazer Boomerang",
            "songName": "R3cover",
            "files": {
                "song": "https://qxx.me/music/R3cover.mp3",
                "cover": "https://qxx.me/music/R3cover.JPG"
            },
            "duration": "3:34"
        }
    ];

    const musicPlayer = document.createElement("div");
    musicPlayer.className = "music-player flex-column";

    const slider = document.createElement("div");
    slider.className = "slider center";
    slider.onclick = handleResizeSlider;

    const sliderContent = document.createElement("div");
    sliderContent.className = "slider__content center";

    const playlistButton = document.createElement("button");
    playlistButton.className = "music-player__playlist-button center button";
    const playlistIcon = document.createElement("i");
    playlistIcon.className = "icon-playlist";
    playlistButton.appendChild(playlistIcon);

    const broadcastGuarantor = document.createElement("button");
    broadcastGuarantor.className = "music-player__broadcast-guarantor center button";
    broadcastGuarantor.onclick = handlePlayMusic;
    const playIcon = document.createElement("i");
    playIcon.className = "icon-play";
    const pauseIcon = document.createElement("i");
    pauseIcon.className = "icon-pause";
    broadcastGuarantor.appendChild(playIcon);
    broadcastGuarantor.appendChild(pauseIcon);

    const sliderImgs = document.createElement("div");
    sliderImgs.className = "slider__imgs flex-row";
    songs.forEach(({ files: { cover }, songName }, index) => {
        const img = document.createElement("img");
        if (index === 0) { img.loading = "eager"; } 
        else { img.loading = "lazy"; }
        img.src = cover;
        img.className = "img lazy-placeholder";
        img.alt = songName;
        sliderImgs.appendChild(img);
    });

    sliderContent.appendChild(playlistButton);
    sliderContent.appendChild(broadcastGuarantor);
    sliderContent.appendChild(sliderImgs);

    const sliderControls = document.createElement("div");
    sliderControls.className = "slider__controls center";

    const prevButton = document.createElement("button");
    prevButton.className = "slider__switch-button flex-row button";
    prevButton.onclick = () => handleChangeMusic({ isPrev: true });
    const prevIcon = document.createElement("i");
    prevIcon.className = "icon-back";
    prevButton.appendChild(prevIcon);

    const musicInfo = document.createElement("div");
    musicInfo.className = "music-player__info text_trsf-cap";
    const songNameDiv = document.createElement("div");
    const singerNameDiv = document.createElement("div");
    singerNameDiv.className = "music-player__singer-name";
    singerNameDiv.innerHTML = `<div>${songs[0].songName}</div>`;
    const subtitleDiv = document.createElement("div");
    const subtitle = document.createElement("div");
    subtitle.className = "music-player__subtitle";
    subtitle.innerHTML = `<div>${songs[0].artist}</div>`;
    subtitleDiv.appendChild(subtitle);
    songNameDiv.appendChild(singerNameDiv);
    musicInfo.appendChild(songNameDiv);
    musicInfo.appendChild(subtitleDiv);

    const nextButton = document.createElement("button");
    nextButton.className = "slider__switch-button flex-row button";
    nextButton.onclick = () => handleChangeMusic({ isPrev: false });
    const nextIcon = document.createElement("i");
    nextIcon.className = "icon-next";
    nextButton.appendChild(nextIcon);

    const progress = document.createElement("div");
    progress.className = "progress center";
    progress.onpointerdown = (e) => {
        e.preventDefault();
        handleScrub(e);
        progressBarIsUpdating = true;
    };
    const progressWrapper = document.createElement("div");
    progressWrapper.className = "progress__wrapper";
    const progressBar = document.createElement("div");
    progressBar.className = "progress__bar center";
    progressWrapper.appendChild(progressBar);
    progress.appendChild(progressWrapper);

    sliderControls.appendChild(prevButton);
    sliderControls.appendChild(musicInfo);
    sliderControls.appendChild(nextButton);
    sliderControls.appendChild(progress);

    slider.appendChild(sliderContent);
    slider.appendChild(sliderControls);

    const playlist = document.createElement("ul");
    playlist.className = "music-player__playlist list";

    songs.forEach((song, index) => {
        const { songName, artist, files: { cover }, duration = "0:00" } = song;

        const listItem = document.createElement("li");
        listItem.className = "music-player__song";
        listItem.onclick = () => handleChangeMusic({ playListIndex: index });

        const flexRow = document.createElement("div");
        flexRow.className = "flex-row _align_center";

        const songImg = document.createElement("img");
        songImg.loading = "lazy";
        songImg.src = cover;
        songImg.className = "img music-player__song-img lazy-placeholder";

        const playlistInfo = document.createElement("div");
        playlistInfo.className = "music-player__playlist-info text_trsf-cap";

        const songTitle = document.createElement("b");
        songTitle.className = "text_overflow";
        songTitle.textContent = songName;

        const flexRowInfo = document.createElement("div");
        flexRowInfo.className = "flex-row _justify_space-btwn";

        const artistName = document.createElement("span");
        artistName.className = "music-player__subtitle";
        artistName.textContent = artist;

        const songDuration = document.createElement("span");
        songDuration.className = "music-player__song-duration";
        songDuration.textContent = duration;

        flexRowInfo.appendChild(artistName);
        flexRowInfo.appendChild(songDuration);

        playlistInfo.appendChild(songTitle);
        playlistInfo.appendChild(flexRowInfo);

        flexRow.appendChild(songImg);
        flexRow.appendChild(playlistInfo);
        listItem.appendChild(flexRow);
        playlist.appendChild(listItem);
    });

    musicPlayer.appendChild(slider);
    musicPlayer.appendChild(playlist);

    root.innerHTML = '';
    root.appendChild(musicPlayer);

    songsLength = songs.length - 1;

    progress_elmnt = document.querySelector(".progress");
    sliderImgs_elmnt = document.querySelector(".slider__imgs");
    songName_elmnt = document.querySelector(".music-player__singer-name");
    musicPlayerInfo_elmnt = document.querySelector(".music-player__info");
    singerName_elmnt = document.querySelector(".music-player__subtitle");
    progressBar_elmnt = document.querySelector(".progress__bar");
    broadcastGuarantor_elmnt = document.querySelector(".music-player__broadcast-guarantor");
    selectedSong = mainAudio;

    mainAudio.addEventListener('timeupdate', updateTheProgressBar);
    mainAudio.addEventListener('ended', handleSongEnded);

    controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
    controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);

    // 【重要：已删除了初始化时强制赋给 mainAudio.src 的代码】
    
    setTimeout(restorePlaybackState, 100);

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songs[0].songName,
            artist: songs[0].artist,
            artwork: [{ src: songs[0].files.cover, sizes: '512x512', type: 'image/jpeg' }]
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => handleChangeMusic({ isPrev: true }));
        navigator.mediaSession.setActionHandler('nexttrack', () => handleChangeMusic({ isPrev: false }));
        navigator.mediaSession.setActionHandler('play', () => {
            if (mainAudio.paused) {
                // MediaSession的外部播放键也要走 handlePlayMusic 的逻辑（防止还没src）
                if(!mainAudio.getAttribute('src')) {
                    document.querySelector('.music-player__broadcast-guarantor').click();
                } else {
                    mainAudio.play();
                    broadcastGuarantor_elmnt.classList.add("click");
                    songIsPlayed = true;
                }
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (!mainAudio.paused) {
                mainAudio.pause();
                broadcastGuarantor_elmnt.classList.remove("click");
                songIsPlayed = false;
            }
        });
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.seekTime != null && mainAudio.getAttribute('src')) {
                if (details.fastSeek && 'fastSeek' in mainAudio) {
                    mainAudio.fastSeek(details.seekTime);
                } else {
                    mainAudio.currentTime = details.seekTime;
                }
            }
        });
    }

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
        while (target.firstChild) { target.removeChild(target.firstChild); }
        const targetChild_elmnt = document.createElement("div");
        targetChild_elmnt.appendChild(document.createTextNode(value));
        target.appendChild(targetChild_elmnt);
        target.classList.remove("animate");
        controlSubtitleAnimation(musicPlayerInfo_elmnt, target);
    }

    function handleResize() {
        const vH = window.innerHeight * 0.01;
        setProperty(document.documentElement, "--vH", `${vH}px`);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("transitionstart", ({ target }) => {
        if (target === sliderImgs_elmnt) {
            isLocked = true;
            setProperty(sliderImgs_elmnt, "will-change", "transform");
        }
    });
    window.addEventListener("transitionend", ({ target, propertyName }) => {
        if (target === sliderImgs_elmnt) {
            isLocked = false;
            setProperty(sliderImgs_elmnt, "will-change", "auto");
        }
        if (target.classList.contains("slider") && propertyName === "height") {
            controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
            controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);
        }
    });
    window.addEventListener("pointerup", (e) => {
        e.preventDefault();
        if (progressBarIsUpdating) {
            selectedSong.muted = false;
            progressBarIsUpdating = false;
        }
    });
    window.addEventListener("pointermove", (e) => {
        if (progressBarIsUpdating) {
            e.preventDefault();
            handleScrub(e);
            selectedSong.muted = true;
        }
    });
    window.addEventListener("touchend", (e) => {
        if (progressBarIsUpdating) {
            selectedSong.muted = false;
            progressBarIsUpdating = false;
        }
    });
    window.addEventListener("touchmove", (e) => {
        if (progressBarIsUpdating) {
            e.preventDefault();
            handleScrub(e);
            selectedSong.muted = true;
        }
    });
}
  
const wechatID = "lllIIllllIIlIII";
var clipboard = new ClipboardJS('#wechatBtn', {
    text: function() {
        return wechatID;
    }
});
clipboard.on('success', function(e) {
    alert('👉微信号复制成功,即将前往 微信WeChat !');
    window.location.href = 'weixin://';
});
clipboard.on('error', function(e) {
    alert('复制失败,请手动输入 ' + wechatID);
    window.location.href = 'weixin://dl/scan';
});
function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 100,
    });
}

const avatarSound = new Audio("https://pub-2892a14f8bbf4cd488041657b793ac15.r2.dev/Neko%3ACat.wav");
avatarSound.volume = 0.35;

document.getElementById('download-vcf').addEventListener('click', function(e) {
    e.preventDefault();
    
    const vcfUrl = 'https://raw.githubusercontent.com/0llllll/0llllll.github.io/main/x.vcf';
    
    fetch(vcfUrl)
        .then(res => res.text())
        .then(text => {
            const dataUri = 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(text);
            const link = document.createElement('a');
            link.href = dataUri;
            link.download = 'contact.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(() => {
            window.location.href = vcfUrl;
        });
});