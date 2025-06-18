import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const port = 4000;
const app = express();

let listaEquipe = [];
let listaJogador = [];
let usuarioLogado = false;


app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false
    }
}));
 
const menu = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Menu</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/cadastrarEquipe">Cadastrar Equipe</a></li>
            <li class="nav-item"><a class="nav-link" href="/cadastrarJogador">Cadastrar Jogador</a></li>
            <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
    `;



app.get("/",verificarAutenticacao, (req, res) => {
  const ultimoLogin = req.cookies.ultimoLogin;
     
  res.send(`
     
    <!DOCTYPE html>
    <html><head>
      <meta charset="UTF-8">
      <title>Home</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body><nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Menu</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/cadastrarEquipe">Cadastrar Equipe</a></li>
            <li class="nav-item"><a class="nav-link" href="/cadastrarJogador">Cadastrar Jogador</a></li>
            <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
            <li class="nav-item">
            <span class="navbar-text nav-link disabled">${ultimoLogin ? "Último acesso: " + ultimoLogin : ""}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  
    <div class="container mt-5"><h1>Bem-vindo!</h1></div>
    </body></html>
  `);
});

// ---------------- Equipes ----------------
app.get("/cadastrarEquipe",verificarAutenticacao, (req, res) => {
  res.send(`
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Cadastro de Equipe</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5">
      <form method="POST" action="/cadastrarEquipe" class="border p-4">
        <fieldset><legend>Cadastro de Equipe</legend>
          <div class="mb-3"><label>Nome da Equipe</label><input id="equipe" type="text" name="nomeEquipe" class="form-control"></div>
          <div class="mb-3"><label>Nome do Tecnico</label><input id="tecnico" type="text" name="tecnico" class="form-control"></div>
          <div class="mb-3"><label>Telefone do Tecnico</label><input id="nomeTecnico" type="tel" name="telefoneTecnico" class="form-control"></div>
          <button type="submit" class="btn btn-primary">Cadastrar</button>
        </fieldset>
      </form></div></body></html>
  `);
});

app.post("/cadastrarEquipe",verificarAutenticacao, (req, res) => {
  
  const equipe = req.body.nomeEquipe;
  const nomeTecnico = req.body.tecnico;
  const telefoneTecnico = req.body.telefoneTecnico;

  let erros = {
    equipe: !equipe ? "Nome de equipe obrigatorio" : "",
    nomeTecnico: !nomeTecnico ? "Nome do tecnico obrigatorio": "",
    telefoneTecnico: !telefoneTecnico ? "Telefone e obrigatorio": "",
  }
  
  const temErros = Object.values(erros).some(msg => msg !== "");

  if(!temErros){
    
    listaEquipe.push({
      equipe: equipe,
      nomeTecnico: nomeTecnico,
      telefoneTecnico: telefoneTecnico,
    });
    res.redirect("/listaEquipe")
  
  }
  else{
    let html =  `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Cadastro de Equipe</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5">
      <form method="POST" action="/cadastrarEquipe" class="border p-4">
        <fieldset><legend>Cadastro de Equipe</legend>
        `;html +=`<div class="mb-3"><label>Nome da Equipe</label><input value="${equipe || ""}"id="equipe" type="text" name="nomeEquipe" class="form-control">
          ${erros.equipe ?` <span class="text-danger">${erros.equipe}</span> `: ""}</div>
          
          <div class="mb-3"><label>Nome do Tecnico</label><input value="${nomeTecnico || ""}" id="tecnico" type="text" name="tecnico" class="form-control">
          ${erros.nomeTecnico ?` <span class="text-danger">${erros.nomeTecnico}</span> `: ""}</div>

          <div class="mb-3"><label>Telefone do Tecnico</label><input value="${telefoneTecnico || ""}" id="nomeTecnico" type="tel" name="telefoneTecnico" class="form-control">
          ${erros.telefoneTecnico ?` <span class="text-danger">${erros.telefoneTecnico}</span>` : ""}</div>
          
          <button type="submit" class="btn btn-primary">Cadastrar</button>`
        ; html +=`  
        </fieldset>
      </form>
    </div></body></html>
    `;
     res.send(html);
  };


});

app.get("/listaEquipe",verificarAutenticacao, (req, res) => {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Equipes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5"><h2>Equipes Cadastradas</h2>
      <table class="table table-dark table-striped-columns">
        <thead>
            <tr>
                <th scope="col">Equipe</th>
                <th scope="col">Tecnico</th>
                <th scope="col">Telefone técnico</th>
                
            </tr>
        </thead>
        <tbody>` ;
        for(let i = 0; i < listaEquipe.length; i++) {
            html = html + `
                    <tr>
                        <td>${listaEquipe[i].equipe}</td>
                        <td>${listaEquipe[i].nomeTecnico}</td>
                        <td>${listaEquipe[i].telefoneTecnico}</td>
                        
                    </tr> ` 
                }
        html = html + ` </tbody>
                          </table>
    </div>
    </body>
    </html>                        `
    res.send(html);
});

