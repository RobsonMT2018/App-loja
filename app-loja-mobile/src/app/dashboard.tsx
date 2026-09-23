import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/api';

interface Produto {
  id: string | number;
  nome?: string;
  name?: string;
  quantidade?: number;
  quantity?: number;
  data_venci: string;
}

interface Pedido {
  status: string;
  valorTotal?: number | string;
  dataHora?: string;
}

interface Stats {
  totalVendas: number;
  totalPedidos: number;
  totalClientes: number;
  totalProdutosEstoque: number;
  valorPrejuizo: number;
}

const API_PEDIDOS = `${API_URL}/pedidos`;
const API_CLIENTES = `${API_URL}/clientes`;
const API_ESTOQUE = `${API_URL}/estoque`;

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <View style={[styles.card, { borderTopColor: accent }]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalVendas: 0,
    totalPedidos: 0,
    totalClientes: 0,
    totalProdutosEstoque: 0,
    valorPrejuizo: 0,
  });
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarDadosDashboard = async () => {
      try {
        setLoading(true);

        const [resPedidos, resClientes, resEstoque] = await Promise.all([
          fetch(API_PEDIDOS).catch(() => null),
          fetch(API_CLIENTES).catch(() => null),
          fetch(API_ESTOQUE).catch(() => null),
        ]);

        const pedidos: Pedido[] = resPedidos?.ok ? await resPedidos.json() : [];
        const clientes: any[] = resClientes?.ok ? await resClientes.json() : [];
        const estoque: Produto[] = resEstoque?.ok ? await resEstoque.json() : [];

        setTodosProdutos(estoque);

        let faturamentoTotal = 0;
        let contagemCancelados = 0;
        let valorPrejuizo = 0;

        pedidos.forEach((pedido) => {
          if (pedido.status === 'Estornado' || pedido.status === 'Cancelado') {
            contagemCancelados += 1;
            valorPrejuizo += Number(pedido.valorTotal || 0);
          } else {
            faturamentoTotal += Number(pedido.valorTotal || 0);
          }
        });

        const somaQuantidadeEstoque = estoque.reduce((acc, curr) => {
          const qtd = curr.quantity ?? curr.quantidade ?? 0;
          return acc + Number(qtd);
        }, 0);

        setStats({
          totalVendas: faturamentoTotal,
          totalPedidos: pedidos.length - contagemCancelados,
          totalClientes: clientes.length,
          totalProdutosEstoque: somaQuantidadeEstoque,
          valorPrejuizo,
        });
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDashboard();
  }, []);

  const alertas = useMemo(() => {
    const hoje = new Date();

    return todosProdutos.filter((produto) => {
      const dataValidade = new Date(produto.data_venci);
      const diffDays = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      const quantidade = Number(produto.quantidade ?? produto.quantity ?? 0);

      return quantidade <= 15 || diffDays <= 60;
    });
  }, [todosProdutos]);

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Estoque', icon: '📦', path: '/estoque' },
    { name: 'Clientes', icon: '👥', path: '/clientes' },
    { name: 'Vendas', icon: '🛒', path: '/vendas' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Sincronizando métricas administrativas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Dashboard</Text>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.menuPanel}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push(item.path as any);
                }}
              >
                <Text style={styles.menuIconItem}>{item.icon}</Text>
                <Text style={styles.menuItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.dismissArea} onPress={() => setMenuVisible(false)} />
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <MetricCard label="Vendas" value={`R$ ${stats.totalVendas.toFixed(2)}`} accent="#2563eb" />
          <MetricCard label="Pedidos" value={String(stats.totalPedidos)} accent="#10b981" />
          <MetricCard label="Clientes" value={String(stats.totalClientes)} accent="#f59e0b" />
          <MetricCard label="Estoque" value={String(stats.totalProdutosEstoque)} accent="#8b5cf6" />
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Alertas</Text>
          {alertas.length === 0 ? (
            <Text style={styles.alertText}>Nenhum alerta no momento.</Text>
          ) : (
            alertas.map((produto, index) => (
              <Text key={`${produto.id ?? index}`} style={styles.alertText}>
                • {produto.nome ?? produto.name}: estoque baixo ou próximo da validade.
              </Text>
            ))
          )}
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Perdas registradas</Text>
          <Text style={styles.summaryValue}>R$ {stats.valorPrejuizo.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fbff',
  },
  menuIcon: {
    fontSize: 28,
    color: '#0f172a',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  menuPanel: {
    width: '78%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#0f172a',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  menuIconItem: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  dismissArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 18,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderTopWidth: 5,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  alertBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c2410c',
    marginBottom: 10,
  },
  alertText: {
    color: '#7c2d12',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  summaryBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    color: '#172554',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
});