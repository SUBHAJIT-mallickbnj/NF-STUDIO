<div align="center">

# NF STUDIO – An Efficient Database Normalizer 🚀

### 🎓 B.Tech  Major Project (5TH Semester Capstone)
**Asansol Engineering College** (Affiliated with MAKAUT)

---

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📖 Introduction

NF STUDIO is an advanced, full-stack database design and engineering platform. The system bridges the gap between relational database theory and real-world database optimization by automating the entire normalization pipeline.

The production-ready version features a **Real-Data Processing Engine** that handles actual user-uploaded CSV files, analyzes complex dependencies, and actively decomposes redundant datasets into clean, optimized structures all the way up to the **Fifth Normal Form (5NF)**.

---

## 👥 THE WAY TECHNOLOGY IMPLEMENTED -----

This system was conceptualized, designed, and engineered as a personal effort:

* 🧑‍💻 Architected the core system engine, authored the algorithmic components for higher normal forms (BCNF/4NF/5NF), and managed the DevOps container infrastructure, Git workflows, and multi-platform cloud deployments.  

* 👩‍💻 Engineered the interactive frontend UI layout, built the CSV parsing and data state-management handlers, and designed the comprehensive interactive educational "Theory & Guide" module.  
  
* 🧑‍💻 Designed the backend validation services, mapped out functional and multi-valued dependency parsing matrices, and structured the physical multi-table export utilities.  

* 🧑‍💻 Spearheaded the dynamic SVG visualization integrations, constructed the data tables schema mapping controls, and conducted localized integration testing.  


  🔗 [LinkedIn](https://www.linkedin.com/in/subhajit-mallick-345113241)


---

## 📂 Repository Structure (Monorepo)

This project is organized as a unified monorepo, keeping the decoupled frontend and backend systems synchronized within a single workspace:

```text
DB-Norm/
├── frontend/                 # React + Vite client-side user interface
│   ├── src/                  # Components, state management, & SVG rendering
│   ├── package.json
│   └── vite.config.js
└── backend/                  # Java Spring Boot REST API
    ├── src/                  # Normalization logic, CSV handlers, & algorithms
    ├── pom.xml               # Maven configuration & dependencies
    └── Dockerfile            # Cloud containerization script
```

---

## 🧩 Problem Statement

Database normalization is a foundational process in relational database design, but executing it manually on complex schemas is highly time-consuming, abstract, and prone to human error. Students and database engineers frequently struggle to calculate attribute closures, identify hidden functional dependencies, and determine the exact normal form of a schema. 

Furthermore, standard online normalization tools are entirely theoretical—they can compute equations but cannot process actual data. There is a distinct lack of interactive visual systems that can take a real, unnormalized data file and physically decompose it. DBNorm addresses this by providing an automated, full-stack visual workspace that normalizes raw data files automatically.

---

## 🎯 Project Objectives

* **Automated Dependency Analytics:** Design an engine to dynamically calculate attribute closures, candidate keys, and minimal canonical covers from user inputs.
* **True 5NF Decomposition:** Provide comprehensive algorithmic support to execute lossless, dependency-preserving decompositions seamlessly across **1NF, 2NF, 3NF, BCNF, 4NF (multi-valued dependencies), and 5NF (join dependencies)**.
* **Real-Data Execution:** Move beyond pure theory by allowing users to upload unnormalized `.csv` files and physically split them into separate, valid tables.
* **Dynamic Graphical Visualizations:** Render real-time SVG diagrams mapping out Functional Dependency Graphs, Candidate Key Search Trees, and Decomposition Trees to serve as a powerful pedagogical tool.
* **Stateless Cloud Architecture:** Maintain a completely secure environment where data is processed efficiently in-memory using optimized Java streams without requiring persistent database storage.

---

## 💻 Technology Stack

## 🚀 Run Locally

From the repository root, run this command in PowerShell:

```powershell
.\start-project.ps1
```

This starts the Spring Boot API on `http://localhost:8080` and the compiled Vite app on `http://localhost:5173`. The script reuses services that are already running, builds or installs missing dependencies when needed, and can be run again after reopening VS Code.

### Frontend
* **Core Framework:** React.js (built with Vite for optimized development and bundling)
* **Styling Framework:** Tailwind CSS & HTML5 (Fully responsive layouts)
* **API Communication:** Axios REST Client
* **Data Visualization:** Custom SVG Layout Engines (for rendering dependency graphs)

### Backend
* **Core Framework:** Java 21 & Spring Boot Framework
* **Build Architecture:** Maven Dependency Manager
* **API Pattern:** Stateless RESTful APIs
* **Processing Libraries:** OpenCSV (for raw data stream parsing) & Zip4j (for multi-table export compression)

---

## 🏗️ Cloud Architecture & DevOps

The production instance of NF STUDIO runs on a modern, decoupled, cloud-native architecture optimized for high performance and zero local machine runtime dependencies:

* **Backend Containerization (Docker + Render):** The Spring Boot backend is fully containerized using a multi-stage `Dockerfile`. 
  * *Stage 1 (Build):* Compiles and packages the application using a heavy Maven OpenJDK 17 image.
  * *Stage 2 (Runtime):* Extracts the compiled `.jar` file and runs it inside a minimal, lightweight Eclipse Temurin Alpine Linux JRE image to reduce server latency and memory footprint. It is deployed as a Web Service on Render.
* **Frontend Edge Delivery (Vercel):** The production React assets are optimized, compiled, and served globally over Vercel’s high-performance CDN edge network, enabling lightning-fast UI loading speeds and seamless request routing to our backend cloud container.

---

## ✨ Key Features

* **Automated Algorithmic Core:** Instant derivation of attribute closures, candidate keys, and minimal canonical covers without manual calculations.
* **True 5NF Coverage:** Deep algebraic processing capable of taking relations completely through 4NF (Multi-valued dependencies) and 5NF (Join dependencies).
* **Interactive CSV File Engine:** Users can upload a standard raw `.csv` table. The application projects the attributes into separate valid sub-tables and prunes out duplicated row records dynamically.
* **Packaged ZIP Exporter:** Download the fully normalized tabular architecture as a set of individual clean CSV files compressed into a single `.zip` archive.
* **Live SVG Diagram Mapping:** Real-time rendering of Functional Dependency Graphs, Decomposition Trees, and Candidate Key Search Trees.
* **Stateless Processing:** Secure engineering runs entirely in-memory using optimized Java streams without storing user data on persistent databases.

---

## 🚀 Future Scope & Extensions

While NF STUDIO successfully automates the entire core normalization pipeline up to 5NF, we look forward to scaling the platform with the following enhancements:
* **Automated SQL DDL Generation:** Dynamically generate the actual optimized `CREATE TABLE` SQL scripts with foreign key constraints based on the decomposed normal forms.
* **Direct Database Integration:** Expand the data engine to allow users to connect live databases via connection strings (JDBC) rather than relying strictly on static `.csv` uploads.
* **AI-Assisted Dependency Discovery:** Implement machine learning heuristics to scan uploaded datasets and automatically predict potential functional and multi-valued dependencies for the user.

---

<div align="center">

Thank you for visiting **NF STUDIO**! If you find this project helpful for understanding relational database theory or optimizing your schemas, feel free to star the repository. ⭐

</div>
