<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>G-Cart - E-commerce Platform for Electronics</h1>

<p><strong>G-Cart</strong> is a modern e-commerce platform designed to offer a seamless shopping experience for electronics. It features product browsing with search, filter, and sorting options, along with secure online transactions via Razorpay. An intuitive admin dashboard provides real-time reporting on sales and inventory.</p>

<a href="https://gcart.onrender.com/mainhomepage">
    <img src="https://gcart.onrender.com/mainhomepage" alt="G-Cart">
</a>

<h2>Key Features</h2>
<ul>
    <li><strong>Search, Filter & Sort:</strong> Quickly find products based on category, price, and more.</li>
    <li><strong>Secure Payments:</strong> Integrated Razorpay for safe online transactions.</li>
    <li><strong>Admin Dashboard:</strong> Manage products, track sales, and monitor inventory.</li>
    <li><strong>User Authentication:</strong> Secure sign-up and login via RESTful APIs.</li>
    <li><strong>Order Management:</strong> View and manage orders effortlessly.</li>
</ul>

<h2>Tech Stack</h2>
<ul>
    <li><strong>Frontend:</strong> EJS (Embedded JavaScript Templates)</li>
    <li><strong>Backend:</strong> Node.js, Express.js</li>
    <li><strong>Database:</strong> MongoDB Atlas</li>
    <li><strong>Payment Gateway:</strong> Razorpay</li>
    <li><strong>Hosting:</strong> AWS EC2</li>
</ul>

<h2>Live Demo</h2>
<p>Explore the live platform: <a href="https://gcart.onrender.com/mainhomepage" target="_blank">G-Cart Live</a></p>

<h2>Installation</h2>
<p>To set up <strong>G-Cart</strong> locally:</p>

<h3>Prerequisites:</h3>
<ul>
    <li>Node.js (v14 or higher)</li>
    <li>MongoDB (use MongoDB Atlas for cloud database)</li>
    <li>Razorpay Account (for payment integration)</li>
</ul>

<h3>Steps:</h3>
<ol>
    <li>Clone the repository:
        <pre><code>git clone https://github.com/yourusername/gcart.git</code></pre>
    </li>
    <li>Navigate to the project directory:
        <pre><code>cd gcart</code></pre>
    </li>
    <li>Install dependencies:
        <pre><code>npm install</code></pre>
    </li>
    <li>Set up environment variables in a <strong>.env</strong> file:
        <pre><code>DB_URI=mongodb+srv://your-mongo-db-uri
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret</code></pre>
    </li>
    <li>Run the application:
        <pre><code>npm start</code></pre>
        Access the app at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.
    </li>
</ol>

<h2>Contributing</h2>
<p>We welcome contributions! If you’d like to improve <strong>G-Cart</strong>:</p>
<ol>
    <li>Fork the repository</li>
    <li>Create a feature branch</li>
    <li>Make changes and submit a pull request</li>
</ol>

<h2>License</h2>
<p>This project is licensed under the MIT License - see the <a href="LICENSE" target="_blank">LICENSE</a> file for details.</p>

<p>Enjoy shopping with <strong>G-Cart</strong>! For any questions, feel free to reach out.</p>

</body>
</html>
