import jwt from 'jsonwebtoken';
import UsersRepo from '../../interface/users.js';

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.info('Token verified:', decoded);
        const user = decoded;
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
};

const auth = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.info('No token provided');
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            const user = await verifyToken(token);
            req.user = user;
            console.info('User authenticated, proceeding to next middleware');
            next();
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    };
};

const teacherAuth = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.info('No token provided');
                return res.status(401).json({
                    error: true,
                    message: 'No token provided'
                });
            }

            const user = await verifyToken(token);
            if (user.userRole !== 'teacher') {
                console.info('Access denied for user role:', user.userRole);
                return res.status(403).json({
                    error: true,
                    message: 'Access denied. Teachers only.'
                });
            }
            console.info('Teacher authenticated, proceeding to next middleware');
            req.user = user;
            next();
        } catch (error) {
            console.error('Teacher authentication error:', error);
            res.status(401).json({
                error: true,
                message: error.message
            });
        }
    };
};

export const studentAuth = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            console.info('Received token:', token);
            
            if (!token) {
                console.info('No token provided');
                return res.status(401).send({
                    success: false,
                    message: 'No token provided'
                });
            }

            const user = await verifyToken(token);
            console.info('Token verified:', user);
            
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.userRole !== 'student') {
                return res.status(403).send({
                    success: false,
                    message: 'Access denied. Students only.'
                });
            }

            console.info('Student authenticated, proceeding to next middleware');
            req.user = user;
            next();
        } catch (error) {
            console.error('Student authentication error:', error);
            res.status(401).send({
                success: false,
                message: 'Invalid token'
            });
        }
    };
};

export {
    auth,
    teacherAuth
};