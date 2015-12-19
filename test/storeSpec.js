import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('store', () => {

    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();

        expect(store.getState()).to.equal(Map());

        store.dispatch({
            type: 'SET_ENTRIES',
            entries: ['Movie ID 1', 'Movie ID 2']
        });

        expect(store.getState()).to.equal(fromJS({
            entries: ['Movie ID 1', 'Movie ID 2']
        }));
    });

});