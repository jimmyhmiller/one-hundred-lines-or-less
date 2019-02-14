// Decent start, need to update elems/attrs
// Also some general clean up

const createElement = (tag, attrs, ...children) => ({
  tag,
  attrs,
  children
});

let currentComponent = 0;
let stateContainers = new Map();

const dispatcher = (() => {
  let subscribers = []
  return {
    subscribe: (f) => {
      subscribers.push(f)
    },
    notify: () => {
      subscribers.forEach(f => f())
    }
  }
})()

const useState = (initialState) => {
  const scomp = String(currentComponent)
  if (!stateContainers.has(scomp)) {
    stateContainers.set(scomp, initialState)
  }
  const current = stateContainers.get(scomp)
  const setState = (value) => {
    stateContainers.set(scomp, value)
    dispatcher.notify()
  }
  return [current, setState]
}

const expandVDom = (vdom) => {
  if (typeof vdom === "string") {
    return vdom
  }
  const { tag, attrs, children = [] } = vdom
  if (tag && tag.bind) {
    currentComponent += 1;
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
  const innerRender = () => {
    if (!node.children.length) {
      node.appendChild(elementToDom(expandVDom(elem)))
    } else {
      node.replaceChild(elementToDom(expandVDom(elem)), node.children[0])
    }
    currentComponent = 0;
  }
  dispatcher.subscribe(innerRender)
  innerRender();

}

const Button = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount)
  return createElement("button", {
    onclick: e => setCount(count+1)
  }, String(count));
}

const elem = createElement(
  "div",
  {},
  createElement(Button, {initialCount: 0}),
  createElement(Button, {initialCount: 10}),
  createElement(
    "h1",
    { style: { color: "green" } },
    createElement("p", {}, "Hello World")
  )
)

render(elem, document.getElementById("app"));



