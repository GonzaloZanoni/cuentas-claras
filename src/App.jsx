import { useState, useEffect } from 'react';
import Form from './components/Form';
import Results from './components/Results';

function App() {
  const [people, setPeople] = useState([]);
  const [budget, setBudget] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const parseNumber = (value) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  // Efecto para resetear resultados al cambiar el presupuesto
  useEffect(() => {
    setResults(null);
  }, [budget]);

  const calculateResults = () => {
    const totalContributions = people.reduce((sum, person) => sum + person.contribution, 0);
    const numericBudget = parseNumber(budget);

    console.log('contribuciones: ' + totalContributions.toFixed(2))
    console.log(numericBudget.toFixed(2))

    if (totalContributions.toFixed(2) !== numericBudget.toFixed(2)) {
      setError('La suma de las contribuciones no coincide con el presupuesto total.');
      setResults(null);  // Limpiar los resultados anteriores
      return;
    }

    const totalPeople = people.length;
    const idealShare = numericBudget / totalPeople;

    let results = people.map(person => {
      let difference = person.contribution - idealShare;
      return { ...person, difference };
    });

    setResults(results);
    setError('');  // Limpiar el mensaje de error
  };

  const editPerson = (index, newContribution) => {
    const updatedPeople = [...people];
    updatedPeople[index].contribution = parseFloat(newContribution);
    setPeople(updatedPeople);
  };

  const deletePerson = (index) => {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
  };


  return (
    <div className="App">
      <h1>Cuentas Claras</h1>
      <Form
        people={people}
        setPeople={setPeople}
        budget={budget}
        setBudget={setBudget}
        calculateResults={calculateResults}
        editPerson={editPerson}
        deletePerson={deletePerson}
      />

      {/* Mostrar mensaje de error si existe */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && <Results results={results} />}

    </div>
  );
}

export default App;