// ---------------- Jogador ----------------
app.get("/cadastrarJogador",verificarAutenticacao, (req, res) => {
  res.send(`
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Cadastro de Cliente</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5">
      <form method="POST" action="/cadastrarJogador" class="border p-4">
        <fieldset><legend>Cadastro de Cliente</legend>
          <div class="mb-3"><label>Nome do Jogador</label><input type="text" name="nomeJogador" class="form-control"></div>
          <div class="mb-3"><label>Numero da Camisa</label><input type="number" name="numCamisa" class="form-control"></div>
          <div class="mb-3"><label>Data de nascimento</label><input type="date" name="dataNascimento" class="form-control"></div>
          <div class="mb-3"><label>Altura</label><input type="text" name="altura" class="form-control"></div>
          <div class="mb-3"><label>Sexo</label><input type="text" name="sexo" class="form-control"></div>
          <div class="mb-3"><label>Posicao</label><input type="text" name="posicao" class="form-control"></div>
          <div class="mb-3">
                    <select class="form-control" name="equipe" required>
                        <option value="">Selecione a equipe</option>
                        ${listaEquipe.map(time =>`
                            <option value="${time.equipe}">${time.equipe}</option>
                        `).join('')}
                    </select>
                    <div class="invalid-feedback">Selecione uma equipe.</div>
                </div>
          <button type="submit" class="btn btn-primary">Cadastrar</button>
        </fieldset>
      </form></div></body></html>
  `);
});


