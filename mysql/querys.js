let Usuarios = `select * from clientes`;
let GetTabla = (tabla) => {
    return `select * from ${tabla}`;
};
let GetWhere = (tabla, where, parametro) => {
    return `select * from ${tabla} where ${where} = ${parametro}`;
};


module.exports = {
    GetTabla,
    GetWhere
};