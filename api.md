<!--
 * @Author: diaochan
 * @Date: 2025-03-16 19:42:26
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-20 08:51:41
 * @Description: 
-->
### 任务详情
- **响应示例**：
```json
  {
    id: 3, // 任务ID
    taskName: "任务2", // 任务名称
    taskStatus: "not_started",  // 任务状态
    channelId: 5,  // 相关联的渠道ID
    channelName: "Instagram", // 相关联的渠道名称
    channelIcon: "http://localhost:3002/uploads/1742035638017-828581327.png", // 相关联的渠道图标
    reward: "100.00",  // 添加任务时设置的任务奖励
    category: "旅行",  // 添加任务时设置的达人领域
    taskType: "image_text",  // 添加任务时设置的任务类型
    fansRequired: "3000万+",  // 添加任务时设置的粉丝要求
    startTime: "2025-03-16 07:34:52", // 添加任务时设置的任务开始时间
    endTime: "2025-03-16 15:36:20",  // 添加任务时设置的任务结束时间
    unlimitedQuota: true,   // 是否限制任务名额
    quota: 5,   // 任务名额
    groupMode: 1,  // 是否指定群组
    groupIds: [5],  // 指定群组ID
    createTime: "2025-03-16 15:36:20",
  }
  ```

### 编辑个人信息
- **请求参数**：
```json
  {
    id: 1,
    avatar: '', // 头像
    nickname: '', // 昵称
    gender: 0, // 性别 0:男 1:女 2:保密 使用系统枚举常量定义（如果没有则添加）
    occupation: 'Housewife', // 职业 使用系统枚举常量定义
    email: '', // 电子邮箱
    phone: '', // 手机号码
    telegram: '', // Telegram
  }
  ```

### 获取以该会员为群主的群列表
- **响应示例**：
```json
  {
    id: 1,
    groupName: '', // 群名称
  }
  ```