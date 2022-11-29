const{request,response}=require('express')
const express=require('express')
var morgan=require('morgan')
const app=express();
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function (req, res) { 
 
  return   JSON.stringify(req.body)})
app.use( morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons=[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
app.get('/api/persons',(request,response)=>{
  response.json(persons)
  
})

app.get('/api/info',(request,response)=>{
  console.log(new Date());
const obj={
  title:`Phonebook has info for ${persons.length} peoples`,

  len:new Date()
}
  response.send(obj.title+ ' \n'+obj.len)
})
app.get('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
  console.log(id);
  const person=persons.find((pers)=>pers.id===id)
  if(!person){
    response.status(404).end()
  }
  response.json(person)
})
app.delete('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
   persons=persons.filter((pers)=>pers.id!==id)
  response.status(204).end()
})
app.post('/api/persons',(request,response)=>{
const body=request.body
const maxId=Math.max(...persons.map((person)=>person.id))
const dublicate=persons.find((pers)=>pers.name.toUpperCase()===body.name.toUpperCase())
if(!body.number||!body.name){
return response.status(404).json({
  error:"name or number is missing"
})
}
else if(dublicate){
  return response.status(404).json({error:"name already exist"})
}

const person={
  id:Math.floor(Math.random() * (100 - maxId) + maxId)+1,
  name:body.name,
  number:body.number
}

persons=persons.concat(person)
response.json(persons)
})
const port=3001
app.listen(port,()=>console.log(`server is running on port ${port}`))