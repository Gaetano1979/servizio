let Usuarios = `select * from clientes`;
let GetTabla = (tabla) => {
    return `select * from ${tabla}`;
};
let GetWhere = (tabla, parametro, id) => {
    return `select * from ${tabla} where ${parametro} = ${id}`;
};


module.exports = {
    GetTabla,
    GetWhere
};