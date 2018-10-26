// Because I didn't use a hash function,
// dispatch values must be immutable

function multi(fn) {
    let m = new Map();
    let defaultMethod = function(...args) {
        throw new Error(`No match found and no default, arguments: ${JSON.stringify(args)}`);
    } 
    function dispatcher(...args) {
        let value = fn(...args);
        if (value != undefined && m.has(value)) {
           return m.get(value)(...args); 
        } else {
            return defaultMethod(...args);
        }
    }
    dispatcher.method = (value, f) => {
        m.set(value, f);
        return this;
    }
    dispatcher.defaultMethod = (f) => {
        defaultMethod = f;
        return this;
    } 
    return dispatcher;
}

var circle = (radius) => ({ shape: 'circle', radius });
var rect = (width, height) => ({ shape: 'rect', width, height });

var area = multi(x => x.shape);

area.method('rect', r => r.width * r.height)
area.method('circle', c => 3.14 * (c.radius * c.radius))

area.defaultMethod(x => console.log('area'));

console.log(
   area(rect(4, 13))
);
console.log(
    area(circle(12))
);
area({shape: "thing"}, 3)

