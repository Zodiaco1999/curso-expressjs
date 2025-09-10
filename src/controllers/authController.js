const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => { 
  try {
    const { email, password, name } = req.body;
    await registerUser(email, password, name);
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { register, login };