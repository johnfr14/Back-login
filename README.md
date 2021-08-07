# Database SRO  
⚠️ before cloning this repo please make sure that everything is installed and up to date (see `quick installation`) ⚠️  
  
If want a perfect understanding of our database i > recommand to do the [getting started](https://devcenter.heroku.com/articles/getting-started-with-nodejs) from heroku.  
But if you don't need just go to `Getting started`

----

## Quick installation (before cloning)
1. **Install heroku CLI**

  - for [macOS](https://cli-assets.heroku.com/heroku.pkg)
  - for [windows 64-bit](https://cli-assets.heroku.com/heroku-x64.exe) or [windows 32-bit](https://cli-assets.heroku.com/heroku-x86.exe)
  - for Linux: `sudo snap install heroku --classic`

2. **Check the version**
   ```
   node --version
   v14.15.4
   ```
   ```
   npm --version 
   6.14.11
   ```
   ```
   git --version
   git version 2.28.0
   ```

----

## Getting started
First log into log into your heroku account, if you don't have you will have to create a *free* account.
```
heroku login
```
Once logged in you'll be able to see all your database and of course `bdd-sro` if not ask ***el jefe*** Romain to add you as collaborator for this database
```
heroku addons
```
Then clone the repo, switch to branch develop and install the dependencies 
```
heroku git:clone -a bdd-sro
cd bdd-sro
git checkout develop
yarn
```
Congratulation !!! Now visit the app at the URL generated by its app name. As a handy shortcut, you can open the website as follows and test the differents routes
```
heroku open
```
### More tip  
- To run the app localy,  http://localhost:5000
    ```
    heroku local web
    ```
- To connect to Heroku database (you can then CREATE, INPUT, DROP table and column from your terminal)
    ```
    heroku pg:psql
    ```
    > psql (13.3 (Ubuntu 13.3-1.pgdg20.04+1)) 
    > SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)  
    > Type "help" for help.  
    > => create table test_table (id integer, name text);  
    > CREATE TABLE  
    > => insert into test_table values (1, 'hello database');  
    > INSERT 0 1  
    > => \q  
- To pull and push database  
    **pg:pull**  
    `pg:pull` can be used to pull remote data from a Heroku Postgres database to a database on your local machine.  
    If providing a Postgres ***user or password*** for your local DB is necessary, use the appropriate environment variables like so:
    ```
    PGUSER=db_user PGPASSWORD=strongpassword123 heroku pg:pull bdd-sro mylocaldb --app bdd-sro
    ```
    **pg:push**  
    `pg:push` pushes data from a local database into a remote Heroku Postgres database. The command looks like this:
    ```
    PGUSER=db_user PGPASSWORD=strongpassword123 heroku pg:push mylocaldb bdd-sro --app bdd-sro
    ```
----

## Architecture 

coming soon.