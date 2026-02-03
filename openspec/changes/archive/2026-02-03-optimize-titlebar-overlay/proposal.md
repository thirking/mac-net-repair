# Proposal: Optimize Title Bar with Overlay Style

## Why

当前的 Mac 网络修复工具使用默认标题栏样式，占用了大量垂直空间。通过使用 Tauri 的 `titleBarStyle: "Overlay"` 特性，可以将标题栏与内容区域融合，创造更现代、沉浸式的 macOS 原生应用体验，同时保留窗口控制按钮（关闭、最小化、最大化）的功能。

## What Changes

- 修改 `tauri.conf.json`，将 `titleBarStyle` 设置为 `"Overlay"`
- 调整前端布局，为 macOS 窗口控制按钮留出安全区域
- 确保标题栏内容与窗口控制按钮不重叠
- 保持应用窗口的可调整大小(resizable)和最小尺寸约束

## Capabilities

### New Capabilities

- `overlay-titlebar`: 使用 Tauri Overlay 标题栏样式，在 macOS 上实现沉浸式标题栏体验

### Modified Capabilities

- 无现有规格需要修改

## Impact

- **配置文件**: `src-tauri/tauri.conf.json` - 添加 `titleBarStyle` 配置
- **前端代码**: 可能需要调整顶部 padding/margin 以适配 overlay 标题栏
- **平台限制**: 此特性仅影响 macOS 平台，Windows/Linux 不受影响
