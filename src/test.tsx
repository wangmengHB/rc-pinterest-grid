import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from './Pinterest/Grid';

const root = document.createElement('div');
document.body.appendChild(root);

const columns = 4;
const columnWidth = 200;
const gutterWidth = 10;
const gutterHeight = 20;

const counts = 20;



const random = (key, props: any) => {
  const str = 'this is  a test txt';
  return (
    <div key={key} data-height={50} {...props} >
      <div>
        {str.repeat(Math.floor(Math.random()* 5))}
      </div>
      <img style={{width:200}} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564391822552&di=67f3e85dc3901ffda923afa8e1db4508&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fb2b56243415c67144c787aebd84ed278f929cae83e2a-7lhIZy_fw658"/>
      <div>
        {str.repeat(Math.floor(Math.random() * 20))}
      </div>
    </div>
  );
}

const app = () => {
  const res = [];
  for (let i = 0; i < 20; i++) {
    res.push(random(i, {height: 1000}));
  }
  return (
    <PinterestGrid columns={columns} columnWidth={columnWidth} gutterWidth={gutterWidth} gutterHeight={gutterHeight}>
      { res}
    </PinterestGrid>
  )
}


ReactDOM.render(app() as any, root);


