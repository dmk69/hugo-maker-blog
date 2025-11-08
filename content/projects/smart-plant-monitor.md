---
title: "智能植物监控系统"
date: 2025-11-05T15:30:00+08:00
draft: false
tags: ["Arduino", "IoT", "传感器", "项目实战"]
categories: ["硬件项目"]
---

![智能植物监控系统](https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop)

## 🌱 项目概述

这是一个基于Arduino的智能植物监控系统，能够自动监测植物的生长环境，并通过手机APP实时查看数据。

## 🎯 项目目标

- 监测土壤湿度、温度、光照强度
- 自动浇水功能
- 数据记录和分析
- 手机远程控制

## 🔧 所需材料

### 硬件组件
- Arduino Uno R3 × 1
- ESP8266 WiFi模块 × 1
- 土壤湿度传感器 × 1
- DHT22温湿度传感器 × 1
- 光敏电阻 × 1
- 水泵 × 1
- 继电器模块 × 1
- OLED显示屏 × 1
- 面包板和跳线若干

### 成本预算
| 组件 | 价格 | 数量 | 小计 |
|------|------|------|------|
| Arduino Uno | ￥45 | 1 | ￥45 |
| ESP8266 | ￥20 | 1 | ￥20 |
| 传感器套装 | ￥35 | 1套 | ￥35 |
| 水泵+继电器 | ￥25 | 1套 | ￥25 |
| OLED显示屏 | ￥18 | 1 | ￥18 |
| **总计** | | | **￥143** |

## 🔌 硬件连接

### 传感器连接
```cpp
// 引脚定义
#define SOIL_MOISTURE_PIN A0    // 土壤湿度传感器
#define DHT_PIN 2              // 温湿度传感器
#define LIGHT_SENSOR_PIN A1    // 光敏电阻
#define PUMP_PIN 3             // 水泵控制
#define OLED_SDA_PIN A4        // OLED SDA
#define OLED_SCL_PIN A5        // OLED SCL
```

### 连接图
```
Arduino Uno:
A0 ── 土壤湿度传感器
A1 ── 光敏电阻 + 10kΩ电阻
A4 ── OLED SDA
A5 ── OLED SCL
D2 ── DHT22 数据线
D3 ── 继电器控制端
5V ── 传感器电源
GND ── 公共地
```

## 💻 软件代码

