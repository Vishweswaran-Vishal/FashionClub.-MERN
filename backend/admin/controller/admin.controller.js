import axios from "axios";

export const getAllUsers = async (req, res) => {
  try {
    // const users = await User.find({});
    const users = await axios.get(
      `${process.env.API_GATEWAY_URI}/api/users/all`,
      {
        headers: {
          token: req.headers.token, // Pass the token here
        },
      }
    );
    res.json(users.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const addNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const response = await axios.post(
      `${process.env.API_GATEWAY_URI}/api/users/add`,
      {
        name,
        email,
        password,
        role,
      },
      {
        headers: {
          token: req.headers.token, // Pass the token here
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const response = await axios.put(
      `${process.env.API_GATEWAY_URI}/api/users/${req.params.id}`,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      },
      {
        headers: {
          token: req.headers.token, // Pass the token here
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const response = await axios.delete(
      `${process.env.API_GATEWAY_URI}/api/users/${req.params.id}`,
      {
        headers: {
          token: req.headers.token, // Pass the token here
        },
      }
    );

    if (response.status === 200) {
      return res.status(200).json({ message: "User deleted successfully!" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};
