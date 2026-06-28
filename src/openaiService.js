import { menuData } from './menuData';

// Expose System Instructions
const SYSTEM_PROMPT = `Você é a Bella, assistente virtual simpática e inteligente da pizzaria e hamburgueria Bella Italia.
Seu objetivo é guiar o cliente no fluxo completo de vendas pelo WhatsApp e gerenciar o carrinho de compras dele usando as ferramentas fornecidas.

Regras de Atendimento:
1. Seja calorosa, amigável, educada e use emojis de comida de forma moderada (🍕, 🍔, 🥤, 🍨, 😋, 👍, etc.).
2. Sempre use as ferramentas disponíveis para modificar o carrinho sempre que o usuário pedir para adicionar, remover, limpar ou alterar itens.
3. Se o cliente quiser pizza, confirme o sabor. Lembre-o que oferecemos opção Meio a Meio (dois sabores diferentes de pizza). Os sabores disponíveis são: Calabresa, Marguerita Premium, Quatro Queijos, Frango com Catupiry. Se ele pedir um sabor que não temos, avise educadamente os sabores disponíveis.
4. Para outros pratos (como burgueres, bebidas, sobremesas), confirme as quantidades.
5. Sempre confirme o que foi adicionado ao carrinho informando que "já atualizou a tela dele".
6. Mantenha um tom profissional e ágil.
7. Quando o cliente terminar de escolher todos os pratos e bebidas, faça a confirmação do carrinho e solicite as informações de checkout necessárias:
   - Nome completo do cliente
   - Endereço de entrega completo (rua, número, bairro)
   - Forma de pagamento (escolha entre: Pix, Cartão de Crédito, Cartão de Débito ou Dinheiro)
8. Assim que tiver o Nome, Endereço de entrega e Forma de pagamento selecionada, chame OBRIGATORIAMENTE a ferramenta 'finalize_order' com estes dados para abrir a janela de finalização do pedido. Não invente esses dados se o usuário não forneceu. Pergunte por eles.
9. Se o carrinho estiver vazio, peça primeiro para ele escolher algo do cardápio antes de tentar finalizar o pedido.

Cardápio Disponível:
${JSON.stringify(menuData.items, null, 2)}
`;

