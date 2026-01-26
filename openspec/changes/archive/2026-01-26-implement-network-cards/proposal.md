# Change: 实现网卡管理功能

## Why
网卡管理是 Mac 网络修复工具的核心功能之一。用户需要能够查看系统中所有网络服务、了解当前连接状态、调整网络服务优先级，以及添加或移除网络服务。当前页面只有静态 UI 占位，没有实际功能。

## What Changes
- 实现后端 Rust 命令：获取网络服务列表、获取接口状态、添加/移除网络服务、调整服务优先级
- 实现前端页面：展示网络服务列表、拖拽排序、添加/移除服务对话框
- 集成 Zustand store 管理网卡状态
- 添加错误处理和用户反馈

## Impact
- 新增 specs: `network-cards`
- 影响代码:
  - `src-tauri/src/commands/network.rs` - 扩展后端命令
  - `src-tauri/src/lib.rs` - 注册新命令
  - `src/pages/network-cards/NetworkCardsPage.tsx` - 重构页面
  - `src/services/network-api.ts` - 添加 API 封装
  - `src/stores/network-store.ts` - 扩展状态管理
  - 新增组件: `NetworkServiceList`, `ServiceSortable`, `AddServiceDialog`, `RemoveServiceDialog`
