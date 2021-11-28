<br />
<p align="center">
  <a href="/">
    <img src="https://github.com/cybalencar96/gratibox-front/blob/main/public/img/419-4195061_be-grateful.png?raw=true" alt="Logo" width="200px" height="auto">
  </a>

<h3 align="center">Gratibox</h3>

  <p align="center">
    Be grateful in life 🙏, it can always get worse 😰
    <br />
    <a href="https://github.com/cybalencar96/gratibox-back"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://gratibox-front-git-main-cybalencar96.vercel.app/">View Demo</a>
    <br />
  </p>
</p>

#

### **About the project**

<br />
<p align="center">
<img src="https://github.com/cybalencar96/gratibox-front/blob/main/public/img/frontPage.png?raw=true" width="300px">
<p>

Above we see the home page of the app. Subscribe in it and you will receive random boxes in your home, with many sort of items varying from teas to organic products.

You will not choose the item, but you can always choose to be grateful for what you have received!

<br />

### **Built with**

- [React JS](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node JS](https://nodejs.org/en/)
- [Material-UI](https://material-ui.com/)

 <br />

## **Getting Started**

### **Prerequisites**

- npm

<br />

### **Installation**

1.  Clone backend repo

```sh
git clone https://github.com/cybalencar96/gratibox-back.git
```

2. Install dependencies executing comand in root

```sh
npm i
```

3. Clone frontend repo **in a different folder**

```sh
git clone https://github.com/cybalencar96/gratibox-front.git
```

4. Install frontend dependencies executing command in root

```sh
npm i
```

5. Create a .env.development file in frontend root folder with following variable and value

```sh
REACT_APP_SERVER_URL=http://localhost:4000
```

6. Create a .env.dev file in backend root folder with following variables 
```sh
DB_USER
DB_HOST
DB_PASS
DB_PORT
DB_NAME
```

7. Create a postgres database and fill .env.dev with database credentials
```sh
DB_USER=postgres
DB_HOST=localhost
DB_PASS=123456
DB_PORT=5432
DB_NAME=gratibox
```

   <br />

8. Run (copy & paste) the dump.sql statements in database
   <br />
   <br />

### **How to run**

1. Start backend server

```sh
npm run dev
```

2. Start frontend

```sh
npm start
```
