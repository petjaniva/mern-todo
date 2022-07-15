import React from "react";
import axios from "axios";

interface SigninProps {
  renderLogin: () => void;
}

const Signup = ({ renderLogin }: SigninProps) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);

  const onSubmit = () => {
    if (password.length >= 6) {
      axios
        .post("/signup", {
          email: username,
          password: password,
        })
        renderLogin();
    }
    else {
        window.alert("password must be at least 6 characters");
    }
  };

  React.useEffect(() => {
    if (password === confirmPassword) setDisabled(false);
    else setDisabled(true);
  }, [password, confirmPassword]);
  return (
    <div>
      <div style={{ height: "300px" }}>
        <h1 className="text-center text-green-400 font-bold text-xl">Signup</h1>
        <div className="mb-4">
          <label className="mb-2">username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
            type="text"
            placeholder="username"
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
        <div className="mb-4">
          <label>Confirm password</label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="flex justify-between items-centered">
          <div>
            <p>
              Already a member?
              <span
                onClick={renderLogin}
                className="text-green-400 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
          <button
            className={`rounded-lg px-6 py-2 font-bold text-white ${
              disabled ? "bg-gray-400" : "bg-green-400"
            }`}
            disabled={disabled}
            onClick={() => onSubmit()}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