app.post("/cadastrarJogador",verificarAutenticacao, (req, res)=>{

  const nomeJogador = req.body.nomeJogador;
  const numCamisa = req.body.numCamisa;
  const dataNascimento = req.body.dataNascimento;
  const altura = req.body.altura;
  const sexo = req.body.sexo;
  const posicao = req.body.posicao;
  const nomeEquipeJogadores = req.body.equipe || "";
  let quantidadeJogadoresEquipe = contarJogadoresPorEquipe(nomeEquipeJogadores);

let erros = {
  nomeJogador: !nomeJogador ? "Nome de jogador obrigatorio" : "",
  numCamisa: !numCamisa ? "Numero de camisa obrigatorio" : "",
  dataNascimento: !dataNascimento ? "Data de nascimento obrigatoria": "",
  altura: !altura ? "Altura obrigatoria": "",
  sexo: !sexo ? "Sexo obrigatorio": "",
  posicao: !posicao ? "Posicao obrigatoria": "",
  equipe: !nomeEquipeJogadores ? "O nome da equipe é obrigatório!" : (quantidadeJogadoresEquipe >= 6 ? "Essa equipe já atingiu o limite de 6 jogadores!" : ""),
}

const temErros = Object.values(erros).some(msg => msg !== "");

if(!temErros){
  listaJogador.push({
    nomeJogador: nomeJogador,
    numCamisa: numCamisa ,
    dataNascimento: dataNascimento,
    altura: altura ,
    sexo: sexo  ,
    posicao: posicao ,
  });
  res.redirect("/listaJogador");
}
else{
    let html =  `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Cadastro de Equipe</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    
    <div class="container mt-5">
      <form method="POST" action="/cadastrarEquipe" class="border p-4">
        <fieldset><legend>Cadastro de Equipe</legend>
        `;html +=`<div class="mb-3"><label>Nome do Jogador</label><input value="${nomeJogador || ""}"id="equipe" type="text" name="nomeEquipe" class="form-control">
          ${erros.nomeJogador ?` <span class="text-danger">${erros.nomeJogador}</span> `: ""}</div>
          
          <div class="mb-3"><label>Numero da Camisa</label><input value="${numCamisa || ""}" id="tecnico" type="text" name="tecnico" class="form-control">
          ${erros.numCamisa ?` <span class="text-danger">${erros.numCamisa}</span> `: ""}</div>

          <div class="mb-3"><label>Data de nascimento</label><input value="${dataNascimento || ""}" id="nomeTecnico" type="tel" name="telefoneTecnico" class="form-control">
          ${erros.dataNascimento ?` <span class="text-danger">${erros.dataNascimento}</span>` : ""}</div>
          
          <div class="mb-3"><label>Altura</label><input value="${altura || ""}" id="tecnico" type="text" name="tecnico" class="form-control">
          ${erros.altura ?` <span class="text-danger">${erros.altura}</span> `: ""}</div>

          <div class="mb-3"><label>Sexo</label><input value="${sexo || ""}" id="tecnico" type="text" name="tecnico" class="form-control">
          ${erros.sexo ?` <span class="text-danger">${erros.sexo}</span> `: ""}</div>

          <div class="mb-3"><label>Posicao</label><input value="${posicao || ""}" id="tecnico" type="text" name="tecnico" class="form-control">
          ${erros.posicao ?` <span class="text-danger">${erros.posicao}</span> `: ""}</div>
          <div class="mb-3">
                        <select class="form-control" id="equipe" name="equipe" required>
                            <option value="">Selecione a equipe</option>
                            ${listaEquipe
                                .filter(time => contarJogadoresPorEquipe(time.equipe) < 6)
                                .map(time => 
                                    `<option value="${time.equipe}" ${nomeEquipeJogadores === time.equipe ? "selected" : ""}>
                                        ${time.equipe}
                                    </option>
                                `).join('')}
                        </select>
                        ${erros.equipe ? `<span class="text-danger">${erros.equipe}</span>` : ""}
                    </div>

          <button type="submit" class="btn btn-primary">Cadastrar</button>`
        ; html +=`  
        </fieldset>
      </form>
    </div></body></html>
    `;
     res.send(html);
}






});
function contarJogadoresPorEquipe(equipe) {
    let count = 0;
    for (let i = 0; i < listaJogador.length; i++) {
        if (listaJogador[i].nomeEquipeJogadores === equipe) {
            count++;
        }
    }
    return count;
}
app.get("/listaJogador",verificarAutenticacao, (req, res) => {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Equipes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5"><h2>Equipes Cadastradas</h2>
      <table class="table table-dark table-striped-columns">
        <thead>
            <tr>
                <th scope="col">Nome do Jogador</th>
                <th scope="col">Numero da Camisa</th>
                <th scope="col">Data de nascimento</th>
                <th scope="col">Altura</th>
                <th scope="col">Sexo</th>
                <th scope="col">Posicao</th>
                
            </tr>
        </thead>
        <tbody>` ;
        for(let i = 0; i < listaJogador.length; i++) {
            html = html + `
                    <tr>
                        <td>${listaJogador[i].nomeJogador}</td>
                        <td>${listaJogador[i].numCamisa}</td>
                        <td>${listaJogador[i].dataNascimento}</td>
                        <td>${listaJogador[i].altura}</td>
                        <td>${listaJogador[i].sexo}</td>
                        <td>${listaJogador[i].posicao}</td>
                    </tr> ` 
                }
        html = html + ` </tbody>
                          </table>
    </div>
    </body>
    </html>                        `
    res.send(html);
});

// ---------------- LOGIN / LOGOUT ----------------
app.get("/login", (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5">
      <form method="POST" action="/login" class="w-50 mx-auto">
        <fieldset><legend>Login</legend>
          <div class="mb-3"><label>Usuário</label><input type="text" name="usuario" class="form-control"></div>
          <div class="mb-3"><label>Senha</label><input type="password" name="senha" class="form-control"></div>
          <button type="submit" class="btn btn-primary">Entrar</button>
        </fieldset>
      </form></div></body></html>
  `);
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  usuarioLogado = (usuario === "admin" && senha === "1234");
  const mensagem = usuarioLogado ? "login efetuado com sucesso!" : "Login está incorreto!";
  if(usuario == "admin" && senha == "123") {
        req.session.logado = true;
        const dataHorasAtuais = new Date();
        res.cookie('ultimoLogin', dataHorasAtuais.toLocaleString());
        res.redirect("/");
    } else {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body>${menu}
    <div class="container mt-5">
      <h1>${mensagem}</h1>
    </div></body></html>
  `);}

});

app.get("/logout",verificarAutenticacao, (req, res) => {

    req.session.destroy();
    res.redirect("/login");

});

app.listen(port, host, () => {
  console.log(`Servidor executando em http://${host}:${port}`);
});

function verificarAutenticacao(requisicao, resposta, next) {
    if(requisicao.session.logado) {
        next();
    } else {
        resposta.redirect("/login");
    }
}