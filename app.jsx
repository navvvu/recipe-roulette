const { useState, useEffect } = React;

/* seed recipes */
const defaultRecipes = [
  {
    id: 1,
    title: "Tomato Pappu (Andhra Dal)",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
    time: "25 min",
    servings: 4,
    difficulty: "Easy",
    rating: 4.8,
    category: "Telugu, South Indian",
    ingredients: [
      "1 cup toor dal",
      "2 ripe tomatoes, chopped",
      "2 green chilies, slit",
      "1/4 tsp turmeric, salt",
      "Tempering: mustard, cumin, garlic, curry leaves, red chili, hing"
    ],
    instructions: [
      "Pressure cook dal + tomatoes + turmeric + chilies + salt (3–4 whistles)",
      "Mash; simmer 5 min; adjust salt",
      "Temper in ghee: mustard, cumin, garlic, red chili, curry leaves, hing",
      "Pour tadka over dal and serve with rice"
    ]
  },
  {
    id: 2,
    title: "Pesarattu (Green Gram Dosa)",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200",
    time: "30 min",
    servings: 4,
    difficulty: "Easy",
    rating: 4.7,
    category: "Telugu, South Indian",
    ingredients: [
      "1 cup whole moong (soaked 4–6h)",
      "1/4 cup rice (optional)",
      "1 inch ginger, 2 green chilies",
      "Salt, cumin; oil/ghee for roasting"
    ],
    instructions: [
      "Grind soaked moong (+ rice) with ginger, chilies, cumin, salt",
      "Heat tawa, spread batter thin; drizzle oil",
      "Cook both sides till crisp; serve with ginger chutney"
    ]
  }
];

