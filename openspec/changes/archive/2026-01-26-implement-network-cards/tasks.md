## 1. 后端实现 (Rust)

- [x] 1.1 扩展 `NetworkService` 结构体，添加 `status` 字段表示连接状态
- [x] 1.2 实现 `get_interface_status` 函数，使用 `ifconfig` 检测接口状态
- [x] 1.3 更新 `get_network_services` 命令，返回包含状态的完整服务信息
- [x] 1.4 实现 `set_service_order` 命令，调用 `networksetup -ordernetworkservices`
- [x] 1.5 实现 `create_network_service` 命令，调用 `networksetup -createnetworkservice`
- [x] 1.6 实现 `remove_network_service` 命令，调用 `networksetup -removenetworkservice`
- [x] 1.7 实现 `get_available_hardware_ports` 命令，获取可用于创建新服务的硬件端口
- [x] 1.8 在 `lib.rs` 中注册所有新命令

## 2. 前端 API 层

- [x] 2.1 在 `network-api.ts` 中添加 `setServiceOrder` 函数
- [x] 2.2 在 `network-api.ts` 中添加 `createNetworkService` 函数
- [x] 2.3 在 `network-api.ts` 中添加 `removeNetworkService` 函数
- [x] 2.4 在 `network-api.ts` 中添加 `getAvailableHardwarePorts` 函数
- [x] 2.5 更新 `NetworkService` 接口，添加 `status` 字段

## 3. 状态管理

- [x] 3.1 在 `network-store.ts` 中添加 `availableHardwarePorts` 状态
- [x] 3.2 添加 `reorderServices` action 用于乐观更新
- [x] 3.3 添加 `addService` 和 `removeService` actions
- [x] 3.4 添加错误处理状态 `error` 和 `setError`

## 4. UI 组件开发

- [x] 4.1 创建 `NetworkServiceItem` 组件，展示单个服务信息和状态图标
- [x] 4.2 创建 `NetworkServiceList` 组件，使用 `@dnd-kit/sortable` 实现拖拽排序
- [x] 4.3 创建 `AddServiceDialog` 对话框组件
- [x] 4.4 创建 `RemoveServiceDialog` 确认对话框组件
- [x] 4.5 安装 `@dnd-kit/core` 和 `@dnd-kit/sortable` 依赖

## 5. 页面集成

- [x] 5.1 重构 `NetworkCardsPage`，集成网络服务列表组件
- [x] 5.2 实现页面加载时自动获取服务列表
- [x] 5.3 实现刷新按钮功能
- [x] 5.4 实现拖拽排序交互和后端同步
- [x] 5.5 实现添加服务流程
- [x] 5.6 实现移除服务流程
- [x] 5.7 添加加载状态和错误提示 UI

## 6. 测试与验证

- [ ] 6.1 手动测试：获取网络服务列表
- [ ] 6.2 手动测试：拖拽调整优先级（需管理员权限）
- [ ] 6.3 手动测试：添加网络服务
- [ ] 6.4 手动测试：移除网络服务
- [ ] 6.5 测试错误场景：权限不足、命令失败等
