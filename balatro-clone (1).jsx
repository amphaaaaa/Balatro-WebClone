import React, { useState, useEffect, useMemo } from 'react';

const SUITS = {
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
  SPADES: '♠'
};

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const RANK_SORT_VALUE = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const POKER_HANDS = {
  'Royal Flush': { chips: 100, mult: 8, rank: 10 },
  'Straight Flush': { chips: 100, mult: 8, rank: 9 },
  'Five of a Kind': { chips: 120, mult: 12, rank: 8 },
  'Flush House': { chips: 140, mult: 14, rank: 7 },
  'Flush Five': { chips: 160, mult: 16, rank: 6 },
  'Four of a Kind': { chips: 60, mult: 7, rank: 5 },
  'Full House': { chips: 40, mult: 4, rank: 4 },
  'Flush': { chips: 35, mult: 4, rank: 3 },
  'Straight': { chips: 30, mult: 4, rank: 2 },
  'Three of a Kind': { chips: 30, mult: 3, rank: 1 },
  'Two Pair': { chips: 20, mult: 2, rank: 0 },
  'Pair': { chips: 10, mult: 2, rank: -1 },
  'High Card': { chips: 5, mult: 1, rank: -2 }
};

const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

const JOKERS = {
  'Joker': { 
    rarity: 'common', 
    effect: 'mult', 
    value: 4, 
    desc: '+4 Mult',
    price: 4
  },
  'Greedy Joker': { 
    rarity: 'common', 
    effect: 'suit_mult', 
    suit: SUITS.DIAMONDS, 
    value: 3,
    desc: 'Played ♦ cards give +3 Mult',
    price: 4
  },
  'Lusty Joker': { 
    rarity: 'common', 
    effect: 'suit_mult', 
    suit: SUITS.HEARTS, 
    value: 3,
    desc: 'Played ♥ cards give +3 Mult',
    price: 4
  },
  'Wrathful Joker': { 
    rarity: 'common', 
    effect: 'suit_mult', 
    suit: SUITS.SPADES, 
    value: 3,
    desc: 'Played ♠ cards give +3 Mult',
    price: 4
  },
  'Gluttonous Joker': { 
    rarity: 'common', 
    effect: 'suit_mult', 
    suit: SUITS.CLUBS, 
    value: 3,
    desc: 'Played ♣ cards give +3 Mult',
    price: 4
  },
  'Jolly Joker': {
    rarity: 'common',
    effect: 'hand_mult',
    handType: 'Pair',
    value: 8,
    desc: '+8 Mult if hand contains a Pair',
    price: 5
  },
  'Zany Joker': {
    rarity: 'common',
    effect: 'hand_mult',
    handType: 'Three of a Kind',
    value: 12,
    desc: '+12 Mult if hand contains Three of a Kind',
    price: 5
  },
  'Mad Joker': {
    rarity: 'common',
    effect: 'hand_mult',
    handType: 'Two Pair',
    value: 10,
    desc: '+10 Mult if hand contains Two Pair',
    price: 5
  },
  'Crazy Joker': {
    rarity: 'common',
    effect: 'hand_mult',
    handType: 'Straight',
    value: 12,
    desc: '+12 Mult if hand contains a Straight',
    price: 5
  },
  'Sly Joker': {
    rarity: 'common',
    effect: 'hand_chips',
    handType: 'Pair',
    value: 50,
    desc: '+50 Chips if hand contains a Pair',
    price: 5
  },
  'Half Joker': {
    rarity: 'uncommon',
    effect: 'small_hand_mult',
    value: 20,
    desc: '+20 Mult if hand has 3 or fewer cards',
    price: 6
  },
  'Stencil Joker': {
    rarity: 'uncommon',
    effect: 'empty_slot_mult',
    value: 1,
    desc: 'x1 Mult for each empty Joker slot',
    price: 6
  },
  'Four Fingers': {
    rarity: 'uncommon',
    effect: 'four_card_hands',
    desc: 'Flushes and Straights can be made with 4 cards',
    price: 7
  },
  'Banner': {
    rarity: 'uncommon',
    effect: 'discard_chips',
    value: 30,
    desc: '+30 Chips for each remaining discard',
    price: 5
  },
  'Mystic Summit': {
    rarity: 'uncommon',
    effect: 'no_discard_mult',
    value: 15,
    desc: '+15 Mult when 0 discards remaining',
    price: 5
  },
  'Square Joker': {
    rarity: 'rare',
    effect: 'four_card_chips',
    value: 0,
    growing: true,
    growth: 4,
    desc: 'Gains +4 Chips if hand has exactly 4 cards',
    price: 8
  },
  'Baron': {
    rarity: 'rare',
    effect: 'king_mult',
    value: 1.5,
    desc: 'Each King held in hand gives x1.5 Mult',
    price: 8
  },
  'Photograph': {
    rarity: 'rare',
    effect: 'first_face_mult',
    value: 2,
    desc: 'First played face card gives x2 Mult',
    price: 8
  },
  'Golden Joker': {
    rarity: 'rare',
    effect: 'end_round_money',
    value: 4,
    desc: 'Earn $4 at end of round',
    price: 6
  },
  'Juggler': {
    rarity: 'rare',
    effect: 'hand_size',
    value: 1,
    desc: '+1 hand size',
    price: 6
  },
  'Drunkard': {
    rarity: 'rare',
    effect: 'discard_size',
    value: 1,
    desc: '+1 discard',
    price: 6
  },
  'The Duo': {
    rarity: 'rare',
    effect: 'hand_mult_multiplier',
    handType: 'Pair',
    value: 2,
    desc: 'x2 Mult if hand contains a Pair',
    price: 8
  },
  'The Trio': {
    rarity: 'rare',
    effect: 'hand_mult_multiplier',
    handType: 'Three of a Kind',
    value: 3,
    desc: 'x3 Mult if hand contains Three of a Kind',
    price: 8
  },
  'The Family': {
    rarity: 'rare',
    effect: 'hand_mult_multiplier',
    handType: 'Four of a Kind',
    value: 4,
    desc: 'x4 Mult if hand contains Four of a Kind',
    price: 8
  },
  'Triboulet': {
    rarity: 'legendary',
    effect: 'king_queen_mult',
    value: 2,
    desc: 'Played Kings and Queens each give x2 Mult',
    price: 20
  },
  'Chicot': {
    rarity: 'legendary',
    effect: 'disable_boss',
    desc: 'Disables effect of every Boss Blind',
    price: 20
  }
};

// ============================================================================
// TAROT CARDS
// ============================================================================

const TAROT_CARDS = {
  'The Fool': { effect: 'create_last_tarot', desc: 'Creates last Tarot or Planet card used', price: 3 },
  'The Magician': { effect: 'enhance_lucky', count: 2, desc: 'Enhances 2 cards to Lucky', price: 3 },
  'The Empress': { effect: 'enhance_mult', count: 2, desc: 'Enhances 2 cards to Mult Cards', price: 3 },
  'The Hierophant': { effect: 'enhance_bonus', count: 2, desc: 'Enhances 2 cards to Bonus Cards', price: 3 },
  'The Lovers': { effect: 'enhance_wild', count: 1, desc: 'Enhances 1 card to Wild Card', price: 3 },
  'The Chariot': { effect: 'enhance_steel', count: 1, desc: 'Enhances 1 card to Steel Card', price: 3 },
  'Justice': { effect: 'enhance_glass', count: 1, desc: 'Enhances 1 card to Glass Card', price: 3 },
  'The Devil': { effect: 'enhance_gold', count: 1, desc: 'Enhances 1 card to Gold Card', price: 3 },
  'The Tower': { effect: 'enhance_stone', count: 1, desc: 'Enhances 1 card to Stone Card', price: 3 },
  'The Hanged Man': { effect: 'destroy', count: 2, desc: 'Destroys up to 2 cards', price: 3 },
  'The Star': { effect: 'convert_diamonds', count: 3, desc: 'Converts up to 3 cards to ♦', price: 3 },
  'The Moon': { effect: 'convert_clubs', count: 3, desc: 'Converts up to 3 cards to ♣', price: 3 },
  'The Sun': { effect: 'convert_hearts', count: 3, desc: 'Converts up to 3 cards to ♥', price: 3 },
  'The World': { effect: 'convert_spades', count: 3, desc: 'Converts up to 3 cards to ♠', price: 3 }
};

