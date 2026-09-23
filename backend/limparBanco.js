const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'dados', 'db.json');

function limparBanco() {
    const rawData = fs.readFileSync(dbPath);
    let db = JSON.parse(rawData);

    if (db.estoque) {
        db.estoque = db.estoque.map(item => ({
            id: item.id,
            nome: item.nome || item.name || 'Sem Nome',
            quantidade: Number(item.quantidade || item.quantity || 0),
            valor: Number(item.valor || 0),
            data_venci: item.data_venci || item.expiration || null,
            data_fabrica: item.data_fabrica || null,
            descricao: item.descricao || item.brand || ''
        }));
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log("✅ Banco de dados limpo e padronizado com sucesso!");
}

limparBanco();