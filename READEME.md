# Leonardo Gonzalez — Personal Website

[![Site Status](https://img.shields.io/website?url=https%3A%2F%2F<username>.github.io)](https://<username>.github.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A clean, responsive personal portfolio built with **HTML**, **CSS**, and **JavaScript**. It showcases my resume, notable projects, and contact links—all without a heavyweight framework.

---

## ✨ Features

* **Vanilla stack** – no external frameworks, just standards‑compliant HTML5/CSS3/ES6.
* **Responsive design** – looks sharp on phones, tablets, and desktops.
* **Smooth scrolling** – simple script for pleasant in‑page navigation.
* **Easy theming** – tweak colors & fonts in one place (`:root` CSS variables).
* **Dead‑simple deploy** – push to GitHub Pages (or any static host) and you’re live.

---

## 📂 Project structure

```
personal-website/
├── index.html        # Main page (About, Projects, Contact)
├── resume.pdf        # Downloadable résumé
├── favicon.ico       # Site icon
├── assets/           # Images, extra CSS/JS if needed
│   ├── images/
│   ├── css/
│   └── js/
└── README.md         # You are here!
```

Feel free to reorganize—everything is static, so the host just serves files.

---

## 🚀 Getting started

### 1. Clone the repo

```bash
git clone https://github.com/<username>/personal-website.git
cd personal-website
```

### 2. Preview locally

Just open `index.html` in your browser or spin up a tiny server:

```bash
python -m http.server 8000  # Then visit http://localhost:8000
```

### 3. Deploy to GitHub Pages

1. Commit & push all files to the **main** branch.
2. In your GitHub repo → **Settings → Pages**.
3. Source: `Deploy from a branch`, Branch: `main` (root).
4. Save. Your site appears at `https://<username>.github.io` within minutes.

*(Prefer Netlify, Vercel, or your own server? It works there too—just drop the files.)*

---

## 🔧 Customizing

| Section             | File                            | What to change                                                                         |
| ------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| **About**           | `index.html`                    | Edit the paragraph under `<section id="about">`                                        |
| **Projects**        | `index.html`                    | Duplicate a `<article class="card">` block and update the title, description, and link |
| **Colors / fonts**  | `<style>` block in `index.html` | Adjust CSS variables (`--clr-*`) or add custom rules                                   |
| **Resume download** | `resume.pdf`                    | Replace with your own PDF                                                              |
| **Icons / images**  | `assets/` folder                | Update paths in the HTML                                                               |

---

## 🛡 License

This project is licensed under the **MIT License** – see [`LICENSE`](LICENSE) for details.

---

## 🤝 Contact

Have suggestions or want to chat? Reach me at **[leo.gueorguiev@gmail.com](mailto:leo.gueorguiev@gmail.com)** or on **[LinkedIn](https://www.linkedin.com/in/yourprofile)**.

> Built with ❤️ and caffeine in Champaign, IL.
