async function handleSocketConnection(socket) {
    // console.info('socket connected ', socket)
    // socket.emit('connected', { messsage: 'it is connected' });
    socket.join(socket.data.userId);
    if (global.REDIS_SERVICE) {
        const user = await REDIS_SERVICE.getValue('user:' + socket.data.userId);
        user.socket = socket.id;
        await REDIS_SERVICE.setValue('user:' + socket.data.userId, user);
    }

    // Credentials.findByIdAndUpdate(socket.data.userId, { socket: socket.id }, { new: true }).then(doc => {
    //     socket.broadcast.emit('User_Connected', {
    //         _id: doc._id,
    //         firstname: doc.firstname,
    //         username: doc.username,
    //         socket: doc.socket,
    //         updatedAt: doc.updatedAt,
    //         roles: doc.roles
    //     })
    // }).catch(err => {
    //     // console.log(err);
    // });
    // Notification.countDocuments({ recievers: socket.data.userId, read: false }).then(count => {
    //     socket.emit('Unread_Notifications', { count })
    // }).catch(err => {
    //     // console.log(err);
    // });

    socket.on('Typing', (data) => {
        socket.to(data.userId).emit('Typing', data)
    });

    socket.on('StopTyping', (data) => {
        socket.to(data.userId).emit('StopTyping', data)
    });


    socket.on('disconnect', async() => {
        // const user = await REDIS_SERVICE.getValue('user:' + socket.data.userId);
        // user.socket = '';
        // user.token = '';
        // await REDIS_SERVICE.setValue('user:' + socket.data.userId, user);
        // Credentials.findOneAndUpdate({ socket: socket.id }, { socket: '' }).then(doc => {
        //     socket.broadcast.emit('User_Disconnected', { userId: doc._id })
        // }).catch(err => {
        //     // console.log(err);
        // })
    })
}

export default handleSocketConnection;