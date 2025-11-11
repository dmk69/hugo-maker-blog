---
title: "工厂自动化监控系统"
date: 2025-11-12T11:00:00+08:00
draft: false
slug: "factory-automation"
tags: ["PLC", "Allen-Bradley", "SCADA", "FactoryTalk View", "数据采集"]
categories: ["项目"]
cover:
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
    alt: "工厂自动化监控系统"
    caption: "Allen-Bradley PLC + FactoryTalk View SCADA集成方案"
weight: 2
---

## 🏭 项目概述

这是一个基于Allen-Bradley ControlLogix PLC和FactoryTalk View SE的工厂自动化监控系统，实现了对整个工厂生产区域的集中监控和数据采集。系统覆盖了原料处理、生产制造、质量检测、仓储物流等全流程。

## 🎯 项目目标

- 建立统一的工厂监控平台
- 实现生产数据实时采集和分析
- 提高设备利用率和生产效率
- 建立预警和报警机制
- 支持移动端远程监控

## 🔧 系统架构

### 硬件网络架构
```
工厂网络拓扑:
┌─────────────────────────────────────────────────────┐
│              ControlLogix L73控制器                   │
│              (主PLC - 1756-L73)                      │
└─────────────────┬───────────────────────────────────┘
                  │ EtherNet/IP (冗余环网)
┌─────────────────┼───────────────────────────────────┐
│     │                │                │              │
┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
│ 原料处理区  │   │ 生产制造区  │   │ 质量检测区  │   │ 仓储物流区  │
│ CompactLogix│   │ ControlLogix│   │ CompactLogix│   │ MicroLogix │
│ 1769-L30ER │   │ 1756-L72  │   │ 1769-L30ER │   │ 1769-L33ER │
└─────┬─────┘   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
      │               │               │               │
      └───────────────┼───────────────┼───────────────┘
                      │               │
            ┌─────────▼─────┐ ┌───────▼───────┐
            │ SCADA服务器   │ │ HMI工作站     │
            │ FactoryTalk   │ │ PanelView Plus│
            │ View SE       │ │ 1500          │
            └───────────────┘ └───────────────┘
```

### PLC配置清单
```excel
控制器配置:
主控制器 (1台):
- Allen-Bradley 1756-L73 (ControlLogix)
- 1756-EN2T (EtherNet/IP模块)
- 1756-IR6I (6通道RTD输入)
- 1756-OF4 (4通道模拟量输出)

区域控制器 (4台):
- 原料处理区: 1769-L30ER + 1769-IQ16 + 1769-OB8
- 生产制造区: 1756-L72 + 1756-IB16 + 1756-OW16I
- 质量检测区: 1769-L30ER + 1769-IF4 + 1769-OF2
- 仓储物流区: 1769-L33ER + 1769-IQ32

HMI设备 (3台):
- PanelView Plus 1500 (15寸彩色触摸屏)
- PanelView Plus 1000 (10寸操作面板)
- 移动平板电脑 (无线HMI)
```

## 💻 PLC程序开发

### 主控制程序结构
```structured_text
// 主程序 - MainProgram
PROGRAM MainProgram
VAR
    // 系统状态变量
    SystemMode : DINT := 0; // 0=停止, 1=手动, 2=自动, 3=维护
    EmergencyActive : BOOL := FALSE;
    ProductionRunning : BOOL := FALSE;

    // 生产统计
    TotalProduction : DINT := 0;
    ShiftProduction : DINT := 0;
    HourlyProduction : ARRAY[0..23] OF DINT;

    // 报警系统
    AlarmArray : ARRAY[1..100] OF AlarmStruct;
    AlarmCount : DINT := 0;

    // 通信数据
    SCADA_Data : SCADA_DataStruct;
    HMI_Commands : HMI_CommandStruct;
END_VAR

// 主循环逻辑
IF SystemMode = 2 THEN // 自动模式
    // 执行生产序列
    ExecuteProductionSequence();

    // 更新生产数据
    UpdateProductionData();

    // 检查报警条件
    CheckAlarmConditions();

ELSIF SystemMode = 1 THEN // 手动模式
    ExecuteManualCommands();

ELSIF SystemMode = 3 THEN // 维护模式
    MaintenanceProcedures();
END_IF;

// 数据通信处理
HandleSCADACommunication();
UpdateHMI_Display();

// 急停处理
IF EmergencyActive THEN
    EmergencyShutdown();
END_IF
```

