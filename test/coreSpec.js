import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () => {

        it('add the entries to the state', () => {
            const state = Map();
            const entries = List.of('Movie ID 1', 'Movie ID 2');
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Movie ID 1', 'Movie ID 2')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Movie ID 1', 'Movie ID 2'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Movie ID 1', 'Movie ID 2')
            }));
        });

    });

    describe('next', () => {

        it('takes the next two entries under vote', () => {
            const state = Map({
                entries: List.of('Movie ID 1', 'Movie ID 2', 'Movie ID 3')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Movie ID 1', 'Movie ID 2')
                }),
                entries: List.of('Movie ID 3')
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Movie ID 1', 'Movie ID 2'),
                    tally: Map({
                        'Movie ID 1': 2,
                        'Movie ID 2': 3
                    })
                }),
                entries: List.of('Movie ID 3', 'Movie ID 4', 'Movie ID 5')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Movie ID 3', 'Movie ID 4')
                }),
                entries: List.of('Movie ID 5', 'Movie ID 2')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Movie ID 1', 'Movie ID 2'),
                    tally: Map({
                        'Movie ID 1': 3,
                        'Movie ID 2': 3
                    })
                }),
                entries: List.of('Movie ID 3', 'Movie ID 4', 'Movie ID 5')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Movie ID 3', 'Movie ID 4')
                }),
                entries: List.of('Movie ID 5', 'Movie ID 1', 'Movie ID 2')
            }));
        });

        it('marks winner when just one entry left', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Movie ID 3', 'Movie ID 5'),
                    tally: Map({
                        'Movie ID 3': 7,
                        'Movie ID 5': 4
                    })
                }),
                entries: List()
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                winner: 'Movie ID 3'
            }));
        });

    });

    describe('vote', () => {

        it('creates a tally for the voted entry', () => {
            const state = Map({
                pair: List.of('Movie ID 1', 'Movie ID 2')
            });
            const nextState = vote(state, 'Movie ID 1');

            expect(nextState).to.equal(Map({
                pair: List.of('Movie ID 1', 'Movie ID 2'),
                tally: Map({
                    'Movie ID 1': 1
                })
            }));
        });

        it('adds existing tally for the voted entry', () => {
            const state = Map({
                pair: List.of('Movie ID 1', 'Movie ID 2'),
                tally: Map({
                    'Movie ID 1': 2,
                    'Movie ID 2': 3
                })
            });
            const nextState = vote(state, 'Movie ID 1');

            expect(nextState).to.equal(Map({
                pair: List.of('Movie ID 1', 'Movie ID 2'),
                tally: Map({
                    'Movie ID 1': 3,
                    'Movie ID 2': 3
                })
            }));
        });

    });

});