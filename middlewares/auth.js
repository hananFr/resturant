import fs from 'fs';
import Jwt from 'jsonwebtoken';
import { throwError } from '../utils/functionHelper.js';
import User from '../models/user.js';

const publicKey = fs.readFileSync('./public_key.pem', 'utf8');

const rolesArray = ['customer', 'waiter', 'admin'];

const auth = (role = null) => {
  const minRole = role ? rolesArray.indexOf(role) : 0;

  return async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      if (!token) throwError('Unauthorized', 403);

      const decoded = Jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      if (!decoded) throwError('Unauthorized', 403);

      req.userId = decoded._id;
      if (!req.userId) throwError('Unauthorized', 403);

      const user = await User.findById(req.userId).select('role');
      if (!user) throwError('Unauthorized', 403);
      req.role = user.role;

      if (rolesArray.indexOf(req.role) < minRole) throwError('Unauthorized', 403);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
