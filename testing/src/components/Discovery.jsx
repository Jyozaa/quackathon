// src/components/Discovery.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Discovery = () => {
  const [items, setItems] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let query = '';
  if (filterType === 'flower') {
    query = 'flower';
  } else if (filterType === 'plant') {
    query = 'plant';
  } else if (filterType === 'bug') {
    query = 'bug';
  } else {
    query = ''; 
  }


  const fetchWikipediaSummary = async (title) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.extract;
      }
    } catch (error) {
      console.error('Error fetching Wikipedia summary:', error);
    }
    return null;
  };

 
  const enrichItems = async (items) => {
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.wikipedia_summary) {
          const summary = await fetchWikipediaSummary(item.name);
          return { ...item, wikipedia_summary: summary };
        }
        return item;
      })
    );
    return enrichedItems;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.inaturalist.org/v1/taxa?page=${currentPage}&per_page=12&locale=en&q=${query}`
        );
        const data = await response.json();
        const enriched = await enrichItems(data.results);
        setItems(enriched);
      } catch (err) {
        setError('Failed to fetch data.');
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, filterType, query]);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', padding: '1rem' }}>
        <h3>Filter</h3>
        <div>
          <input
            type="radio"
            id="all"
            name="filter"
            value="all"
            checked={filterType === 'all'}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          />
          <label htmlFor="all" style={{ marginLeft: '0.5rem' }}>All</label>
        </div>
        <div>
          <input
            type="radio"
            id="flower"
            name="filter"
            value="flower"
            checked={filterType === 'flower'}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          />
          <label htmlFor="flower" style={{ marginLeft: '0.5rem' }}>Flower</label>
        </div>
        <div>
          <input
            type="radio"
            id="plant"
            name="filter"
            value="plant"
            checked={filterType === 'plant'}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          />
          <label htmlFor="plant" style={{ marginLeft: '0.5rem' }}>Plant</label>
        </div>
        <div>
          <input
            type="radio"
            id="bug"
            name="filter"
            value="bug"
            checked={filterType === 'bug'}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          />
          <label htmlFor="bug" style={{ marginLeft: '0.5rem' }}>Bug</label>
        </div>
      </aside>

      {/* Main Content Section */}
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}
              >
                <img
                  src={
                    item.default_photo
                      ? item.default_photo.medium_url
                      : 'https://via.placeholder.com/250'
                  }
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <h4 style={{ marginTop: '0.5rem' }}>{item.name}</h4>
                {/* Button to view details */}
                <Link to={`/details/${item.id}`} state={item}>
                  <button className="nes-btn is-primary" style={{ marginTop: '0.5rem' }}>
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="nes-btn"
          >
            Back
          </button>
          <button 
            onClick={handleNextPage}
            className="nes-btn"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Discovery;
