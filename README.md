# React.JS: Under the Hood
___

## Introduction

Our goal with the Anvil Developer Network is not just putting a focus on learning how to use development tools, but to gain a better understanding of how they actually work. So in the spirit of that goal, today, we'll be learning how to build our own version of React, a library that often gets credit for having a lot of "magic" going on beind the scenes.

This talk has a github repo to support it which contains the final code and a README that contains many of the steps to follow through building react on your own machine. I would recommend pulling that up so that you can copy and paste some of the setup.

## Pre-reqs

Some prereqs to fully understand this talk are Javascript, React, npm ecosystem, and the
document api. If you aren't super familiar with some of these you will likely still be able
to follow if you ASK QUESTIONS!

## What do we know about React

Ok so let's begin by going over what we know about react. Well we know this is react, and this, and this. (showing pictures). React, simply put, lets us write javascript classes/functions that return an HTML-like elements that can be rendered to a webpage. But that isn't totally true and we'll see why very soon.

## Key Elements of React

The two most important things React provides us are...
1. a way to declare ui elements
2. a way to render these elements to the DOM.

By the end of this talk we will have written enough react support to do both of these things!
(and maybe more if time allows)

## Demystifying JSX

To start, let's focus on creating UI elements. But before we do we need to understand what that
HTML syntax really is. It's actually called JSX and it's totally separate from React. It's
very often used with React, but has nothing to do with React itself. JSX is just an HTML-like
syntax that is "transpiled" (converted) to plain JS. This transpilation (syntax conversion) can
be done by many tools, but the most common JSX transpiler is called, Babel. (show the babel page)

Notice the plain javascript. We now see a reference to React! React.createElement is what is
being called to actually create out UI elements. This function is what we'll be reimplementing
to create our UI elements.

## Setup Specs

Alright let's do some setup and start building. We need the following things to pull this off...
node v9
npm v6
Babel JSX transpiler


## Project Setup

#### File Structure Setup

`mkdir react`

`cd react && npm init`

`mkdir src/`

`touch src/index.js`

#### Babel Installation & Setup

`npm install --save-dev @babel/core @babel/cli @babel/plugin-transform-react-jsx`

`touch .babelrc`

.babelrc

```
{
  "plugins": [["@babel/plugin-transform-react-jsx"]]
}
```

Add the following to scripts in package.json
`"build": "babel src -d lib"`


#### Testing our Setup

Type the following into `src/index.js`

```javascript
const App = () => (
	<div>
		<ul>
			<li>Apples</li>
			<li>Oranges</li>
		</ul>
	</div>
)
```

`npm run build`

Open the `lib/index.js` to find the transpiled version of our `src` folder files


#### Quick fixup

The JSX tags are currently being transpiled to a function call to React.createElement, but we're
just going to call our version createElement. To change this we will add a pragma to our jsx
babel plugin. Update your `.babelrc` to look like this...

```
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
	    "pragma": "createElement"
      }
    ]
  ]
}
```

## Webpage setup (let's use our lib/index.js file)

`touch index.html`

Add the following to your `index.html` file

```html
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <title>react</title>
    </head>
    <body></body>
    <!-- USE OUR lib/index.js SCRIPT -->
    <script type="text/javascript" src="lib/index.js"></script>
  </html>
```


## createElement Usage & Implementation

First, let's look at how createElement is being used. We see the first
argument is the name of the element or a function. The second argument,
although null in this example will be an object of the props passed to
the element. And all remaining arguments are the children of the UI
element. (show example of having more than one child)

## What is createElement Actually Creating? 

What are we actually creating here? Well, all we really want in return from calling createElement is a javascript object that describes the UI element so that we can render it as a plain
HTML element (DOM node).

*Walkthrough full pipeline of how createElement is used and what it will produce.

## First implementation of createElement

Our function accepts the nodeName, props, and a list of children. I'm using a "spread" operator here on children. All that does is store all arugments after props as a single array.

