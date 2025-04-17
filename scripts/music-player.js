// 音乐播放器组件 - 基于Family Button UI设计

// 音乐资源
const musicResources = {
  apple: [
    { id: 1, title: "偷心", artist: "张学友", url: "assets/images/music/偷心-张学友.m4s" },
    { id: 2, title: "吻别", artist: "张学友", url: "assets/images/music/吻别-张学友.m4s" },
    { id: 3, title: "西楼爱情故事", artist: "李袁杰&Au", url: "assets/images/music/西楼爱情故事-李袁杰&Au.mp3" }
  ],
  spotify: []
};

// 初始化时将本地歌曲填充到spotify(歌曲列表)服务中
function initLocalMusicList() {
  // 将所有apple的歌曲复制到spotify(歌曲列表)中，这里模拟本地歌曲列表
  musicResources.spotify = [...musicResources.apple].map((song, index) => ({
    ...song,
    id: index + 1
  }));
}

// 创建音频元素
let audioElement = null;
let currentService = 'apple';
let currentTrackId = 1;
let isPlaying = false;
let isBackgroundVisible = false;
let currentVolume = 0.4; // 默认音量改为40%
let visualizationInterval = null; // 定义可视化间隔变量
let showPlaylist = false; // 是否显示播放列表

// 初始化音乐播放器
function initMusicPlayer() {
  audioElement = document.createElement('audio');
  audioElement.id = 'background-music';
  audioElement.loop = false;
  document.body.appendChild(audioElement);
  
  // 当一首歌结束后播放下一首
  audioElement.addEventListener('ended', () => {
    playNextTrack();
  });
  
  // 创建音乐播放器UI
  createMusicPlayerUI();
  
  // 创建背景可视化效果
  createBackgroundVisualization();
}

// 创建音乐播放器UI
function createMusicPlayerUI() {
  const container = document.getElementById('music-player-container');
  if (!container) return;
  
  // 创建主容器
  const musicPlayer = document.createElement('div');
  musicPlayer.className = 'music-player-button';
  musicPlayer.innerHTML = `
    <div class="music-player-inner">
      <div class="music-player-content">
        <div id="music-service-tabs" class="music-service-tabs">
          <button class="service-tab active" data-service="apple">推荐</button>
          <button class="service-tab" data-service="spotify">歌曲列表</button>
          <span class="tab-indicator"></span>
        </div>
        
        <!-- 推荐页面 -->
        <div id="recommend-view" class="player-view active">
          <div class="music-controls">
            <button id="prev-track" class="control-button"><i class="fas fa-step-backward"></i></button>
            <button id="play-pause" class="control-button play-button"><i class="fas fa-play"></i></button>
            <button id="next-track" class="control-button"><i class="fas fa-step-forward"></i></button>
            <button id="toggle-visualization" class="control-button" title="显示/隐藏音乐可视化效果"><i class="fas fa-eye"></i></button>
          </div>
          <div class="volume-control">
            <i class="fas fa-volume-down volume-icon"></i>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${currentVolume}">
            <i class="fas fa-volume-up volume-icon"></i>
          </div>
          <div class="track-info">
            <div id="track-title" class="track-title">选择音乐开始播放</div>
            <div id="track-artist" class="track-artist"></div>
            <div id="progress-container" class="progress-container">
              <div id="progress-bar" class="progress-bar"></div>
            </div>
            <div class="time-display">
              <span id="current-time">0:00</span>
              <span id="total-time">0:00</span>
            </div>
          </div>
        </div>
        
        <!-- 歌曲列表页面 -->
        <div id="playlist-view" class="player-view">
          <div class="playlist-header">
            <span>本地歌曲列表</span>
          </div>
          <div id="playlist-songs" class="playlist-songs">
            <!-- 歌曲列表将在这里显示 -->
          </div>
          <div class="playlist-controls">
            <div class="now-playing">
              <div id="playlist-track-title" class="playlist-track-title">未播放</div>
              <div id="playlist-track-artist" class="playlist-track-artist"></div>
            </div>
            <div class="playlist-buttons">
              <button id="playlist-play-pause" class="playlist-control-button"><i class="fas fa-play"></i></button>
            </div>
          </div>
        </div>
      </div>
      <button id="toggle-player" class="toggle-player">
        <i class="fas fa-music"></i>
      </button>
    </div>
  `;
  
  container.appendChild(musicPlayer);
  
  // 初始化UI
  updateServiceLogo(currentService);
  
  // 添加事件监听器
  setupEventListeners();
}

