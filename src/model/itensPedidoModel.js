import connection from "../config/database.js";



class ItensPedidoModel {

    async create(itens_pedido, conexao = connection) {
        const sql = 'INSERT INTO itens_pedido(pedido_id, produto_id, quantidade, preco_unidade) VALUES (?, ?, ?, ?)'
        await conexao.execute(sql, [
            itens_pedido.pedido_id, 
            itens_pedido.produto_id, 
            itens_pedido.quantidade, 
            itens_pedido.preco_unidade])
    }
}


export default new ItensPedidoModel()