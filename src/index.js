const createElement = (
  nodeName, // String / Function
  props, // Object
  ...children
) => {
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
  }

  // handle function components
  if (typeof vnode.nodeName === "function") {
    return render(vnode.nodeName({ ...vnode.props, children: vnode.children }));
  }

  // create node
  let node = document.createElement(vnode.nodeName);

  // assign node attributes
  for (prop in vnode.props) {
    node.setAttribute(prop, vnode.props[prop]);
  }

  // render children
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

  document.body.appendChild(render(<App />));
};

const starters = [
  {
    name: "bulbasaur",
    img:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  {
    name: "charmander",
    img:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  },
  {
    name: "squirtle",
    img:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
  }
];

const darkGray = "#323135";
const styles = {
  ["dark"]: `background-color: ${darkGray}; color: white;`,
  ["light"]: `background-color: white; color: ${darkGray};`
};

const toggleTheme = () => {
  if (state.theme === "dark") {
    setState({ theme: "light" });
  } else {
    setState({ theme: "dark" });
  }
};

const Box = ({ children }) => <div>{children}</div>;

const TitleBox = ({ title, children }) => (
  <div style={`padding: 2em; ${styles[state.theme]}`}>
    <h3>{title}</h3>
    <Box>{children}</Box>
  </div>
);

const App = () => (
  <div style={"text-align: center;"}>
    <button onclick={"toggleTheme()"}>Toggle Theme</button>
    <TitleBox title={"Pokemon"}>
      {starters.map(({ name, img }) => (
        <div>
          <img src={img} />
          <p>{name}</p>
        </div>
      ))}
    </TitleBox>
  </div>
);

const initialState = {
  theme: "light"
};

// Initial render.
setState(initialState);