// ============================================================================
// PLANET CARDS
// ============================================================================

const PLANET_CARDS = {
  'Pluto': { handType: 'High Card', desc: 'Level up High Card', price: 3 },
  'Mercury': { handType: 'Pair', desc: 'Level up Pair', price: 3 },
  'Venus': { handType: 'Two Pair', desc: 'Level up Two Pair', price: 3 },
  'Earth': { handType: 'Three of a Kind', desc: 'Level up Three of a Kind', price: 3 },
  'Mars': { handType: 'Straight', desc: 'Level up Straight', price: 3 },
  'Jupiter': { handType: 'Flush', desc: 'Level up Flush', price: 3 },
  'Saturn': { handType: 'Full House', desc: 'Level up Full House', price: 3 },
  'Uranus': { handType: 'Four of a Kind', desc: 'Level up Four of a Kind', price: 3 },
  'Neptune': { handType: 'Straight Flush', desc: 'Level up Straight Flush', price: 3 }
};

// ============================================================================
// BOSS BLINDS
// ============================================================================

const BOSS_BLINDS = [
  { name: 'The Hook', effect: 'discard_cards', value: 2, desc: 'Discards 2 random cards per hand played' },
  { name: 'The Wall', effect: 'double_score', desc: 'Double score requirement' },
  { name: 'The Psychic', effect: 'five_cards', desc: 'Must play 5 cards' },
  { name: 'The Eye', effect: 'no_repeat', desc: 'No repeat hand types this round' },
  { name: 'The Mouth', effect: 'one_hand_type', desc: 'Play only 1 hand type this round' },
  { name: 'The Plant', effect: 'debuff_face', desc: 'All face cards are debuffed' },
  { name: 'The Needle', effect: 'one_hand', desc: 'Play only 1 hand' },
  { name: 'The Flint', effect: 'half_chips_mult', desc: 'Base Chips and Mult are halved' }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createDeck = () => {
  const deck = [];
  let id = 0;
  Object.values(SUITS).forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: id++,
        rank,
        suit,
        enhancement: null,
        edition: null,
        seal: null
      });
    });
  });
  return shuffle(deck);
};

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const evaluateHand = (cards, fourFingers = false) => {
  if (cards.length === 0) return { handType: 'High Card', scoringCards: [] };
  
  const nonStoneCards = cards.filter(c => c.enhancement !== 'Stone');
  const ranks = nonStoneCards.map(c => c.rank);
  const suits = nonStoneCards.map(c => {
    if (c.enhancement === 'Wild') return 'WILD';
    return c.suit;
  });
  
  const rankCounts = {};
  ranks.forEach(rank => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });
  
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const uniqueRanks = Object.keys(rankCounts).length;
  
  const isFlush = () => {
    if (suits.length < (fourFingers ? 4 : 5)) return false;
    const realSuits = suits.filter(s => s !== 'WILD');
    if (realSuits.length === 0) return true;
    const mainSuit = realSuits[0];
    return suits.every(s => s === 'WILD' || s === mainSuit);
  };
  
  const isStraight = () => {
    if (nonStoneCards.length < (fourFingers ? 4 : 5)) return false;
    const rankValues = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
    const values = [...new Set(ranks.map(r => rankValues[r]))].sort((a, b) => a - b);
    
    if (values.length < (fourFingers ? 4 : 5)) return false;
    
    for (let i = 0; i < values.length - (fourFingers ? 3 : 4); i++) {
      let consecutive = true;
      for (let j = 0; j < (fourFingers ? 3 : 4); j++) {
        if (values[i + j + 1] !== values[i + j] + 1) {
          consecutive = false;
          break;
        }
      }
      if (consecutive) return true;
    }
    
    if (values.includes(14)) {
      const lowAce = [1, ...values.filter(v => v !== 14)].sort((a, b) => a - b);
      for (let i = 0; i < lowAce.length - (fourFingers ? 3 : 4); i++) {
        let consecutive = true;
        for (let j = 0; j < (fourFingers ? 3 : 4); j++) {
          if (lowAce[i + j + 1] !== lowAce[i + j] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) return true;
      }
    }
    
    return false;
  };
  
  const flush = isFlush();
  const straight = isStraight();
  
  // Check for identical cards (same rank AND suit)
  const cardIdentities = {};
  cards.forEach(card => {
    if (card.enhancement !== 'Stone') {
      const identity = `${card.rank}-${card.suit}`;
      cardIdentities[identity] = (cardIdentities[identity] || 0) + 1;
    }
  });
  const maxIdentical = Math.max(...Object.values(cardIdentities), 0);
  
  if (counts[0] === 5) return { handType: 'Five of a Kind', scoringCards: cards };
  
  // Flush Five: 5+ identical cards (same rank AND suit) in a flush
  if (flush && maxIdentical >= 5) {
    return { handType: 'Flush Five', scoringCards: cards };
  }
  
  if (flush && counts[0] === 3 && counts[1] === 2) return { handType: 'Flush House', scoringCards: cards };
  
  if (straight && flush) {
    const isRoyal = ranks.includes('A') && ranks.includes('K') && ranks.includes('Q') && ranks.includes('J') && ranks.includes('10');
    return { handType: isRoyal ? 'Royal Flush' : 'Straight Flush', scoringCards: cards };
  }
  if (counts[0] === 4) return { handType: 'Four of a Kind', scoringCards: cards };
  if (counts[0] === 3 && counts[1] === 2) return { handType: 'Full House', scoringCards: cards };
  if (flush) return { handType: 'Flush', scoringCards: cards };
  if (straight) return { handType: 'Straight', scoringCards: cards };
  if (counts[0] === 3) return { handType: 'Three of a Kind', scoringCards: cards };
  if (counts[0] === 2 && counts[1] === 2) return { handType: 'Two Pair', scoringCards: cards };
  if (counts[0] === 2) return { handType: 'Pair', scoringCards: cards };
  
  return { handType: 'High Card', scoringCards: cards };
};

