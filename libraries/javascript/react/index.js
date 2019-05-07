// Decent start, need to update elems/attrs
// Also some general clean up

const createElement = (tag, attrs, ...children) => ({
  tag,
  attrs,
  children
});

const isFunction = (f) => f && f.bind;

const expandVDom = (vdom) => {
  if (typeof vdom === "string") {
    return vdom
  }
  const { tag, attrs, children = [] } = vdom
  if (isFunction(tag)) { 
    return expandVDom(tag({ ...attrs, children }));
  } else {
    return {
      tag,
      attrs,
      children: children.map(expandVDom)
    };
  }
};

const createDomNode = ({ tag, children }) => {
  if (!tag) {
    return null;
  }
  const elem = document.createElement(tag);
  if (children.length === 1 && typeof children[0] === "string") {
    elem.appendChild(document.createTextNode(children));
  }
  return elem;
};

const setAttributes = (elem, attrs) => {
  if (attrs) {
    Object.keys(attrs).forEach(k => {
      if (k === "style") {
        setAttributes(elem[k], attrs[k])
      } else {
        elem[k] = attrs[k]
      }
    })
  }
}

const elementToDom = ({ tag, attrs, children }) => {
  const elem = createDomNode({ tag, children });
  setAttributes(elem, attrs);
  const renderedChildren = children ? children.map(elementToDom).filter(x => x) : [];
  renderedChildren.forEach(c => elem.appendChild(c))
  return elem
}

const render = (elem, node) => {
  if (!node.children.length) {
    node.appendChild(elementToDom(expandVDom(elem)))
  } else {
    node.replaceChild(elementToDom(expandVDom(elem)), node.children[0])
  }
}

let callId = 0;
let states = []

const useState = (initialState) => {
  const currentCall = callId;
  callId += 1;

  if (states[currentCall]) {
    return states[currentCall]
  }

  const setState = (value) => {
    states[currentCall][0] = value;
    callId = 0;
    React.forceUpdate()
  }
  const tuple = [initialState, setState]
  states[currentCall] = tuple
  return tuple
}

const React = (() => {
  let _elem = null;
  let _node = null;

  return {
    render: (elem, node) => {
      _elem = elem;
      _node = node;
      return render(elem, node);
    },
    forceUpdate: () => {
      React.render(_elem, _node)
    },
    useState: useState
  }
})()

const Button = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount)
  const [error, setError] = useState(null)
  return createElement("button", {
    onclick: e => { 
      if (count >= 50) {
        setError("Error!")
      } else {
        setCount(count+1)
      }
    }
  }, String(error || count));
}

const elem = createElement(
  "div",
  {},
  createElement(Button, {initialCount: 0}),
  createElement(Button, {initialCount: 40}),
  createElement(
    "h1",
    { style: { color: "green" } },
    createElement("p", {}, "Hello World")
  )
)

React.render(elem, document.getElementById("app"));



