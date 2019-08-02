import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PinterestGrid from './index';

const root = document.createElement('div');
document.body.appendChild(root);

const columns = 4;
const columnWidth = 200;
const gutterWidth = 10;
const gutterHeight = 20;
const COUNT = 5;



const str = 'this is  a test txt. ';
class TestBlock extends React.Component{
  state = {
    count: 0,
    header: str.repeat(Math.floor(Math.random()* 5)),
    body: str.repeat(Math.floor(Math.random()* 20))
  }

  addRow = () => {
    const { count } = this.state;
    this.setState({count: count + 1})
  }

  render() {
    const { count, header, body } = this.state;

    const rows: any[] = [];
    for (let i = 0; i < count; i++) {
      rows.push((<div key={i}>{i} row</div>));
    }

    
    return (
      <div {...this.props} style={{border: 'solid 1px red'}}>
      <div>
        {header}
      </div>
      <img style={{width:'100%'}} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564391822552&di=67f3e85dc3901ffda923afa8e1db4508&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fb2b56243415c67144c787aebd84ed278f929cae83e2a-7lhIZy_fw658"/>
      <div>
        {body}
      </div>
      <div>
        <button onClick={this.addRow}>Add row</button>
      </div>
      {
        rows
      }
      
    </div>
    )
  }
}

const createRandomBlock = (key: string | number, props: any): any => {
  
  return (
    <TestBlock key={key} {...props}/>
  );
}

let uid = 0;
function addRandomBlock(count: number) {
  const res: any = [];
  for (let i = 0; i < count; i++) {
    res.push(createRandomBlock(uid++, {}));
  }
  return res;
}


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

  replace = () => {
    this.setState({
      list: addRandomBlock(COUNT),
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
          style={{ position: 'fixed', top: 100, right: 200, fontSize: 30}} 
          onClick={this.addMore}
        >
          追加记录
        </button>
        <button 
          style={{ position: 'fixed', top: 150, right: 200, fontSize: 30}} 
          onClick={this.replace}
        >
          替换记录
        </button>
      </div>
    )
  }
}






ReactDOM.render(<Demo />, root);

