
import React from 'react'

const yhteensa = (lista) => {
    let dummyLista = []
    lista.map(kurssinOsa => {
        return (
            dummyLista.push(kurssinOsa.tehtavia)
        )
    })
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return dummyLista.reduce(reducer)
}
const Kurssi = props => {
    return (
        <div>
            <h1>
                {props.kurssi.nimi}
            </h1>
            <ul>
                {props.kurssi.osat.map((note) => <KasitteleOsat key={note.id} note={note} />)}
                <li>Tehtavia yhteensä: {yhteensa(props.kurssi.osat)}</li>
            </ul>
        </div>
    )
}
const KasitteleOsat = ({ note }) => {
    return (
        <li>{note.nimi} {note.tehtavia}</li>
    )
}
export default Kurssi

