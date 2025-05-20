# 📚 Book Notes Web App

A clean, responsive web application for saving and managing personal book notes. Built using Node.js, Express, PostgreSQL, EJS, and the Open Library Covers API, this project allows users to search for books, view cover images, write custom notes, mark favorites, and organize their reading experience.

---

## 🚀 Features

- 🔍 **Book Search & Add Notes**: Search for books using title/author and save custom notes.
- 🖼 **Cover Images**: Fetch book cover images using Open Library Covers API.
- ❤️ **Favorites**: Mark books as favorites and access them on a dedicated “My Books” page.
- 🧠 **Personal Notes**: Add and edit notes for each book.
- 🔄 **Filter & Sort**: Easily filter and sort books based on favorites, title, or other criteria.
- 📱 **Responsive UI**: Clean and responsive design built with HTML, CSS, and EJS templating.
- 🧰 **Full-Stack Architecture**: Seamlessly integrates backend and frontend for a smooth UX.

---

## 🛠️ Tech Stack

| Layer         | Technology                               |
|---------------|------------------------------------------|
| **Frontend**  | HTML, CSS, JavaScript, EJS               |
| **Backend**   | Node.js (with ES Modules), Express       |
| **Database**  | PostgreSQL, Sequelize ORM                |
| **API**       | Open Library Covers API                  |
| **Tools**     | Git, GitHub, Visual Studio Code          |

---


bash
Copy
Edit
npm install
Set Up Environment Variables

Create a .env file in the root directory:

ini
Copy
Edit
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=booknotes
Run Migrations (If using Sequelize)

bash
Copy
Edit
npx sequelize-cli db:migrate
Start the Application

bash
Copy
Edit
npm start
The app will be running on http://localhost:3000.

📸 Screenshots
Home Page	My Books (Favorites)

Note: Screenshots are optional — you can add your own for better presentation.

🧪 Future Improvements
✅ User authentication (Login/Register)

🔔 Notification system

🗂️ Tagging or categorizing notes

🌐 Deploy to platforms like Vercel or Render

📱 Mobile-first design enhancement

🙌 Acknowledgements
Open Library Covers API for providing free book cover images.

Node.js, Express, PostgreSQL, and the entire open-source community for powering this project.

👨‍💻 About Me
Hi! I'm Arpan, a passionate full-stack developer currently focused on building intuitive and efficient web applications. I enjoy turning ideas into working products and learning new technologies along the way.

Connect with me on LinkedIn or check out more projects on GitHub.

