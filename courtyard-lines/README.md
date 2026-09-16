# 廊间 · Courtyard Lines

原创三室一厅体素风现代住宅 3D 展示网站。项目以开放客餐厨为家庭核心，通过一条清晰的公共—私密动线连接主卧、次卧、书房、多功能入户和景观阳台。

## 设计内容

- 客餐厅：四人沙发、休闲椅、双层茶几、电视墙、六人餐桌、餐边柜与连续阳台
- 厨房：半开放 L 型操作面、岛台、水槽、灶台、冰箱与吊柜
- 主卧：双人床、双床头柜、整墙衣柜、梳妆区和阅读椅
- 次卧：横向单床、衣柜和独立工作位
- 书房：书桌、书柜、阅读椅、植物和可留宿榻榻米
- 入户 / 阳台：高柜、换鞋凳、圆镜、木格栅、长凳与程序化绿植

所有木纹、织物、石材、地毯和装饰画都在浏览器中通过 Canvas 程序化生成；没有外部图片资源。Three.js 与 OrbitControls 固定保存在 `vendor/`，页面运行不依赖 CDN 或构建工具。

## 本地预览

项目是纯静态网站，可在仓库根目录运行任意静态服务器：

```bash
python -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/`。

## 项目结构

```text
.
├── index.html                 # 页面语义结构与 UI
├── styles.css                 # 作品集排版、场景布局与响应式样式
├── src/
│   └── main.js                # 户型、家具、材质、灯光与相机交互
├── vendor/
│   ├── three.core.min.js      # Three.js 本地核心
│   ├── three.module.min.js    # Three.js ES Module
│   └── OrbitControls.js       # 相机轨道控制
├── .github/workflows/pages.yml# GitHub Pages 自动部署
└── .nojekyll                  # 禁用 Jekyll 路径处理
```

## 调整房间和家具

模型全部在 `src/main.js` 中以真实比例感的几何函数构建：

- `buildArchitecture()`：地板、外墙、隔墙、房门、窗与阳台栏杆
- `buildLivingDining()`：客厅、餐厅和厨房
- `buildMaster()`：主卧
- `buildGuest()`：次卧
- `buildStudio()`：书房 / 多功能房
- `buildBalconyAndEntry()`：阳台和入户区

家具由 `sofa()`、`bed()`、`wardrobe()`、`desk()`、`bookcase()` 等复用函数生成。每个调用的前两个数值是平面坐标 `x / z`，第三个通常是绕 Y 轴旋转角；尺寸在对应函数内部集中维护。新增或移动家具时，优先保持门洞前约 0.9 个单位、床侧约 0.65 个单位、餐椅后约 0.8 个单位的净空。

相机预设集中在 `views` 对象中；每个视角包含 `position`、`target` 和说明文字。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会发布仓库根目录。首次部署需要在仓库 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**。

