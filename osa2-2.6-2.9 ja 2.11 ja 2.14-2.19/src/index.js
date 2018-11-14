
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import personService from './personService/persons'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
      msg2user: null,
      errorMsg: null,
    }
  }
  handleNameChange = (event) => {
    console.log(event.target.value)
    this.setState({ newName: event.target.value })
    personService.getAll()
      .then(response => {
        this.setState({
          persons: response
        })
      })
  }
  handleNumberChange = (event) => {
    console.log(event.target.value)
    this.setState({ newNumber: event.target.value })
    personService.getAll()
      .then(response => {
        this.setState({
          persons: response
        })
      })
  }
  handleFilterChange = (event) => {
    console.log(event.target.value)
    this.setState({ filter: event.target.value })
    personService.getAll()
      .then(response => {
        this.setState({
          persons: response
        })
      })
  }

  addNote = (event) => {
    event.preventDefault()
    if (this.state.persons.some(n => n.name === this.state.newName)) {
      let person = this.state.persons.find(n => n.name === this.state.newName)
      const result = window.confirm(person.name + ' on jo luettelossa, korvataanko vanha numero uudella?')
      if (result) {
        person.number = this.state.newNumber
        personService.update(person.id, person)
          .then(response => {
            this.setState({
              newName: '',
              newNumber: '',
              msg2user: 'Muutettiin yhteystiedon ' + person.name + ' numeroa'
            })
          })
          .catch(error => {
            this.setState({
              newName: '',
              newNumber: '',
              errorMsg: "Muutos ei onnistunut, koska " + error,
            })
            console.log(error)
          })
        setTimeout(() => {
          this.setState({ msg2user: null, errorMsg: null })
        }, 5000)
      } else {
        console.log('duplikaatti')
        this.setState({
          newName: '',
          newNumber: '',
          errorMsg: "Et muuttanut yhteystietoa",
        })
        setTimeout(() => {
          this.setState({ msg2user: null, errorMsg: null })
        }, 5000)
      }
    } else {
      const person = {
        name: this.state.newName,
        number: this.state.newNumber,
      }
      personService
        .create(person)
        .then(newPerson => {
          this.setState({
            persons: this.state.persons.concat(newPerson),
            newName: '',
            newNumber: '',
            msg2user: 'Lisättiin yhteystieto ' + person.name
          })
        })
        .catch(error => {
          this.setState({
            errorMsg: 'Lisääminen ei onnistunut'
          })
        })
      setTimeout(() => {
        this.setState({ msg2user: null, errorMsg: null })
      }, 5000)
    }
  }

  componentDidMount() {
    personService
      .getAll()
      .then(response => {
        this.setState({ persons: response })
      })
  }


  render() {
    const UserMessages = (props) => {
      if (this.state.msg2user !== null) {
        return (
          <div className="success">
            {this.state.msg2user}
          </div>
        )
      }
      if (this.state.errorMsg !== null) {
        return (
          <div className="error">
            {this.state.errorMsg}
          </div>
        )
      } else {
        return null
      }
    }
    const poista = (henkilo) => {
      const poista2 = () => {
        const result = window.confirm('Poistetaanko ' + henkilo.name)
        if (result) {
          const person = this.state.persons.find(n => n.name === henkilo.name)
          const newList = this.state.persons.filter(n => n.name !== henkilo.name)
          personService
            .deleteStuff(person.id)
            .then(response => {
              this.setState({
                persons: newList,
                msg2user: 'Poistettiin yhteystieto ' + person.name,
              })
            })
            .catch(error => {
              this.setState({
                errorMsg: 'Poistaminen ei onnistunut'
              })
            })
          setTimeout(() => {
            this.setState({ msg2user: null, errorMsg: null })
          }, 5000)
        }
      }
      return poista2
    }
    const peopleToShow = this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.filter))
    const KasitteleOsat = (person) => {
      return (
          <tr>
            <td className="nimi">
              {person.name}
            </td>
            <td className="numero">
              {person.number}
            </td>
            <td>
              <button onClick={poista(person)}>poista</button>
            </td>
          </tr>
      )
    }
    return (
      <div>
        {UserMessages()}
        <h1>Puhelinluettelo</h1>
        <form>
          filter: <input value={this.state.filter}
            onChange={this.handleFilterChange} />
        </form>
        <form onSubmit={this.addNote}>
          <div>
            nimi: <input
              value={this.state.newName}
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            numero: <input
              value={this.state.newNumber}
              onChange={this.handleNumberChange}
            />
          </div>

          <button type="submit">lisää</button>
        </form>
        <h2>Numerot</h2>
        <table>
          <tbody>
            {peopleToShow.map((person) => <KasitteleOsat key={person.name} name={person.name} number={person.number} />)}
          </tbody>
        </table>

      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
