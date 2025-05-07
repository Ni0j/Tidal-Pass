document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('compass-video');
    const pressureBar = document.querySelector('.pressure-bar');
    const instructions = document.querySelector('.instructions');
    
    // 视频播放控制
    video.playbackRate = 0.5; // 初始速度
    video.play();
    
    // 状态变量
    let isTouching = false;
    let touchStartTime = 0;
    let currentSpeed = 0.5;
    let targetSpeed = 0.5;
    let lastBeta = 0; // 陀螺仪X轴（前后倾斜）
    let lastGamma = 0; // 陀螺仪Y轴（左右倾斜）
    
    // 惯性动画ID
    let inertiaAnimationId = null;
    
    // 初始化陀螺仪
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    } else {
        instructions.textContent = "您的设备不支持陀螺仪功能";
    }
    
    // 触摸事件监听
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchforcechange', handleTouchForce);
    
    // 鼠标事件（用于桌面调试）
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 动画循环
    function update() {
        // 惯性减速
        if (!isTouching && Math.abs(currentSpeed - targetSpeed) > 0.01) {
            currentSpeed += (targetSpeed - currentSpeed) * 0.05;
            video.playbackRate = currentSpeed;
        }
        
        // 更新压力指示器
        const pressurePercent = Math.min(100, (currentSpeed - 0.5) * 200);
        pressureBar.style.width = `${pressurePercent}%`;
        
        inertiaAnimationId = requestAnimationFrame(update);
    }
    
    update();
    
    // 陀螺仪处理
    function handleOrientation(event) {
        if (event.beta !== null && event.gamma !== null) {
            // 平滑处理陀螺仪数据
            const smoothFactor = 0.3;
            lastBeta = lastBeta * (1 - smoothFactor) + event.beta * smoothFactor;
            lastGamma = lastGamma * (1 - smoothFactor) + event.gamma * smoothFactor;
            
            // 计算旋转角度（限制范围）
            const rotateX = Math.max(-15, Math.min(15, lastBeta * 0.5));
            const rotateY = Math.max(-15, Math.min(15, lastGamma * 0.5));
            
            video.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }
    
    // 触摸开始
    function handleTouchStart(e) {
        isTouching = true;
        touchStartTime = Date.now();
        targetSpeed = 2.0; // 按压时目标速度
        e.preventDefault();
    }
    
    // 触摸结束
    function handleTouchEnd() {
        isTouching = false;
        targetSpeed = 0.5; // 松开后目标速度（慢速）
    }
    
    // 压力感应（iOS）
    function handleTouchForce(e) {
        if (e.touches && e.touches[0].force) {
            const force = e.touches[0].force;
            targetSpeed = 0.5 + force * 1.5; // 根据按压力度调整速度
        }
    }
    
    // 鼠标按下（桌面调试）
    function handleMouseDown() {
        isTouching = true;
        touchStartTime = Date.now();
        targetSpeed = 2.0;
    }
    
    // 鼠标抬起（桌面调试）
    function handleMouseUp() {
        isTouching = false;
        targetSpeed = 0.5;
    }
    
    // 清理动画
    window.addEventListener('beforeunload', function() {
        cancelAnimationFrame(inertiaAnimationId);
    });
});