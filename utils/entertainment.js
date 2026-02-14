import { jokes } from '../data/jokes';
import { facts } from '../data/facts';
import { triviaQuestions } from '../data/trivia';
import { personalityQuestions } from '../data/personality';
import { puzzles } from '../data/puzzles';
import { learningContent } from '../data/learning';
import { metaHumorMessages } from '../data/metaHumor';

const MODULES = [
    'joke',
    'fact',
    'trivia',
    'personality',
    'detective',
    'learning',
    'meta',
];

let usedIndices = {};

const getRandomUnused = (array, type) => {
    if (!usedIndices[type]) usedIndices[type] = new Set();
    if (usedIndices[type].size >= array.length) usedIndices[type].clear();

    let idx;
    do {
        idx = Math.floor(Math.random() * array.length);
    } while (usedIndices[type].has(idx));

    usedIndices[type].add(idx);
    return array[idx];
};

export const getRandomModule = () => {
    const idx = Math.floor(Math.random() * MODULES.length);
    return MODULES[idx];
};

export const getRandomJoke = () => getRandomUnused(jokes, 'joke');
export const getRandomFact = () => getRandomUnused(facts, 'fact');
export const getRandomTrivia = () => getRandomUnused(triviaQuestions, 'trivia');
export const getRandomPersonality = () => getRandomUnused(personalityQuestions, 'personality');
export const getRandomPuzzle = () => getRandomUnused(puzzles, 'puzzle');
export const getRandomLearning = () => getRandomUnused(learningContent, 'learning');

export const getMetaHumor = (elapsedSec, sassLevel = 1) => {
    const applicable = metaHumorMessages.filter(
        (m) => elapsedSec >= m.minTime && (m.maxTime === undefined || elapsedSec <= m.maxTime) && (m.sassLevel || 1) <= sassLevel
    );
    if (applicable.length === 0) {
        return metaHumorMessages[Math.floor(Math.random() * metaHumorMessages.length)];
    }
    return applicable[Math.floor(Math.random() * applicable.length)];
};

export const getNextEntertainment = (elapsedSec, sassLevel) => {
    const moduleType = getRandomModule();
    switch (moduleType) {
        case 'joke':
            return { type: 'joke', data: getRandomJoke() };
        case 'fact':
            return { type: 'fact', data: getRandomFact() };
        case 'trivia':
            return { type: 'trivia', data: getRandomTrivia() };
        case 'personality':
            return { type: 'personality', data: getRandomPersonality() };
        case 'detective':
            return { type: 'detective', data: getRandomPuzzle() };
        case 'learning':
            return { type: 'learning', data: getRandomLearning() };
        case 'meta':
            return { type: 'meta', data: getMetaHumor(elapsedSec, sassLevel) };
        default:
            return { type: 'joke', data: getRandomJoke() };
    }
};

export const resetUsedContent = () => {
    usedIndices = {};
};
