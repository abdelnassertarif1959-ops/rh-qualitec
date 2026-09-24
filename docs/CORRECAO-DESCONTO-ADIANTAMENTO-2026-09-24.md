# Desconto único no adiantamento

O lançamento EMPRESTIMO, de R$ 500,00, tinha vigência em 18/09/2026. O holerite 1628 do Leonardo era pago em 18/09, mas foi criado em 24/09. O recálculo utilizava a data de criação e ignorava o lançamento. O resumo do editor também não somava itens personalizados. Na geração de adiantamentos, os totais eram zerados mesmo quando havia descontos cadastrados.

A vigência agora usa a data de pagamento, tanto no editor quanto na geração, gravação e recálculo. Itens únicos são aceitos sem número de parcelas; itens desativados ou fora da vigência não entram. A folha seguinte compensa o adiantamento bruto, pois o empréstimo já foi retido nele.

Para lançar mensalmente, escolha **Único**, informe R$ 500,00 e use a data de pagamento do adiantamento. No mês seguinte, cadastre um novo lançamento com a nova data. Não transforme o item em recorrente se deseja decidir o valor todo mês.

Correção pontual aplicada no Supabase: somente holerite 1628, com verificação dos valores anteriores, passou de R$ 1.600,00 líquidos para proventos de R$ 1.600,00, desconto de R$ 500,00 e líquido de R$ 1.100,00. Nenhuma migração estrutural foi necessária.

Testes: vigência, exclusão de meses seguintes, itens inativos, fronteiras de recorrência e execução do endpoint de recálculo com banco simulado, verificando ausência de duplicação e preservação dos valores quando a consulta falha. A correção do editor e dos fluxos futuros depende da publicação da aplicação.
