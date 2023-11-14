const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

const GITHUB_CLIENT_ID = 'SEU_CLIENT_ID';
const GITHUB_CLIENT_SECRET = 'SEU_CLIENT_SECRET';
const CALLBACK_URL = 'http://localhost:3000/auth/github/callback'; // Defina sua URL de retorno correta

passport.use(new GitHubStrategy({
    clientID: '7c62f8632c5114554935',
    clientSecret: 'aa640edf77ae03b9dd7fe1ca19dba8a3a84c7fcd',
    callbackURL: CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // Aqui você pode manipular os dados do perfil do usuário, como salvar no banco de dados, etc.
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  // Aqui você pode serializar o usuário para armazenar na sessão, como o ID do usuário, por exemplo.
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // Aqui você pode desserializar o usuário, talvez buscar os detalhes do usuário do banco de dados, etc.
  done(null, obj);
});

const app = express();
app.use(session({ secret: 'secreto', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/perfil');
  });

app.get('/perfil', (req, res) => {
  res.send(req.user);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
