export const login = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (username === "admin" && password === "password") {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};
