# Project Context

## Purpose
Mac 网络修复工具 - 一个用于诊断和修复 macOS 网络问题的桌面应用程序。

### 核心功能
1. **网卡管理**
   - 列出当前所有网卡及其状态
   - 显示网卡优先级顺序
   - 识别并显示默认网卡
   - 支持添加/移除网络服务

2. **代理管理**
   - 检测系统代理设置（HTTP/HTTPS/SOCKS）
   - 一键清除所有代理配置

3. **网络诊断**
   - 一键 Ping 测试（支持自定义目标）
   - DNS 查询测试

4. **DNS 管理**
   - 查看当前 DNS 服务器配置
   - 设置自定义 DNS 服务器
   - 刷新 DNS 缓存

5. **网络重置**
   - 一键重置网络配置
   - 刷新网络服务

## Tech Stack
- **前端框架**: React 18 + TypeScript
- **桌面框架**: Tauri 2.x (Rust)
- **UI 组件库**: Shadcn/ui
- **状态管理**: Zustand
- **构建工具**: Vite
- **包管理器**: pnpm

### 系统命令依赖
- `networksetup` - macOS 网络配置工具
- `scutil` - 系统配置工具
- `dscacheutil` - DNS 缓存工具
- `ping` - 网络连通性测试
- `nslookup` / `dig` - DNS 查询

## Project Conventions

### Code Style
- 使用 TypeScript 严格模式
- 使用 ESLint + Prettier 进行代码格式化
- 组件使用函数式组件 + Hooks
- 命名规范:
  - 组件: PascalCase (如 `NetworkCard.tsx`)
  - 工具函数: camelCase (如 `parseNetworkInfo.ts`)
  - 常量: UPPER_SNAKE_CASE
  - Rust 代码遵循 Rust 官方风格指南

### Architecture Patterns
- **前端**: 功能模块化组织
  ```
  src/
  ├── components/     # 通用组件
  ├── features/       # 功能模块
  │   ├── network-cards/
  │   ├── proxy/
  │   ├── dns/
  │   └── diagnostics/
  ├── hooks/          # 自定义 Hooks
  ├── services/       # Tauri 命令调用封装
  └── utils/          # 工具函数
  ```
- **后端 (Rust)**: Tauri Commands 模式
  ```
  src-tauri/
  ├── src/
  │   ├── commands/   # Tauri 命令
  │   ├── network/    # 网络操作模块
  │   └── utils/      # 工具函数
  ```

### Testing Strategy
- 前端: Vitest + React Testing Library
- Rust: 内置测试框架
- 关键网络操作需要有单元测试

### Git Workflow
- 主分支: `main`
- 功能分支: `feature/功能名称`
- 修复分支: `fix/问题描述`
- Commit 规范: Conventional Commits
  - `feat:` 新功能
  - `fix:` 修复
  - `docs:` 文档
  - `refactor:` 重构
  - `test:` 测试

## Domain Context

### macOS 网络架构
- **网络服务 (Network Service)**: macOS 中网络接口的逻辑表示
- **网络接口**: 物理或虚拟网卡 (如 en0, en1, bridge0)
- **服务顺序**: 决定网络请求的优先级

### 常用 macOS 网络命令
```bash
# 列出所有网络服务
networksetup -listallnetworkservices

# 获取服务顺序
networksetup -listnetworkserviceorder

# 获取代理设置
networksetup -getwebproxy "Wi-Fi"
networksetup -getsecurewebproxy "Wi-Fi"
networksetup -getsocksfirewallproxy "Wi-Fi"

# 清除代理
networksetup -setwebproxystate "Wi-Fi" off
networksetup -setsecurewebproxystate "Wi-Fi" off
networksetup -setsocksfirewallproxystate "Wi-Fi" off

# DNS 操作
networksetup -getdnsservers "Wi-Fi"
networksetup -setdnsservers "Wi-Fi" 8.8.8.8 8.8.4.4
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 获取网络接口信息
ifconfig
scutil --nwi
```

## Important Constraints

### 权限要求
- 部分操作需要管理员权限 (sudo)
- Tauri 需要配置权限请求
- 需要处理权限不足的情况

### 系统兼容性
- 目标: macOS 12.0 (Monterey) 及以上
- 仅支持 Apple Silicon 和 Intel Mac

### 安全考虑
- 敏感操作需要用户确认
- 不存储用户密码
- 命令执行需要防止注入攻击

## External Dependencies

### 系统工具
- `/usr/sbin/networksetup`
- `/usr/sbin/scutil`
- `/usr/bin/dscacheutil`
- `/sbin/ping`
- `/usr/bin/nslookup`

### 可能的第三方库
- `tauri-plugin-shell` - 执行系统命令
- `tauri-plugin-dialog` - 系统对话框
- `tauri-plugin-notification` - 系统通知
