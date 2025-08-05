import React, { useEffect, useState } from 'react';

const AIRTABLE_TOKEN = 'patlA8VoCdqHS9GkQ.63999c29a21d80a36c4617805edcd765fc4d87d1397ea34f0fa03e698f5b98bf';
const BASE_ID = 'appWGgRPKQ3yvx3zd';
const TABLE_NAME = 'Voertuigen'; // Pas aan als je tabel anders heet

export default function VoertuigenLijst() {
  const [voertuigen, setVoertuigen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVoertuigen() {
      setLoading(true);
      const res = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          },
        }
      );
      const data = await res.json();
      setVoertuigen(data.records || []);
      setLoading(false);
    }
    fetchVoertuigen();
  }, []);

  if (loading) return <div>Bezig met laden...</div>;

  return (
    <div>
      <h2>Voertuigen uit Airtable</h2>
      <ul>
        {voertuigen.map(record => (
          <li key={record.id}>
            {record.fields.Merk} {record.fields.Model} - €{record.fields.Prijs}
          </li>
        ))}
      </ul>
    </div>
  );
} 