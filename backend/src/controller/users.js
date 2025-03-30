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
};


export default new UsersController(_service);