# NBStore

## Project - SE1760-NJ

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Menu

- [Roles](#roles)
- [Database Setup](#database-setup)
- [Back End](#back-end)
- [Front End](#front-end)

### Roles

- **Admin**: Manages the entire system, oversees users and sellers, and handles high-level administration tasks.
- **Seller**: Manages their own products, sales, and related operations.
- **User**: Regular customers who browse, purchase products, and manage their personal account.

### Database Setup

- Use the JSON files located in the `db` folder to import data into your local database.

<!-- ====================================== BACK END =============================== -->

### Back End

<details>
<summary><strong>Folder Structure</strong></summary>

- `npm i`

- `npm start` - http://localhost:9999/

```plaintext

    └── backend/
        ├── controllers/
        │   ├── index.js
        │   ├── authController.js
        │   ├── userController.js
        │   └── ...
        ├── middlewares/
        │   ├── verifySignUp.js
        │   ├── verifyJWT.js
        │   └── ...
        ├── models/
        │   ├── index.js
        │   ├── user.model.js
        │   ├── role.model.js
        │   └── ...
        ├── node_modules
        ├── routes/
        │   ├── index.js
        │   ├── authRoute.js
        │   ├── userRoute.js
        │   └── ...
        ├── .env
        ├── .prettierrc
        ├── note BE.txt
        ├── package-lock.json
        ├── package.json
        └── server.js

```

</details>

<!-- ====================================== FRONT END =============================== -->

### Front End

<details>
<summary><strong>Folder Structure</strong></summary>

- `npm i`

- `npm run dev` - http://localhost:5173/

```plaintext

    └── frontEnd/
        ├── public
        ├── src/
        │   ├── assets
        │   ├── axios
        │   ├── components/
        │   │   ├── ui/
        │   │   │   ├── accordion.jsx
        │   │   │   ├── badge.jsx
        │   │   │   ├── button.jsx
        │   │   │   └── ...
        │   │   └── admin/
        │   │       ├── formAddProduct.jsx
        │   │       ├── tableProduct.jsx
        │   │       ├── tableUser.jsx
        │   │       └── ...
        │   ├── lib
        │   ├── pages/
        │   │   ├── admin/
        │   │   │   ├── dashboard.jsx
        │   │   │   ├── manageProduct.jsx
        │   │   │   └── ...
        │   │   ├── seller
        │   │   ├── auth/
        │   │   │   ├── login.jsx
        │   │   │   ├── register.jsx
        │   │   │   └── ...
        │   │   ├── error/
        │   │   │   └── notFoundPage.jsx
        │   │   └── main/
        │   │       ├── home.jsx
        │   │       ├── cart.jsx
        │   │       └── ...
        │   ├── app.jsx
        │   ├── app.scss
        │   ├── index.scss
        │   └── index.jsx
        ├── .prettierrc
        ├── .gitignore
        └── components.json

```

</details>
