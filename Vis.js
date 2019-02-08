// base code for filtering visualizations

class Vis{
  constructor(element){
    this.attributes = pp.attributes
    this.type = "base_vis"
    this.html = ""
    this.filter_state = "{}"
    this.element = element
    this.element.classList.add("vis")
    window.addEventListener("data", this.onData)
    window.addEventListener("filter", this.onFilter)
    this.data = []
    // TODO listen for new data event
    // TODO listen for filter event
  }
  // default render method
  render(){
    this.element.innerHTML = this.html
  }
  onData(data, fresh){
    if (fresh){
      this.data = data
    } else {
      this.data.push(data)
    }
    this.html = JSON.stringify(this.data) + JSON.stringify(this.filter_state)
    this.render()
  }
  onFilter(filter_state){
    this.filter_state = filter_state
    this.html = JSON.stringify(this.data) + JSON.stringify(this.filter_state)
    this.render()
  }
  filter(state){
    var event = new CustomEvent('filter', { filter: state });
    window.dispatchEvent(event)
  }
}

export default Vis