### 生产序列控制
```structured_text
// 生产序列控制函数
FUNCTION ExecuteProductionSequence : VOID
VAR_INPUT
END_VAR
VAR
    CurrentStep : DINT := 0;
    StepTimer : TIMER;
END_VAR

BEGIN
CASE CurrentStep OF
    0: // 初始状态
        IF HMI_Commands.StartButton THEN
            CurrentStep := 10;
            StepTimer.PRE := 3000; // 3秒
            StepTimer.IN := TRUE;
        END_IF;

    10: // 原料准备
        IF RawMaterialReady AND StepTimer.DN THEN
            CurrentStep := 20;
            StartConveyor(CONVEYOR_FEEDER);
            StepTimer.PRE := 5000; // 5秒
            StepTimer.IN := TRUE;
        END_IF;

    20: // 物料输送
        IF MaterialAtPosition(STATION_1) AND StepTimer.DN THEN
            CurrentStep := 30;
            StopConveyor(CONVEYOR_FEEDER);
            StartProcessing(STATION_1);
            StepTimer.PRE := 15000; // 15秒
            StepTimer.IN := TRUE;
        END_IF;

    30: // 加工处理
        IF ProcessComplete(STATION_1) AND StepTimer.DN THEN
            CurrentStep := 40;
            StartConveyor(CONVEYOR_MAIN);
            MoveToNextStation();
            StepTimer.PRE := 8000; // 8秒
            StepTimer.IN := TRUE;
        END_IF;

    40: // 质量检测
        IF AtQualityStation() AND StepTimer.DN THEN
            CurrentStep := 50;
            StopConveyor(CONVEYOR_MAIN);
            StartQualityCheck();
            StepTimer.PRE := 10000; // 10秒
            StepTimer.IN := TRUE;
        END_IF;

    50: // 结果处理
        IF QualityCheckComplete() AND StepTimer.DN THEN
            IF QualityPass THEN
                // 合格品 - 进入包装流程
                CurrentStep := 60;
                StartPackaging();
            ELSE
                // 不合格品 - 进入返工流程
                CurrentStep := 70;
                StartReworkProcess();
            END_IF;
            StepTimer.PRE := 5000;
            StepTimer.IN := TRUE;
        END_IF;

    60: // 包装完成
        IF PackagingComplete() AND StepTimer.DN THEN
            CurrentStep := 0;
            TotalProduction := TotalProduction + 1;
            ShiftProduction := ShiftProduction + 1;
            HourlyProduction[GetCurrentHour()] :=
                HourlyProduction[GetCurrentHour()] + 1;
        END_IF;

    70: // 返工处理
        IF ReworkComplete() AND StepTimer.DN THEN
            CurrentStep := 20; // 返回到加工步骤
        END_IF;
END_CASE;

// 急停处理
IF EmergencyActive THEN
    StopAllEquipment();
    CurrentStep := 0;
END_IF;
END_FUNCTION
```

### 数据记录功能
```structured_text
// 生产数据记录
FUNCTION LogProductionData : VOID
VAR_INPUT
END_VAR
VAR
    DataRecord : ProductionRecord;
    CurrentTime : DT;
END_VAR

BEGIN
    // 获取当前时间
    CurrentTime := GetSystemTime();

    // 构建数据记录
    DataRecord.Timestamp := CurrentTime;
    DataRecord.ShiftID := GetCurrentShift();
    DataRecord.ProductID := CurrentProductID;
    DataRecord.Quantity := ShiftProduction;
    DataRecord.QualityPassRate := CalculateQualityRate();
    DataRecord.EquipmentUtilization := CalculateOEE();
    DataRecord.EnergyConsumption := GetTotalEnergyUsage();

    // 写入数据缓冲区
    ProductionLogBuffer.Write(DataRecord);

    // 每小时向SCADA发送一次汇总数据
    IF IsHourBoundary() THEN
        SendHourlyDataToSCADA();
    END_IF;
END_FUNCTION
```

## 🖥️ SCADA系统开发

