class Ingest{
  constructor(source, dest, time_key, settings){
    // source in is a function or url
    // this.source is function which returns a promise (which resolves with a flat json)
    // the function is used to customize or generate things like time key, or to flatten the json
    // can also be used to make composite or computed variables (e.g. ln(x)+y**2)
    // TODO consider splitting out some of this functionality?
    if (source instanceof Function){
      this.source = source
    } else {
      this.source = function(){
        return fetch(source, {mode: "cors"}).then(x=>x.json())
      }
    }
    // time_key in where to find the time key, default to '_time'
    // each record is expected to have a unique time key, and they should order correctly
    this.time_key = time_key
    // dest in is a idb name
    // this.save is a function which takes in the record data and saves it
    this.dest = dest
    this.db = idb.openDb(this.dest, 1, x=>{
      if (!x.objectStoreNames.contains('records')) {
        let idb_opts = { keyPath: this.time_key }
        // if time key is not set, autoindex
        if (! this.time_key){
          idb_opts = {autoIncrement : true}
        }
        let recordStore = x.createObjectStore("records", idb_opts);
      }
    })

    // SETTINGS
    this.settings = settings || {}
    this.frequency = this.settings.frequency || 5000
    this.max_size = this.settings.max_size // (falsy means no max, use with care)
    // whether or not to run _update on interval
    this.active = false
  }
  save(records){
    // if it's not an array, make it an array with one element for foreach
    if (! records instanceof Array){
      records = [records]
    }
    return this.db.then(x=>{
      let tx = x.transaction('records', 'readwrite')
      var store = tx.objectStore('records')
      records.forEach(x=>store.add(x))
    })
  }
  init(catch_up){
    // is catch up a nothing, a url, or function?
    // if nothing, do not try to catch up
    // if a function, it should do what the source function you set did, but for all records
    // if a url, then get it
    if (catch_up){
      if (catch_up instanceof Function){
        catch_up().then(this.save)
      } else {
        fetch(catch_up, {mode: "cors"}).then(x=>x.json()).then(this.save)
      }
    }
    this.active=true
    // every this.frequency, run update
    window.setInterval(x=>{
      if (this.active){
        this._update()
      }
    }, this.frequency)
  }
  _update(){
    // get the record
    this.source().then(record=>{
      this.save([record]).then(x=>{
        // emit a "new record" event of some sort
        var event = new CustomEvent('ingest', { data: record });
        window.dispatchEvent(event)
      })
    })
  }
}