const calculateScore = (cards, handType, handLevels, jokers, bossBlind) => {
  let baseHand = POKER_HANDS[handType];
  let chips = baseHand.chips;
  let mult = baseHand.mult;
  
  const level = handLevels[handType] || 0;
  chips += level * 30;
  mult += level * 3;
  
  if (bossBlind?.effect === 'half_chips_mult') {
    chips = Math.floor(chips / 2);
    mult = Math.floor(mult / 2);
  }
  
  cards.forEach(card => {
    if (card.enhancement === 'Stone') {
      chips += 50;
    } else {
      chips += CARD_VALUES[card.rank] || 0;
    }
    
    if (card.enhancement === 'Bonus') chips += 30;
    if (card.edition === 'Foil') chips += 50;
  });
  
  cards.forEach(card => {
    if (card.enhancement === 'Mult') mult += 4;
    if (card.edition === 'Holographic') mult += 10;
  });
  
  jokers.forEach(joker => {
    if (joker.effect === 'suit_mult') {
      const count = cards.filter(c => c.suit === joker.suit).length;
      mult += count * joker.value;
    } else if (joker.effect === 'hand_mult' && handType.includes(joker.handType)) {
      mult += joker.value;
    } else if (joker.effect === 'hand_chips' && handType.includes(joker.handType)) {
      chips += joker.value;
    } else if (joker.effect === 'mult') {
      mult += joker.value;
    } else if (joker.effect === 'small_hand_mult' && cards.length <= 3) {
      mult += joker.value;
    } else if (joker.effect === 'discard_chips') {
      // handled elsewhere with discards remaining
    } else if (joker.effect === 'four_card_chips' && cards.length === 4) {
      chips += joker.value;
    }
  });
  
  let multMultiplier = 1;
  
  cards.forEach(card => {
    if (card.enhancement === 'Glass') multMultiplier *= 2;
    if (card.edition === 'Polychrome') multMultiplier *= 1.5;
  });
  
  jokers.forEach(joker => {
    if (joker.effect === 'hand_mult_multiplier' && handType.includes(joker.handType)) {
      multMultiplier *= joker.value;
    } else if (joker.effect === 'king_mult') {
      // handled in hand evaluation
    } else if (joker.effect === 'first_face_mult') {
      const faceCard = cards.find(c => ['J', 'Q', 'K'].includes(c.rank));
      if (faceCard) multMultiplier *= joker.value;
    } else if (joker.effect === 'king_queen_mult') {
      cards.forEach(c => {
        if (c.rank === 'K' || c.rank === 'Q') {
          multMultiplier *= joker.value;
        }
      });
    }
  });
  
  const finalMult = Math.floor(mult * multMultiplier);
  const score = chips * finalMult;
  
  return { score, chips, mult: finalMult };
};

const getBlindScore = (ante, blindType) => {
  const baseScores = {
    small: 300,
    big: 450,
    boss: 600
  };
  
  const base = baseScores[blindType];
  const multiplier = Math.pow(1.5, ante - 1);
  
  return Math.floor(base * multiplier);
};

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

