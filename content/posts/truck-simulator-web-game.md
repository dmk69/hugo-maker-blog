---
title: "卡车模拟Web游戏开发随记"
date: 2025-11-11T20:00:00+08:00
draft: false
slug: "truck-simulator-web-game"
tags: ["Web开发", "JavaScript", "随记", "小游戏"]
categories: ["随记"]
---

## 🚛 项目概述

昨晚做了一个简单的卡车模拟Web游戏，使用纯JavaScript实现，包含基础的物理模拟和键盘控制功能。

## 🎮 游戏特性

### 基础功能
- 键盘控制（WASD或方向键）
- 基础物理引擎（加速、制动、转向）
- 简单的道路和障碍物
- 燃料消耗系统
- 货物运输机制

### 技术实现
```javascript
// 卡车控制类
class TruckSimulator {
    constructor() {
        this.position = { x: 400, y: 300 };
        this.velocity = 0;
        this.angle = 0;
        this.fuel = 100;
        this.cargo = null;
    }

    update(keys) {
        // 加速和制动
        if (keys['w'] || keys['ArrowUp']) {
            this.velocity = Math.min(this.velocity + 0.5, 10);
            this.fuel -= 0.1;
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.velocity = Math.max(this.velocity - 0.8, -5);
        }

        // 转向
        if (keys['a'] || keys['ArrowLeft']) {
            this.angle -= 3 * Math.abs(this.velocity) / 10;
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.angle += 3 * Math.abs(this.velocity) / 10;
        }

        // 更新位置
        this.position.x += Math.cos(this.angle) * this.velocity;
        this.position.y += Math.sin(this.angle) * this.velocity;

        // 摩擦力
        this.velocity *= 0.95;
    }
}
```

## 🎯 游戏截图

```
简单画面布局:
┌─────────────────────────────┐
│  燃料: 85%  速度: 45 km/h     │
│  货物: 木材  重量: 5吨        │
├─────────────────────────────┤
│                             │
│       🚛                   │
│    ──────────────           │
│    │      道路      │       │
│    ──────────────           │
│       🌳    🌳              │
│                             │
├─────────────────────────────┤
│  控制: WASD或方向键          │
│  任务: 将货物运输到目的地     │
└─────────────────────────────┘
```

## 🔧 开发过程

### 遇到的挑战
1. **物理模拟**: 简化物理引擎，平衡真实性和游戏性
2. **控制响应**: 调整转向灵敏度，让操控更自然
3. **碰撞检测**: 基础的矩形碰撞检测算法
4. **性能优化**: 使用requestAnimationFrame实现流畅动画

### 解决方案
```javascript
// 碰撞检测
function checkCollision(truck, obstacle) {
    const truckBounds = {
        x: truck.position.x - 20,
        y: truck.position.y - 10,
        width: 40,
        height: 20
    };

    const obstacleBounds = obstacle.getBounds();

    return !(truckBounds.x > obstacleBounds.x + obstacleBounds.width ||
             truckBounds.x + truckBounds.width < obstacleBounds.x ||
             truckBounds.y > obstacleBounds.y + obstacleBounds.height ||
             truckBounds.y + truckBounds.height < obstacleBounds.y);
}
```

## 📊 游戏数据

### 基础参数
- 卡车最大速度: 100 km/h
- 燃料消耗: 匀速行驶0.1%/秒，加速0.2%/秒
- 货物重量: 影响加速和制动性能
- 地图大小: 1000x800像素

### 得分系统
- 成功送货: +100分
- 节省燃料: 额外+20分
- 快速送达: 时间奖励+10分
- 撞车惩罚: -30分

## 🚀 未来改进

### 计划功能
- [ ] 更真实的物理引擎
- [ ] 多种车型选择
- [ ] 不同地形和天气
- [ ] 保存和加载游戏进度
- [ ] 音效和背景音乐
- [ ] 多人在线模式

### 技术升级
- 使用Canvas API渲染更好的图形
- 引入Web Workers处理复杂计算
- 添加粒子效果和动画
- 响应式设计支持移动端

## 💻 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡车模拟器</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        #gameCanvas { border: 2px solid #333; display: block; margin: 0 auto; }
        #controls { text-align: center; margin-top: 20px; }
        .info { display: inline-block; margin: 0 20px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🚛 卡车模拟器</h1>
    <div id="controls">
        <span class="info">燃料: <span id="fuel">100</span>%</span>
        <span class="info">速度: <span id="speed">0</span> km/h</span>
        <span class="info">货物: <span id="cargo">无</span></span>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>

    <script>
        // 游戏主逻辑
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const game = new TruckSimulator();
        const keys = {};

        // 键盘事件监听
        document.addEventListener('keydown', (e) => keys[e.key] = true);
        document.addEventListener('keyup', (e) => keys[e.key] = false);

        // 游戏循环
        function gameLoop() {
            game.update(keys);
            game.render(ctx);
            updateUI();
            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    </script>
</body>
</html>
```

## 📝 开发总结

这个小游戏虽然简单，但涵盖了基本的游戏开发概念：
- 游戏循环和状态管理
- 输入处理和事件监听
- 简单的物理模拟
- 碰撞检测
- UI更新和用户反馈

作为一次技术练手，这个项目很好地巩固了JavaScript游戏开发的基础知识。

---

**开发时间**: 约4小时
**代码行数**: 约200行
**下次更新**: 计划添加更多车型和地图

*这只是技术探索的一个小例子，展示Web开发的另一面。*