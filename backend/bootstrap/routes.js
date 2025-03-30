
import usersRoute from '../src/routes/users';
import examsRoute from '../src/routes/exam';

export default (server) => {
    server.use('/api/exams', examsRoute);       
    server.use('/api/users', usersRoute);    
};
