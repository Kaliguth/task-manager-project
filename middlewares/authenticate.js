// Authentication middleware
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authenticationHeader = req.headers.authorization;

  if (!authenticationHeader) {
    return res.status(401).json({ message: "Invalid token." });
    // Status 401 = Unauthorized - Missing authorization header.
  }

  const [bearer, token] = authenticationHeader.split(" ");

  if (bearer != "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token." });
    // Status 401 = Unauthorized - Invalid or missing token.
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
    // Status 401 = Unauthorized - Invalid token.
  }
}

module.exports = authenticate;
