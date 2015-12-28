import {List, Map} from 'immutable';

function getWinners (vote) {
    if (!vote) {
        return [];
    }

    const [a, b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);

    if (aVotes === bVotes) {
        return [a, b];
    }
    return aVotes > bVotes ? [a] : [b];
}

function removePreviousVote (voteState, voter) {
    const previousVote = voteState.getIn(['votes', voter]);
    if (previousVote) {
        return voteState.updateIn(['tally', previousVote], tally => tally -1)
                        .removeIn(['votes', voter]);
    }
    return voteState;
}

function addVote (voteState, entry, voter) {
    if (voteState.get('pair').includes(entry)) {
        return voteState.updateIn(['tally', entry], 0, tally => tally + 1)
                        .setIn(['votes', voter], entry);
    }
    return voteState;
}

export function setEntries (state, entries) {
    const list = List(entries);
    return state.set('entries', list).set('initialEntries', list);
};

export function next (state, round = state.getIn(['vote', 'round'], 0)) {
    const entries = state.get('entries').concat(getWinners(state.get('vote')));

    if (entries.size === 1) {
        return state.remove('vote').remove('entries').set('winner', entries.first());
    }

    return state.merge({
        vote: Map({
            round: round + 1,
            pair: entries.take(2)
        }),
        entries: entries.skip(2)
    });
};

export function restart (state) {
    const round = state.getIn(['vote', 'round'], 0);
    const initialState = state.set('entries', state.get('initialEntries')).remove('vote').remove('winner');

    return next(initialState, round);
}

export function vote (voteState, entry, voter) {
    return addVote(
        removePreviousVote(voteState, voter),
        entry,
        voter
    );
}

export const INITIAL_STATE = Map();
