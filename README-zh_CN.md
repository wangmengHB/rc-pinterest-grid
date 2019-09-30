# 瀑布流布局组件 rc-pinterest-grid（react 组件）
[English](./README.md) | 简体中文

功能特点：
1. 无需设置每个块的高度，块的高度可动态自适应计算出来。
2. 支持的每个块的高度 resize，当块的高度发生变化，布局能够自动更新
3. 支持自动响应式。
4. 支持精确自定义响应式布局。

![demo1](https://raw.githubusercontent.com/wangmengHB/rc-pinterest-grid/master/images/demo1.png)

## 安装
```
npm install --S rc-pinterest-grid
```

## 使用说明
```jsx
import PinterestGrid from 'rc-pinterest-grid';
```

```jsx
<PinterestGrid
  columns={4}               // how many columns in one row
  columnWidth={200}         // width of each block
  gutterWidth={10}          // horizontal gutter between each block
  gutterHeight={10}         // vertical gutter between each block
>
  <div key="A">A</div>
  <div key="B">B</div>
  <div key="C">C</div>
  {
    // ... more blocks here
  }
</PinterestGrid>
```
### PinterestGrid 参数列表说明
| 参数     | 说明     | 类型     |  是否必需  | 默认值 |
| :----- | :------- | :------- | :----- | :----- |
| columns | 瀑布流布局的列数 | number | true  | 4     |
| columnWidth | 瀑布流布局中每个块的宽度 | number | true | 200 |
| gutterWidth | 块之间的水平间隙 | number | false  | 10     |
| gutterHeight | 块之间的上下间隙 | number | false | 10  |
| responsive  | 是否需要页面响应式以及响应式相关配置  | boolean &#124; ResponsiveConfigObject &#124; undefined   | false  | false    |

#### ResponsiveConfigObject
```ts
export interface ResponsiveConfigObject {
  minPadding?: number;
  maxWidth?: number;
  customBreakPoints?: BreakPoint[];
}
```

说明：    
1. 如果 `responsive` 为 `false` 或不提供, 组件不会有响应式行为。     
2. 如果 `responsive` 为 `true`, 组件会使用默认的 min-padding 和 max-width 来计算响应式行为。        
3. 如果提供了 `responsive.minPadding`, 则组件会使用 `responsive.minPadding` 来计算响应式行为。      
4. 如果提供了 `responsive.maxWidth` , 则组件会使用 `responsive.maxWidth` 来计算响应式行为。   
5. 如果提供了 `responsive.customBreakPoints`, 则组件会完全使用自己提供的定制断点来进行响应式行为，不做额外的计算。  

### BreakPoint 对象
| 参数     | 说明     | 类型     |  是否必需  | 默认值 |
| :------- | :------- | :------- | :----- | :----- |
| minScreenWidth | 该断点的最小页面宽度，第一个断点的最小页面宽度值应为 0 | number | true  | 无     |
| maxScreenWidth | 该断点的最小页面宽度, 最后一个断点的最大页面宽度为 Infinity | number | true  | 无 |
| columnWidth  | 在该断点下，每个块的宽度  | number  | true  | 无    |
| columns | 在该断点下，布局的列数 | number | true   |   无   |


## 使用示例 1： 简单示例
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from 'rc-pinterest-grid';

const list = [1,2,3,4,5,6,7,8,9,10,11,12];

const Demo = () => (
  <PinterestGrid
    columns={4}             // 一共有多少列
    columnWidth={200}       // 列宽度
    gutterWidth={10}        // 块之间的水平间隙
    gutterHeight={10}       // 块之间的上下间隙
  >
    { // 此处放置需要渲染的块
      list.map((item, index) => (
        <div key={index} className={...} style={...}>
          ...
        </div>
      ))
    }
  </PinterestGrid>
)

ReactDOM.render(<Demo />, root);

```

## 使用示例 2：自动响应式
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from 'rc-pinterest-grid';

const list = [1,2,3,4,5,6,7,8,9,10,11,12];

const Demo = () => (
  <PinterestGrid
    columns={4}             // 一共有多少列
    columnWidth={200}       // 列宽度
    gutterWidth={10}        // 块之间的水平间隙
    gutterHeight={10}       // 块之间的上下间隙
    responsive={true}       // 是否响应式
  >
    { // 此处放置需要渲染的块
      list.map((item, index) => (
        <div key={index} className={...} style={...}>
          ...
        </div>
      ))
    }
  </PinterestGrid>
)

ReactDOM.render(<Demo />, root);
```
![demo2](https://raw.githubusercontent.com/wangmengHB/rc-pinterest-grid/master/images/demo2.png)
![demo3](https://raw.githubusercontent.com/wangmengHB/rc-pinterest-grid/master/images/demo3.png)


## 使用示例 3: 自定义响应式
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from 'rc-pinterest-grid';

const list = [1,2,3,4,5,6,7,8,9,10,11,12];

// 自定义断点，更精确地定义断点布局，不同的断点下可以重新定义列数和列宽度。
const breakPoints = [
  {
    minScreenWidth: 0,
    maxScreenWidth: 300,
    columns: 1,
    columnWidth: 200,
  },
  {
    minScreenWidth: 300,
    maxScreenWidth: 900,
    columns: 2,
    columnWidth: 300,
  },
  {
    minScreenWidth: 900,
    maxScreenWidth: Infinity,
    columns: 3,
    columnWidth: 600,
  },
]

const Demo = () => (
  <PinterestGrid
    columns={4}                                   // 一共有多少列
    columnWidth={200}                             // 列宽度
    gutterWidth={10}                              // 块之间的水平间隙
    gutterHeight={10}                             // 块之间的上下间隙
    responsive={{customBreakPoints:breakPoints}}  // 使用自定义断点模式
  >
    { // 此处放置需要渲染的块
      list.map((item, index) => (
        <div key={index} className={...} style={...}>
          ...
        </div>
      ))
    }
  </PinterestGrid>
)

ReactDOM.render(<Demo />, root);
```

## License
MIT