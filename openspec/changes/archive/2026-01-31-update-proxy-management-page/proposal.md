# Change: Update Proxy Management Page

## Why
当前代理管理功能较为基础，用户无法直观查看和修改各类代理配置（HTTP/HTTPS/SOCKS）。需要一个完整的管理页面来提供查看状态、切换开关、编辑配置以及一键清除代理的功能，以方便用户解决网络连接问题。

## What Changes
- 新增代理管理界面，展示 HTTP、HTTPS 和 SOCKS 代理的当前状态
- 支持单独开启或关闭各类代理
- 支持编辑各类代理的服务器地址和端口
- 提供"清除所有代理"的一键操作功能
- 实时获取并显示当前网络服务的代理配置

## Capabilities

### New Capabilities
- `proxy-management`: 提供代理配置的查看、编辑、开关切换及清除功能

### Modified Capabilities
<!-- No existing capabilities are being modified at the requirement level -->

## Impact
- **Backend**: `src-tauri/src/commands/proxy.rs` 需要扩展以支持设置代理（目前仅支持获取和清除）
- **Frontend**: 新增代理管理页面组件
- **API**: 新增 `set_proxy_settings` 等 Tauri 命令
