const fs = require('fs');

const caminhoDb = './db.json'; // Ajuste o caminho se necessário

function padronizarDados() {
    try {
        const rawData = fs.readFileSync(caminhoDb);
        let db = JSON.parse(rawData);

        // 1. Padronizar Estoque (Insumos)
        if (db.estoque) {
            db.estoque = db.estoque.map(item => ({
                id: item.id,
                nome: item.nome || item.name || 'Produto Sem Nome',
                quantidade: Number(item.quantidade || item.quantity || 0),
                valor: Number(item.valor || item.price || 0),
                data_venci: item.data_venci || item.expiration || null,
                data_fabrica: item.data_fabrica || null,
                descricao: item.descricao || item.brand || ''
            }));
        }

        // 2. Padronizar Pedidos (Garantir histórico consistente)
        if (db.pedidos) {
            db.pedidos = db.pedidos.map(pedido => ({
                ...pedido,
                produtos: (pedido.produtos || pedido.itens || []).map(item => ({
                    ...item,
                    nome: item.nome || item.name || 'Produto',
                    valor: Number(item.valor || 0)
                })),
                valorTotal: Number(pedido.valorTotal || pedido.total || 0)
            }));
        }

        fs.writeFileSync(caminhoDb, JSON.stringify(db, null, 2));
        console.log("✅ db.json corrigido e padronizado com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao processar o banco de dados:", err);
    }
}

padronizarDados();