function App() {
  const [recipes, setRecipes] = useState(() =>
    JSON.parse(localStorage.getItem("recipes") || "null") || defaultRecipes
  );
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => localStorage.setItem("recipes", JSON.stringify(recipes)), [recipes]);
  useEffect(() => localStorage.setItem("favorites", JSON.stringify(favorites)), [favorites]);

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  /* form state */
  const [form, setForm] = useState({
    title: "",
    image: "",
    time: "",
    servings: "",
    difficulty: "Easy",
    rating: 5.0,
    category: "",
    ingredients: [""],
    instructions: [""]
  });

  const updateList = (list, i, v) => {
    const next = [...form[list]];
    next[i] = v;
    setForm({ ...form, [list]: next });
  };

  const addRow = (list) => setForm({ ...form, [list]: [...form[list], ""] });
  const removeRow = (list, i) =>
    form[list].length > 1 &&
    setForm({ ...form, [list]: form[list].filter((_, ix) => ix !== i) });

  function addRecipe(e) {
    e.preventDefault();
    const r = {
      ...form,
      id: Date.now(),
      servings: parseInt(form.servings || "0", 10),
      ingredients: form.ingredients.filter((s) => s.trim() !== ""),
      instructions: form.instructions.filter((s) => s.trim() !== "")
    };
    setRecipes((p) => [...p, r]);
    setShowForm(false);
    setForm({
      title: "",
      image: "",
      time: "",
      servings: "",
      difficulty: "Easy",
      rating: 5.0,
      category: "",
      ingredients: [""],
      instructions: [""]
    });
  }

  /* form view */
  if (showForm) {
    return (
      <div className="container">
        <button className="button" onClick={() => setShowForm(false)}>
          ← Back to Recipes
        </button>
        <div className="form">
          <h2>Add New Recipe</h2>
          <form onSubmit={addRecipe}>
            <label>Recipe Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Biryani"
            />

            <label>Image URL</label>
            <input
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />

            <div className="inline">
              <div>
                <label>Cooking Time</label>
                <input
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="45 min"
                />
              </div>
              <div>
                <label>Servings</label>
                <input
                  required
                  type="number"
                  value={form.servings}
                  onChange={(e) =>
                    setForm({ ...form, servings: e.target.value })
                  }
                  placeholder="4"
                />
              </div>
            </div>

            <div className="inline">
              <div>
                <label>Category</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Telugu, South Indian"
                />
              </div>
              <div>
                <label>Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value })
                  }
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <label>Ingredients</label>
            {form.ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", gap: 8, margin: "6px 0" }}>
                <input
                  value={ing}
                  onChange={(e) => updateList("ingredients", i, e.target.value)}
                  placeholder="e.g., 2 cups rice"
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="button ghost"
                    onClick={() => removeRow("ingredients", i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="button"
              onClick={() => addRow("ingredients")}
            >
              + Add Ingredient
            </button>

            <label>Instructions</label>
            {form.instructions.map((st, i) => (
              <div key={i} style={{ display: "flex", gap: 8, margin: "6px 0" }}>
                <textarea
                  rows="2"
                  value={st}
                  onChange={(e) => updateList("instructions", i, e.target.value)}
                  placeholder="Describe this step..."
                ></textarea>
                {form.instructions.length > 1 && (
                  <button
                    type="button"
                    className="button ghost"
                    onClick={() => removeRow("instructions", i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="button"
              onClick={() => addRow("instructions")}
            >
              + Add Step
            </button>

            <button type="submit" className="button" style={{ width: "100%" }}>
              Add Recipe
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* recipe detail view */
  if (selected) {
    const r = selected;
    return (
      <div className="container">
        <button className="button" onClick={() => setSelected(null)}>
          ← Back to Recipes
        </button>
        <div className="detail">
          <img
            src={r.image}
            alt={r.title}
            style={{ width: "100%", height: 360, objectFit: "cover" }}
          />
          <div className="detail-body">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                gap: 12
              }}
            >
              <h1>{r.title}</h1>
              <button
                className="button"
                onClick={(e) => toggleFavorite(r.id, e)}
              >
                {favorites.includes(r.id) ? "❤️" : "🤍"}
              </button>
            </div>
            <p>
              ⏱ {r.time} | 👥 {r.servings} | ⭐ {r.rating}
            </p>

            <h3>Ingredients</h3>
            <ul>
              {r.ingredients.map((ing, i) => (
                <li key={i}>• {ing}</li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <ol>
              {r.instructions.map((st, i) => (
                <li key={i}>
                  <b>{i + 1}.</b> {st}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  /* main grid */
  return (
    <div>
      <div className="header">
        <div className="header-row container">
          <div className="brand">
            <span style={{ fontSize: 28 }}>🍳</span>
            <div>
              <h1 className="title">food for thought</h1>
              <p className="tagline">and recipes to reminisce</p>
            </div>
          </div>
          <div className="buttons">
            <span className="button ghost">{favorites.length} Favorites</span>
            <button className="button" onClick={() => setShowForm(true)}>
              + Add Recipe
            </button>
          </div>
        </div>

        <div className="search-wrap">
          <span className="search-ico">🔎</span>
          <input
            className="input"
            placeholder="Search recipes or categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid container">
        {filtered.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => setSelected(card)}
          >
            <img src={card.image} alt={card.title} />
            <div className="card-body">
              <h3>{card.title}</h3>
              <p>
                ⏱ {card.time} | 👥 {card.servings} | ⭐ {card.rating}
              </p>
              <p className="category">{card.category}</p>
              <span className="diff">{card.difficulty}</span>
            </div>
            <button
              className="button"
              style={{ position: "absolute", top: 12, right: 12 }}
              onClick={(e) => toggleFavorite(card.id, e)}
            >
              {favorites.includes(card.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No recipes found. Try a different search!
          </div>
        )}
      </div>

      <div
        className="container buttons"
        style={{ justifyContent: "flex-end", marginTop: -12, marginBottom: 12 }}
      >
        <button
          className="button ghost"
          onClick={() => {
            const blob = new Blob([JSON.stringify(recipes, null, 2)], {
              type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recipes.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export JSON
        </button>

        <label className="button ghost" style={{ cursor: "pointer" }}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const txt = await f.text();
                const data = JSON.parse(txt);
                if (Array.isArray(data)) {
                  localStorage.setItem("recipes", JSON.stringify(data));
                  location.reload();
                } else alert("Invalid JSON: expected an array of recipes.");
              } catch {
                alert("Could not import file.");
              }
            }}
          />
        </label>
      </div>

      <div className="footer">Made with ❤️ for food lovers everywhere</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
