# 项目图片资源

这个文件夹包含了网站项目中使用的所有图片资源。

## 文件结构

```
images/
├── projects/           # 项目相关图片
│   ├── ecommerce/      # 电商平台项目图片
│   ├── fitness/        # 健身追踪应用图片
│   ├── analytics/      # 数据分析仪表板图片
│   └── tools/          # API测试工具图片
├── skills/             # 技能相关图片
│   ├── frontend/       # 前端开发技能图片
│   ├── backend/        # 后端开发技能图片
│   └── data/          # 数据分析技能图片
├── blog/              # 博客文章图片
└── general/           # 通用图片资源
```

## 图片使用说明

### 项目图片
- **电商平台系统**: 展示电商平台的界面设计、架构图和功能截图
- **健身追踪应用**: 移动应用界面截图、功能展示图
- **销售数据分析仪表板**: 数据可视化图表、仪表板界面
- **API测试工具**: 工具界面截图、使用示例图

### 技能图片
- **前端开发**: 技术栈图标、项目截图、代码示例图
- **后端开发**: 架构图、技术栈图标、部署示意图
- **数据分析**: 数据可视化图表、分析流程图

### 博客图片
- **微服务架构**: 架构图、设计模式图、部署示意图
- **React性能优化**: 性能对比图、优化前后对比
- **Python数据分析**: 代码示例图、分析结果图

## 图片规范

1. **格式**: 推荐使用WebP格式，兼容性考虑可提供PNG/JPG备选
2. **尺寸**: 根据使用场景调整，避免过大图片影响加载速度
3. **命名**: 使用有意义的文件名，便于管理和引用
4. **压缩**: 适当压缩图片，平衡质量和文件大小

## 占位符图片

当前使用占位符图片，实际项目中应替换为真实的项目截图和设计图。

### 占位符图片列表
- `placeholder-ecommerce-1.webp` - 电商平台主页截图
- `placeholder-ecommerce-2.webp` - 电商平台产品页面
- `placeholder-fitness-1.webp` - 健身应用主界面
- `placeholder-fitness-2.webp` - 健身数据统计页面
- `placeholder-analytics-1.webp` - 数据分析仪表板
- `placeholder-analytics-2.webp` - 数据可视化图表
- `placeholder-tools-1.webp` - API测试工具界面
- `placeholder-tools-2.webp` - 测试报告示例

## 图片引用方式

在Markdown文件中引用图片：

```markdown
![图片描述](/images/projects/ecommerce/placeholder-ecommerce-1.webp)
```

在HTML中引用图片：

```html
<img src="/images/projects/ecommerce/placeholder-ecommerce-1.webp" alt="图片描述">
```

## 注意事项

1. 所有图片路径应以 `/images/` 开头
2. 确保图片文件名与引用路径一致
3. 定期检查图片链接是否有效
4. 考虑使用CDN加速图片加载