// 更新服务标志
function updateServiceLogo(service) {
  // 直接切换视图到对应页面
  
  if (service === 'apple') {
    // 切换视图到推荐页面
    const recommendView = document.getElementById('recommend-view');
    const playlistView = document.getElementById('playlist-view');
    
    if (recommendView && playlistView) {
      recommendView.classList.add('active');
      playlistView.classList.remove('active');
    }
  } else if (service === 'spotify') {
    // 切换视图到歌曲列表页面
    const recommendView = document.getElementById('recommend-view');
    const playlistView = document.getElementById('playlist-view');
    
    if (recommendView && playlistView) {
      recommendView.classList.remove('active');
      playlistView.classList.add('active');
      
      // 渲染播放列表
      renderPlaylist();
      
      // 更新当前播放歌曲信息
      updatePlaylistNowPlaying();
    }
  }
}

// 更新播放列表中的当前播放歌曲信息
function updatePlaylistNowPlaying() {
  const titleElement = document.getElementById('playlist-track-title');
  const artistElement = document.getElementById('playlist-track-artist');
  const playPauseButton = document.getElementById('playlist-play-pause');
  
  if (!titleElement || !artistElement || !playPauseButton) return;
  
  const tracks = musicResources[currentService];
  const track = tracks.find(t => t.id === currentTrackId);
  
  if (track) {
    titleElement.textContent = track.title;
    artistElement.textContent = track.artist;
    
    // 更新播放/暂停按钮状态
    playPauseButton.innerHTML = isPlaying 
      ? '<i class="fas fa-pause"></i>' 
      : '<i class="fas fa-play"></i>';
  } else {
    titleElement.textContent = '未播放';
    artistElement.textContent = '';
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}

// 渲染播放列表
function renderPlaylist() {
  const playlistContainer = document.getElementById('playlist-songs');
  if (!playlistContainer) return;
  
  const currentList = musicResources.spotify;
  
  // 清空当前列表
  playlistContainer.innerHTML = '';
  
  // 如果没有歌曲，显示提示
  if (currentList.length === 0) {
    playlistContainer.innerHTML = '<div class="no-songs">没有本地歌曲</div>';
    return;
  }
  
  // 渲染歌曲列表
  currentList.forEach(song => {
    const songElement = document.createElement('div');
    songElement.className = `playlist-song ${currentService === 'spotify' && song.id === currentTrackId ? 'active' : ''}`;
    songElement.dataset.id = song.id;
    songElement.innerHTML = `
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-actions">
        <button class="play-song-btn" title="播放"><i class="fas fa-play"></i></button>
      </div>
    `;
    playlistContainer.appendChild(songElement);
    
    // 添加点击事件
    songElement.addEventListener('click', (e) => {
      if (e.target.closest('.play-song-btn')) return; // 如果点击的是播放按钮，不处理
      
      const songId = parseInt(songElement.dataset.id);
      currentService = 'spotify';
      currentTrackId = songId;
      
      updateActiveTab('spotify');
      updateTrackInfo();
      playCurrentTrack();
      updatePlaylistNowPlaying();
      
      // 更新活跃状态
      document.querySelectorAll('.playlist-song').forEach(el => {
        el.classList.remove('active');
      });
      songElement.classList.add('active');
    });
    
    // 添加播放按钮点击事件
    songElement.querySelector('.play-song-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const songId = parseInt(songElement.dataset.id);
      currentService = 'spotify';
      currentTrackId = songId;
      
      updateActiveTab('spotify');
      updateTrackInfo();
      playCurrentTrack();
      updatePlaylistNowPlaying();
      
      // 更新活跃状态
      document.querySelectorAll('.playlist-song').forEach(el => {
        el.classList.remove('active');
      });
      songElement.classList.add('active');
    });
  });
}

