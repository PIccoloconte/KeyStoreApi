import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeaders = req.headers["authorization"];

  const token = authHeaders && authHeaders.split(" ")[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  console.log("DEBUG isAdmin - req.user:", req.user);
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Accesso riservato agli admin" });
};
