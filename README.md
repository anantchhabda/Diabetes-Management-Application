
# Diabetes-Management-Application

The aim of this project is to design and prototype a mobile health (mHealth) application to support individuals with type 2 diabetes, particularly in low- and middle-income countries (LMICs). The app will focus on improving blood sugar control, medication adherence, and digital literacy, especially for middle-aged users with limited experience using mobile technology. The system will be multilingual, lightweight, and capable of functioning offline. 

This project requires a `.env` file to run the backend locally. Before running the project, create a `.env` file in the root directory and add the following variables:

<pre> ```env
MONGO_URI = mongodb+srv://user12345:team24dma@cluster0.eadmv9n.mongodb.net/?retryWrites = true&w=majority&appName=Cluster0
PORT = 3000
JWT_SECRET = yourjwtsecret``` <\pre>

Note that JWT_SECRET should be a long, random string for security (each member has their own one)
