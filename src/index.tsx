import * as React from 'react';
import {render} from 'react-dom';

import {Verb} from './include/verb';
import * as _ from 'lodash';

const PerPage = 22

// They need extra training. Macrons will be removed by matching
const failedInfinitives = [
  'constituere',
  'delere',
  'dicere',
  'educare',
  'gerere',
  'interrogare',
  'monere',
  'oppugnare',
  'prohibere',
  'properare',
]

interface VerbTestCardProps {
  verb: Verb,
}

const VerbCard = ({ verb }: VerbTestCardProps) => {
  return (
    <li>
      <label>{verb.present_infinitive}</label>
      <div/>
    </li>
  )
}

interface VerbTestState {
  verbs:    Verb[],
  selected: Verb[]
}

class VerbTest extends React.Component<{}, VerbTestState> {
  constructor(props) {
    super(props)

    this.state = { verbs: [], selected: [] };
  }

  componentDidMount() {
    fetch('https://latin-cards.fsvehla.at/data/verbs.json')
      .then(r => r.json())
      .then((raw) => {
        let allVerbs: Verb[] = raw

        let matchedFailedVerbs = _.filter(allVerbs, f => {
          let normalizedPresentInf = f.present_infinitive
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, '')

          return failedInfinitives.indexOf(normalizedPresentInf) != -1
        })

        // ensure that we always have the troublesome, then add some random ones, and then shuffle again
        let shuffled =
          _.shuffle(
            _.uniq([...matchedFailedVerbs, ..._.shuffle(allVerbs)])
              .slice(0, PerPage)
          )

        this.setState({ verbs: allVerbs, selected: shuffled })
      })
  }

  render(): React.ReactNode {
    return <main>
      <h1>Verb Test</h1>

      <p>Übersetze das Verb (immer im Infinitiv Präsens angegeben)</p>

      <ul>
        { this
            .state
            .selected
            .map(v => <VerbCard verb={v} key={v.present_infinitive}/>)
        }
      </ul>
    </main>
  }
}

render(<VerbTest/>, document.getElementById('root'));
