## ADDED Requirements

### Requirement: 网络服务列表展示
系统 SHALL 展示当前 macOS 系统中所有网络服务的列表，包括服务名称、硬件端口、设备标识、连接状态和优先级顺序。

#### Scenario: 成功获取网络服务列表
- **WHEN** 用户打开网卡管理页面
- **THEN** 系统调用 `networksetup -listallhardwareports` 获取所有硬件端口
- **AND** 系统调用 `networksetup -listnetworkserviceorder` 获取服务优先级
- **AND** 系统展示服务列表，按优先级排序
- **AND** 默认网络服务（优先级最高）显示特殊标记

#### Scenario: 获取网络服务失败
- **WHEN** 系统命令执行失败
- **THEN** 系统显示错误提示信息
- **AND** 用户可以点击重试按钮

### Requirement: 网络接口状态检测
系统 SHALL 检测每个网络接口的当前连接状态（已连接/未连接/不可用）。

#### Scenario: 检测 Wi-Fi 已连接
- **WHEN** Wi-Fi 网络服务处于连接状态
- **THEN** 系统显示绿色连接图标
- **AND** 显示 "已连接" 状态文本

#### Scenario: 检测以太网未连接
- **WHEN** 以太网接口存在但未插入网线
- **THEN** 系统显示灰色图标
- **AND** 显示 "未连接" 状态文本

#### Scenario: 检测接口不可用
- **WHEN** 网络接口硬件不存在或被禁用
- **THEN** 系统显示 "不可用" 状态

### Requirement: 网络服务优先级调整
系统 SHALL 允许用户通过拖拽方式调整网络服务的优先级顺序。

#### Scenario: 拖拽调整优先级成功
- **WHEN** 用户拖动某个网络服务到新位置
- **THEN** 系统调用 `networksetup -ordernetworkservices` 更新顺序
- **AND** 需要管理员权限时提示用户授权
- **AND** 更新成功后刷新列表显示

#### Scenario: 调整优先级失败
- **WHEN** 用户没有管理员权限或命令执行失败
- **THEN** 系统显示错误提示
- **AND** 列表恢复到原来的顺序

### Requirement: 添加网络服务
系统 SHALL 允许用户添加新的网络服务。

#### Scenario: 添加网络服务成功
- **WHEN** 用户点击 "添加服务" 按钮
- **THEN** 系统显示对话框，列出可用的硬件端口
- **AND** 用户选择硬件端口并输入服务名称
- **AND** 系统调用 `networksetup -createnetworkservice` 创建服务
- **AND** 创建成功后刷新列表

#### Scenario: 添加服务失败 - 服务名已存在
- **WHEN** 用户输入的服务名称已存在
- **THEN** 系统显示 "服务名称已存在" 错误提示

### Requirement: 移除网络服务
系统 SHALL 允许用户移除已有的网络服务。

#### Scenario: 移除网络服务成功
- **WHEN** 用户选择一个网络服务并点击 "移除服务"
- **THEN** 系统显示确认对话框
- **AND** 用户确认后，系统调用 `networksetup -removenetworkservice` 移除服务
- **AND** 移除成功后刷新列表

#### Scenario: 移除服务失败 - 唯一服务
- **WHEN** 用户尝试移除最后一个网络服务
- **THEN** 系统阻止操作并显示 "无法移除唯一的网络服务" 提示

#### Scenario: 移除服务需要确认
- **WHEN** 用户点击移除服务
- **THEN** 系统显示确认对话框，包含服务名称
- **AND** 用户必须明确确认才能执行移除

### Requirement: 刷新网络服务列表
系统 SHALL 提供手动刷新网络服务列表的功能。

#### Scenario: 手动刷新列表
- **WHEN** 用户点击 "刷新" 按钮
- **THEN** 系统重新获取所有网络服务信息
- **AND** 显示加载状态
- **AND** 更新列表展示
