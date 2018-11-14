


import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      filter: '',
      countryOfFocus: '',
    }
  }
  handleFilterChange = (event) => {
    console.log(event.target.value)
    this.setState({ filter: event.target.value, countryOfFocus: "" })
  }

  componentDidMount() {
    console.log('did mount')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        this.setState({ countries: response.data })
        console.log(response.data)
      })

  }


  render() {
    const nimenklikkaus = (country) => {
      const nimenklikkaus2 = () => {
        if (country.capital) {
          this.setState({
            countryOfFocus: country
          })
        }
      }
      return (
        nimenklikkaus2
      )
    }
    const filtteroi = (countries) => {
      let palautus = countries.filter(country => country.name.toLowerCase().includes(this.state.filter))
      if (palautus.length > 10) {
        palautus = [{ name: "too many matches, specify another filter" }]
      } else if (palautus.length === 0) {
        palautus = [{ name: "no matches" }]
      } else if (this.state.countryOfFocus.capital) {
        palautus = [this.state.countryOfFocus]
      }
      return (
        palautus
      )
    }


    const KasitteleMaat = countries => {
      if (countries.countries.length === 1) {
        return (<KasitteleOsatYksiVaan country={countries.countries[0]} />)
      } else {
        return (
          <div>
            {countries.countries.map((country) => <KasitteleOsat key={country.name} country={country} />)}
          </div>
        )
      }
    }

    const KasitteleOsat = ({ country }) => {
      return (
        <div onClick={nimenklikkaus(country)}>{country.name}</div>
      )
    }
    const KasitteleOsatYksiVaan = ({ country }) => {
      if (country.capital) {
        return (
          <ul>
            <li>Name: {country.name}</li>
            <li>Capital: {country.capital}</li>
            <img src={country.flag} alt="brbr"></img>
          </ul>
        )
      } else if (country.name) {
        return (
          <li>{country.name}</li>
        )
      } else {
        return null
      }

    }

    const countriesToShowDummy = filtteroi(this.state.countries)

    return (
      <div>
        <h2>Maahakemisto</h2>
        <form>
          find countries: <input value={this.state.filter}
            onChange={this.handleFilterChange} />
        </form>
        <h2>Löydetyt maat</h2>
        <KasitteleMaat key={countriesToShowDummy} countries={countriesToShowDummy} />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)