const tools = [
  {
    type: "function",
    function: {
      name: "get_menu",
      description: "Retorna o cardápio completo do restaurante com ID de itens, preços, categorias e descrições.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Adiciona um prato ou bebida ao carrinho de compras do cliente.",
      parameters: {
        type: "object",
        properties: {
          item_id: {
            type: "string",
            description: "ID do prato/bebida (ex: piz_calabresa, brg_classico, sob_brownie)."
          },
          quantity: {
            type: "integer",
            description: "Quantidade de itens (padrão é 1).",
            default: 1
          },
          flavors: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Sabores selecionados para a pizza. Use 1 sabor para pizza inteira ou 2 sabores para pizza Meio a Meio (ex: ['Calabresa', 'Marguerita Premium'])."
          },
          notes: {
            type: "string",
            description: "Observações ou pedidos especiais (ex: sem cebola, bem passado, sem gelo)."
          }
        },
        required: ["item_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "remove_from_cart",
      description: "Remove um item específico do carrinho usando o ID exclusivo do item gerado no carrinho.",
      parameters: {
        type: "object",
        properties: {
          cart_item_id: {
            type: "string",
            description: "O ID único do item dentro do carrinho (gerado pelo sistema React)."
          }
        },
        required: ["cart_item_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "clear_cart",
      description: "Limpa completamente todos os itens do carrinho.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "finalize_order",
      description: "Inicia o checkout do pedido após coletar os dados do cliente.",
      parameters: {
        type: "object",
        properties: {
          customer_name: {
            type: "string",
            description: "Nome completo do cliente."
          },
          delivery_address: {
            type: "string",
            description: "Endereço completo de entrega."
          },
          payment_method: {
            type: "string",
            enum: ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"],
            description: "Método de pagamento."
          }
        },
        required: ["customer_name", "delivery_address", "payment_method"]
      }
    }
  }
];

export async function sendChatMessage({
  apiKey,
  model,
  messages,
  cart,
  cartFunctions,
  onSystemMessage,
}) {
  if (!apiKey) {
    throw new Error("Por favor, configure sua chave da OpenAI nas configurações.");
  }

  // Prepend system prompt if not present
  const fullMessages = [...messages];
  const hasSystem = fullMessages.some(m => m.role === 'system');
  if (!hasSystem) {
    fullMessages.unshift({ role: 'system', content: SYSTEM_PROMPT });
  }

  // Define fallback models if user requested model fails (e.g. gpt-5.4-mini-2026-03-17)
  const modelsToTry = [model, 'gpt-4o-mini', 'gpt-4o'];
  let currentModelIndex = 0;
  
  while (currentModelIndex < modelsToTry.length) {
    const activeModel = modelsToTry[currentModelIndex];
    try {
      onSystemMessage?.(`Enviando requisição usando o modelo: ${activeModel}...`);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: activeModel,
          messages: fullMessages,
          tools: tools,
          tool_choice: "auto"
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;
        
        // If it's a model not found error and we have fallbacks left, try the next one
        if ((response.status === 404 || errorMessage.includes("model") || errorMessage.includes("does not exist")) && currentModelIndex < modelsToTry.length - 1) {
          console.warn(`Modelo ${activeModel} indisponível. Tentando fallback...`);
          currentModelIndex++;
          continue;
        }
        throw new Error(errorMessage || `Erro da API OpenAI (Status: ${response.status})`);
      }

      const data = await response.json();
      const choice = data.choices[0];
      const assistantMessage = choice.message;

      // Handle Tool Calls (Function Calling)
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Add assistant message with tool calls to context
        fullMessages.push(assistantMessage);

        for (const toolCall of assistantMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          let result = "";

          onSystemMessage?.(`Bella está executando a função: ${functionName}...`);

          try {
            if (functionName === "get_menu") {
              result = JSON.stringify(menuData);
            } else if (functionName === "add_to_cart") {
              const cartItem = cartFunctions.addToCart(args.item_id, args.quantity || 1, args.flavors || [], args.notes || "");
              result = JSON.stringify({ status: "success", message: "Item adicionado ao carrinho", cartItem });
            } else if (functionName === "remove_from_cart") {
              cartFunctions.removeFromCart(args.cart_item_id);
              result = JSON.stringify({ status: "success", message: "Item removido do carrinho" });
            } else if (functionName === "clear_cart") {
              cartFunctions.clearCart();
              result = JSON.stringify({ status: "success", message: "Carrinho limpo com sucesso" });
            } else if (functionName === "finalize_order") {
              cartFunctions.finalizeOrder(args.customer_name, args.delivery_address, args.payment_method);
              result = JSON.stringify({ status: "success", message: "Checkout iniciado na interface para o cliente." });
            } else {
              result = JSON.stringify({ status: "error", message: `Função ${functionName} não suportada.` });
            }
          } catch (err) {
            console.error(`Erro ao executar ferramenta ${functionName}:`, err);
            result = JSON.stringify({ status: "error", message: err.message });
          }

          // Add tool result to context
          fullMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: functionName,
            content: result
          });
        }

        // Recursively call OpenAI again with the tool outputs in history
        return await sendChatMessage({
          apiKey,
          model: activeModel, // Use the active successful model
          messages: fullMessages,
          cart,
          cartFunctions,
          onSystemMessage
        });
      }

      // No tool calls, return final response and full history
      return {
        message: assistantMessage.content,
        updatedHistory: fullMessages.concat(assistantMessage)
      };

    } catch (error) {
      console.error(`Erro com modelo ${activeModel}:`, error);
      if (currentModelIndex === modelsToTry.length - 1) {
        throw error; // If all fallbacks failed, throw the final error
      }
      currentModelIndex++;
    }
  }

  throw new Error("Erro desconhecido ao chamar a OpenAI API.");
}
