module.exports = {
    initialize :        require('./server/initialize'),
    list:               require('./database/list'),
    loadDatabase:       require('./database/loadDatabase'),
    listCollections:    require('./database/listCollections'),
    addCollection:      require('./database/addCollection'),
    getCollection:      require('./database/getCollection'),
    saveDatabase:       require('./database/saveDatabase'),
    insert:             require('./collection/insert'),
    get:                require('./collection/get'),
    remove:             require('./collection/remove')
};