// 设置事件监听器
function setupEventListeners() {
  // 服务标签切换
  const serviceTabs = document.querySelectorAll('.service-tab');
  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const service = tab.getAttribute('data-service');
      if (service !== currentService) {
        currentService = service;
        currentTrackId = 1;
        updateActiveTab(service);
        updateServiceLogo(service);
        updateTrackInfo();
        if (service === 'spotify') {
          renderPlaylist();
        }
        if (isPlaying) {
          playCurrentTrack();
        }
      } else {
        // 即使是同一个服务，也确保视图切换正确
        updateServiceLogo(service);
      }
    });
  });
  
  // 播放/暂停按钮
  const playPauseButton = document.getElementById('play-pause');
  if (playPauseButton) {
    playPauseButton.addEventListener('click', togglePlayPause);
  }
  
  // 上一曲/下一曲按钮
  const prevButton = document.getElementById('prev-track');
  const nextButton = document.getElementById('next-track');
  if (prevButton) prevButton.addEventListener('click', playPreviousTrack);
  if (nextButton) nextButton.addEventListener('click', playNextTrack);
  
  // 展开/折叠按钮
  const toggleButton = document.getElementById('toggle-player');
  const playerElement = document.querySelector('.music-player-button');
  if (toggleButton && playerElement) {
    toggleButton.addEventListener('click', () => {
      playerElement.classList.toggle('expanded');
      toggleButton.innerHTML = playerElement.classList.contains('expanded') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-music"></i>';
    });
  }
  
  // 可视化效果开关
  const visualizationButton = document.getElementById('toggle-visualization');
  if (visualizationButton) {
    visualizationButton.addEventListener('click', toggleVisualization);
  }
  
  // 进度条点击事件
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer && audioElement) {
    progressContainer.addEventListener('click', (e) => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = audioElement.duration;
      
      if (!isNaN(duration) && duration > 0) {
        audioElement.currentTime = (clickX / width) * duration;
        updateProgressBar();
      }
    });
  }
  
  // 更新进度条
  if (audioElement) {
    audioElement.addEventListener('timeupdate', updateProgressBar);
    audioElement.addEventListener('loadedmetadata', updateTrackDuration);
  }
  
  // 音量控制
  const volumeSlider = document.getElementById('volume-slider');
  if (volumeSlider && audioElement) {
    // 设置初始音量
    audioElement.volume = currentVolume;
    
    // 音量滑块变化事件
    volumeSlider.addEventListener('input', () => {
      currentVolume = parseFloat(volumeSlider.value);
      audioElement.volume = currentVolume;
      updateVolumeIcon(currentVolume);
    });
    
    // 初始化音量图标
    updateVolumeIcon(currentVolume);
  }
  
  // 播放列表中的播放/暂停按钮
  const playlistPlayPauseButton = document.getElementById('playlist-play-pause');
  if (playlistPlayPauseButton) {
    playlistPlayPauseButton.addEventListener('click', togglePlayPause);
  }
}

// 更新活动标签
function updateActiveTab(service) {
  const tabs = document.querySelectorAll('.service-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-service') === service) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // 更新指示器位置
  const activeTab = document.querySelector(`.service-tab[data-service="${service}"]`);
  const indicator = document.querySelector('.tab-indicator');
  if (activeTab && indicator) {
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = activeTab.parentElement.getBoundingClientRect();
    indicator.style.left = `${tabRect.left - containerRect.left}px`;
    indicator.style.width = `${tabRect.width}px`;
  }
}

// 更新曲目信息
function updateTrackInfo() {
  const tracks = musicResources[currentService];
  const track = tracks.find(t => t.id === currentTrackId);
  
  if (track) {
    const titleElement = document.getElementById('track-title');
    const artistElement = document.getElementById('track-artist');
    
    if (titleElement) titleElement.textContent = track.title;
    if (artistElement) artistElement.textContent = track.artist;
  }
}

