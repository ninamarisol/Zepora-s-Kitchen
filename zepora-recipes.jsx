import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Edit2, X, ChefHat, Sparkles } from 'lucide-react';

const ZeporaRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const courses = [
    { id: 'entrees', label: 'Entrées', icon: '🍽️' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'salads', label: 'Salads', icon: '🥗' },
    { id: 'appetizers', label: 'Appetizers', icon: '🥖' },
    { id: 'drinks', label: 'Drinks', icon: '🍹' },
    { id: 'sides', label: 'Sides', icon: '🥔' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    course: 'entrees',
    originalLink: '',
    notes: '',
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const result = await window.storage.get('zepora-recipes');
      if (result) {
        setRecipes(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No existing recipes found');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipes = async (updatedRecipes) => {
    try {
      await window.storage.set('zepora-recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      id: editingId || Date.now().toString(),
      ...formData,
      createdAt: editingId ? recipes.find(r => r.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedRecipes;
    if (editingId) {
      updatedRecipes = recipes.map(r => r.id === editingId ? newRecipe : r);
    } else {
      updatedRecipes = [...recipes, newRecipe];
    }

    saveRecipes(updatedRecipes);
    resetForm();
  };

  const handleEdit = (recipe) => {
    setFormData(recipe);
    setEditingId(recipe.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this recipe?')) {
      saveRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      ingredients: '',
      instructions: '',
      course: 'entrees',
      originalLink: '',
      notes: '',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const filteredRecipes = selectedCourse === 'all' 
    ? recipes 
    : recipes.filter(r => r.course === selectedCourse);

  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
      <div className="recipe-header">
        <div className="recipe-course-badge">
          {courses.find(c => c.id === recipe.course)?.icon} {courses.find(c => c.id === recipe.course)?.label}
        </div>
        <div className="recipe-actions">
          <button onClick={() => handleEdit(recipe)} className="icon-btn" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(recipe.id)} className="icon-btn" title="Delete">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <h3 className="recipe-title">{recipe.title}</h3>
      
      <div className="recipe-section">
        <h4>Ingredients</h4>
        <div className="ingredients-list">
          {recipe.ingredients.split('\n').filter(i => i.trim()).map((ingredient, idx) => (
            <div key={idx} className="ingredient-item">
              <Sparkles size={12} className="ingredient-icon" />
              <span>{ingredient}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="recipe-section">
        <h4>Instructions</h4>
        <p className="recipe-instructions">{recipe.instructions}</p>
      </div>

      {recipe.notes && (
        <div className="recipe-section recipe-notes">
          <h4>Zepora's Notes</h4>
          <p>{recipe.notes}</p>
        </div>
      )}

      {recipe.originalLink && (
        <a 
          href={recipe.originalLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="original-link"
        >
          <ExternalLink size={14} />
          <span>Original Recipe</span>
        </a>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <ChefHat size={48} className="loading-icon" />
        <p>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #e8f3f1 0%, #f0f4f8 50%, #e6e9f0 100%);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #2c3e50;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .header::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #7ba5a0, transparent);
        }

        .main-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 300;
          color: #4a6b66;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .subtitle {
          font-size: 1rem;
          color: #7ba5a0;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .course-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1.5px solid #d4e3e0;
          background: white;
          color: #5a7873;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: #f0f8f6;
          border-color: #7ba5a0;
          transform: translateY(-1px);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #7ba5a0, #5a7873);
          color: white;
          border-color: #7ba5a0;
          box-shadow: 0 2px 8px rgba(122, 165, 160, 0.2);
        }

        .add-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #8fb5af, #6a9490);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(122, 165, 160, 0.2);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(122, 165, 160, 0.3);
        }

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(44, 62, 80, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .form-container {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #4a6b66;
          font-weight: 400;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #8fb5af;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f0f8f6;
          color: #5a7873;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #5a7873;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        input, textarea, select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #d4e3e0;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: #2c3e50;
          transition: all 0.2s ease;
          background: white;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #7ba5a0;
          box-shadow: 0 0 0 3px rgba(122, 165, 160, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-hint {
          font-size: 0.8rem;
          color: #8fb5af;
          margin-top: 0.25rem;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary {
          flex: 1;
          padding: 0.875rem;
          background: linear-gradient(135deg, #8fb5af, #6a9490);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 165, 160, 0.25);
        }

        .btn-secondary {
          flex: 1;
          padding: 0.875rem;
          background: white;
          color: #5a7873;
          border: 1.5px solid #d4e3e0;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f0f8f6;
          border-color: #8fb5af;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          animation: fadeIn 0.5s ease;
        }

        .recipe-card {
          background: white;
          border-radius: 12px;
          padding: 1.75rem;
          box-shadow: 0 2px 12px rgba(74, 107, 102, 0.08);
          transition: all 0.3s ease;
          animation: slideUp 0.4s ease;
          border: 1px solid #e8f3f1;
        }

        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(74, 107, 102, 0.12);
        }

        .recipe-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .recipe-course-badge {
          background: linear-gradient(135deg, #e8f3f1, #d4e3e0);
          color: #5a7873;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .recipe-actions {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #8fb5af;
          padding: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background: #f0f8f6;
          color: #5a7873;
        }

        .recipe-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          color: #4a6b66;
          margin-bottom: 1.25rem;
          font-weight: 400;
          line-height: 1.3;
        }

        .recipe-section {
          margin-bottom: 1.25rem;
        }

        .recipe-section h4 {
          color: #5a7873;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .ingredients-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ingredient-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #5a7873;
          font-size: 0.925rem;
          line-height: 1.5;
        }

        .ingredient-icon {
          color: #a8ccc7;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .recipe-instructions {
          color: #5a7873;
          line-height: 1.7;
          font-size: 0.925rem;
        }

        .recipe-notes {
          background: linear-gradient(135deg, #f7fcfb, #f0f8f6);
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #8fb5af;
        }

        .recipe-notes p {
          color: #4a6b66;
          font-style: italic;
          font-size: 0.925rem;
          line-height: 1.6;
        }

        .original-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: #7ba5a0;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .original-link:hover {
          background: #f0f8f6;
          color: #5a7873;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #8fb5af;
        }

        .empty-icon {
          color: #a8ccc7;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #7ba5a0;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #7ba5a0;
        }

        .loading-icon {
          color: #8fb5af;
          margin-bottom: 1rem;
          animation: float 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .course-filters {
            justify-content: center;
          }

          .recipes-grid {
            grid-template-columns: 1fr;
          }

          .form-container {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="header">
        <h1 className="main-title">Zepora's Kitchen</h1>
        <p className="subtitle">Curated Recipes</p>
      </div>

      <div className="controls">
        <div className="course-filters">
          <button
            className={`filter-btn ${selectedCourse === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCourse('all')}
          >
            All Recipes
          </button>
          {courses.map(course => (
            <button
              key={course.id}
              className={`filter-btn ${selectedCourse === course.id ? 'active' : ''}`}
              onClick={() => setSelectedCourse(course.id)}
            >
              {course.icon} {course.label}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
          Add Recipe
        </button>
      </div>

      {showAddForm && (
        <div className="form-overlay" onClick={(e) => e.target.className === 'form-overlay' && resetForm()}>
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">{editingId ? 'Edit Recipe' : 'New Recipe'}</h2>
              <button className="close-btn" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Recipe Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g., Grandma's Apple Pie"
                />
              </div>

              <div className="form-group">
                <label>Course *</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.icon} {course.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ingredients *</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  required
                  placeholder="2 cups flour&#10;1 tsp vanilla&#10;3 eggs"
                  rows={6}
                />
                <div className="form-hint">One ingredient per line</div>
              </div>

              <div className="form-group">
                <label>Instructions *</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  required
                  placeholder="Preheat oven to 350°F. Mix ingredients..."
                  rows={6}
                />
              </div>

              <div className="form-group">
                <label>Original Recipe Link (optional)</label>
                <input
                  type="url"
                  value={formData.originalLink}
                  onChange={(e) => setFormData({...formData, originalLink: e.target.value})}
                  placeholder="https://example.com/recipe"
                />
              </div>

              <div className="form-group">
                <label>Zepora's Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="I added extra cinnamon and reduced sugar by 1/4 cup..."
                  rows={4}
                />
                <div className="form-hint">Note any changes or special tips</div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Recipe' : 'Save Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <ChefHat size={64} className="empty-icon" />
          <h3>No recipes yet</h3>
          <p>Start by adding your first delicious creation</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ZeporaRecipes;
