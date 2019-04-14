const createElement = (nodeName, // String / Function
props, // Object
...children) => {
  return {
    nodeName,
    props,
    children: children.flat()
  };
};
/*
  vnode {
    nodeName,
    props,
    children
  }
*/


const render = vnode => {
  // handle text vnode
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  } // handle function components


  if (typeof vnode.nodeName === "function") {
    return render(vnode.nodeName({ ...vnode.props,
      children: vnode.children
    }));
  } // create node


  let node = document.createElement(vnode.nodeName); // assign node attributes

  for (prop in vnode.props) {
    node.setAttribute(prop, vnode.props[prop]);
  } // render children


  for (let i = 0; i < vnode.children.length; i++) {
    node.appendChild(render(vnode.children[i]));
  }

  return node;
};

let state = {};

const setState = updatedState => {
  state = updatedState;
  /* Remove previously rendered component */

  const body = document.body;

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  document.body.appendChild(render(createElement(App, null)));
};

const App = () => createElement("div", null);

const initialState = {}; // Initial render.

setState(initialState);