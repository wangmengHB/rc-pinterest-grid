# 瀑布流布局组件 rc-pinterest-grid（react 组件）
功能特点：
1. 无需设置每个块的高度，块的高度可动态自适应计算出来。
2. 支持的块尺寸的 resize，当块的高度发生变化，布局能够自动更新
3. 支持自动响应式。
4. 支持精确自定义响应式布局。

# 安装
```
npm install --S rc-pinterest-grid
```
说明：  
1. rc-pinterest-grid 依赖两个第三方npm：
  * resize-observer-polyfill, (ResizeObserver 的 Polyfill)  
  * enquire.js (借助它实现相应式)
在运行安装指令时，这两个依赖项会自动安装。  
2. rc-pinterest-grid 是基于 react 的组件. 在使用环境中，用户应该在自己的工程中安装 react 和 react-dom。


# 使用说明
### PinterestGrid 参数列表说明
| 参数     | 说明     | 类型     |  是否必需  | 默认值 |
| :------- | :------- | :------- | :----- | :----- |
| columns | 是否展开，仅表单模式无需 | number | true  | 4     |
| columnWidth | 用于Drawer、Modal标题 | number | false   | 无     |
| gutterWidth | 素材，详情见下方 | Material | number  | {}     |
| gutterHeight | 关联内容是否仅能阅读 | number | false | true  |
| responsive  | 是否需要页面响应式  | number  | false  | 无    |
| breakPoints | 自定义页面断点对象列表，只有当 responsive 参数存在时生效 | BreakPoint[] | undefined | false   |   无   |
说明： 当 responsive 为 true 时，如果不提供自定义的断点列表 breakPoints, 则按照默认的方法计算页面的响应式。当 responsive 为 true 并且 breakPoints 存在时，按照自定义的响应式进行布局。

### BreakPoint 对象
| 参数     | 说明     | 类型     |  是否必需  | 默认值 |
| :------- | :------- | :------- | :----- | :----- |
| minScreenWidth | 该断点的最小页面宽度，第一个断点的最小页面宽度值应为 0 | number | true  | 无     |
| maxSceenWidth | 该断点的最小页面宽度, 最后一个断点的最大页面宽度为 Infinity | number | true  | 无 |
| columnWidth  | 在该断点下，每个块的宽度  | number  | true  | 无    |
| columns | 在该断点下，布局的列数 | number | true   |   无   |


# 使用示例 1： 简单示例
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from 'rc-pinterest-grid';

const list = [1,2,3,4];

const Demo = () => (
  <PinterestGrid
    columns={columns}             // 一共有多少列
    columnWidth={columnWidth}     // 列宽度
    gutterWidth={gutterWidth}     // 块之间的水平间隙
    gutterHeight={gutterHeight}   // 块之间的上下间隙
    responsive={true}             // 是否响应式
  >
    { // 此处放置需要渲染的块
      list.map((item, index) => (
        <div key={index}>{item} </div>
      ))
    }
  </PinterestGrid>
)

ReactDOM.render(<Demo />, root);

```

# 使用示例 2：自动响应式


# 使用示例 3: 自定义响应式