// 更新进度条
function updateProgressBar() {
  if (!audioElement) return;
  
  const progressBar = document.getElementById('progress-bar');
  const currentTimeDisplay = document.getElementById('current-time');
  
  if (progressBar && !isNaN(audioElement.duration) && audioElement.duration > 0) {
    const percentage = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = `${percentage}%`;
  }
  
  if (currentTimeDisplay) {
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
  }
}

// 更新音频总时长
function updateTrackDuration() {
  if (!audioElement) return;
  
  const totalTimeDisplay = document.getElementById('total-time');
  
  if (totalTimeDisplay && !isNaN(audioElement.duration)) {
    totalTimeDisplay.textContent = formatTime(audioElement.duration);
  }
}

// 格式化时间
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 播放/暂停切换
function togglePlayPause() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playCurrentTrack();
  }
}

// 播放当前曲目
function playCurrentTrack() {
  if (!audioElement) return;
  
  const tracks = musicResources[currentService];
  const track = tracks.find(t => t.id === currentTrackId);
  
  if (track) {
    // 检查音频文件是否存在
    fetch(track.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('音频文件不存在');
        }
        return true;
      })
      .catch(error => {
        console.warn('音频文件访问错误:', error);
        // 显示错误提示，但仍继续播放流程（模拟播放）
        const errorToast = document.createElement('div');
        errorToast.className = 'audio-error-toast';
        errorToast.textContent = '无法加载音频文件，使用模拟播放';
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
          if (errorToast.parentNode) {
            errorToast.parentNode.removeChild(errorToast);
          }
        }, 3000);
      })
      .finally(() => {
        // 无论是否找到文件，都继续播放流程
        audioElement.src = track.url;
        audioElement.play().then(() => {
          isPlaying = true;
          updatePlayPauseButton();
          updateTrackInfo();
          
          // 如果可视化效果已开启，激活它
          if (isBackgroundVisible) {
            activateVisualization();
          }
        }).catch(err => {
          console.error('无法播放音乐:', err);
          // 模拟播放状态（前端模拟）
          isPlaying = true;
          updatePlayPauseButton();
          updateTrackInfo();
          
          // 即使音频无法播放，也激活可视化效果
          if (isBackgroundVisible) {
            activateVisualization();
          }
        });
      });
  }
}

// 暂停音乐
function pauseMusic() {
  if (!audioElement) return;
  
  audioElement.pause();
  isPlaying = false;
  updatePlayPauseButton();
  
  // 如果可视化效果正在运行，暂停它
  if (isBackgroundVisible) {
    pauseVisualization();
  }
}

// 播放下一曲
function playNextTrack() {
  const tracks = musicResources[currentService];
  let nextTrackId = currentTrackId + 1;
  
  if (nextTrackId > tracks.length) {
    nextTrackId = 1; // 循环播放
  }
  
  currentTrackId = nextTrackId;
  updateTrackInfo();
  
  if (isPlaying) {
    playCurrentTrack();
  }
}

// 播放上一曲
function playPreviousTrack() {
  const tracks = musicResources[currentService];
  let prevTrackId = currentTrackId - 1;
  
  if (prevTrackId < 1) {
    prevTrackId = tracks.length; // 循环播放
  }
  
  currentTrackId = prevTrackId;
  updateTrackInfo();
  
  if (isPlaying) {
    playCurrentTrack();
  }
}

// 更新播放/暂停按钮图标
function updatePlayPauseButton() {
  const button = document.getElementById('play-pause');
  if (button) {
    button.innerHTML = isPlaying 
      ? '<i class="fas fa-pause"></i>' 
      : '<i class="fas fa-play"></i>';
  }
}

// 创建背景可视化效果
function createBackgroundVisualization() {
  // 创建可视化效果容器
  const visualizationContainer = document.createElement('div');
  visualizationContainer.id = 'music-visualization';
  visualizationContainer.className = 'music-visualization';
  visualizationContainer.title = '音乐可视化效果 - 按ESC键退出';
  document.body.appendChild(visualizationContainer);
  
  // 创建音频可视化效果的元素
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualization-bar';
    visualizationContainer.appendChild(bar);
  }
  
  // 添加ESC键退出可视化效果的事件监听
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isBackgroundVisible) {
      toggleVisualization();
    }
  });
}

