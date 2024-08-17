/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';

function Form({ people, setPeople, budget, setBudget, calculateResults, deletePerson }) {
    const [name, setName] = useState('');
    const [contribution, setContribution] = useState('');
    const [error, setError] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [isEditingBudget, setIsEditingBudget] = useState(true);
    const titleRef = useRef(null);

    const formatNumber = (value) => {

        if (!value && value !== 0) return '';  // Manejar caso de valor vacío
        return value.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const parseNumber = (value) => {
        if (typeof value !== 'string') {
            value = value.toString();
        }
        const parsed = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        return isNaN(parsed) ? 0 : parsed;
    };

    const handleBudgetChange = (e) => {
        const value = e.target.value.replace(/[^\d,]/g, '');
        setBudget(value);
    };

    const handleBudgetBlur = () => {
        setBudget(formatNumber(parseNumber(budget)));
    };

    const toggleBudgetEdit = () => {
        if (isEditingBudget) {
            const numericBudget = parseNumber(budget);
            if (numericBudget === 0) {
                setError('El presupuesto no puede ser $0,00.');
                setBudget('');
                return;
            } else {
                setBudget(formatNumber(numericBudget));
                setError('');
                setIsEditingBudget(false);  // Dejar de editar el presupuesto
            }
        } else {
            setIsEditingBudget(true);  // Permitir editar el presupuesto nuevamente
        }
    };

    const handleContributionBlur = () => {
        setContribution(formatNumber(parseNumber(contribution)));
        setError('');
    };

    const handleContributionChange = (e) => {
        const value = e.target.value.replace(/[^\d,]/g, '');
        setContribution(value);
        setError('');
    };

    const addPerson = () => {
        const trimmedName = name.trim();
        if (name.trim() === '') {
            setError('El nombre no puede estar vacío.');
            return;
        }

        // if (people.some(person => person.name.toLowerCase() === name.trim().toLowerCase())) {
        //     setError('Este nombre ya existe. Por favor, ingrese un nombre diferente.');
        //     return;
        // }
        const isDuplicateName = people.some((person, index) => person.name === trimmedName && index !== editIndex);

        if (isDuplicateName) {
            setError('El nombre ya existe. Por favor, elija otro nombre.');
            return;
        }

        const numericContribution = parseNumber(contribution);

        if (editIndex !== null) {
            const updatedPeople = [...people];
            updatedPeople[editIndex] = { name: trimmedName, contribution: numericContribution };
            setPeople(updatedPeople);
            setEditIndex(null);
        } else {
            setPeople([...people, { name: trimmedName, contribution: numericContribution }]);
        }

        setName('');
        setContribution('');
        setError('');
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setName(people[index].name);
        setContribution(formatNumber(people[index].contribution));

        if (titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        setName('');
        setContribution('');
        setEditIndex(null);
        setError('');
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const totalContributions = people.reduce((sum, person) => sum + person.contribution, 0);

    return (
        <div>
            {isEditingBudget && <h2>Ingresa un presupuesto</h2>}
            {isEditingBudget ? (

                <input
                    type="text"
                    value={budget}
                    onChange={handleBudgetChange}
                    onBlur={handleBudgetBlur}
                    onFocus={(e) => e.target.select()}
                    placeholder="Escribe el presupuesto total"
                />
            ) : (
                <label>Presupuesto Total: <span className='total-bugdet'> ${budget}</span></label>
            )}
            <br />
            <button className='button-budget' onClick={toggleBudgetEdit}>
                {isEditingBudget ? 'Aceptar' : 'Modificar'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* MOSTRAR EL FORMULARIO AGREGAR PERSONAS SI HAY PRESUPUESTO */}
            {!isEditingBudget && (
                <>
                    <h3 ref={titleRef}>{editIndex !== null ? 'Editar Persona' : 'Agregar Personas'}</h3>

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => {
                            // Permite solo letras y caracteres especiales permitidos
                            const newValue = e.target.value;
                            // Expresión regular para permitir letras, espacios y algunos caracteres especiales
                            if (/^[a-zA-ZÀ-ÿ\s]*$/.test(newValue)) {
                                setName(newValue);
                            }
                        }}
                        onBlur={() => {
                            setError('');
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Contribución"
                        value={contribution}
                        onChange={handleContributionChange}
                        onBlur={handleContributionBlur}
                        inputMode="decimal"
                        onFocus={(e) => e.target.select()}
                    />
                    <button
                        onClick={addPerson}
                        className={editIndex !== null ? 'button-update' : 'button-add'}
                    >
                        {editIndex !== null ? 'Modificar' : 'Agregar'}
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="button-cancel"
                        style={{ display: editIndex !== null ? 'inline-block' : 'none' }}
                    >
                        Cancelar
                    </button>


                    {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

                    {/* Mostrar la tabla y el botón Calcular Resultados solo si hay personas */}
                    {people.length > 0 && (
                        <>
                            <h3>Lista de Personas</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Contribución</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {people.map((person, index) => (
                                        <tr key={index}>
                                            <td>{person.name}</td>
                                            <td>$ {formatNumber(person.contribution)}</td>
                                            <td><button className='button-edit' onClick={() => startEdit(index)}>Editar</button></td>
                                            <td><button className='button-delete' onClick={() => deletePerson(index)}>Eliminar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="" className='table-total'>Total:</td>
                                        <td className='table-contribution'>$ {formatNumber(totalContributions)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <button className='button-calcular' onClick={calculateResults}>Calcular</button>
                        </>
                    )}
                    {/* Botón para refrescar la página */}
                    <label onClick={refreshPage} className="refresh-label">
                        Volver a calcular
                    </label>
                </>
            )}
        </div>

    );
}

export default Form;