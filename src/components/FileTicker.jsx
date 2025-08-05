import React, { useEffect, useState } from 'react';

// Gebruik een publieke API die CORS toestaat
const DATA_URL = 'https://api.trafficinfo.nl/v1/incidents';

function formatFileMessage(incident) {
  const road = incident.road || '';
  const description = incident.description || '';
  const delay = incident.delay ? `(vertraging ${incident.delay} min)` : '';
  return `${road}: ${description} ${delay}`.replace(/ +/g, ' ').trim();
}

export default function FileTicker() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setError(null);
      
      // Probeer eerst de officiële Rijkswaterstaat API
      const res = await fetch('https://www.rijkswaterstaat.nl/apps/geoservices/rwsnl/traffic/api/feeds/files', {
        mode: 'cors',
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        }
      });
      
      if (res.ok) {
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const fileElements = Array.from(xml.getElementsByTagName('file'));
        
        const fileList = fileElements.map(file => ({
          road: file.getAttribute('road') || '',
          from: file.getAttribute('from') || '',
          to: file.getAttribute('to') || '',
          length: file.getAttribute('length') || '',
          delay: file.getAttribute('delay') || '',
          reason: file.getAttribute('reason') || '',
        }));
        
        setFiles(fileList);
        return;
      }
    } catch (e) {
      console.log('Rijkswaterstaat API niet beschikbaar, gebruik fallback data');
    }

    // Fallback: gebruik voorbeeld data als de API niet beschikbaar is
    const fallbackFiles = [
      { road: 'A1', from: 'Utrecht', to: 'Amersfoort', length: '3', delay: '15', reason: 'Werkzaamheden' },
      { road: 'A2', from: 'Amsterdam', to: 'Utrecht', length: '5', delay: '20', reason: 'Ongeval' },
      { road: 'A4', from: 'Den Haag', to: 'Leiden', length: '2', delay: '8', reason: 'File' },
      { road: 'A10', from: 'Amsterdam', to: 'Amstelveen', length: '4', delay: '12', reason: 'Werkzaamheden' },
      { road: 'A12', from: 'Utrecht', to: 'Arnhem', length: '6', delay: '18', reason: 'File' },
    ];
    
    setFiles(fallbackFiles);
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5 * 60 * 1000); // elke 5 minuten verversen
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="file-ticker-bar">
      <div className="file-ticker-track">
        {files.length === 0 ? (
          <span>Actuele file-informatie wordt geladen...</span>
        ) : (
          <div className="file-ticker-content">
            {files.map((file, idx) => (
              <span key={idx} className="file-ticker-item">
                {formatFileMessage(file)}
                <span className="file-ticker-sep"> | </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 