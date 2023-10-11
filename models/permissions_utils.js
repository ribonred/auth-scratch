
exports.attachPerm = async (user, perm) => {
    user.permissions.push(perm);
    await user.save();
};
exports.detachPerm = async (user, perm) => {
    user.permissions.pull(perm);
    await user.save();
};