### FactoryTalk View SE配置
```
应用结构:
FactoryTalk SE Application
├── Area Models
│   ├── Raw_Material_Area (原料处理区)
│   ├── Production_Area (生产制造区)
│   ├── Quality_Area (质量检测区)
│   └── Logistics_Area (仓储物流区)
├── HMI Displays
│   ├── Main_Overview (主监控画面)
│   ├── Production_Detail (生产详情)
│   ├── Alarm_Display (报警显示)
│   ├── Trend_Display (趋势图)
│   └── Report_Display (报表画面)
├── Data Logs
│   ├── Production_Log (生产数据)
│   ├── Alarm_Log (报警记录)
│   └── Energy_Log (能耗数据)
└── Security
    ├── Operator (操作员权限)
    ├── Supervisor (主管权限)
    └── Engineer (工程师权限)
```

### 主监控画面设计
```
主画面布局 (1920×1080分辨率):
┌─────────────────────────────────────────────────────────┐
│ 标题栏: 工厂自动化监控系统                    │ 用户: 操作员 │
├─────────────────────────────────────────────────────────┤
│ 区域选择标签: [原料区] [生产区] [质量区] [仓储区] [总览]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │   原料处理区    │ │   生产制造区    │ │   质量检测区    │ │
│ │                │ │                │ │                │ │
│ │ 🟢 正常运行     │ │ 🟡 性能下降     │ │ 🟢 正常运行     │ │
│ │ 产量: 245吨     │ │ 产量: 1,847件   │ │ 合格率: 99.2%   │ │
│ │ 效率: 94.5%     │ │ OEE: 87.3%     │ │ 检测: 1,823件   │ │
│ │                │ │                │ │                │ │
│ │ [详细信息]      │ │ [详细信息]      │ │ [详细信息]      │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 实时趋势图 (最近1小时):                                  │
│ 产量曲线: ████████████████████████████████████████████  │
│ 质量曲线: ████████████████████████████████████████████  │
│ 效率曲线: ████████████████████████████████████████████  │
├─────────────────────────────────────────────────────────┤
│ 底部状态栏: 报警数: 2 | 系统状态: 正常 | 当前时间: 14:35: │
└─────────────────────────────────────────────────────────┘
```

### VBA脚本 - 数据导出功能
```vba
' 导出生产报表到Excel
Sub ExportProductionReport()
    Dim excelApp As Object
    Dim workbook As Object
    Dim worksheet As Object
    Dim reportData As Variant
    Dim i As Integer

    ' 创建Excel应用程序
    Set excelApp = CreateObject("Excel.Application")
    Set workbook = excelApp.Workbooks.Add
    Set worksheet = workbook.Worksheets(1)

    ' 设置表头
    worksheet.Cells(1, 1).Value = "时间"
    worksheet.Cells(1, 2).Value = "产量"
    worksheet.Cells(1, 3).Value = "合格率"
    worksheet.Cells(1, 4).Value = "OEE"
    worksheet.Cells(1, 5).Value = "能耗"

    ' 从FactoryTalk数据模型获取数据
    For i = 0 To 23
        worksheet.Cells(i + 2, 1).Value = FormatHour(i)
        worksheet.Cells(i + 2, 2).Value = HourlyProduction(i)
        worksheet.Cells(i + 2, 3).Value = HourlyQualityRate(i)
        worksheet.Cells(i + 2, 4).Value = HourlyOEE(i)
        worksheet.Cells(i + 2, 5).Value = HourlyEnergy(i)
    Next i

    ' 格式化表格
    worksheet.Columns("A:E").AutoFit
    worksheet.Range("A1:E1").Font.Bold = True

    ' 保存文件
    Dim fileName As String
    fileName = "Production_Report_" & Format(Now, "yyyymmdd") & ".xlsx"
    workbook.SaveAs fileName
    workbook.Close

    excelApp.Quit
    Set excelApp = Nothing

    ' 显示导出成功消息
    MsgBox "生产报表已导出至: " & fileName, vbInformation, "导出完成"
End Sub
```

## 📊 数据分析与报表

