const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 1) Load all recipe files
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const files = [
          "./recipes.json",
          "./recipes-telugu.json", 
          "./recipes-south-indian.json",
          "./recipes-kerala.json",
          "./recipes-kannada.json",
          "./recipes-desserts.json",
          "./recipes-north-indian.json"
        ];
        
        const allRecipes = [];
        
        for (const file of files) {
          try {
            const response = await fetch(file);
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data)) {
                allRecipes.push(...data);
              }
            }
          } catch (err) {
            // Skip files that don't exist
            continue;
          }
        }
        
        setRecipes(allRecipes);
      } catch (e) {
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  // 2) Filter by title or category text
  const filtered = recipes.filter((r) => {
    if (!r || !r.title) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    
    const title = r.title.toLowerCase();
    const categories = Array.isArray(r.category) ? r.category.join(" ").toLowerCase() : (r.category || "").toLowerCase();
    const ingredients = Array.isArray(r.ingredients) ? r.ingredients.join(" ").toLowerCase() : "";
    
    return title.includes(q) || categories.includes(q) || ingredients.includes(q);
  });

  // ---------- Loading / Error ----------
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading recipes...</h2>
        <p>Please wait while we load your family recipe collection</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>⚠️ {error}</h2>
        <p>Please refresh the page to try again</p>
      </div>
    );
  }

  // ---------- Detail View ----------
  if (selected) {
    return (
      <div className="container">
        <button className="button" onClick={() => setSelected(null)}>← Back</button>

        <div className="detail" style={{ marginTop: 16 }}>
          <img
            src={selected.id === 1 ? './images/hyderabadibiryani.jpg' : selected.id === 24 ? './images/andhrachickencurry.jpg' : selected.image}
            alt={selected.title}
            style={{ width: "100%", height: 360, objectFit: "cover" }}
            onError={(e) => {
              // Fallback to placeholder if specific image fails
              e.target.src = selected.image;
            }}
          />
          <div className="detail-body">
            <h1 
              className={selected.title.includes('పె') ? 'telugu' : ''}
              style={{ marginBottom: 8 }}
            >
              {selected.title}
            </h1>
            <div className="recipe-stats">
              <span>⏱ {selected.time}</span>
              <span>👥 {selected.servings}</span>
              <span>💪 {selected.difficulty}</span>
            </div>

            <h3>Ingredients</h3>
            <ul>
              {selected.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>

            <h3>Instructions</h3>
            <ol>
              {selected.instructions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            {selected.credit && (
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 12px",
                  border: "1px dashed #c57b57",
                  borderRadius: 10,
                  background: "#fffaf4"
                }}
              >
                🧑‍🍳 <strong>Cooking Credits:</strong>{" "}
                {selected.credit.link
                  ? <a href={selected.credit.link} target="_blank" rel="noreferrer">{selected.credit.display}</a>
                  : <span>{selected.credit.display}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Main Grid ----------
  return (
    <>
      <header className="header">
        <div className="header-row container">
          <div className="brand">
            <div className="logo-container">
              <img 
                src="./images/matki.jpg" 
                alt="Cooking Pot Logo" 
                className="logo-image"
                onError={(e) => {
                  // If image fails, show a simple cooking pot emoji
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style="font-size: 32px;">🍲</div>';
                }}
              />
            </div>
            <div className="brand-text">
              <h1 className="title">food for thought</h1>
              <span className="tagline">
                and recipes to reminisce
              </span>
            </div>
          </div>

          <div className="buttons">
            <div className="logo-container right-logo">
              <img 
                src="./images/matki.jpg" 
                alt="Cooking Pot Logo" 
                className="logo-image"
                onError={(e) => {
                  // If image fails, show a simple cooking pot emoji
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style="font-size: 32px;">🍲</div>';
                }}
              />
            </div>
            <a
              className="button ghost"
              href="https://docs.google.com/forms/d/e/1FAIpQLSeNIzZZVF1-nnTq3McM1NUuOU6N9GMEt8k-iHR7w9PU2I6YZw/viewform?usp=header"
              target="_blank"
              rel="noreferrer"
            >
              Submit a Recipe
            </a>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-wrap">
          <span className="search-ico">🔎</span>
          <input
            className="input"
            placeholder="Search recipes or categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '16px', padding: '12px' }}
          />
        </div>
      </header>

      <main className="grid container">
        {filtered.map((r) => (
          <div className="card" key={r.id} onClick={() => setSelected(r)}>
            <img 
              src={r.id === 1 ? './images/hyderabadibiryani.jpg' : r.id === 24 ? './images/andhrachickencurry.jpg' : r.image} 
              alt={r.title}
              loading="lazy"
              onError={(e) => {
                // Fallback to placeholder if specific image fails
                e.target.src = r.image;
              }}
            />
            <div className="card-body">
              <h3>{r.title}</h3>
              <p style={{ margin: "4px 0 6px" }}>
                {(Array.isArray(r.category) ? r.category.join(", ") : r.category) || ""}
              </p>
              <span className="diff">{r.time} • {r.difficulty}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.7 }}>
            {search ? `No recipes found for "${search}". Try searching for "biryani", "chicken", or "dessert".` : "No recipes yet. Add some to recipes.json or use the Google Form."}
          </div>
        )}
      </main>

      <footer className="footer">
        Made with ❤️ for food lovers everywhere
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
