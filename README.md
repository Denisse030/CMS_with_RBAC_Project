# **Secure Content Management System (CMS) with Role-Based Access Control (RBAC), Blockchain, and Machine Learning**

A robust and scalable web application designed to manage user authentication, authorization, and content securely. This project integrates modern technologies like **blockchain** for immutable logging and **machine learning** for anomaly detection in login behavior.

> **Note**: This project was developed as part of my **Capstone Experience in Digital Forensics/Cybersecurity II + Network Security and Forensics** courses at John Jay College of Criminal Justice. It demonstrates the integration of advanced technologies to solve real-world cybersecurity challenges.

---
## Demo Video

[![Watch the video](https://img.youtube.com/vi/your_video_id/maxresdefault.jpg)](https://youtu.be/svGL3UsED9Y)

Click the thumbnail above to watch a walkthrough of the project's features and functionality!

---


## **Features**
- **Role-Based Access Control (RBAC)**: Secure role management for Admins, Moderators, and Clients, enabling fine-grained permissions.
- **User Authentication**: Secure login and registration system using **Passport.js** and encrypted sessions with **MongoDB**.
- **Blockchain Integration**: Immutable activity logs stored on the **Ethereum blockchain** via **Solidity smart contracts**.
- **Machine Learning for Anomaly Detection**: Implements statistical thresholds to flag suspicious login attempts.
- **Content Management**: Allows moderators to create and manage content while admins oversee all activities.
- **Admin Panel**: Comprehensive interface for managing users, updating roles, and reviewing blockchain-based logs.
- **Responsive Frontend**: Built with **HTML**, **CSS**, and **EJS**, ensuring accessibility across devices.

---

## **Technologies Used**
### **Backend**
- **Node.js** with **Express.js**: Backend framework for routing and API management.
- **MongoDB**: Database for storing user credentials, roles, and session data.
- **Solidity**: Smart contracts for blockchain-based logging.
- **Web3.js**: Blockchain interaction and transaction management.

### **Frontend**
- **HTML5**, **CSS3**, **EJS**: For creating a responsive and user-friendly interface.

### **Machine Learning**
- **Simple-Statistics**: For calculating thresholds and detecting anomalies.

### **Authentication**
- **Passport.js**: Local authentication strategy.
- **Bcrypt**: Password hashing for enhanced security.

---

## **Setup Instructions**
Follow these steps to set up and run the project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/RBAC_Project.git
   cd RBAC_Project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=RBAC_Project
   SESSION_SECRET=your_session_secret
   ADMIN_EMAIL=admin@example.com
   BLOCKCHAIN_PROVIDER=http://127.0.0.1:7545
   BLOCKCHAIN_CONTRACT_ADDRESS=your_contract_address
   ```

4. **Run MongoDB Locally**:
   Ensure you have MongoDB installed and running locally:
   ```bash
   mongod
   ```

5. **Compile and Deploy Smart Contracts**:
   Install **Truffle** globally (if not already installed):
   ```bash
   npm install -g truffle
   ```
   Compile and deploy the smart contract:
   ```bash
   truffle compile
   truffle migrate --network development
   ```

6. **Start the Application**:
   ```bash
   npm start
   ```

7. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:3001
   ```

---

## **How It Works**
### **RBAC System**
- Admins can:
  - Manage user roles and permissions.
  - View activity logs stored on the blockchain.
- Moderators can:
  - Create and manage content they own.
- Clients have access to general content and basic features.

### **Blockchain Integration**
- Logs all key user actions (e.g., role updates, login attempts) to ensure transparency and auditability.
- Smart contracts manage logs with an immutable structure.

### **Anomaly Detection**
- Uses **statistical thresholds** to detect anomalies in failed login attempts or unusual login times.
- Warns users or admins of potential security threats.

---

## **Project Structure**
```
RBAC_Project/
├── blockchain/          # Smart contracts and blockchain configuration
├── models/              # Mongoose schemas for MongoDB
├── public/              # Static files (CSS, JS)
├── routes/              # Express.js route handlers
├── utils/               # Utility functions (e.g., anomaly detection, constants)
├── views/               # EJS templates for the frontend
├── app.js               # Main application entry point
├── package.json         # Node.js dependencies
└── README.md            # Project documentation
```

---

## **Future Improvements**
- Deploy the application to a cloud platform like **AWS**, **Heroku**, or **Vercel**.
- Implement multi-factor authentication (MFA) for enhanced security.
- Expand machine learning capabilities for dynamic anomaly detection.
- Add support for role-based email notifications for critical actions.

---


## **Contact**
For questions or feedback, feel free to reach out:  
**Denisse Benito**  
Email: [denissebg03@gmail.com](mailto:denissebg03@gmail.com)  
GitHub: [github.com/Denisse030](https://github.com/Denisse030)

---
