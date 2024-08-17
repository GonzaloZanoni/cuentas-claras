/* eslint-disable react/prop-types */


function Results({ results }) {
    const totalBudget = results.reduce((sum, person) => sum + person.contribution, 0);
    const totalPeople = results.length;
    const amountPerPerson = (totalBudget / totalPeople).toFixed(2).replace('.', ',');


    return (
        <div className="results-container">
            <h2>Resultados</h2>
            <p className="p-result">
                El presupuesto total y la cantidad de contribuciones son iguales <b>(${totalBudget.toFixed(2).replace('.', ',')})</b>,
                por lo tanto cada persona<b>({totalPeople})</b> debe abonar un total de <b>(${amountPerPerson})</b>.
            </p>
            <ul className="results-list">
                {results.map((person, index) => (
                    <li
                        key={index}
                        className={`result-item ${person.difference > 0 ? 'positive' : person.difference < 0 ? 'negative' : 'neutral'
                            }`}
                    >
                        <span className="result-name">{person.name}</span> {person.difference > 0 ? "recibe: +" : person.difference < 0 ? "debe: -" : "no debe ni recibe: "}${Math.abs(person.difference.toFixed(2))}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default Results;
