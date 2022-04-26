module.exports = (array, userId) => {
    let userIndex = -1
    for(let i = 0; i < array.length; i++){
        if(i == 0) {
            if(array[i].user === userId) {
                userIndex += 1
            }
        }
        if(array[i].user === userId) {
        userIndex += i
        }
        if(userIndex > -1) break
    }
    return userIndex
}