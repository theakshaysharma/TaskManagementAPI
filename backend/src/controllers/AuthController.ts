import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from '../models/user';
import config from '../config';
import { ClientError } from '../exceptions/clientError';
import { UnauthorizedError } from '../exceptions/unauthorizedError';
import { NotFoundError } from '../exceptions/notFoundError';
import { processErrors } from '../utils/errorProcessing';
import { Error } from 'mongoose';

// Utility function for password validation
const isValidPassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

class AuthController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, username, firstName, lastName, password } = req.body;

            if (!email || !username || !firstName || !lastName || !password) {
                throw new ClientError('All fields are required');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ClientError('Invalid email format');
            }

            // Password strength validation
            if (!isValidPassword(password)) {
                throw new ClientError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            }

            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                throw new ClientError('Email or Username already exists');
            }

            const user = new User({ email, username, firstName, lastName, password });
            await user.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (e) {
            console.error(e);
            next(e);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
    let { userIdentifier, password } = req.body; // Use userIdentifier instead of username
    if (!(userIdentifier && password)) throw new ClientError('User identifier and password are required');

    // Check if the userIdentifier is an email or username, and search the database accordingly
    const user = await User.findOne({
        $or: [
            { email: userIdentifier }, // Check for email
            { username: userIdentifier } // Check for username
        ]
    }).exec();

    // If user not found or password is incorrect
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new UnauthorizedError("Username/email and password don't match");
    }

    // Sign JWT, valid for 1 hour
    const accessToken = sign(
        { userId: user._id.toString(), username: user.username, role: user.role },
        config.jwt.secret!,
        {
            expiresIn: '1h',
            notBefore: '0',
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        }
    );

    // Send the JWT in the response
    res.type('json').send({ status:"success",data:{accessToken} });
};


    static changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.userId;
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) throw new ClientError("Passwords don't match");

        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found`);
        } else if (!(await user.isPasswordCorrect(oldPassword))) {
            throw new UnauthorizedError("Old password doesn't match");
        }

        if (!isValidPassword(newPassword)) {
            throw new ClientError('New password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
        }

        user.password = newPassword;
        try {
            await user.save();
        } catch (e) {
            console.error(e);
            throw new ClientError(processErrors(e as Error.ValidationError));
        }

        res.status(204).send();
    };
}

export default AuthController;
