const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "NOTEAPI";


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existUser = await userModel.findOne({ username: username });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        });
        const token = jwt.sign({ email: result.email, id: result.id }, SECRET_KEY);
        res.status(200).json({ user: result, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const signin = async (req, res) => {
    const {email, password} = req.body;
    try{
        const existUser = await userModel.findOne({ email: email });
        if (!existUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const matchPassword= await bcrypt.compare(password, existUser.password);
        if (!matchPassword){
            return res.status(400).json({message:"Wrong password"});
        }
        const token = jwt.sign({ email: existUser.email, id: existUser.id }, SECRET_KEY);
        res.status(201).json({ user: existUser, token: token });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
module.exports = { signin, signup };