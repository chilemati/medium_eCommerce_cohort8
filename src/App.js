import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Products from "./components/products/Product";
import Navbar from "./components/navBar/Navbar";
import Footer from "./components/footer/Footer";
import Product from "./components/products/Product";
import Login from "./components/Login/Login";
import Signup from "./components/signup/Signup";
import Pin from "./components/pin/Pin";
import Createpin from "./components/createPin/CreatePin";
import Create from "./components/createProduct/Create";
import Createuser from "./components/createUser/CreateUser";
import Error from "./components/404/Error";
import Details from "./components/details/Details";
import Cart from "./components/cart/Cart";
import Users from "./components/users/Users";
function App() {
  return (
    <div className="App">
      <Navbar />
      {/* put constant components here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pin" element={<Pin />} />
        <Route path="/createPin" element={<Createpin />} />
        <Route path="/createProduct" element={<Create />} />
        <Route path="/createUser" element={<Createuser />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {/* put constant components here */}
      <Footer />
    </div>
  );
}

export default App;
