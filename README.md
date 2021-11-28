<br />
<p align="center">
  <a href="/">
    <img src="https://github.com/cybalencar96/gratibox-front/blob/main/public/farrapo-logo.png?raw=true" alt="Logo" width="90px" height="auto">
  </a>

<h3 align="center">Farrapo Store</h3>

  <p align="center">
    The best place to get rid of old (<strong>but gold</strong>) stuff
    <br />
    <a href="https://github.com/cybalencar96/farrapo-store-back"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://farrapo-store-front-git-main-cybalencar96.vercel.app/">View Demo</a>
    <br />
  </p>
</p>

#

### **About the project**

<br />
<p align="center">
<img src="https://github.com/cybalencar96/farrapo-store-front/blob/main/public/farrapo-gif.gif?raw=true" width="600px">
<p>

<br />

A bazaar eCommerce to free space in your closet while winning some Benjamins 💰💰 

<br />

### **Built with**

- [React JS](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node JS](https://nodejs.org/en/)
- [Styled-Components](https://styled-components.com/)

 <br />

## **Getting Started**

- Want to simply try it? Access demo by [clicking here](https://farrapo-store-front-git-main-cybalencar96.vercel.app/)!

- Want to run frontend local not worrying with back? Learn how in README of farrapo-store-front repository by [clicking here](https://github.com/cybalencar96/farrapo-store-front)!

- Want to run backend and front end local? Keep reading then!

### **Prerequisites**

- npm

<br />

### **Installation**

1.  Clone backend repo

```sh
git clone https://github.com/cybalencar96/farrapo-store-back.git
```

2. Install dependencies executing comand in root

```sh
npm i
```

3. Clone frontend repo **in a different folder**

```sh
git clone https://github.com/cybalencar96/farrapo-store-front.git
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
DB_NAME=farrapo-store
```

   <br />

8. Run (copy & paste) the farrapo_dump.sql statements in database
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
