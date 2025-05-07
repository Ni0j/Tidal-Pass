document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const leftZone = document.getElementById('left-zone');
    const rightZone = document.getElementById('right-zone');
    let currentRotation = 0;

    // 禁用iOS长按菜单（额外保险）
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 左旋转
    leftZone.addEventListener('click', () => {
        currentRotation -= 10;
        applyRotation();
    });

    // 右旋转
    rightZone.addEventListener('click', () => {
        currentRotation += 10;
        applyRotation();
    });

    // 应用旋转动画
    function applyRotation() {
        videoContainer.style.transform = `rotate(${currentRotation}deg)`;
    }

    // 初始化视频（自动播放）
    const video = document.getElementById('compass-video');
    video.play().catch(e => console.log("自动播放被阻止，请点击屏幕"));
});