require ../Vis.js as Vis
// anything you add requiring vis
var $NODE_TYPES = {}
$NODE_TYPES.Vis = Vis
// add other types

// initalize them
for (let type in $NODE_TYPES){
  let nodes = document.getElementByTagName(type)
  for (let node of nodes){
    new $NODE_TYPES[type](node)
  }
}
