import Controller from './Controller.js';
import UsersRepo from '../interface/users.js';
import UsersService from '../services/users.js';

const _service = new UsersService(UsersRepo);

class UsersController extends Controller {
  constructor(service) {
    super(service);
  }

  async signin(req, res) {
    const { userId, password } = req.body;
    const response = await _service.signin(userId, password);
    return res.status(response.statusCode).send(response);
  }
  
  async getAllUsers(req, res) {
    try {
      const response = await _service.getAllUsers(req.query || {});
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(500).send({ error: true, statusCode: 500, message: error.message })
    }
  }
};


export default new UsersController(_service);