import java.util.ArrayList;

public class Cliente {
	private String name;
	private String cpf;
	private Carrinho[] carrinho; // Expected non-array: multiplicity error
	private Pagamento[] pagamento;
	// private Pedido[] pedido; // Missing aggregation
	public void listarPedidos() {

	}
	public void iniciarPedido() {

	}
}
