window.onload = function () {
    // 获取视频
    var video = document.querySelector("#wrapper > video");
    // 获取视频进度条
    var video_progress = document.querySelector(".video-progress");
    // 获取视频进度条拖拽方块
    var video_inner = document.querySelector(".video-progress > .wrap > .inner");
    // 获取视频进度条底色显示
    var video_deep = document.querySelector(".video-progress > .deep");
    // 获取声音进度条
    var sound_progress = document.querySelector(".sound-progress");
    // 获取声音进度条拖拽方块
    var sound_inner = document.querySelector(".sound-progress > .wrap > .inner");
    // 获取声音进度条底色显示
    var sound_deep = document.querySelector(".sound-progress > .deep");
    // 获取视频控件外部容器
    var control = document.querySelector("#wrapper > .control");

    // 设置视频宽高
    if (document.documentElement.clientWidth >= 600) {
        video.width = document.documentElement.clientWidth;//视口宽度
        video.height = document.documentElement.clientHeight - control.offsetHeight;
    }

    /**
     * 设置进度条拖拽
    */
    // 1.视频进度条拖拽

    // 为进度条方块绑定鼠标按下事件
    video_inner.onmousedown = function (event) {
        event = event || window.event;
        // 获取鼠标偏移量
        var progressX = event.clientX - this.offsetLeft;
        var progressY = event.clientY - this.offsetTop;
        // 绑定鼠标移动事件
        document.onmousemove = function (event) {
            event = event || window.event;
            // 获取方块偏移量
            var innerX = event.clientX - progressX;
            // 获取方块移动总距离
            var progressWidth = video_inner.parentNode.clientWidth - video_inner.offsetWidth;
            // 控制范围，防止越界
            if (innerX <= 0) {
                innerX = 0;
            } else if (innerX >= progressWidth) {
                innerX = progressWidth;
            }
            // 修改方块偏移量 和 显示进度条底色
            video_inner.style.left = video_deep.style.width = innerX + "px";
            // 视频播放进度跟随拖动实时变化
            var scare = video_inner.offsetLeft / (video_progress.clientWidth - video_inner.offsetWidth);
            video.currentTime = video.duration * scare;
            // 视频时间跟随进度条变化
            timeNow.innerHTML = display(video.currentTime);
        };

        // 绑定鼠标抬起事件
        document.onmouseup = function () {
            // 取消鼠标移动事件
            document.onmousemove = null;
            // 取消鼠标抬起事件
            document.onmouseup = null;
        };
        // 取消默认行为
        return false;
    };

    // 2.声音进度条拖拽
    // 为进度条方块绑定鼠标按下事件
    sound_inner.onmousedown = function (event) {
        event = event || window.event;

        // 获取鼠标偏移量
        var progressX = event.clientX - this.offsetLeft;
        var progressY = event.clientY - this.offsetTop;
        // 绑定鼠标移动事件
        document.onmousemove = function (event) {
            event = event || window.event;
            // 获取方块偏移量
            var innerX = event.clientX - progressX;
            var innerY = event.clientY - progressY;
            // 获取方块移动总距离
            var progressWidth = sound_inner.parentNode.clientWidth - sound_inner.offsetWidth;
            // 控制范围，防止越界
            if (innerX <= 0) {
                innerX = 0;
            } else if (innerX >= progressWidth) {
                innerX = progressWidth;
            }
            // 修改方块偏移量 和 显示进度条底色
            sound_inner.style.left = sound_deep.style.width = innerX + "px";
            // 修改音量
            sound = (sound_inner.offsetLeft / progressWidth);
            video.volume = sound;
            console.log(video.volume);
            if (video.volume == 0) {
                video.muted = true;
                sound_btn.innerHTML = "&#xe605;";//显示静音状态按钮
            } else {
                video.muted = false;
                sound_btn.innerHTML = "&#xe607;";//显示非静音按钮
            }
        };
        // 绑定鼠标抬起事件
        document.onmouseup = function () {
            // 取消鼠标移动事件
            document.onmousemove = null;
            // 取消鼠标抬起事件
            document.onmouseup = null;
        };
        // 取消默认行为
        return false;
    };


    /**
     * 设置视频功能
    */
    // 获取播放按钮
    var start = document.querySelector(".start");
    // 获取视频上方悬浮按钮
    var btn = document.querySelector(".btn");
    // 获取播放按钮下的图标
    var icon = document.querySelector(".start > i");
    var icons = document.querySelector(".btn > i");
    // 获取重载按钮
    var reload = document.querySelector(".reload");
    // 获取播放时间
    var timeNow = document.querySelector(".time > .now");
    var timeTotal = document.querySelector(".time > .all");


    // 1.点击按钮视频播放 和 暂停
    start.onclick = function () {
        play();
        display();
    };

    //2.点击视频区域播放或暂停视频
    video.onclick = function () {
        play();
        // 显示悬浮按钮
        setTimeout(function () {
            btn.style.display = "block";
        }, 200);
        // 隐藏悬浮按钮
        setTimeout(function () {
            btn.style.display = "none";
        }, 500);
    };
    // 3.点击视频上方悬浮按钮播放或暂停视频
    btn.onclick = function () {
        play();
        setTimeout(function () {
            btn.style.display = "block";
        }, 500);
        setTimeout(function () {
            btn.style.display = "none";
        }, 1000);

    };

    // 4.设置视频重载
    reload.onclick = function () {
        video.load();
        icon.innerHTML = "&#xe601;";
        video_inner.style.left = video_deep.style.width = 0 + "px";
        timeNow.innerHTML = "00:00:00";
    };

    // 5.点击进度条实现快进
    video_progress.onclick = function (event) {
        event = event || window.event;
        icon.innerHTML = "&#xe604;";
        // 获取鼠标当前点击位置
        var videoX = event.clientX - this.offsetLeft;
        // 获取进度条总长度
        var length = video_progress.clientWidth - video_inner.offsetWidth;
        // 点击后视频播放所处的新位置
        video.currentTime = video.duration * (videoX / length);
        // 重新设定进度条的位置
        video_inner.style.left = video_deep.style.width = (video.currentTime / video.duration) * length + "px";
        // 在暂停状态下快进后，启动进度条走动
        if (video.paused) {
            video.play();
            icon.innerHTML = "&#xe604;";//按钮为播放状态
            icons.innerHTML = "&#xe604;";//悬浮按钮为播放状态
            // 进度条开始走动
            timer = setInterval(function () {
                // 获取进度条总长度
                var length = video_progress.clientWidth - video_inner.offsetWidth;
                // 每秒进度条所走的距离
                var videoTime = (video.currentTime / video.duration) * length;
                video_inner.style.left = video_deep.style.width = videoTime + "px";
                // 视频时间跟随进度条变化
                timeNow.innerHTML = display(video.currentTime);
                // 如果视频播放完成,切换播放按钮状态
                if (video_inner.offsetLeft == length) {
                    icon.innerHTML = "&#xe601;";//按钮为暂停状态
                    icons.innerHTML = "&#xe601;";//悬浮按钮为暂停状态
                    clearInterval(timer);//防止拖拽方块急速抖动
                }
            }, 10);
        }

    };
    // 6.显示总时间
    video.addEventListener("loadeddata", function () {
        timeTotal.innerHTML = display(video.duration);
    });


    /**
     * 设置声音功能
    */
    // 同步音量
    var sound;
    // 获取声音按钮
    var sound_btn = document.querySelector(".sound-btn > span");

    // 1.声音默认最高
    sound = 1;
    video.muted = false;
    sound_inner.style.left = sound_deep.style.width = (sound_progress.clientWidth - sound_inner.offsetWidth) + "px";
    // 2.点击声音按钮切换静音
    sound_btn.onclick = function () {
        if (video.muted) {
            video.muted = false;//非静音
            video.volume = sound;
            this.innerHTML = "&#xe607;";//显示非静音按钮
            // 进度条回到上次非静音状态
            sound_inner.style.left = sound_deep.style.width = sound * (sound_progress.clientWidth - sound_inner.offsetWidth) + "px";
        } else {
            video.muted = true;//静音
            video.volume = 0;
            this.innerHTML = "&#xe605;";//显示静音按钮
            // 进度条回到零点
            sound_inner.style.left = sound_deep.style.width = 0 + "px";

        }
    };
    // 3.点击进度条调整音量
    sound_progress.onclick = function (event) {
        event = event || window.event;
        // 获取鼠标当前点击位置
        var soundX = sound_progress.clientWidth - (document.documentElement.clientWidth - event.clientX - this.offsetLeft);
        // 获取进度条总长度
        var length = sound_progress.clientWidth - sound_inner.offsetWidth;
        var scare = soundX / length;
        if (scare <= 0) {
            scare = 0;
            sound_btn.innerHTML = "&#xe605;";//显示静音按钮
        } else if (scare >= 1) {
            scare = 1;
            sound_btn.innerHTML = "&#xe607;";//显示非静音按钮
        }else {
            sound_btn.innerHTML = "&#xe607;";//显示非静音按钮
        }
        // 设置点击后进度条的位置
        sound_inner.style.left = sound_deep.style.width = sound_progress.clientWidth * scare + "px";
        // 设置点击后的音量
        video.volume = scare;
    };

    /**
     * 倍速功能
    */
    var speed = document.querySelector(".speed");
    var speedNode = document.querySelector(".speed > ul");
    var speedNodes = document.querySelectorAll(".speed > ul > li");
    var index = 0;//存储倍速索引

    speedNode.style.display = "none";// 默认倍速菜单隐藏
    // 点击倍速，倍速菜单显示或隐藏
    speed.onclick = function(){
        var flag = speedNode.style.display;
        console.log(typeof flag);
        if(flag == "block"){
            speedNode.style.display = "none";
        }else if(flag == "none") {
            speedNode.style.display = "block";
        }
    }
    speedNodes[3].style.backgroundColor = "green";// 默认一倍速背景为绿色
    for(var i=0;i<speedNodes.length;i++){
        speedNodes[i].num = i;//为不同倍速设置标识
        speedNodes[i].addEventListener("click",function(){
            index = this.num;
            for(var j = 0;j<speedNodes.length;j++){
                speedNodes[j].style.backgroundColor = "";//防止伪类设置的背景颜色被覆盖
            }
            speedNodes[index].style.backgroundColor = "green";
            video.playbackRate = 2 - this.num*0.25;
        });
    }

    /**
     * 全屏功能
    */
    var full_screen = document.querySelector(".full-screen > .full-btn > i");
    var isFullScreen = false;//全屏标识
    full_screen.onclick = function () {
        fullScreen();
    };


    /**
     * 工具函数库
    */
    //1.封装视频播放函数 
    var timer;//存储定时器标识
    function play() {
        if (video.paused) {
            video.play();
            icon.innerHTML = "&#xe604;";//按钮为播放状态
            icons.innerHTML = "&#xe604;";//悬浮按钮为播放状态
            // 进度条开始走动
            timer = setInterval(function () {
                // 获取进度条方块滑动总长度
                var length = video_progress.clientWidth - video_inner.offsetWidth;
                // 每秒进度条所走的距离
                var videoTime = (video.currentTime / video.duration) * length;
                video_inner.style.left = video_deep.style.width = videoTime + "px";
                // 视频时间跟随进度条变化
                timeNow.innerHTML = display(video.currentTime);
                // 如果视频播放完成,切换播放按钮状态
                if (video_inner.offsetLeft == length) {
                    icon.innerHTML = "&#xe601;";//按钮为暂停状态
                    icons.innerHTML = "&#xe601;";//悬浮按钮为暂停状态
                    clearInterval(timer);//防止拖拽方块急速抖动
                }
            }, 10);
        } else if (video.play) {
            video.pause();
            icon.innerHTML = "&#xe601;";//按钮为暂停状态
            icons.innerHTML = "&#xe601;";//悬浮按钮为暂停状态
            clearInterval(timer);
        }
    }

    /**
        * 2.定义函数固定位数（位数不够，前面补充0），实现视频时间显示为两位数。
        *  num：被操作数
        *  n： 固定的总位数
        */
    function cover(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }

    // 3.封装视频时间
    function display(timeAll) {
        var hour = cover(parseInt(timeAll / 3600), 2);
        var min = cover(parseInt(timeAll % 3600 / 60), 2);
        var sec = cover(parseInt(timeAll % 3600), 2);
        return hour + ":" + min + ":" + sec;
    }

    // 4.封装全屏函数
    function fullScreen() {
        if (isFullScreen) {//退出全屏
            isFullScreen = false;
            full_screen.innerHTML = "&#xe755";//大屏图标
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            isFullScreen = true;//进入全屏
            full_screen.innerHTML = "&#xe67d;";//小屏图标
            var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                // W3c
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                //firebox
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScren) {
                // chrome
                docElm.webkitRequestFullScren();
            }

        }
    }

};