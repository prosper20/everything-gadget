# EverythingGadget API ⛳

![fork repository](https://res.cloudinary.com/dhqv8cxqz/image/upload/v1663888596/q0y7ghveufs50nyhznpe.png)

<table>
<tr>
<td>
  This is a repository for the API of Everything-Gadgets, an E-Commerce website, where you may purchase your preferred electronics products.
</td>
</tr>
</table>

## Tech Stack 🛠️

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## API Description

Click [here](https://documenter.getpostman.com/view/24186009/2s93CHtuRV) for the current api documentaion on Postman.

## Run locally

1. Fork this repo

2. Clone the project

   ```bash
      git clone your forked url
   ```

3. Install dependencies using

   ```bash
      npm install
   ```

4. Create a .env file in the root folder and set your environment variables

5. Run in either producton or development mode

   for development mode

   ```bash
      npm run dev
   ```

   for production mode

   ```bash
      npm run prod
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `PORT` : port on which the server would run.
- `MONGO_URI`: connection string for the mongodb database.
- `MONGO_USER` : mongodb username.
- `MONGO_PASS` : your mongodb password.
- `NODE_ENV` : set to "development".
- `JWT_SECRET` : secret for jwt token.
- `JWT_EXPIRES_IN` : token duration eg "90d".
