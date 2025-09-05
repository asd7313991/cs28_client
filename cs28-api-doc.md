# 🎯 CS28-API 接口文档（lottery 模块）

## 1. 健康检查
**接口：**  
```
GET /ping
```

**说明：**  
用于检测服务是否正常。

**返回示例：**
```json
{
  "msg": "pong"
}
```

---

## 2. 获取当前期信息
**接口：**  
```
GET /lottery/current?code=jnd28
```

**参数：**
- `code` (string) 必填 → 彩种代码（如 `jnd28`、`aus28` 等）

**返回示例：**
```json
{
  "code": "jnd28",
  "issue_code": "3331500",
  "open_time": "2025-09-05 13:41:30",
  "close_time": "2025-09-05 13:44:30",
  "lottery_time": "2025-09-05 13:45:00"
}
```

---

## 3. 获取上一期开奖结果
**接口：**  
```
GET /lottery/last?code=jnd28
```

**参数：**
- `code` (string) 必填 → 彩种代码

**返回示例：**
```json
{
  "code": "jnd28",
  "issue_code": "3331499",
  "open_time": "2025-09-05 13:38:00",
  "n1": 8,
  "n2": 9,
  "n3": 6,
  "sum_value": 23,
  "bs": 1,
  "oe": 1,
  "extreme": 0
}
```

字段说明：  
- `n1,n2,n3` → 三个开奖号码  
- `sum_value` → 和值  
- `bs` → 大小（1=大，2=小）  
- `oe` → 单双（1=单，2=双）  
- `extreme` → 极值（0=否，1=极大，2=极小）  

---

## 4. 获取历史开奖记录
**接口：**  
```
GET /lottery/history?code=jnd28&limit=10
```

**参数：**
- `code` (string) 必填 → 彩种代码  
- `limit` (int) 可选 → 返回条数，默认 10  

**返回示例：**
```json
{
  "code": "jnd28",
  "list": [
    {
      "issue_code": "3331498",
      "open_time": "2025-09-05 13:38:00",
      "n1": 1,
      "n2": 2,
      "n3": 1,
      "sum_value": 4,
      "bs": 2,
      "oe": 2,
      "extreme": 0
    },
    {
      "issue_code": "3331497",
      "open_time": "2025-09-05 13:34:30",
      "n1": 5,
      "n2": 0,
      "n3": 4,
      "sum_value": 9,
      "bs": 2,
      "oe": 1,
      "extreme": 0
    }
  ]
}
```
