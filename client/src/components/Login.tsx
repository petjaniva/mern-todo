import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  renderSignup: () => void;
}

interface PostResponse {
  status: number;
  data: LoginData;
}
interface LoginData {
  token: string;
}

const Login = ({ renderSignup }: LoginProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = () => {
    axios
      .post("/login", {
        email: email,
        password: password,
      })
      .then((res: PostResponse) => {
        if (res.status === 200) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
        }
      });
  };

  return (
    <div style={{ height: "300px" }}>
      <h1 className="text-center text-green-400 font-bold text-xl">login</h1>
      <div className="mb-4">
        <label className="mb-2">email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
          type="text"
          placeholder="email"
        />
      </div>
      <div className="mb-4">
        <label>password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="flex justify-between items-centered">
        <div>
          <p>
            No Account?&nbsp;
            <span
              onClick={renderSignup}
              className="text-green-400 cursor-pointer"
            >
              Signup
            </span>
          </p>
        </div>
        <button
          className="rounded-lg px-6 py-2 font-bold bg-green-400 text-white"
          onClick={onSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
