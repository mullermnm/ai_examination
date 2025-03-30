export default (schema) => {
    schema.add({
        __updateLogs: [{
            __actor: String,
            __actorName: String,
            __changes: [{
                __field: String,
                __previousValue: String,
                __newValue: String
            }]
        }]
    })
    schema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
        console.log(this);
        next()
    })
}