## Context

当前 DNS 管理页面 (`/dns`) 是一个静态 UI 页面，仅展示硬编码的 DNS 服务器信息。后端已完全实现了 DNS 管理所需的 Tauri 命令：

- `get_dns_servers(service_name)` - 获取指定服务的 DNS 服务器列表
- `set_dns_servers(service_name, servers)` - 设置 DNS 服务器列表
- `flush_dns_cache()` - 刷新系统 DNS 缓存

前端需要集成这些后端命令，实现完整的 DNS 管理功能。参考现有的 Proxy 页面实现模式，保持 UI 风格和交互一致性。

## Goals / Non-Goals

**Goals:**
- 实现网络服务选择功能，允许用户选择要配置的特定网络服务
- 动态加载和显示选中服务的当前 DNS 服务器配置
- 支持添加、删除 DNS 服务器
- 支持保存 DNS 配置到系统
- 集成 DNS 缓存刷新功能
- 提供加载状态和操作反馈

**Non-Goals:**
- 修改后端 Tauri 命令（已完全实现）
- 实现多服务批量配置
- 实现 DNS 速度测试功能
- 预设公共 DNS 列表（Google DNS、Cloudflare 等）- 可在未来版本添加

## Decisions

### Decision: 使用本地状态管理
选择使用 React `useState` 和 `useEffect` 管理组件状态，而非添加到全局 Zustand store。

**Rationale**: DNS 配置是页面级别的临时状态，不需要跨页面共享。 Proxy 页面也采用相同模式。

**Alternative**: 使用 Zustand store - 过度设计，增加不必要的复杂性。

### Decision: 每个 DNS 变更立即验证格式
在添加到列表前验证 IP 地址格式。

**Rationale**: 尽早捕获错误，避免无效数据进入列表。

**Validation rules**:
- IPv4: 标准点分十进制格式
- IPv6: 标准冒号分隔格式（包括压缩形式 ::）

### Decision: 批量保存模式
用户添加/删除 DNS 服务器后，需要点击 "Save" 按钮才能生效。

**Rationale**:
- 允许用户在提交前确认更改
- 与系统网络配置交互是较重的操作，应避免误触
- 与 Proxy 页面保存模式保持一致

**Alternative**: 自动保存 - 可能导致频繁调用系统命令，增加失败风险。

### Decision: 错误处理策略
操作失败时显示通知，并保持当前 UI 状态允许重试。

**Rationale**: 网络配置操作可能因权限等原因失败，用户需要知道错误信息并能够重试。

## Risks / Trade-offs

**[Risk] 系统命令执行权限失败** → **Mitigation**: 捕获错误并显示用户友好的错误消息。Tauri 已配置好权限，但系统策略可能限制某些操作。

**[Risk] 无效 DNS 配置导致网络中断** → **Mitigation**: 这是系统级工具的预期行为，用户应有管理员权限意识。考虑将来添加配置备份/恢复功能。

**[Risk] 多服务配置冲突** → **Mitigation**: 当前仅支持单个服务配置，避免复杂性。macOS 网络服务优先级由系统管理。

## Migration Plan

无需数据迁移，这是新功能实现。部署步骤：
1. 实现前端 DNS 页面功能
2. 测试各后端命令集成
3. 验证错误处理流程
