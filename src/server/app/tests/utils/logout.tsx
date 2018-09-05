export const logout = (request, userId, done) => {
  request
    .delete(`/api/users/logout/${userId}`)
    .end((err, res) => {
      if (err) {
        throw err;
      }
      done();
    });
};
