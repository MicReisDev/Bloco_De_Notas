const express = require("express"); 
const app = express(); //importaçã da instância express
const handlebars = require("express-handlebars") //framework - o "express-handlebars" é o especial para ser utilizado com o express
const bodyParse = require("body-parser") //utilizado para transferir os dados que foram enviados no Post de forma possível ser utilizado
const Post = require("./models/Posts") // modulo criado para postar no banco de dados

//bodyparser - serve para transferir os dados em do formulário em json, no caso é possível usar o 
app.use(bodyParse.urlencoded({extended:false})) //obrigatorio para formulários em POST
app.use(bodyParse.json()) //informa que os dados vão ser em json
//utilizando o req.body."name" que foi utilizado no input html.


//estilização
app.use(express.static("public"))

// o handlebars é como se fosse um framework e os seguintes comandos é para configurar, isso serve para que usar a função res.render
app.engine("handlebars", handlebars.engine({defaultLayout:"main"}));
app.set("view engine", "handlebars"); //definindo os .handlebars como extenção nativa. importante que deve estar os arquivos na parta views, tem que ter exatamente este nome.


//traçando rotas, o methodo post só pode ser acessado após um submit no fomulário, não da pra alterar o url e chegar nele, essa é a diferença por aqui.
app.get("/form",(req,res)=>{
  res.render("formulario") //o .render só funciona pq configuramos na função de cima, da pra usar com a extenção ejs tbm, mas temos que definir em cima.
});
app.get("/",(req,res)=>{
  Post.findAll({order:[["id","DESC"]]}).then((posts)=>{ //esse comando retorna o banco de dados inteiro em formato de objeto - os parametros servem para organizarmos como esse arquivo vem, no caso de forma decrescente e organizado pelo ID. 
    res.render('home', {posts: posts.map(posts  => posts.toJSON())}) // depois estamos nomeando o objeto e passando ele para a home da pag exibir posts:posts
    //por padrão de segurança o handlebars não deixa exibir o objeto que veio do banco de dados, então temos que primeiramente transformar o objeto em um json com a função toJSON()
  })

});

app.post("/adc",(req,res)=>{ //Normalmente trabalhamos com o a palavra get porem como estamos trabalhando com o metodo POST no formulário,tem que ser post aqui tambem
  Post.create({ //o post create é utilizado para criar uma postagem no banco de dados. a variavel Post vem de um require em outra pasta.
    titulo:req.body.titulo, //o caso está da seguinte forma, por conta do bodyparse quando clicamos em submit os valores são enviados pelo body, o conteudo é acessado "name" de cada campo no formulário
    conteudo:req.body.conteudo
  }).then(()=> { 
    res.redirect("/") //apos o post criado com sucesso é redirecinado para a raiz do site
    
    }).
    catch((error)=>res.send("Ocorreu o seguinte error: "+error))
    
});

//deletar posts
app.get("/deletar/:id",(req,res)=>{//estamos passando no /:id uma váriavel através do html para o backend

  Post.destroy({where:{"id":req.params.id}}).then(()=>{
    res.redirect("/") }).
  catch((error)=>console.log("ocorreu o seguinte erro" + error)) //comando para apagar posts.

})

//visualizar post
app.get("/visualizar/:id",(req,res)=>{
  Post.findAll({where:{id:req.params.id}}).then((nota)=>{res.render("nota",{nota:nota.map(nota  => nota.toJSON())})})
}) //essa rota não funcionou pq o estilo não estava pegando

//Comando que define o server e qual porta utilizar, importante usar portas com numerações altas pq podem já estar sendo utilizadas com numero baixos.
app.listen(8081,()=>{
  console.log("servidor rodando")
});

