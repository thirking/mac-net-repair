## Why

当前 DNS 管理页面 (`/dns`) 仅包含静态 UI，无法实际管理系统的 DNS 服务器配置。后端已实现了完整的 DNS 管理命令（获取、设置 DNS 服务器，刷新缓存），但前端页面未集成这些功能。用户需要通过图形界面管理网络服务的 DNS 设置，这是网络工具应用的核心功能之一。

## What Changes

- **DNS 服务选择器**: 添加网络服务下拉选择器，允许用户选择要配置的特定网络服务（如 Wi-Fi、以太网等）
- **动态加载 DNS 设置**: 根据选中的服务，从后端获取当前配置的 DNS 服务器列表
- **DNS 服务器管理**: 实现添加、删除 DNS 服务器的交互功能
- **保存配置**: 将修改后的 DNS 服务器列表保存到系统
- **刷新 DNS 缓存**: 集成后端 `flush_dns_cache` 命令，提供一键刷新功能
- **状态管理**: 添加加载状态、错误处理和操作反馈通知

## Capabilities

### New Capabilities
- `dns-management`: DNS 服务器配置管理 - 包括服务选择、DNS 列表展示、添加/删除/保存 DNS 服务器
- `dns-cache-flush`: DNS 缓存刷新 - 一键刷新系统 DNS 缓存功能

### Modified Capabilities
- 无

## Impact

**前端代码**:
- `src/pages/dns/DnsPage.tsx` - 重写为功能完整的组件
- `src/services/network-api.ts` - 已包含所需 API 调用，无需修改
- `src/types/` - 可能需要添加 DNS 相关类型定义

**后端代码**:
- 无需修改，后端命令已完全实现 (`src-tauri/src/commands/dns.rs`)

**依赖**:
- 使用现有的 shadcn/ui 组件（Select, Button, Input, Card 等）
- 使用现有的 Tauri API 调用模式
- 遵循与 Proxy 页面一致的交互设计模式
