// Decent start, need to update elems/attrs
// Also some general clean up

const createElement = (tag, attrs, children) => ({
  tag,
  attrs,
  children,
})

const createDomNode = ({ tag, children }) => {
  if (!tag) {
    return null;
  }
  const elem = document.createElement(tag);
  if (children.length === 1 && typeof children[0] === "string") {
    elem.appendChild(document.createTextNode(children))
  }
  return elem
}

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
  node.appendChild(elementToDom(elem))
}

const Input = () => 
  createElement("input", 
    {value: "jimmy", onkeypress: (e) => console.log(e)},
    [])

render(createElement("div", {}, [
  Input(),
  createElement("h1", {style: {color: "green"}},
    [createElement("p", {},
      ["Hello World"])])]),
  document.getElementById("app"))