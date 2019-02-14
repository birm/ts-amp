// anything you add requiring vis
var $NODE_TYPES = {}
$NODE_TYPES.vis = Vis
// add other types

// initalize them
for (let type in $NODE_TYPES){
  let nodes = document.getElementsByTagName(type)
  for (let node of nodes){
    // hold onto a reference
    node.AMP = new $NODE_TYPES[type](node)
  }
}
