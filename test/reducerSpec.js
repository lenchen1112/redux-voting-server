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
                pair: ['Movie ID 1', 'Movie ID 2']
            },
            entries: []
        }));
    });

    it('handles VOTE', () => {
        const initialState = fromJS({
            vote: {
                pair: ['Movie ID 1', 'Movie ID 2']
            },
            entries: []
        });
        const action = {type: 'VOTE', entry: 'Movie ID 1'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Movie ID 1', 'Movie ID 2'],
                tally: {
                    'Movie ID 1': 1
                }
            },
            entries: []
        }));
    });

});