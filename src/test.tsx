import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from './index';

const root = document.createElement('div');
document.body.appendChild(root);

const columns = 4;
const columnWidth = 200;
const gutterWidth = 10;
const gutterHeight = 20;


const createRandomBlock = (key, props: any) => {
  const str = 'this is  a test txt';
  return (
    <div key={key} data-height={50} {...props} style={{border: 'solid 1px red'}}>
      <div>
        {str.repeat(Math.floor(Math.random()* 5))}
      </div>
      <img style={{width:'100%'}} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564391822552&di=67f3e85dc3901ffda923afa8e1db4508&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fb2b56243415c67144c787aebd84ed278f929cae83e2a-7lhIZy_fw658"/>
      <div>
        {str.repeat(Math.floor(Math.random() * 20))}
      </div>
    </div>
  );
}

const COUNT = 5;

class Demo extends React.PureComponent {

  state = {
    list: addRandomBlock(COUNT),
  }
  
  addMore = () => {
    const { list } = this.state;
    const more = addRandomBlock(COUNT);
    const next = [].concat(list, more);
    this.setState({
      list: next
    })
  }

  render() {
    const { list } = this.state;
    return (
      <div>
        <PinterestGrid 
          style={{border: 'solid 2px black'}} 
          columns={columns} 
          columnWidth={columnWidth} 
          gutterWidth={gutterWidth} 
          gutterHeight={gutterHeight}
        >
          { list }
        </PinterestGrid>
        <button 
          style={{ position: 'fixed', top: 100, right: 200, fontSize: 48}} 
          onClick={this.addMore}
        >
          追加记录
        </button>
      </div>
    )
  }
}

let uid = 0;
function addRandomBlock(count) {
  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(createRandomBlock(uid++, {height: 1000}));
  }
  return res;
}




ReactDOM.render(<Demo />, root);