### 生产KPI计算
```structured_text
// 关键性能指标计算
FUNCTION CalculateKPIs : KPI_Struct
VAR_INPUT
    ShiftData : Shift_Data_Struct;
END_VAR
VAR_OUTPUT
    Result : KPI_Struct;
END_VAR
VAR
    PlannedProductionTime : REAL;
    ActualProductionTime : REAL;
    IdealCycleTime : REAL;
END_VAR

BEGIN
    // 计划生产时间 (小时)
    PlannedProductionTime := 8.0; // 8小时班次

    // 实际生产时间 (考虑停机时间)
    ActualProductionTime := PlannedProductionTime -
                          (ShiftData.Downtime.Total / 3600.0);

    // 理想循环时间 (秒/件)
    IdealCycleTime := 45.0; // 45秒生产一件

    // 可用率 (Availability)
    Result.Availability := ActualProductionTime / PlannedProductionTime;

    // 性能率 (Performance)
    Result.Performance := (IdealCycleTime * ShiftData.TotalParts) /
                         (ActualProductionTime * 3600.0);

    // 质量率 (Quality)
    IF ShiftData.TotalParts > 0 THEN
        Result.Quality := ShiftData.GoodParts / ShiftData.TotalParts;
    ELSE
        Result.Quality := 0.0;
    END_IF;

    // OEE (Overall Equipment Effectiveness)
    Result.OEE := Result.Availability * Result.Performance * Result.Quality;

    // 产量达成率
    Result.ProductionRate := ShiftData.TotalParts / ShiftData.TargetProduction;

    // 能耗指标
    Result.EnergyPerUnit := ShiftData.TotalEnergy / ShiftData.TotalParts;
END_FUNCTION
```

### 实时数据趋势图
```structured_text
// 趋势数据缓存
FUNCTION_BUFFER TrendDataBuffer
VAR_INPUT
    NewValue : REAL;
    Timestamp : DT;
END_VAR
VAR
    DataArray : ARRAY[1..1000] OF REAL;
    TimeArray : ARRAY[1..1000] OF DT;
    Index : DINT := 0;
    BufferSize : DINT := 1000;
END_VAR

BEGIN
    // 更新索引
    Index := (Index MOD BufferSize) + 1;

    // 存储新数据
    DataArray[Index] := NewValue;
    TimeArray[Index] := Timestamp;

    // 输出最近N个数据点给SCADA
    SCADA_TrendData := GetRecentDataPoints(100);
END_FUNCTION_BUFFER
```

## 🔧 移动端监控

### Web HMI界面
```
移动端监控界面 (响应式设计):
┌─────────────────────────┐
│ 🏭 工厂监控            │
├─────────────────────────┤
│ 📊 今日生产概况        │
│ 目标: 2,000件          │
│ 实际: 1,847件 (92.4%)  │
│ 合格: 1,832件 (99.2%)  │
│                        │
│ 📈 各区域状态          │
│ 原料区: 🟢 正常         │
│ 生产区: 🟡 效率85%      │
│ 质检区: 🟢 正常         │
│ 仓储区: 🟢 正常         │
│                        │
│ ⚠️ 当前报警            │
│ • 生产区效率下降        │
│ • 3号设备需维护         │
│                        │
│ 📱 快速操作            │
│ [查看详情] [导出报表]   │
│ [报警确认] [联系支持]   │
└─────────────────────────┘
```

## 📈 项目成果

### 技术成果
- **监控覆盖范围**: 4个生产区域，32台设备
- **数据采集点**: 500+个实时监控点
- **报警响应时间**: < 2秒
- **历史数据存储**: 3年完整数据
- **移动端访问**: 支持iOS/Android设备

### 管理效益
- **生产透明度**: 实时掌握全厂生产状况
- **决策支持**: 基于数据的管理决策
- **异常响应**: 快速发现和处理生产异常
- **成本控制**: 精细化的能耗和材料管理
- **质量提升**: 实时质量监控和追溯

### 投资回报
- **实施周期**: 6个月
- **投资金额**: 280万元
- **年收益**: 450万元
- **投资回收期**: 7.5个月

## 🎓 技术特色

1. **分布式控制架构**: 多PLC协同工作，提高系统可靠性
2. **冗余网络设计**: 环网拓扑，单点故障不影响系统运行
3. **实时数据采集**: 毫秒级数据更新，准确反映生产状态
4. **智能报警系统**: 分级报警管理，重要信息及时推送
5. **移动化支持**: 随时随地的生产监控能力

---

**该项目展示了现代工厂自动化监控系统的完整解决方案，从硬件选型到软件开发，从数据处理到用户界面的全方位技术能力。**

*系统已稳定运行18个月，为工厂管理提供了强有力的技术支撑。*