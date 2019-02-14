// base code for filtering visualizations

class Vis{
  constructor(element){
    this.dataArray = []
    this.attributes = element.attributes
    this.type = "base_vis"
    this.html = ""
    this.filter_state = "{}"
    this.element = element
    this.element.classList.add("vis")
    window.addEventListener("data", {parent: this, handleEvent:this.onData})
    window.addEventListener("filter", {parent: this, handleEvent:this.onFilter})
    // TODO listen for new data event
    // TODO listen for filter event
  }
  // default render method
  render(){
    this.element.innerHTML = this.html
  }
  onData(event, fresh){
    let self = this.parent || this
    let data = event.detail
    if (fresh){
      self.dataArray = data
    } else {
      self.dataArray.push(data)
    }
    self.html = JSON.stringify(self.dataArray) + JSON.stringify(this.filter_state)
    self.render()
  }
  onFilter(event){
    let filter_state = event.detail
    self.filter_state = filter_state
    self.html = JSON.stringify(self.dataArray) + JSON.stringify(this.filter_state)
    self.render()
  }
  filter(state){
    var event = new CustomEvent('filter', { filter: state });
    window.dispatchEvent(event)
  }
}