// 切换可视化效果显示
function toggleVisualization() {
  const visualizationContainer = document.getElementById('music-visualization');
  const visualizationButton = document.getElementById('toggle-visualization');
  
  if (!visualizationContainer) return;
  
  isBackgroundVisible = !isBackgroundVisible;
  
  if (isBackgroundVisible) {
    visualizationContainer.classList.add('visible');
    if (visualizationButton) {
      visualizationButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
    
    // 如果音乐正在播放，激活可视化效果
    if (isPlaying) {
      activateVisualization();
    } else {
      // 如果音乐未播放，显示提示消息
      const message = document.createElement('div');
      message.className = 'visualization-message';
      message.textContent = '请先播放音乐以查看可视化效果';
      visualizationContainer.appendChild(message);
      
      // 3秒后自动移除消息
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 3000);
    }
  } else {
    visualizationContainer.classList.remove('visible');
    if (visualizationButton) {
      visualizationButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
    pauseVisualization();
    
    // 移除可能存在的消息
    const message = visualizationContainer.querySelector('.visualization-message');
    if (message) {
      visualizationContainer.removeChild(message);
    }
  }
}

// 激活可视化效果
function activateVisualization() {
  if (!isBackgroundVisible) return;
  
  const bars = document.querySelectorAll('.visualization-bar');
  if (!bars.length) return;
  
  // 停止之前的动画
  pauseVisualization();
  
  // 开始新的动画循环
  visualizationInterval = setInterval(() => {
    bars.forEach(bar => {
      const height = Math.floor(Math.random() * 70) + 10; // 10-80之间的随机高度
      bar.style.height = `${height}px`;
      // 添加动画过渡效果
      bar.style.transition = 'height 0.2s ease';
    });
  }, 200); // 每200毫秒更新一次
}

// 暂停可视化效果
function pauseVisualization() {
  if (visualizationInterval) {
    clearInterval(visualizationInterval);
    visualizationInterval = null;
  }
}

// 更新音量图标
function updateVolumeIcon(volume) {
  const volumeIcons = document.querySelectorAll('.volume-icon');
  if (volumeIcons.length < 2) return;
  
  const lowVolumeIcon = volumeIcons[0];
  const highVolumeIcon = volumeIcons[1];
  
  if (volume === 0) {
    lowVolumeIcon.className = 'fas fa-volume-mute volume-icon';
  } else if (volume < 0.5) {
    lowVolumeIcon.className = 'fas fa-volume-down volume-icon';
  } else {
    lowVolumeIcon.className = 'fas fa-volume-up volume-icon';
  }
  
  // 设置图标颜色透明度与音量相关
  lowVolumeIcon.style.opacity = volume < 0.5 ? 1 : 0.5;
  highVolumeIcon.style.opacity = volume >= 0.5 ? 1 : 0.5;
}

// 在页面加载时初始化音乐播放器
document.addEventListener('DOMContentLoaded', () => {
  // 初始化本地音乐列表
  initLocalMusicList();
  // 初始化音乐播放器
  initMusicPlayer();
});

// 监听主题变化，适应不同的主题样式
document.addEventListener('themeChanged', (e) => {
  const theme = e.detail.theme;
  const playerElement = document.querySelector('.music-player-button');
  const visualizationContainer = document.getElementById('music-visualization');
  
  if (playerElement) {
    // 移除所有主题类
    playerElement.classList.remove('theme-blue', 'theme-purple', 'theme-dark', 'theme-red', 'theme-green');
    // 添加当前主题类
    playerElement.classList.add(`theme-${theme}`);
  }
  
  if (visualizationContainer) {
    // 更新可视化效果的主题颜色
    visualizationContainer.classList.remove('theme-blue', 'theme-purple', 'theme-dark', 'theme-red', 'theme-green');
    visualizationContainer.classList.add(`theme-${theme}`);
  }
}); 