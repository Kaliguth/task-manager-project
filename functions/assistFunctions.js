// Function to check if email contains '@' and ends with ".{domain}"
function isValidEmail(email) {
  if (email.includes(" ")) {
    return false;
  }

  return (
    (email.includes("@") && email.endsWith(".com")) ||
    email.endsWith(".org") ||
    email.endsWith(".net") ||
    email.endsWith(".il") ||
    email.endsWith(".uk")
  );
}

function isValidUsername(username) {
  if (username.length < 5 || username.includes(" ")) {
    return false;
  }

  for (let char of username) {
    if (char >= "A" && char <= "Z") {
      return false;
    }
  }

  return true;
}

// Function to check if password length is 5 or longer,
// includes at least one number and capital letter
// and does not include spaces
function isValidPassword(password) {
  if (password.length < 5 || password.includes(" ")) {
    return false;
  }

  let hasCapital = false;
  let hasNumber = false;

  for (let char of password) {
    if (char >= "0" && char <= "9") {
      hasNumber = true;
    }

    if (char >= "A" && char <= "Z") {
      hasCapital = true;
    }
  }

  return hasNumber && hasCapital;
}

module.exports = { isValidEmail, isValidUsername, isValidPassword };
