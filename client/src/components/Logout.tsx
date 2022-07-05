const Logout = () => {
  return (
    <p
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "./";
      }}
      className="cursor-pointer"
    >
      logout
    </p>
  );
};

export default Logout;