# ts-amp
Browser Time Series Analysis Tool


## bad sample usage
let src = 'https://jsonplaceholder.typicode.com/todos/1'
let dest = 'todo'
let I = new Ingest(src, dest)
let R = new Read(dest)
I.init()
... some time passes...
R.readAll().then(console.log)
