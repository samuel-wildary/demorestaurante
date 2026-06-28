export const menuData = {
  restaurantName: "Bella Italia",
  categories: ["Pizzas", "Burgueres", "Bebidas", "Sobremesas"],
  items: [
    // Pizzas
    {
      id: "piz_calabresa",
      name: "Pizza Calabresa",
      category: "Pizzas",
      price: 49.90,
      description: "Molho de tomate artesanal, muçarela, calabresa defumada fatiada, cebola roxa e orégano fresco.",
      flavors: ["Calabresa"],
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "piz_marguerita",
      name: "Pizza Marguerita Premium",
      category: "Pizzas",
      price: 47.90,
      description: "Molho de tomate especial, muçarela de búfala, rodelas de tomate fresco, manjericão gigante e azeite extra virgem.",
      flavors: ["Marguerita"],
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "piz_quatro_queijos",
      name: "Pizza Quatro Queijos",
      category: "Pizzas",
      price: 52.90,
      description: "Base cremosa de muçarela, provolone ralado, gorgonzola dolci e requeijão cremoso tipo catupiry.",
      flavors: ["Quatro Queijos"],
      image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "piz_frango_catupiry",
      name: "Pizza Frango com Catupiry",
      category: "Pizzas",
      price: 50.90,
      description: "Frango desfiado temperado, milho verde selecionado e generosa camada de Catupiry original.",
      flavors: ["Frango com Catupiry"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80"
    },
    
    // Burgueres
    {
      id: "brg_classico",
      name: "Bella Smash Burger",
      category: "Burgueres",
      price: 28.90,
      description: "Pão de brioche selado na manteiga, blend de carne de 120g smash, queijo cheddar derretido e maionese da casa.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "brg_bacon",
      name: "Bella Bacon Double",
      category: "Burgueres",
      price: 36.90,
      description: "Dois blends smash de 120g, muito queijo cheddar, tiras de bacon crocantes e barbecue defumado.",
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "brg_gorgonzola",
      name: "Bella Gorgon & Onion",
      category: "Burgueres",
      price: 38.90,
      description: "Blend bovino premium de 150g, creme de gorgonzola artesanal, cebola caramelizada e rúcula fresca.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80"
    },

    // Bebidas
    {
      id: "beb_coca_lata",
      name: "Coca-Cola Lata",
      category: "Bebidas",
      price: 6.50,
      description: "Lata de 350ml trincando de gelada.",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "beb_guarana_lata",
      name: "Guaraná Antarctica Lata",
      category: "Bebidas",
      price: 6.00,
      description: "Lata de 350ml gelada.",
      image: "https://images.unsplash.com/photo-1527960471264-93a9a9e88c13?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "beb_suco_laranja",
      name: "Suco Natural de Laranja",
      category: "Bebidas",
      price: 9.90,
      description: "Copo de 400ml feito na hora com laranjas frescas espremidas.",
      image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "beb_cerveja_long",
      name: "Heineken Long Neck",
      category: "Bebidas",
      price: 10.00,
      description: "Cerveja Heineken garrafa de 330ml bem gelada.",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80"
    },

    // Sobremesas
    {
      id: "sob_brownie",
      name: "Brownie Belga com Sorvete",
      category: "Sobremesas",
      price: 19.90,
      description: "Brownie de chocolate belga morno acompanhado de uma bola de sorvete de creme e calda de chocolate.",
      image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "sob_pudim",
      name: "Pudim de Leite Condensado",
      category: "Sobremesas",
      price: 12.00,
      description: "Fatia generosa de pudim super cremoso com calda de caramelo artesanal.",
      image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=300&q=80"
    }
  ]
};

// Helper lists
export const pizzaFlavorsList = ["Calabresa", "Marguerita", "Quatro Queijos", "Frango com Catupiry"];