Then I'm just returning those things inside a plain js object.
If it isn't clear where this gets us, don't worry. We're just scaffolding out all the properies needed for a UI element.

## What's left? (Render Intro) 

So, what's left to do? Well, we have our UI element "created"...we just need to render it to the DOM. The DOM or document object model is a javascript object that is used to represent the current webpage. It's the object your browser uses to properly render the page and you can access it using the global `document` variable.

This is what we've been using for react. ReactDOM.render. so we're going to write our own version of this which will complete the core functionality of react.


## Render Boilerplating

Ok so here is some boilerplate for what our render function will do. The only argument to our render function will be a DOM node retuned from a call to createElement.

First, we need to create an actual DOM node using the document api. You may recognize the document object from using something like `document.getElementById()`. This document object offers a lot more functionality that you can find [here](https://developer.mozilla.org/en-US/docs/Web/API/Document).

Next, well assigning our components props as HTML attributes on the new DOM node we've created.

Then we need to render any children the component has, and after doing this we can just return our DOM node.

## Render Special Cases

This looks good, but we have a few issues.

1.) This doesn't handle a specific case for rendering children.

Imagine the case when our child element is just plain text. If we look inside our existing render function we see that we recursively call render on each child, so the child being passed to render may just be a string. We will handle this case by just creating a textNode and returning it.

2.) We aren't accounting for function components
In the case that we're using a function component, our vnode.nodeName will be of type function. In which case we need to call that function and pass it the props and children.


## Example Use Case


```
const Card = ({ title, text }) => (
  <div>
      <h2>{title}</h2>
      <p>{text}</p>
  </div>
)

const App = () => (
  <div>
      <Card title="Card One" text="this is card one!" />
      <Card title="Card Two" text="this is card two!" />
  </div>
)


// render app to the document body
document.body.appendChild(render(<App />))
```

Let's use what we've built so far. Here we have a Card component and our App component. Pretty simple components, and to actually render these to the page we're appending the render of `App` to the document body.


### Issue with using React children

We do have an issue on our hands when we try rendering children

```
const Card = ({ children }) => (
  <div>
    {children}
  </div>
);

const App = () => (
  <Card>
   Hello, world
  </Card>
);
```
Error walkthrough:

When transpiled this will translate our `Card` component into

createElement("div", null, ["Hello, world"])

this call returns us the following

{
  nodeName: "div",
  props: null
  children: [["Hello, world"]]  <-- this is the issue
}

Because of the nested array we'll eventually try to render 
the inner array as if it were a node. One possible solution to fix this is to change our createElement a bit...

const createElement = (
  nodeName, // String / Function
  props, // Object
  ...children
) => {
  return {
    nodeName,
    props,
    children: children.flat()  // <-- the fix
  };
};

Array.flat() compresses inner arrays by a single level

Example:

```
[1, [2, 3]].flat()
// => [1, 2, 3
```

## Pokedex Application

Our element creation and rendering are both working as expected. Now, we can write a more useful application.

```
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

const Box = ({ children }) => {
	return ( 
		<div>{children}</div> 
	);
}

const TitleBox = ({ title, children }) => {
	return (
	  <div style={`padding: 2em;`}>
	    <h3>{title}</h3>
	    <Box>{children}</Box>
	  </div>
	);
}

const App = () => { 
	return (
	  <div style={"text-align: center;"}>
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
}

document.body.appendChild(render(<App />))
```


## Implementing (a wildly inefficient) application state manager

Another important feature of any UI library is state management. We're going to build a quick example of global state management for our version of react. Anytime the state is updated we will completely rerender our page.


```
let state = {}

function setState(newState) {
	state = newState
	
	/* remove existing child nodes in body */
	let body = document.body
	while (body.firstChild) {
    	body.removeChild(body.firstChild);
  	}
  	
  	document.body.appendChild(render(<App />))
}
```

Adding a theme toggle to our Pokemon App

```
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

// function to toggle our theme state
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

const App = () => { 
	return (
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
}

const initialState = {
  theme: "light"
};

// Initial render.
setState(initialState);
```















