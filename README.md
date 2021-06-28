# API BASEADA EM FUNÇÕES NO TWITTER 

# Tecnologias 
- Express
- Mongodb
- Jwt
- Cookie-parser
- Bcrypt

# Funções 
## Criar conta [ /api/user/signup ] -- *method POST*
passar no body * *username* *, * *email* *, * *password* * , * *name*(opcional) <br>

<hr>

## Login [ /api/user/login ] -- *method POST*
passar no body * *username* * e * *password* * <br>

<hr>

## Seguir outros usuarios [ /api/user/*seu-Id*/follow ] -- *method POST* 
passar na URL o id da sua conta e no body * *targetId* * id do usuario que deseja seguir  <br>

<hr>

## deixar de seguir outros usuarios [ /api/user/*seu-Id*/unfollow ] -- *method POST*
 passar na URL o id da sua conta e no body * *targetId* *  id do usuario que deseja deixar de seguir  <br>

<hr>

## Editar nome e username  [ /api/user/profile/edit/seu-Id ] -- *method PUT*
passar no body qual deseja editar, * *username* * e * *name* * ou apenas um <br>
username é como o @ do twitter  <br>

<hr>

## Mudar senha [ /api/user/password/edit/*seu-Id* ] -- *method PUT*
passar no body * *oldPassword* *, * *newPassword* * e * *confNewPassword* * <br>
<hr>

## Mudar email [ /api/user/email/edit/*seu-id* ] -- *method PUT*
passar no body * *newEmail* *, * *confNewEmail* * e * *password* *<br>


## Ver posts de algum usuario [ /api/user/timeline/*id-do-usuario* ] -- *method GET*
<br>
<hr>

## Informações sobre o usuario [ /api/user/*id-do-usuario* ] -- *method GET* 
retorna numero de seguidores, quantas pessoas segue, nome e username "@" <br>

## Deletar conta [ /api/user/delete/*seu-id* ] -- *method DELETE*
passar no body * *password* * 
<br>
<hr>

## Criar post [ /api/post/create ] -- *method POST*
passar no body * *content* *, * *author* -seu id- *, * *img* * -url- (opcional) <br>

<hr>

## Procurar por usuario [ /api/user/search/nome-do-usuario ] -- *method GET*
<br>
<hr>

## Curtir post [ /api/post/id-do-post/like ] -- *method POST*
passar no body * *userId* * seu id <br>

<hr>

## Deixar de curtir post [ /api/post/id-do-post/unlike ] -- *method POST*
passar no body * *userId* * seu id <br>

<hr>

## Deletar post [ /api/post/id-do-post/delete ] -- *method DELETE*
