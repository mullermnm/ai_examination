import Service from './Service';    
import bcrypt from 'bcrypt';


class UsersService extends Service {
  constructor(repo) {
    super(repo);
  }
  

  async signin(userId, password) {
    try {
      const { isPresent, item: user } = await this.repo.checkIfItExists({
        userId
      });
      if (!isPresent) {
        return this.errorResponse('Invalid Credentials', 404);
      }
      console.info(user);
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return this.errorResponse('Invalid Credentials', 401);
      }

      let token = await this.repo.getUserToken(user._id, user);

      return this.successResponse({
        message: "User Successfully LoggedIn",
        token, 
        user 
      });
    } catch (error) {
      return this.errorResponse(error.message, 500);
    }
  }
}

export default UsersService;