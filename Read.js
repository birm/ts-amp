class Read{
  constructor(database){
    this.db = idb.openDb(database, 1)
  }
  read(key){
    return this.db.then(x=>{
      return x.transaction('records').objectStore('records', 'readonly').get(key)
    })
  }
  readAll(){
    return this.db.then(x=>{
      return x.transaction('records').objectStore('records', 'readonly').getAll()
    })
  }
}
