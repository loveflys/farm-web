# 项目结构

```
.
├── README.md : 说明入口文档
├── build : 构建脚本
├── docs : 文档目录
├── index.html
├── src : 主代码文件夹
│   ├── App.vue
│   ├── assets : 代码中会引用到的asset
│   ├── components : 通用的vue组件目录，不局限在某个页面内使用
│   │   └── CommonComponent1.vue : vue组件，命名方式采用PascalCase
│   │   └── CommonComponent2.vue
│   ├── libs : 一些并非通过npm引入的不能算是组件的库
│   ├── main.js : 入口文件
│   └── pages : 按照页面分目录存放
│       └── page1 : 一个页面的目录
│           ├── components : 通用的vue组件目录，不局限在某个页面内使用
│           │   └── Component1.vue : 指定页面内使用的组件
│           │   └── Component2.vue : 指定页面内使用的组件
│           ├── entry.vue
│           ├── entry.js
├── static: 静态文件夹
└── test : 测试相关目录
```