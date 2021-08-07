# Database SRO  
⚠️ before cloning this repo please make sure that everything is installed and up to date (see `quick installation`) ⚠️  
  
If want a perfect understanding of our database i > recommand to do the [getting started](https://devcenter.heroku.com/articles/getting-started-with-nodejs) from heroku.  
But if you don't need just go to `Getting started`

  
## Quick installation (before cloning)
1. Install heroku CLI
    - for [macOS](https://cli-assets.heroku.com/heroku.pkg)
    - for [windows 64-bit](https://cli-assets.heroku.com/heroku-x64.exe) or [windows 32-bit](https://cli-assets.heroku.com/heroku-x86.exe)
    - for Linux: `sudo snap install heroku --classic`

2. Log into Heroku CLI  
    This command will redirect you to log into your heroku account, if you don't have you will have to create a *free* account.
    ```
    heroku login
    ```

3. Check the version
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

## Getting started
First clone the repo and install the dependencies 
```
git clone https://github.com/SRO-SarahRo/bdd-sro.git
cd bdd-sro
yarn
```
then switch to branch develop or create your own branch
```
git branch your-name
git checkout you-name
```