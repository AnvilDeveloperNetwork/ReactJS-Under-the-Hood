const createElement = (nodeName, // String / Function
props, // Object
...children) => {
  return {
    nodeName,
    props,
    children: children.flat() // [["Hello, world"]] =>

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
/*
Need to flatten children because ...


*/


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

const darkGray = "#323135";
const styles = {
  ["dark"]: `background-color: ${darkGray}; color: white;`,
  ["light"]: `background-color: white; color: ${darkGray};`
};

const Box = ({
  children
}) => createElement("div", null, children);

const TitleBox = ({
  title,
  children
}) => createElement("div", {
  style: `padding: 2em; ${styles[state.theme]}`
}, createElement("h3", null, title), createElement(Box, null, children));

const toggleTheme = () => {
  if (state.theme === "dark") {
    setState({
      theme: "light"
    });
  } else {
    setState({
      theme: "dark"
    });
  }
};

const starters = [{
  name: "bulbasaur",
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
}, {
  name: "charmander",
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
}, {
  name: "squirtle",
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
}];

const App = () => createElement("div", {
  style: "text-align: center;"
}, createElement("button", {
  onclick: "toggleTheme()"
}, "Toggle Theme"), createElement(TitleBox, {
  title: "Pokemon"
}, starters.map(({
  name,
  img
}) => createElement("div", null, createElement("img", {
  src: img
}), createElement("p", null, name)))));

const initialState = {
  theme: "light"
}; // Initial render.

setState(initialState);