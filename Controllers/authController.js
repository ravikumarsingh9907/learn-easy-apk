const usersDb = require("../models/users");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const accessTokensDb = require("../models/tokenAccessHistory");
const { generateAuthToken, generateVerificationToken, generateAccessToken, } = require('../utils/tokens');

const loginUser = async (req, res) => {
    try {
        const data = req.body;
        const foundUser = await usersDb.findOne({ email: data.email });
        if (!foundUser) {
            throw new Error('Incorrect email or password.');
        }

        const token = generateVerificationToken();
        const URL = `http://localhost:3300/signup/verify-user/${token}`;

        if(!foundUser.isVerified) {
            const Token = new accessTokensDb({
               email: foundUser.email,
               token: token,
                user: foundUser._id,
            });

            await Token.save();

            await sendEmail({
                email: foundUser.email,
                subject: 'Verify your email - Learn Easy.',
                body: `<p>To verify your account, please <a href=${URL}>Click here.</a></p>`
            });

            throw new Error('Unverified email, please verify your email.');
        }

        const validateCustomer = await bcrypt.compare(
            data.password,
            foundUser.password
        );
        if (!validateCustomer) {
            throw new Error('Incorrect email or password.');
        }

        const authToken = generateAuthToken(foundUser);
        foundUser.tokens.push({token: authToken});

        await foundUser.save();

        res.status(201).send({ id: foundUser._id, token: authToken });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
}

const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const checkUser = await usersDb.findOne({ email: email });

        if (checkUser) {
            throw new Error('Email already registered.')
        }

        const hashedPass = await bcrypt.hash(password, 12);
        const savedData = new usersDb({
            name,
            email,
            password: hashedPass,
        });

        await savedData.save();
        const token = generateVerificationToken();

        const saveToken = new accessTokensDb({
            email: savedData.email,
            token: token,
            user: savedData._id,
        });

        await saveToken.save();

        const URL = `http://localhost:3300/signup/verify-user/${token}`;

        await sendEmail({
            email,
            subject: 'Verify your email - Learn Easy.',
            body: `<p>To verify your account, please <a href=${URL}>Click here.</a></p>`
        });

        res.status(201).send({ success: 'Registered, please verify your account.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const verifyUser = async (req, res) => {
    try {
        const token = req.params.token
        const foundToken = await accessTokensDb.findOne({token: token}).populate('user');

        if (!foundToken) throw Error('Invalid verification link.');

        const foundUser = await usersDb.findById(foundToken.user._id);
        foundUser.isVerified = true;

        await  foundUser.save();
        await accessTokensDb.findOneAndRemove({token: token});

        res.status(200).send({ 'success': 'Your account is verified successfully, Now you can close this window.' });
    } catch (e) {
        res.status(401).send({ error: e.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const foundUser = await usersDb.findOne({ email: email });

        if (!foundUser) {
            throw new Error("Email is not registered, create your account.")
        }

        const otp = generateAccessToken();
        const token = generateVerificationToken();

        const createAccessToken = new accessTokensDb({
            otp: otp,
            token: token,
            email: email,
            user: foundUser._id,
        });

        await sendEmail({
            otp,
            email,
            name: foundUser.name,
            subject: 'One Time Password (OTP) - Learn Easy',
            body: `<div style="background-color: #0000ff3b; padding: 4px; border-radius: 2px; width: 400px; text-align: center;">
	                    <p style="font-size: 42px; letter-spacing: 10px; font-weight: 600;">${otp}</p>
                        <p style="heading">One Time Password (OTP) for reseting your password. valid for 10 minutes.</p>
                   </div>`
        });

        await createAccessToken.save();
        res.status(200).send({token});
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const verifyOtpForForgotPasswordUrl = async (req, res, next) => {
    try {
        const token = req.params.token;

        const foundToken = await accessTokensDb.findOne({token: token});
        if(!foundToken) throw new Error('Invalid URL');

        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const verifyOtpForForgotPassword = async (req, res) => {
    try {
        const { otp } = req.body;
        const foundAccessOtp = await accessTokensDb.findOne({ otp: otp });

        if (!foundAccessOtp) throw new Error('Invalid OTP');

        res.status(200).send({ success: 'Verified successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const { password, confirmPassword } = req.body;
        const foundUser = await accessTokensDb.findOne({ token }).populate('user');

        if(!foundUser) throw new Error('Invalid request or please try again.')

        if (password !== confirmPassword) {
            throw new Error("Password didn't match.")
        }

        const hashedPass = await bcrypt.hash(password, 12);
        await usersDb.findByIdAndUpdate(foundUser.user._id, {password: hashedPass});

        res.status(200).send({ success: 'Password updated successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const signOutUser = async (req, res) => {
    try {
        const getUser = await usersDb.findById(req.user._id);
        getUser.tokens.filter(token => {
            return token.token !== req.token;
        });

        await getUser.save();
        res.status(200).send({success: 'logged out'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    loginUser,
    signUpUser,
    signOutUser,
    verifyUser,
    forgotPassword,
    verifyOtpForForgotPassword,
    resetPassword,
    verifyOtpForForgotPasswordUrl,
})