### 主程序
```cpp
#include <DHT.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// 传感器初始化
DHT dht(DHT_PIN, DHT22);
Adafruit_SSD1306 display(128, 64, &Wire, -1);
SoftwareSerial esp(10, 11); // RX, TX

// 全局变量
float temperature, humidity;
int soilMoisture, lightLevel;
bool pumpStatus = false;
unsigned long lastCheckTime = 0;
const unsigned long CHECK_INTERVAL = 30000; // 30秒检查一次

void setup() {
  Serial.begin(9600);
  esp.begin(9600);
  dht.begin();

  // OLED初始化
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
  }

  pinMode(PUMP_PIN, OUTPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LIGHT_SENSOR_PIN, INPUT);

  digitalWrite(PUMP_PIN, LOW);

  // 显示启动画面
  displayBootScreen();
}

void loop() {
  // 定时检查传感器数据
  if (millis() - lastCheckTime > CHECK_INTERVAL) {
    readSensors();
    updateDisplay();
    checkAutoWater();
    sendDataToServer();
    lastCheckTime = millis();
  }

  // 检查手机APP指令
  checkMobileCommand();

  delay(1000);
}

void readSensors() {
  // 读取温湿度
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // 读取土壤湿度 (0-1023, 数值越小越湿润)
  soilMoisture = analogRead(SOIL_MOISTURE_PIN);

  // 读取光照强度
  lightLevel = analogRead(LIGHT_SENSOR_PIN);

  Serial.print("温度: "); Serial.print(temperature);
  Serial.print("°C, 湿度: "); Serial.print(humidity);
  Serial.print("%, 土壤湿度: "); Serial.print(soilMoisture);
  Serial.print(", 光照: "); Serial.println(lightLevel);
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.print("智能植物监控");

  display.setCursor(0, 16);
  display.printf("温度:%.1f°C 湿度:%.0f%%", temperature, humidity);

  display.setCursor(0, 32);
  display.printf("土壤:%d 光照:%d", 1024-soilMoisture, lightLevel);

  display.setCursor(0, 48);
  display.print("水泵:");
  display.print(pumpStatus ? "开启" : "关闭");

  display.display();
}

void checkAutoWater() {
  // 土壤湿度阈值 (可根据植物类型调整)
  int moistureThreshold = 700;

  if (soilMoisture > moistureThreshold && !pumpStatus) {
    startPump();
  } else if (soilMoisture < moistureThreshold - 100 && pumpStatus) {
    stopPump();
  }
}

void startPump() {
  digitalWrite(PUMP_PIN, HIGH);
  pumpStatus = true;
  Serial.println("启动水泵浇水");
}

void stopPump() {
  digitalWrite(PUMP_PIN, LOW);
  pumpStatus = false;
  Serial.println("停止水泵");
}

void sendDataToServer() {
  DynamicJsonDocument doc(1024);

  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = 1024 - soilMoisture; // 转换为湿度百分比
  doc["lightLevel"] = lightLevel;
  doc["pumpStatus"] = pumpStatus;
  doc["timestamp"] = millis();

  serializeJson(doc, esp);
  esp.println();
}

void checkMobileCommand() {
  if (esp.available()) {
    String command = esp.readStringUntil('\n');
    command.trim();

    if (command == "PUMP_ON") {
      startPump();
    } else if (command == "PUMP_OFF") {
      stopPump();
    } else if (command == "GET_DATA") {
      sendDataToServer();
    }
  }
}

void displayBootScreen() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(20, 20);
  display.print("植物卫士");
  display.setTextSize(1);
  display.setCursor(30, 50);
  display.print("System Starting...");
  display.display();
  delay(2000);
}
```

## 📱 手机APP界面

### Blynk配置
使用Blynk平台快速创建手机控制界面：

```
组件设置:
- V0: 温度显示 (数值显示)
- V1: 湿度显示 (数值显示)
- V2: 土壤湿度显示 (量表)
- V3: 光照强度显示 (图表)
- V4: 水泵控制 (按钮)
- V5: 状态通知 (通知)
```

## 🎯 教育价值

### 适合年龄
- **12-15岁**: 在指导下完成
- **15岁以上**: 独立完成并扩展功能

### 学习目标
1. **硬件知识**: 了解传感器工作原理
2. **编程技能**: 掌握Arduino编程基础
3. **系统思维**: 理解物联网系统架构
4. **解决问题**: 调试和优化项目

### 扩展功能建议
- 添加摄像头监控植物生长
- 集成机器学习预测植物需求
- 制作移动端APP
- 添加语音控制功能

## 🔧 常见问题解决

### 问题1: 传感器读数不准确
**解决方案**:
- 检查接线是否正确
- 校准传感器读数
- 添加滤波算法

### 问题2: WiFi连接不稳定
**解决方案**:
- 添加重连机制
- 优化天线位置
- 降低数据发送频率

### 问题3: 水泵工作异常
**解决方案**:
- 检查继电器接线
- 添加电源保护
- 设置工作时间限制

## 📊 项目数据记录

创建简单的数据记录表格：

| 日期 | 温度(°C) | 湿度(%) | 土壤湿度 | 光照 | 浇水次数 | 备注 |
|------|----------|---------|----------|------|----------|------|
| 11/01 | 22.5 | 65 | 45% | 750 | 2 | 晴天 |
| 11/02 | 21.8 | 68 | 52% | 680 | 1 | 多云 |
| 11/03 | 23.2 | 62 | 38% | 820 | 3 | 晴天 |

## 🚀 升级方向

1. **机器学习**: 预测最佳浇水时间
2. **太阳能**: 实现环保供电
3. **多植物管理**: 扩展到多个花盆
4. **数据分析**: 生成植物生长报告

---

**这个项目将编程、电子和植物知识完美结合，是STEM教育的绝佳案例！**

*项目代码和详细教程已上传到GitHub，欢迎star和fork！*