export default function BalatroClone() {
  const [gameState, setGameState] = useState('menu');
  const [ante, setAnte] = useState(1);
  const [blindType, setBlindType] = useState('small');
  const [blindsCompleted, setBlindsCompleted] = useState({ small: false, big: false, boss: false });
  const [bossBlind, setBossBlind] = useState(null);
  
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  
  const [money, setMoney] = useState(4);
  const [jokers, setJokers] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [handLevels, setHandLevels] = useState({});
  
  const [handsRemaining, setHandsRemaining] = useState(4);
  const [discardsRemaining, setDiscardsRemaining] = useState(3);
  const [maxHands, setMaxHands] = useState(4);
  const [maxDiscards, setMaxDiscards] = useState(3);
  const [handSize, setHandSize] = useState(8);
  
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(300);
  
  const [shop, setShop] = useState({ jokers: [], packs: [], packSelectionsCount: 0 });
  const [playedHandTypes, setPlayedHandTypes] = useState([]);
  
  const [message, setMessage] = useState('');
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [usingConsumable, setUsingConsumable] = useState(null);
  const [showRunInfo, setShowRunInfo] = useState(false);

  // SCORING ANIMATION STATE
  const [scoringState, setScoringState] = useState({ 
    active: false, 
    chips: 0, 
    mult: 0, 
    handType: '', 
    triggerQueue: [],
    finalScore: 0,
    triggeredId: null
  });

  const hasFourFingers = useMemo(() => jokers.some(j => j.effect === 'four_card_hands'), [jokers]);
  const hasChicot = useMemo(() => jokers.some(j => j.effect === 'disable_boss'), [jokers]);
  
  const effectiveBossBlind = useMemo(() => (hasChicot && bossBlind) ? null : bossBlind, [hasChicot, bossBlind]);

  // Scoring queue processor
  useEffect(() => {
    if (scoringState.active && scoringState.triggerQueue.length > 0) {
      const nextTrigger = scoringState.triggerQueue[0];
      
      const timer = setTimeout(() => {
        setScoringState(prev => ({
          ...prev,
          chips: nextTrigger.newChips || prev.chips,
          mult: nextTrigger.newMult || prev.mult,
          triggeredId: nextTrigger.sourceId,
          triggerQueue: prev.triggerQueue.slice(1)
        }));
      }, 500);

      return () => clearTimeout(timer);
    } else if (scoringState.active && scoringState.triggerQueue.length === 0) {
      const timer = setTimeout(() => {
        setScore(prev => prev + scoringState.finalScore);
        
        setTimeout(() => {
          setScoringState({ active: false, chips: 0, mult: 0, handType: '', triggerQueue: [], finalScore: 0, triggeredId: null });
          checkWinLose(scoringState.finalScore);
        }, 1000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [scoringState]);

  const startGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setMoney(4);
    setJokers([]);
    setConsumables([]);
    setHandLevels({});
    setAnte(1);
    setBlindType('small');
    setBlindsCompleted({ small: false, big: false, boss: false });
    setBossBlind(null);
    setScore(0);
    setPlayedHandTypes([]);
    
    const bonusHandSize = 0;
    const bonusDiscards = 0;
    
    setHandSize(8 + bonusHandSize);
    setMaxHands(4);
    setMaxDiscards(3 + bonusDiscards);
    setHandsRemaining(4);
    setDiscardsRemaining(3 + bonusDiscards);
    
    setGameState('blind_select');
  };

  const selectBlind = (type) => {
    // Enforce blind order
    if (type === 'big' && !blindsCompleted.small) {
      setMessage('Must complete Small Blind first!');
      return;
    }
    if (type === 'boss' && !blindsCompleted.big) {
      setMessage('Must complete Big Blind first!');
      return;
    }
    
    setBlindType(type);
    const target = getBlindScore(ante, type);
    
    const bonusHandSize = jokers.filter(j => j.effect === 'hand_size').reduce((sum, j) => sum + j.value, 0);
    const bonusDiscards = jokers.filter(j => j.effect === 'discard_size').reduce((sum, j) => sum + j.value, 0);
    
    let boss = null;
    if (type === 'boss') {
      boss = BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)];
      setBossBlind(boss);
      
      if (boss.effect === 'double_score') {
        setTargetScore(target * 2);
        setHandsRemaining(maxHands);
        setDiscardsRemaining(maxDiscards + bonusDiscards);
      } else if (boss.effect === 'one_hand') {
        setTargetScore(target);
        setHandsRemaining(1);
        setMaxHands(1);
        setDiscardsRemaining(maxDiscards + bonusDiscards);
      } else {
        setTargetScore(target);
        setHandsRemaining(maxHands);
        setDiscardsRemaining(maxDiscards + bonusDiscards);
      }
    } else {
      setTargetScore(target);
      setBossBlind(null);
      setHandsRemaining(maxHands);
      setDiscardsRemaining(maxDiscards + bonusDiscards);
    }
    
    setScore(0);
    setPlayedHandTypes([]);
    setHandSize(8 + bonusHandSize);
    setGameState('playing');
    
    // RESET DECK: Combine deck + discard pile + hand and shuffle everything
    const fullDeck = [...deck, ...discardPile, ...hand];
    const shuffledDeck = shuffle(fullDeck);
    
    // Clear discard pile and hand
    setDiscardPile([]);
    
    // Draw initial hand from freshly shuffled deck
    const drawn = shuffledDeck.slice(0, 8 + bonusHandSize);
    const remaining = shuffledDeck.slice(8 + bonusHandSize);
    setHand(drawn);
    setDeck(remaining);
  };

  const sortHand = (method) => {
    setHand(prev => {
      const sorted = [...prev];
      if (method === 'rank') {
        sorted.sort((a, b) => RANK_SORT_VALUE[b.rank] - RANK_SORT_VALUE[a.rank]);
      } else if (method === 'suit') {
        const suitOrder = { [SUITS.SPADES]: 4, [SUITS.HEARTS]: 3, [SUITS.CLUBS]: 2, [SUITS.DIAMONDS]: 1 };
        sorted.sort((a, b) => {
          if (suitOrder[b.suit] !== suitOrder[a.suit]) return suitOrder[b.suit] - suitOrder[a.suit];
          return RANK_SORT_VALUE[b.rank] - RANK_SORT_VALUE[a.rank];
        });
      }
      return sorted;
    });
  };

  const skipBlind = () => {
    const skipCost = blindType === 'small' ? 5 : blindType === 'big' ? 10 : 20;
    
    if (money < skipCost) {
      setMessage(`Need $${skipCost} to skip!`);
      return;
    }
    
    setMoney(prev => prev - skipCost);
    
    if (blindType === 'small') {
      setBlindsCompleted(prev => ({ ...prev, small: true }));
      setGameState('shop');
      generateShop();
    } else if (blindType === 'big') {
      setBlindsCompleted(prev => ({ ...prev, big: true }));
      setGameState('shop');
      generateShop();
    }
  };

  const drawCards = (count) => {
    setDeck(prevDeck => {
      const drawn = prevDeck.slice(0, count);
      const remaining = prevDeck.slice(count);
      
      if (drawn.length < count && discardPile.length > 0) {
        const shuffled = shuffle(discardPile);
        const additional = shuffled.slice(0, count - drawn.length);
        const newDiscard = shuffled.slice(count - drawn.length);
        setDiscardPile(newDiscard);
        setHand(prev => [...prev, ...drawn, ...additional]);
        return remaining;
      }
      
      setHand(prev => [...prev, ...drawn]);
      return remaining;
    });
  };

  const toggleCard = (cardId) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 5) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const playHand = () => {
    if (selectedCards.length === 0) {
      setMessage('Select cards to play!');
      return;
    }
    
    const selected = hand.filter(card => selectedCards.includes(card.id));
    
    if (effectiveBossBlind?.effect === 'five_cards' && selected.length !== 5) {
      setMessage('Must play exactly 5 cards!');
      return;
    }
    
    const debuffedCards = selected.filter(card => {
      if (effectiveBossBlind?.effect === 'debuff_face') {
        return ['J', 'Q', 'K'].includes(card.rank);
      }
      return false;
    });
    
    const scoringCards = selected.filter(card => !debuffedCards.includes(card));
    
    const { handType, scoringCards: validCards } = evaluateHand(scoringCards, hasFourFingers);
    
    if (effectiveBossBlind?.effect === 'no_repeat' && playedHandTypes.includes(handType)) {
      setMessage('Cannot repeat hand types!');
      return;
    }
    
    if (effectiveBossBlind?.effect === 'one_hand_type' && playedHandTypes.length > 0 && playedHandTypes[0] !== handType) {
      setMessage(`Can only play ${playedHandTypes[0]}!`);
      return;
    }
    
    // PREPARE ANIMATION QUEUE
    let currentChips = POKER_HANDS[handType].chips;
    let currentMult = POKER_HANDS[handType].mult;
    
    const level = handLevels[handType] || 0;
    currentChips += level * 30;
    currentMult += level * 3;
    
    if (effectiveBossBlind?.effect === 'half_chips_mult') {
      currentChips = Math.floor(currentChips / 2);
      currentMult = Math.floor(currentMult / 2);
    }

    const queue = [];

    // 1. Base Cards - scoring cards only
    scoringCards.forEach(card => {
      let cardChips = 0;
      if (card.enhancement === 'Stone') cardChips = 50;
      else cardChips = CARD_VALUES[card.rank] || 0;

      if (card.enhancement === 'Bonus') cardChips += 30;
      if (card.edition === 'Foil') cardChips += 50;

      if (cardChips > 0) {
        currentChips += cardChips;
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }

      if (card.enhancement === 'Mult') {
        currentMult += 4;
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
      if (card.edition === 'Holographic') {
        currentMult += 10;
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
      
      // Glass/Polychrome multiply
      if (card.enhancement === 'Glass') {
        currentMult = currentMult * 2;
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
      if (card.edition === 'Polychrome') {
        currentMult = Math.floor(currentMult * 1.5);
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
    });

    // 2. Held Cards (Steel, Baron, etc) - unplayed cards in hand
    const heldCards = hand.filter(card => !selectedCards.includes(card.id));
    heldCards.forEach(card => {
      let triggered = false;
      if (card.enhancement === 'Steel') {
        currentMult = Math.floor(currentMult * 1.5);
        triggered = true;
      }
      // Baron check
      const baronJoker = jokers.find(j => j.effect === 'king_mult');
      if (baronJoker && card.rank === 'K') {
        currentMult = Math.floor(currentMult * 1.5);
        triggered = true;
      }

      if (triggered) {
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
    });

    // 3. Jokers
    jokers.forEach(joker => {
      let triggered = false;
      if (joker.effect === 'suit_mult') {
        const count = scoringCards.filter(c => c.suit === joker.suit).length;
        if (count > 0) {
          currentMult += count * joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'hand_mult' && handType.includes(joker.handType)) {
        currentMult += joker.value;
        triggered = true;
      } else if (joker.effect === 'hand_chips' && handType.includes(joker.handType)) {
        currentChips += joker.value;
        triggered = true;
      } else if (joker.effect === 'mult') {
        currentMult += joker.value;
        triggered = true;
      } else if (joker.effect === 'small_hand_mult' && scoringCards.length <= 3) {
        currentMult += joker.value;
        triggered = true;
      } else if (joker.effect === 'discard_chips') {
        currentChips += joker.value * discardsRemaining;
        triggered = true;
      } else if (joker.effect === 'four_card_chips' && scoringCards.length === 4) {
        currentChips += joker.value;
        triggered = true;
      } else if (joker.effect === 'no_discard_mult' && discardsRemaining === 0) {
        currentMult += joker.value;
        triggered = true;
      } else if (joker.effect === 'hand_mult_multiplier' && handType.includes(joker.handType)) {
        currentMult *= joker.value;
        triggered = true;
      } else if (joker.effect === 'first_face_mult') {
        const faceCard = scoringCards.find(c => ['J', 'Q', 'K'].includes(c.rank));
        if (faceCard) {
          currentMult *= joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'king_queen_mult') {
        let multVal = 1;
        scoringCards.forEach(c => {
          if (c.rank === 'K' || c.rank === 'Q') multVal *= joker.value;
        });
        if (multVal > 1) {
          currentMult *= multVal;
          triggered = true;
        }
      } else if (joker.effect === 'empty_slot_mult') {
        const emptySlots = 5 - jokers.length;
        if (emptySlots > 0) {
          const multiplier = 1 + emptySlots;
          currentMult = Math.floor(currentMult * multiplier);
          triggered = true;
        }
      }
      
      if (triggered) {
        queue.push({ sourceId: joker.id, newChips: currentChips, newMult: currentMult });
      }
    });

    // Start Scoring Animation
    setScoringState({
      active: true,
      chips: POKER_HANDS[handType].chips + (level * 30),
      mult: POKER_HANDS[handType].mult + (level * 3),
      handType,
      triggerQueue: queue,
      finalScore: currentChips * currentMult,
      triggeredId: null
    });
    
    setPlayedHandTypes(prev => [...prev, handType]);
    
    // Logic for removal and draw
    const remainingHand = hand.filter(card => !selectedCards.includes(card.id));
    setHand(remainingHand);
    setDiscardPile(prev => [...prev, ...selected]);
    setSelectedCards([]);
    setHandsRemaining(prev => prev - 1);
    
    const numCardsPlayed = selected.length;
    
    if (effectiveBossBlind?.effect === 'discard_cards') {
      setTimeout(() => {
        setHand(prevHand => {
          const toDiscard = prevHand.slice(0, Math.min(2, prevHand.length));
          setDiscardPile(prev => [...prev, ...toDiscard]);
          const afterDiscard = prevHand.slice(Math.min(2, prevHand.length));
          return afterDiscard;
        });
        setTimeout(() => {
          const cardsToDraw = Math.min(numCardsPlayed + 2, handSize);
          drawCards(cardsToDraw);
        }, 300);
      }, 500);
    } else {
      setTimeout(() => {
        drawCards(numCardsPlayed);
      }, 500);
    }
    
    // Growing jokers
    jokers.forEach(joker => {
      if (joker.effect === 'four_card_chips' && scoringCards.length === 4) {
        setJokers(prev => prev.map(j => 
          j.id === joker.id ? { ...j, value: j.value + (j.growth || 0) } : j
        ));
      }
    });
  };

  const discardCards = () => {
    if (selectedCards.length === 0) {
      setMessage('Select cards to discard!');
      return;
    }
    
    if (discardsRemaining <= 0) {
      setMessage('No discards remaining!');
      return;
    }
    
    const discarded = hand.filter(card => selectedCards.includes(card.id));
    const numDiscarded = discarded.length;
    
    setHand(prev => prev.filter(card => !selectedCards.includes(card.id)));
    setDiscardPile(prev => [...prev, ...discarded]);
    setSelectedCards([]);
    setDiscardsRemaining(prev => prev - 1);
    
    // Draw the same number of cards that were discarded
    setTimeout(() => {
      drawCards(numDiscarded);
    }, 300);
  };

  const checkWinLose = (currentScore) => {
    const total = score + currentScore;
    
    if (total >= targetScore) {
      const reward = blindType === 'small' ? 3 : blindType === 'big' ? 4 : 8;
      
      // Interest: $1 per $5 saved, max $5
      const interest = Math.min(Math.floor(money / 5), 5);
      
      setMoney(prev => prev + reward + interest);
      
      jokers.forEach(joker => {
        if (joker.effect === 'end_round_money') {
          setMoney(prev => prev + joker.value);
        }
      });
      
      setMessage(`Blind cleared! +$${reward}${interest > 0 ? ` (Interest: $${interest})` : ''}`);
      
      // Mark blind as completed
      if (blindType === 'small') {
        setBlindsCompleted(prev => ({ ...prev, small: true }));
      } else if (blindType === 'big') {
        setBlindsCompleted(prev => ({ ...prev, big: true }));
      } else if (blindType === 'boss') {
        setBlindsCompleted(prev => ({ ...prev, boss: true }));
      }
      
      setTimeout(() => {
        // ALWAYS go to shop first after clearing any blind
        setGameState('shop');
        generateShop();
      }, 2000);
    } else if (handsRemaining <= 0) {
      setMessage('Out of hands! Blind failed.');
      setTimeout(() => {
        setGameState('game_over');
      }, 2000);
    }
  };

  const generateShop = () => {
    const shopJokers = [];
    for (let i = 0; i < 2; i++) {
      const jokerNames = Object.keys(JOKERS);
      const randomJoker = jokerNames[Math.floor(Math.random() * jokerNames.length)];
      const jokerData = JOKERS[randomJoker];
      shopJokers.push({
        name: randomJoker,
        ...jokerData,
        id: Math.random()
      });
    }
    
    const packs = [
      { type: 'Standard Pack', price: 4, contains: 'playing cards', id: Math.random() },
      { type: 'Arcana Pack', price: 4, contains: 'tarot cards', id: Math.random() },
      { type: 'Celestial Pack', price: 4, contains: 'planet cards', id: Math.random() },
      { type: 'Buffoon Pack', price: 4, contains: 'jokers', id: Math.random() }
    ];
    
    const shopPacks = [];
    for (let i = 0; i < 2; i++) {
      const randomPack = packs[Math.floor(Math.random() * packs.length)];
      shopPacks.push({ ...randomPack, id: Math.random() });
    }
    
    setShop({
      jokers: shopJokers,
      packs: shopPacks,
      packSelectionsCount: 0,
      openPack: null,
      packType: null
    });
  };

  const buyJoker = (joker) => {
    if (money >= joker.price && jokers.length < 5) {
      setMoney(prev => prev - joker.price);
      setJokers(prev => [...prev, { ...joker, id: Math.random() }]);
      setShop(prev => ({
        ...prev,
        jokers: prev.jokers.filter(j => j.id !== joker.id)
      }));
      setMessage(`Bought ${joker.name}!`);
    } else if (jokers.length >= 5) {
      setMessage('Joker slots full!');
    } else {
      setMessage('Not enough money!');
    }
  };

  const sellJoker = (joker) => {
    const sellValue = Math.floor(joker.price / 2);
    setMoney(prev => prev + sellValue);
    setJokers(prev => prev.filter(j => j.id !== joker.id));
    setMessage(`Sold ${joker.name} for $${sellValue}`);
  };

  const buyPack = (pack) => {
    if (money >= pack.price) {
      setMoney(prev => prev - pack.price);
      setMessage(`Opening ${pack.type}...`);
      
      // Generate pack contents
      let packContents = [];
      
      if (pack.type === 'Standard Pack') {
        for (let i = 0; i < 4; i++) {
          const suit = Object.values(SUITS)[Math.floor(Math.random() * 4)];
          const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
          const hasEnhancement = Math.random() < 0.3;
          packContents.push({
            id: Math.random(),
            rank,
            suit,
            enhancement: hasEnhancement ? ['Bonus', 'Mult', 'Glass', 'Steel'][Math.floor(Math.random() * 4)] : null,
            edition: null,
            seal: null,
            type: 'playing'
          });
        }
      } else if (pack.type === 'Arcana Pack') {
        const tarotNames = Object.keys(TAROT_CARDS);
        for (let i = 0; i < 3; i++) {
          const tarotName = tarotNames[Math.floor(Math.random() * tarotNames.length)];
          packContents.push({
            id: Math.random(),
            name: tarotName,
            ...TAROT_CARDS[tarotName],
            type: 'tarot'
          });
        }
      } else if (pack.type === 'Celestial Pack') {
        const planetNames = Object.keys(PLANET_CARDS);
        for (let i = 0; i < 3; i++) {
          const planetName = planetNames[Math.floor(Math.random() * planetNames.length)];
          packContents.push({
            id: Math.random(),
            name: planetName,
            ...PLANET_CARDS[planetName],
            type: 'planet'
          });
        }
      } else if (pack.type === 'Buffoon Pack') {
        const jokerNames = Object.keys(JOKERS);
        for (let i = 0; i < 3; i++) {
          const jokerName = jokerNames[Math.floor(Math.random() * jokerNames.length)];
          packContents.push({
            id: Math.random(),
            name: jokerName,
            ...JOKERS[jokerName],
            type: 'joker'
          });
        }
      }
      
      setShop(prev => ({
        ...prev,
        openPack: packContents,
        packType: pack.type,
        packSelectionsCount: 0,
        packs: prev.packs.filter(p => p.id !== pack.id) // Remove purchased pack
      }));
    } else {
      setMessage('Not enough money!');
    }
  };

  const selectFromPack = (item) => {
    let success = false;
    
    if (item.type === 'playing') {
      setDeck(prev => [...prev, item]);
      setMessage('Added card to deck!');
      success = true;
    } else if (item.type === 'tarot' || item.type === 'planet') {
      if (consumables.length < 2) {
        setConsumables(prev => [...prev, item]);
        setMessage(`Added ${item.name}!`);
        success = true;
      } else {
        setMessage('Consumable slots full!');
        return; // Don't count failed attempts
      }
    } else if (item.type === 'joker') {
      if (jokers.length < 5) {
        setJokers(prev => [...prev, item]);
        setMessage(`Added ${item.name}!`);
        success = true;
      } else {
        setMessage('Joker slots full!');
        return; // Don't count failed attempts
      }
    }
    
    // Only increment counter and check auto-close on success
    if (success) {
      setShop(prev => {
        const newCount = prev.packSelectionsCount + 1;
        const newOpenPack = prev.openPack.filter(i => i.id !== item.id);
        
        // Auto-close after 2 selections OR when pack is empty
        if (newCount >= 2 || newOpenPack.length === 0) {
          setTimeout(() => {
            setShop(prevShop => ({
              ...prevShop,
              openPack: null,
              packType: null,
              packSelectionsCount: 0
            }));
          }, 500);
        }
        
        return {
          ...prev,
          openPack: newOpenPack,
          packSelectionsCount: newCount
        };
      });
    }
  };

  const useConsumable = (consumable) => {
    if (consumable.type === 'planet') {
      const handType = consumable.handType;
      setHandLevels(prev => ({
        ...prev,
        [handType]: (prev[handType] || 0) + 1
      }));
      setConsumables(prev => prev.filter(c => c.id !== consumable.id));
      setMessage(`${handType} leveled up!`);
    } else if (consumable.type === 'tarot') {
      setUsingConsumable(consumable);
      setMessage(`Select cards for ${consumable.name}`);
    }
  };

  const applyTarot = () => {
    if (!usingConsumable || selectedCards.length === 0) return;
    
    const tarot = usingConsumable;
    const selected = hand.filter(card => selectedCards.includes(card.id));
    
    if (tarot.effect === 'enhance_lucky') {
      selected.slice(0, 2).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Lucky' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Lucky' } : c));
      });
    } else if (tarot.effect === 'enhance_mult') {
      selected.slice(0, 2).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Mult' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Mult' } : c));
      });
    } else if (tarot.effect === 'enhance_bonus') {
      selected.slice(0, 2).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Bonus' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Bonus' } : c));
      });
    } else if (tarot.effect === 'enhance_glass') {
      selected.slice(0, 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Glass' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Glass' } : c));
      });
    } else if (tarot.effect === 'enhance_steel') {
      selected.slice(0, 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Steel' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Steel' } : c));
      });
    } else if (tarot.effect === 'enhance_stone') {
      selected.slice(0, 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Stone' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Stone' } : c));
      });
    } else if (tarot.effect === 'enhance_gold') {
      selected.slice(0, 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Gold' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement: 'Gold' } : c));
      });
    } else if (tarot.effect === 'destroy') {
      selected.slice(0, 2).forEach(card => {
        setDeck(prev => prev.filter(c => c.id !== card.id));
        setHand(prev => prev.filter(c => c.id !== card.id));
      });
    } else if (tarot.effect.startsWith('convert_')) {
      const suitMap = {
        'convert_diamonds': SUITS.DIAMONDS,
        'convert_clubs': SUITS.CLUBS,
        'convert_hearts': SUITS.HEARTS,
        'convert_spades': SUITS.SPADES
      };
      const newSuit = suitMap[tarot.effect];
      selected.slice(0, 3).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, suit: newSuit } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, suit: newSuit } : c));
      });
    }
    
    setConsumables(prev => prev.filter(c => c.id !== tarot.id));
    setUsingConsumable(null);
    setSelectedCards([]);
    setMessage(`${tarot.name} used!`);
  };

  const leaveShop = () => {
    // After completing boss blind
    if (blindType === 'boss' && blindsCompleted.boss) {
      if (ante >= 8) {
        setGameState('victory');
      } else {
        setAnte(prev => prev + 1);
        setBlindsCompleted({ small: false, big: false, boss: false });
        setGameState('blind_select');
      }
    }
    // After completing small or big blind
    else if ((blindType === 'small' && blindsCompleted.small) || (blindType === 'big' && blindsCompleted.big)) {
      setGameState('blind_select');
    }
  };

  const currentHandType = useMemo(() => {
    if (selectedCards.length === 0) return null;
    const selected = hand.filter(card => selectedCards.includes(card.id));
    const { handType } = evaluateHand(selected, hasFourFingers);
    return handType;
  }, [selectedCards, hand, hasFourFingers]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ============================================================================
  // RENDERING
  // ============================================================================

  const Card = ({ card, selectable, selected, onClick, small, triggering }) => {
    const suitColor = card.suit === SUITS.HEARTS || card.suit === SUITS.DIAMONDS ? 'text-red-500' : 'text-gray-900';
    const size = small ? 'w-12 h-16 text-xs' : 'w-20 h-28';
    
    return (
      <div
        onClick={onClick}
        className={`${size} bg-white rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all relative
          ${selected ? 'border-yellow-400 -translate-y-4 shadow-lg shadow-yellow-400/50' : 'border-gray-300 hover:border-yellow-300'}
          ${triggering ? 'scale-125 border-4 border-yellow-500 z-10 animate-bounce' : ''}
          ${card.enhancement === 'Glass' ? 'bg-gradient-to-br from-blue-100 to-blue-200' : ''}
          ${card.enhancement === 'Gold' ? 'bg-gradient-to-br from-yellow-100 to-yellow-300' : ''}
          ${card.enhancement === 'Stone' ? 'bg-gradient-to-br from-gray-300 to-gray-400' : ''}
          ${card.edition === 'Foil' ? 'shadow-lg shadow-blue-300' : ''}
          ${card.edition === 'Holographic' ? 'shadow-lg shadow-purple-300' : ''}
          ${card.edition === 'Polychrome' ? 'shadow-lg shadow-rainbow' : ''}
        `}
      >
        <div className={`text-lg font-bold ${suitColor}`}>
          {card.enhancement === 'Stone' ? '?' : card.rank}
        </div>
        <div className={`text-2xl ${suitColor}`}>
          {card.enhancement === 'Stone' ? '●' : card.suit}
        </div>
        {card.seal && (
          <div className="absolute top-0 right-0 w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: 
                card.seal === 'Gold' ? '#fbbf24' :
                card.seal === 'Red' ? '#ef4444' :
                card.seal === 'Blue' ? '#3b82f6' :
                card.seal === 'Purple' ? '#a855f7' : '#666'
            }}
          />
        )}
      </div>
    );
  };

  const JokerCard = ({ joker, inShop, onBuy, onSell, triggering }) => {
    const rarityColors = {
      common: 'from-gray-400 to-gray-600',
      uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600',
      legendary: 'from-purple-500 to-pink-600'
    };
    
    return (
      <div className={`w-32 h-44 rounded-lg bg-gradient-to-br ${rarityColors[joker.rarity]} p-3 flex flex-col items-center justify-between text-white shadow-lg transition-transform ${triggering ? 'scale-110 ring-4 ring-yellow-400 z-20' : ''}`}>
        <div className="text-center font-bold text-sm">{joker.name}</div>
        <div className="text-4xl">🃏</div>
        <div className="text-xs text-center opacity-90">{joker.desc}</div>
        {inShop && (
          <button
            onClick={() => onBuy(joker)}
            className="bg-yellow-500 text-gray-900 px-3 py-1 rounded font-bold text-sm hover:bg-yellow-400"
          >
            ${joker.price}
          </button>
        )}
        {!inShop && onSell && (
          <button
            onClick={() => onSell(joker)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-400"
          >
            Sell ${Math.floor(joker.price / 2)}
          </button>
        )}
      </div>
    );
  };

  const RunInfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-8">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">Run Info</h2>
          <button 
            onClick={() => setShowRunInfo(false)} 
            className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
        
        <h3 className="text-xl text-white mb-4 border-b border-gray-600 pb-2">Poker Hands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(POKER_HANDS).map(handName => {
            const base = POKER_HANDS[handName];
            const lvl = handLevels[handName] || 0;
            return (
              <div 
                key={handName} 
                className={`p-4 rounded-lg ${lvl > 0 ? 'bg-purple-900 border border-purple-500' : 'bg-gray-700'}`}
              >
                <div className="flex justify-between text-white font-bold">
                  <span>{handName}</span>
                  <span className="text-blue-300">Lvl.{lvl + 1}</span>
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  <span className="text-blue-400 font-bold">{base.chips + (lvl * 30)}</span> × <span className="text-red-400 font-bold">{base.mult + (lvl * 3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ScoringDisplay = () => {
    if (!scoringState.active) return null;

    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-[600px]">
        <div className="bg-black bg-opacity-90 rounded-2xl border-4 border-gray-600 p-6 flex flex-col items-center shadow-2xl">
          <div className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">{scoringState.handType}</div>
          <div className="flex items-center gap-4 text-5xl font-black mb-6 bg-gray-900 p-4 rounded-xl border-2 border-gray-700">
            <div className="flex flex-col items-center">
              <div className={`text-blue-400 transition-all ${scoringState.triggeredId ? 'scale-110' : ''}`}>{scoringState.chips}</div>
              <div className="text-xs text-blue-300 font-normal">CHIPS</div>
            </div>
            <div className="text-white">×</div>
            <div className="flex flex-col items-center">
              <div className={`text-red-400 transition-all ${scoringState.triggeredId ? 'scale-110' : ''}`}>{scoringState.mult}</div>
              <div className="text-xs text-red-300 font-normal">MULT</div>
            </div>
          </div>
          <div className="text-6xl text-yellow-400 font-bold bg-gray-800 px-8 py-2 rounded-lg border border-gray-600 w-full text-center">
            {(scoringState.chips * scoringState.mult).toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  if (gameState === 'menu') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-400 mb-8" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
            BALATRO
          </h1>
          <p className="text-white text-xl mb-8">Poker Roguelike Deckbuilder</p>
          <button
            onClick={startGame}
            className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-2xl font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/50"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'blind_select') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-8">
        <div className="text-center max-w-6xl">
          <h2 className="text-5xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(251, 191, 36, 0.6)' }}>
            Ante {ante}
          </h2>
          <p className="text-yellow-300 mb-12">Select Your Blind</p>
          
          <div className="flex gap-8 justify-center">
            {/* Small Blind */}
            <div className={`bg-gray-800 p-8 rounded-2xl border-4 ${blindsCompleted.small ? 'border-green-500' : 'border-blue-400'} shadow-2xl transform transition-all hover:scale-105`}>
              <h3 className="text-white text-3xl mb-4 font-bold">Small Blind</h3>
              <div className="text-yellow-400 text-4xl mb-2 font-bold">{getBlindScore(ante, 'small')}</div>
              <p className="text-gray-400 text-sm mb-4">Score Required</p>
              <p className="text-green-400 mb-6 text-xl">Reward: $3</p>
              {blindsCompleted.small ? (
                <div className="text-green-400 text-2xl">✓ Completed</div>
              ) : (
                <button
                  onClick={() => selectBlind('small')}
                  className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-blue-400 transition-all shadow-lg"
                >
                  Select
                </button>
              )}
            </div>
            
            {/* Big Blind */}
            <div className={`bg-gray-800 p-8 rounded-2xl border-4 ${blindsCompleted.big ? 'border-green-500' : blindsCompleted.small ? 'border-blue-400' : 'border-gray-600'} shadow-2xl transform transition-all ${blindsCompleted.small ? 'hover:scale-105' : 'opacity-50'}`}>
              <h3 className="text-white text-3xl mb-4 font-bold">Big Blind</h3>
              <div className="text-yellow-400 text-4xl mb-2 font-bold">{getBlindScore(ante, 'big')}</div>
              <p className="text-gray-400 text-sm mb-4">Score Required</p>
              <p className="text-green-400 mb-6 text-xl">Reward: $4</p>
              {blindsCompleted.big ? (
                <div className="text-green-400 text-2xl">✓ Completed</div>
              ) : blindsCompleted.small ? (
                <button
                  onClick={() => selectBlind('big')}
                  className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-blue-400 transition-all shadow-lg"
                >
                  Select
                </button>
              ) : (
                <div className="text-gray-500 text-sm">Complete Small Blind first</div>
              )}
            </div>
            
            {/* Boss Blind */}
            <div className={`bg-red-900 p-8 rounded-2xl border-4 ${blindsCompleted.boss ? 'border-green-500' : blindsCompleted.big ? 'border-red-400' : 'border-gray-600'} shadow-2xl transform transition-all ${blindsCompleted.big ? 'hover:scale-105' : 'opacity-50'}`}>
              <h3 className="text-white text-3xl mb-4 font-bold">Boss Blind</h3>
              <div className="text-yellow-400 text-4xl mb-2 font-bold">{getBlindScore(ante, 'boss')}</div>
              <p className="text-gray-400 text-sm mb-2">Score Required</p>
              <p className="text-red-300 text-sm mb-4 h-12">{BOSS_BLINDS[0].desc}</p>
              <p className="text-green-400 mb-6 text-xl">Reward: $8</p>
              {blindsCompleted.boss ? (
                <div className="text-green-400 text-2xl">✓ Completed</div>
              ) : blindsCompleted.big ? (
                <button
                  onClick={() => selectBlind('boss')}
                  className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-400 transition-all shadow-lg"
                >
                  Select
                </button>
              ) : (
                <div className="text-gray-500 text-sm">Complete Big Blind first</div>
              )}
            </div>
          </div>
          
          <div className="mt-12 flex gap-4 justify-center">
            {!blindsCompleted.small && (
              <button
                onClick={skipBlind}
                className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all"
              >
                Skip Small Blind ($5)
              </button>
            )}
            {blindsCompleted.small && !blindsCompleted.big && (
              <button
                onClick={skipBlind}
                className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all"
              >
                Skip Big Blind ($10)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'shop') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-bold text-yellow-400" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(251, 191, 36, 0.6)' }}>
              Shop
            </h2>
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => setShowRunInfo(true)} 
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600"
              >
                Run Info
              </button>
              <div className="text-3xl text-yellow-400 font-bold">💰 ${money}</div>
            </div>
          </div>
          
          {showRunInfo && <RunInfoModal />}
          
          {/* Open Pack Modal */}
          {shop.openPack && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-4xl relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl text-yellow-400">Choose up to 2 from {shop.packType}</h3>
                  <button
                    onClick={() => setShop(prev => ({ ...prev, openPack: null, packType: null, packSelectionsCount: 0 }))}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
                <p className="text-gray-400 mb-6">Selected: {shop.packSelectionsCount}/2</p>
                <div className="flex gap-4 flex-wrap justify-center">
                  {shop.openPack.map(item => (
                    <div
                      key={item.id}
                      onClick={() => selectFromPack(item)}
                      className="cursor-pointer transform hover:scale-105 transition-all"
                    >
                      {item.type === 'playing' ? (
                        <Card card={item} />
                      ) : item.type === 'tarot' || item.type === 'planet' ? (
                        <div className="w-32 h-44 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 flex flex-col items-center justify-center text-white">
                          <div className="text-2xl mb-2">🔮</div>
                          <div className="text-center text-sm font-bold">{item.name}</div>
                          <div className="text-xs text-center mt-2">{item.desc}</div>
                        </div>
                      ) : (
                        <JokerCard joker={item} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Jokers</h3>
            <div className="flex gap-4 flex-wrap">
              {shop.jokers.map(joker => (
                <JokerCard key={joker.id} joker={joker} inShop onBuy={buyJoker} />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Booster Packs</h3>
            <div className="flex gap-4 flex-wrap">
              {shop.packs.map(pack => (
                <div
                  key={pack.id}
                  className="w-40 h-56 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 flex flex-col items-center justify-between text-white shadow-xl"
                >
                  <div className="text-center font-bold text-lg">{pack.type}</div>
                  <div className="text-5xl">📦</div>
                  <div className="text-xs text-center opacity-80">{pack.contains}</div>
                  <button
                    onClick={() => buyPack(pack)}
                    className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                  >
                    ${pack.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Your Jokers ({jokers.length}/5)</h3>
            <div className="flex gap-4 flex-wrap">
              {jokers.map(joker => (
                <JokerCard key={joker.id} joker={joker} onSell={sellJoker} />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Consumables ({consumables.length}/2)</h3>
            <div className="flex gap-4 flex-wrap">
              {consumables.map(cons => (
                <div
                  key={cons.id}
                  onClick={() => useConsumable(cons)}
                  className="w-32 h-44 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 flex flex-col items-center justify-between text-white cursor-pointer hover:scale-105 transition-all shadow-xl"
                >
                  <div className="text-center font-bold text-sm">{cons.name}</div>
                  <div className="text-4xl">🔮</div>
                  <div className="text-xs text-center opacity-90">{cons.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={leaveShop}
            className="bg-green-500 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:bg-green-400 transition-all shadow-xl"
          >
            Continue to Next Blind
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-400 mb-8">Victory!</h1>
          <p className="text-white text-2xl mb-8">You beat Ante 8!</p>
          <button
            onClick={() => setGameState('menu')}
            className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-2xl font-bold hover:bg-yellow-400"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'game_over') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-400 mb-8">Game Over</h1>
          <p className="text-white text-2xl mb-8">Reached Ante {ante}</p>
          <button
            onClick={() => setGameState('menu')}
            className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-2xl font-bold hover:bg-yellow-400"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col overflow-hidden relative">
      {/* Scoring Overlay */}
      <ScoringDisplay />
      
      {/* Run Info Modal */}
      {showRunInfo && <RunInfoModal />}
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-30">
        <div className="text-white">
          <div className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            Ante {ante} • {blindType.charAt(0).toUpperCase() + blindType.slice(1)} Blind
          </div>
          {effectiveBossBlind && (
            <div className="text-red-400 text-sm mt-1">{effectiveBossBlind.name}: {effectiveBossBlind.desc}</div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setShowRunInfo(true)} 
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600"
          >
            Run Info
          </button>
          <div className="text-3xl text-yellow-400 font-bold">💰 ${money}</div>
        </div>
      </div>

      {/* Score Display */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border-2 border-yellow-400">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400 mb-1">SCORE</div>
            <div className="text-5xl font-bold text-yellow-400" style={{ fontFamily: 'Georgia, serif' }}>
              {score.toLocaleString()} / {targetScore.toLocaleString()}
            </div>
            <div className="flex gap-6 mt-3 text-white">
              <div>
                <span className="text-blue-400 font-bold">Hands:</span> {handsRemaining}
              </div>
              <div>
                <span className="text-red-400 font-bold">Discards:</span> {discardsRemaining}
              </div>
            </div>
          </div>
          {currentHandType && !scoringState.active && (
            <div className="text-right">
              <div className="text-2xl font-bold text-white mb-2">{currentHandType}</div>
              <div className="flex items-center justify-end gap-2 text-2xl font-mono bg-black bg-opacity-50 p-2 rounded-lg">
                <span className="text-blue-400">{POKER_HANDS[currentHandType].chips + (handLevels[currentHandType]||0)*30}</span> 
                <span className="text-white text-sm">×</span>
                <span className="text-red-400">{POKER_HANDS[currentHandType].mult + (handLevels[currentHandType]||0)*3}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hand Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Sort Buttons */}
        {!usingConsumable && (
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => sortHand('rank')} 
              className="bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600 font-bold"
            >
              Sort Rank
            </button>
            <button 
              onClick={() => sortHand('suit')} 
              className="bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600 font-bold"
            >
              Sort Suit
            </button>
          </div>
        )}
        
        <div className="flex gap-3 flex-wrap justify-center max-w-6xl min-h-[160px]">
          {hand.map(card => (
            <Card
              key={card.id}
              card={card}
              selected={selectedCards.includes(card.id)}
              triggering={scoringState.triggeredId === card.id}
              onClick={() => !usingConsumable && toggleCard(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Consumable Use Panel */}
      {usingConsumable && (
        <div className="mx-4 mb-4 bg-purple-900 border-2 border-purple-400 rounded-xl p-4">
          <div className="text-white text-center mb-2">
            Using: <span className="text-yellow-400 font-bold">{usingConsumable.name}</span> - Select up to {usingConsumable.count} cards
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={applyTarot}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-400"
            >
              Apply
            </button>
            <button
              onClick={() => { setUsingConsumable(null); setSelectedCards([]); }}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!usingConsumable && !scoringState.active && (
        <div className="flex gap-4 justify-center mb-4 px-4">
          <button
            onClick={playHand}
            disabled={selectedCards.length === 0 || handsRemaining <= 0}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-105 disabled:hover:scale-100 border-b-8 border-blue-800 active:border-b-0 active:translate-y-2"
          >
            PLAY HAND
          </button>
          <button
            onClick={discardCards}
            disabled={selectedCards.length === 0 || discardsRemaining <= 0}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-105 disabled:hover:scale-100 border-b-8 border-red-800 active:border-b-0 active:translate-y-2"
          >
            DISCARD
          </button>
        </div>
      )}

      {/* Jokers and Consumables */}
      <div className="bg-black bg-opacity-80 p-4 border-t-4 border-gray-700">
        <div className="flex gap-8 max-w-7xl mx-auto">
          <div className="flex-1">
            <div className="text-yellow-400 mb-2 font-bold text-sm tracking-widest">JOKERS ({jokers.length}/5)</div>
            <div className="flex gap-2 overflow-x-auto pb-2 min-h-[180px]">
              {jokers.map(joker => (
                <div key={joker.id} className="flex-shrink-0">
                  <JokerCard joker={joker} triggering={scoringState.triggeredId === joker.id} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 border-l border-gray-700 pl-4">
            <div className="text-purple-400 mb-2 font-bold text-sm tracking-widest">CONSUMABLES ({consumables.length}/2)</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {consumables.map(cons => (
                <div
                  key={cons.id}
                  onClick={() => gameState === 'playing' && useConsumable(cons)}
                  className="w-24 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-2 flex flex-col items-center justify-between text-white cursor-pointer hover:scale-105 transition-all flex-shrink-0 border border-purple-400"
                >
                  <div className="text-center font-bold text-xs">{cons.name}</div>
                  <div className="text-2xl">🔮</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Overlay */}
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-xl font-bold shadow-2xl z-50 border-4 border-yellow-300 animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}