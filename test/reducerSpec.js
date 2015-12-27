import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

    it('has an initial state', () => {
        const action = {type: 'SET_ENTRIES', entries: ['Movie ID 1']};
        const nextState = reducer(undefined, action);

        expect(nextState).to.equal(fromJS({
            entries: ['Movie ID 1']
        }));
    });

    it('handles SET_ENTRIES', () => {
        const initialState = Map();
        const action = {type: 'SET_ENTRIES', entries: ['Movie ID 1']};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            entries: ['Movie ID 1']
        }));
    });

    it('handles NEXT', () => {
        const initialState = fromJS({
            entries: ['Movie ID 1', 'Movie ID 2']
        });
        const action = {type: 'NEXT'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                round: 1,
                pair: ['Movie ID 1', 'Movie ID 2']
            },
            entries: []
        }));
    });

    it('handles VOTE', () => {
        const initialState = fromJS({
            vote: {
                round: 1,
                pair: ['Movie ID 1', 'Movie ID 2']
            },
            entries: []
        });
        const action = {type: 'VOTE', entry: 'Movie ID 1', clientId: 'Client ID 1'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                round: 1,
                pair: ['Movie ID 1', 'Movie ID 2'],
                tally: {
                    'Movie ID 1': 1
                },
                votes: {
                    'Client ID 1': 'Movie ID 1'
                }
            },
            entries: []
        }));
    });

    it('can be used with reduce', () => {
        const actions = [
            {type: 'SET_ENTRIES', entries: ['Movie ID 1', 'Movie ID 2']},
            {type: 'NEXT'},
            {type: 'VOTE', entry: 'Movie ID 1', clientId: 'Client ID 1'},
            {type: 'VOTE', entry: 'Movie ID 2', clientId: 'Client ID 2'},
            {type: 'VOTE', entry: 'Movie ID 1', clientId: 'Client ID 3'},
            {type: 'NEXT'}
        ];
        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS({
            winner: 'Movie ID 1'
        }));
    });

});