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
    desc: '+1 Mult for each empty Joker slot',
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
  },
  // Additional Common Jokers
  'Droll Joker': {
    rarity: 'common',
    effect: 'hand_mult',
    handType: 'Flush',
    value: 10,
    desc: '+10 Mult if hand contains a Flush',
    price: 5
  },
  'Wily Joker': {
    rarity: 'common',
    effect: 'hand_chips',
    handType: 'Three of a Kind',
    value: 100,
    desc: '+100 Chips if hand contains Three of a Kind',
    price: 5
  },
  'Clever Joker': {
    rarity: 'common',
    effect: 'hand_chips',
    handType: 'Two Pair',
    value: 80,
    desc: '+80 Chips if hand contains Two Pair',
    price: 5
  },
  'Devious Joker': {
    rarity: 'common',
    effect: 'hand_chips',
    handType: 'Straight',
    value: 100,
    desc: '+100 Chips if hand contains a Straight',
    price: 5
  },
  'Crafty Joker': {
    rarity: 'common',
    effect: 'hand_chips',
    handType: 'Flush',
    value: 80,
    desc: '+80 Chips if hand contains a Flush',
    price: 5
  },
  // Additional Uncommon Jokers
  'Marble Joker': {
    rarity: 'uncommon',
    effect: 'add_stone_card',
    desc: 'Adds 1 Stone card to deck when Blind selected',
    price: 6
  },
  'Loyalty Card': {
    rarity: 'uncommon',
    effect: 'loyalty_mult',
    value: 4,
    counter: 0,
    desc: 'x4 Mult every 6 hands played',
    price: 6
  },
  '8 Ball': {
    rarity: 'uncommon',
    effect: 'eight_ball_mult',
    value: 20,
    desc: '1 in 4 chance for each 8 to give +20 Mult or -20 Mult',
    price: 6
  },
  'Raised Fist': {
    rarity: 'uncommon',
    effect: 'raised_fist',
    desc: 'Adds 2x rank of lowest card held in hand to Mult',
    price: 6
  },
  // Additional Rare Jokers
  'Stone Joker': {
    rarity: 'rare',
    effect: 'stone_card_chips',
    value: 25,
    desc: '+25 Chips for each Stone card in deck',
    price: 8
  },
  'The Order': {
    rarity: 'rare',
    effect: 'hand_mult_multiplier',
    handType: 'Straight',
    value: 3,
    desc: 'x3 Mult if hand contains a Straight',
    price: 8
  },
  'The Tribe': {
    rarity: 'rare',
    effect: 'hand_mult_multiplier',
    handType: 'Flush',
    value: 2,
    desc: 'x2 Mult if hand contains a Flush',
    price: 8
  },
  'Stuntman': {
    rarity: 'rare',
    effect: 'stuntman',
    value: 250,
    handSizeChange: -2,
    desc: '+250 Chips, -2 hand size',
    price: 8
  },
  'Satellite': {
    rarity: 'rare',
    effect: 'satellite_money',
    value: 1,
    counter: 0,
    desc: 'Earn $1 per unique Planet card used this run',
    price: 8
  },
  'Shoot the Moon': {
    rarity: 'rare',
    effect: 'queen_mult',
    value: 13,
    desc: '+13 Mult for each Queen held in hand',
    price: 8
  },
  'Rocket': {
    rarity: 'rare',
    effect: 'rocket_money',
    value: 1,
    growing: true,
    desc: 'Earn $1 at end of round. +$2 when Boss Blind defeated',
    price: 8
  },
  'To the Moon': {
    rarity: 'rare',
    effect: 'extra_interest',
    desc: 'Earn $1 extra interest for every $5',
    price: 8
  },
  'Gift Card': {
    rarity: 'rare',
    effect: 'gift_card',
    desc: 'Add $1 sell value to every Joker and Consumable at end of round',
    price: 8
  },
  'Seeing Double': {
    rarity: 'rare',
    effect: 'seeing_double',
    value: 2,
    desc: 'x2 Mult if hand has Club card and card of any other suit',
    price: 8
  },
  'Baseball Card': {
    rarity: 'rare',
    effect: 'baseball_card',
    value: 1.5,
    desc: 'Uncommon Jokers each give x1.5 Mult',
    price: 8
  },
  // Additional Legendary
  'Canio': {
    rarity: 'legendary',
    effect: 'canio_mult',
    value: 1,
    desc: 'Gains x1 Mult when face card destroyed',
    price: 20
  },
  'Yorick': {
    rarity: 'legendary',
    effect: 'yorick_mult',
    value: 1,
    counter: 0,
    desc: 'Gains x1 Mult every 23 cards discarded',
    price: 20
  },
  // Blueprint & Brainstorm - copy abilities
  'Blueprint': {
    rarity: 'rare',
    effect: 'blueprint',
    desc: 'Copies ability of Joker to the right',
    price: 8
  },
  'Brainstorm': {
    rarity: 'rare',
    effect: 'brainstorm',
    desc: 'Copies ability of leftmost Joker',
    price: 8
  },
  'Idol': {
    rarity: 'uncommon',
    effect: 'idol_rank',
    value: 2,
    rank: 'K', // Will be set based on random card from deck
    desc: 'Each played King gives x2 Mult, card chosen at end of round',
    price: 6
  },
  'Fibonacci': {
    rarity: 'uncommon',
    effect: 'fibonacci',
    value: 8,
    desc: 'Each played Ace, 2, 3, 5, or 8 gives +8 Mult',
    price: 6
  },
  'Scary Face': {
    rarity: 'common',
    effect: 'face_chips',
    value: 30,
    desc: 'Played face cards give +30 Chips',
    price: 5
  },
  'Abstract Joker': {
    rarity: 'common',
    effect: 'mult_per_joker',
    value: 3,
    desc: '+3 Mult per Joker slot',
    price: 4
  },
  'Delayed Gratification': {
    rarity: 'uncommon',
    effect: 'unused_discard_money',
    value: 2,
    desc: 'Earn $2 per unused discard at end of round',
    price: 6
  },
  'Hack': {
    rarity: 'uncommon',
    effect: 'retrigger_2345',
    desc: 'Retrigger each played 2, 3, 4, or 5',
    price: 6
  },
  'Pareidolia': {
    rarity: 'uncommon',
    effect: 'all_face_cards',
    desc: 'All cards considered face cards',
    price: 6
  },
  'Gros Michel': {
    rarity: 'common',
    effect: 'banana_mult',
    value: 15,
    desc: '+15 Mult, 1 in 4 chance to destroy at end of round',
    price: 5
  },
  'Cavendish': {
    rarity: 'rare',
    effect: 'backup_banana',
    value: 3,
    desc: '+3 Mult (x Mult), replaces destroyed Gros Michel',
    price: 8,
    counter: 1
  },
  'Egg': {
    rarity: 'common',
    effect: 'gain_sell_value',
    value: 3,
    desc: 'Gains $3 of sell value at end of round',
    price: 4
  },
  'Ice Cream': {
    rarity: 'common',
    effect: 'ice_cream_chips',
    value: 100,
    desc: '+100 Chips, -5 Chips per hand played',
    price: 5
  },
  'Turtle Bean': {
    rarity: 'uncommon',
    effect: 'turtle_bean_handsize',
    value: 5,
    desc: '+5 Hand Size, reduced by 1 each round',
    price: 6
  },
  'Erosion': {
    rarity: 'uncommon',
    effect: 'erosion_mult',
    value: 4,
    desc: '+4 Mult for each card below 52 in full deck',
    price: 6
  },
  'Golden Ticket': {
    rarity: 'uncommon',
    effect: 'gold_money',
    value: 3,
    desc: 'Played Gold cards give $3 when scored',
    price: 6
  },
  'Lucky Cat': {
    rarity: 'uncommon',
    effect: 'lucky_cat_mult',
    value: 2,
    desc: 'x Mult for each successful Lucky trigger this hand',
    price: 6,
    counter: 1
  },
  'Smeared Joker': {
    rarity: 'uncommon',
    effect: 'smeared_suits',
    desc: 'Hearts and Diamonds count as same suit, Clubs and Spades count as same suit',
    price: 6
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
  'The World': { effect: 'convert_spades', count: 3, desc: 'Converts up to 3 cards to ♠', price: 3 },
  'The High Priestess': { effect: 'create_planet', count: 2, desc: 'Creates up to 2 random Planet cards', price: 3 },
  'The Emperor': { effect: 'create_tarot', count: 2, desc: 'Creates up to 2 random Tarot cards', price: 3 },
  'Strength': { effect: 'upgrade_rank', count: 2, desc: 'Increases rank of up to 2 cards by 1', price: 3 },
  'Death': { effect: 'transform_card', count: 2, desc: 'First card becomes exact copy of second card', price: 3 },
  'The Hermit': { effect: 'double_money', max: 20, desc: 'Doubles money (max $20)', price: 3 },
  'Wheel of Fortune': { effect: 'random_edition', desc: '1 in 4 chance to add edition to random Joker', price: 3 },
  'Temperance': { effect: 'sell_jokers', max: 50, desc: 'Gives total sell value of all Jokers (max $50)', price: 3 },
  'Judgement': { effect: 'create_joker', desc: 'Creates a random Joker card', price: 3 }
};

// ============================================================================
// SPECTRAL CARDS (High Risk/High Reward)
// ============================================================================

const SPECTRAL_CARDS = {
  'Familiar': { effect: 'destroy_random_add_random', desc: 'Destroy 1 random card, add 3 enhanced random cards', price: 4 },
  'Grim': { effect: 'destroy_all_rank_add_money', desc: 'Destroy all cards of 1 rank, gain $1 per destroyed', price: 4 },
  'Incantation': { effect: 'destroy_random_add_tarot_planet', desc: 'Destroy 1 random card, add 4 random Tarots/Planets', price: 4 },
  'Talisman': { effect: 'add_gold_seal', count: 1, desc: 'Add Gold Seal to 1 card', price: 4 },
  'Aura': { effect: 'add_edition_foil', count: 1, desc: 'Add Foil edition to 1 card', price: 4 },
  'Wraith': { effect: 'create_rare_joker_bankrupt', desc: 'Create rare Joker, set money to $0', price: 4 },
  'Sigil': { effect: 'convert_all_to_suit', desc: 'Convert all cards to 1 random suit', price: 4 },
  'Ouija': { effect: 'convert_all_rank_to_rank', desc: 'Convert all cards of 1 rank to another random rank', price: 4 },
  'Ectoplasm': { effect: 'add_negative_joker_nohand', desc: 'Add Negative to random Joker, -1 hand per round', price: 4 },
  'Immolate': { effect: 'destroy_5_cards_add_20', desc: 'Destroy 5 random cards, add $20', price: 4 },
  'Ankh': { effect: 'copy_joker_destroy_others', desc: 'Copy random Joker, destroy all other Jokers', price: 4 },
  'Deja Vu': { effect: 'add_red_seal', count: 1, desc: 'Add Red Seal to 1 card', price: 4 },
  'Hex': { effect: 'add_polychrome_joker_destroy_others', desc: 'Add Polychrome to random Joker, destroy all others', price: 4 },
  'Trance': { effect: 'add_blue_seal', count: 1, desc: 'Add Blue Seal to 1 card', price: 4 },
  'Medium': { effect: 'add_purple_seal', count: 1, desc: 'Add Purple Seal to 1 card', price: 4 },
  'Cryptid': { effect: 'create_copy_card', count: 1, desc: 'Create 1 copy of selected card', price: 4 },
  'The Soul': { effect: 'create_legendary_joker_bankrupt', desc: 'Create Legendary Joker, set money to $0', price: 4 },
  'Black Hole': { effect: 'upgrade_all_hands', desc: 'Upgrade every poker hand by 1 level', price: 4 }
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
// TAGS (Skip Blind Rewards)
// ============================================================================

const TAGS = {
  'Uncommon Tag': { effect: 'free_uncommon', desc: 'Free uncommon joker next shop', icon: '🟢' },
  'Rare Tag': { effect: 'free_rare', desc: 'Free rare joker next shop', icon: '🔵' },
  'Negative Tag': { effect: 'next_negative', desc: 'Next joker is Negative', icon: '💜' },
  'Foil Tag': { effect: 'next_foil', desc: 'Next joker is Foil', icon: '✨' },
  'Holographic Tag': { effect: 'next_holo', desc: 'Next joker is Holographic', icon: '🌈' },
  'Polychrome Tag': { effect: 'next_poly', desc: 'Next joker is Polychrome', icon: '🎨' },
  'Investment Tag': { effect: 'money', value: 25, desc: 'Gain $25', icon: '💰' },
  'Voucher Tag': { effect: 'free_voucher', desc: 'Free voucher next shop', icon: '🎟️' },
  'Coupon Tag': { effect: 'discount', desc: 'Next shop item is free', icon: '🏷️' }
};

// ============================================================================
// VOUCHERS (Permanent Upgrades)
// ============================================================================

const VOUCHERS = {
  'Overstock': { effect: 'extra_shop_slot', desc: '+1 Joker shop slot', price: 10, icon: '📦' },
  'Clearance Sale': { effect: 'discount_all', value: 0.75, desc: 'All shop items 25% off', price: 10, icon: '🏷️' },
  'Hone': { effect: 'hand_size', value: 1, desc: '+1 hand size', price: 10, icon: '✋' },
  'Reroll Surplus': { effect: 'cheap_reroll', desc: 'Reroll costs $2', price: 10, icon: '🔄' },
  'Crystal Ball': { effect: 'consumable_slot', value: 1, desc: '+1 consumable slot', price: 10, icon: '🔮' },
  'Telescope': { effect: 'interest_bonus', value: 1, desc: '+$1 interest per $5', price: 10, icon: '🔭' },
  'Grabber': { effect: 'hand_size', value: 1, desc: '+1 hand size', price: 10, icon: '🤲' },
  'Wasteful': { effect: 'discard_size', value: 1, desc: '+1 discard', price: 10, icon: '🗑️' }
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
  { name: 'The Flint', effect: 'half_chips_mult', desc: 'Base Chips and Mult are halved' },
  { name: 'The Pillar', effect: 'one_hand_type', desc: 'Play only 1 hand type this round' },
  { name: 'The Arm', effect: 'decrease_hand_level', desc: 'Decrease level of played hand by 1' },
  { name: 'The Club', effect: 'debuff_clubs', desc: 'All Club cards are debuffed' },
  { name: 'The Window', effect: 'debuff_diamonds', desc: 'All Diamond cards are debuffed' },
  { name: 'The Mark', effect: 'debuff_face', desc: 'All face cards drawn face down' }
];

// ============================================================================
// DECKS (Starting Deck Types)
// ============================================================================

const DECKS = {
  'Red Deck': { 
    bonus: 'none', 
    desc: 'Standard deck',
    color: 'from-red-600 to-red-800'
  },
  'Blue Deck': { 
    bonus: 'extra_hand', 
    value: 1,
    desc: '+1 Hand per round',
    color: 'from-blue-600 to-blue-800'
  },
  'Yellow Deck': { 
    bonus: 'extra_money', 
    value: 10,
    desc: 'Start with $10 extra',
    color: 'from-yellow-600 to-yellow-800'
  },
  'Green Deck': { 
    bonus: 'extra_interest', 
    value: 1,
    desc: '+$1 interest per $5',
    color: 'from-green-600 to-green-800'
  },
  'Black Deck': { 
    bonus: 'joker_slot_minus_hand', 
    desc: '+1 Joker Slot, -1 Hand',
    color: 'from-gray-800 to-black'
  },
  'Magic Deck': { 
    bonus: 'start_voucher', 
    value: 'Crystal Ball',
    desc: 'Start with Crystal Ball',
    color: 'from-purple-600 to-purple-800'
  },
  'Nebula Deck': { 
    bonus: 'start_consumable', 
    value: 'Celestial Pack',
    desc: 'Start with Celestial Pack',
    color: 'from-indigo-600 to-indigo-800'
  },
  'Ghost Deck': { 
    bonus: 'spectral_shop', 
    desc: 'Spectral cards in shop',
    color: 'from-gray-600 to-gray-800'
  }
};

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
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [ante, setAnte] = useState(1);
  const [blindType, setBlindType] = useState('small');
  const [blindsCompleted, setBlindsCompleted] = useState({ small: false, big: false, boss: false });
  const [bossBlind, setBossBlind] = useState(null);
  const [upcomingBoss, setUpcomingBoss] = useState(null);
  
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  
  const [money, setMoney] = useState(4);
  const [jokers, setJokers] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [lastUsedConsumable, setLastUsedConsumable] = useState(null);
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
  
  const [tags, setTags] = useState([]);
  const [vouchers, setVouchers] = useState([]);

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

  const startGame = (deckName) => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setSelectedDeck(deckName);
    
    const deck = DECKS[deckName];
    let startMoney = 4;
    let bonusHands = 0;
    let bonusHandSize = 0;
    let bonusDiscards = 0;
    
    // Apply deck bonuses
    if (deck.bonus === 'extra_money') {
      startMoney += deck.value;
    } else if (deck.bonus === 'extra_hand') {
      bonusHands = deck.value;
    } else if (deck.bonus === 'joker_slot_minus_hand') {
      bonusHands = -1; // Black Deck: -1 hand
      // +1 joker slot handled in buyJoker/selectFromPack
    }
    
    setMoney(startMoney);
    setJokers([]);
    
    // Apply starting consumables
    let startingConsumables = [];
    if (deck.bonus === 'start_consumable') {
      // Nebula Deck: Start with 1 random Planet card
      const planetNames = Object.keys(PLANET_CARDS);
      const randomPlanet = planetNames[Math.floor(Math.random() * planetNames.length)];
      const planetData = PLANET_CARDS[randomPlanet];
      startingConsumables.push({
        id: Date.now() + Math.random(),
        name: randomPlanet,
        ...planetData,
        type: 'planet'
      });
    }
    setConsumables(startingConsumables);
    
    setHandLevels({});
    setAnte(1);
    setBlindType('small');
    setBlindsCompleted({ small: false, big: false, boss: false });
    setBossBlind(null);
    setScore(0);
    setPlayedHandTypes([]);
    setTags([]);
    
    // Apply starting vouchers
    let startingVouchers = [];
    if (deck.bonus === 'start_voucher') {
      // Magic Deck: Start with Crystal Ball
      const crystalBall = {
        name: 'Crystal Ball',
        effect: 'consumable_slot',
        value: 1,
        desc: '+1 consumable slot',
        price: 10,
        icon: '🔮'
      };
      startingVouchers.push(crystalBall);
    }
    setVouchers(startingVouchers);
    
    // Preview a random boss
    const randomBoss = BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)];
    setUpcomingBoss(randomBoss);
    
    setHandSize(8 + bonusHandSize);
    setMaxHands(4 + bonusHands);
    setMaxDiscards(3 + bonusDiscards);
    setHandsRemaining(4 + bonusHands);
    setDiscardsRemaining(3 + bonusDiscards);
    
    // Start in shop to give player prep time
    setGameState('shop');
    generateShop(true); // Include voucher for first ante
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
    const handSizeReduction = jokers.filter(j => j.effect === 'stuntman').reduce((sum, j) => sum + (j.handSizeChange || 0), 0);
    const bonusDiscards = jokers.filter(j => j.effect === 'discard_size').reduce((sum, j) => sum + j.value, 0);
    
    let boss = null;
    if (type === 'boss') {
      // Use the previewed boss instead of random
      boss = upcomingBoss || BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)];
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
    setHandSize(8 + bonusHandSize + handSizeReduction);
    setGameState('playing');
    
    // RESET DECK: Combine deck + discard pile + hand and shuffle everything
    const fullDeck = [...deck, ...discardPile, ...hand];
    const shuffledDeck = shuffle(fullDeck);
    
    // Clear discard pile
    setDiscardPile([]);
    
    // Draw initial hand from freshly shuffled deck
    const drawn = shuffledDeck.slice(0, 8 + bonusHandSize + handSizeReduction);
    const remaining = shuffledDeck.slice(8 + bonusHandSize + handSizeReduction);
    
    // Set hand and deck in one go to prevent duplication
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
    // Determine which blind we're skipping based on completion status
    let blindToSkip = 'small';
    let skipCost = 5;
    
    if (!blindsCompleted.small) {
      blindToSkip = 'small';
      skipCost = 5;
    } else if (!blindsCompleted.big) {
      blindToSkip = 'big';
      skipCost = 10;
    } else {
      setMessage("Can't skip boss blind!");
      return;
    }
    
    if (money < skipCost) {
      setMessage(`Need $${skipCost} to skip!`);
      return;
    }
    
    setMoney(prev => prev - skipCost);
    
    // Give random Tag as reward for skipping
    const tagNames = Object.keys(TAGS);
    const randomTag = tagNames[Math.floor(Math.random() * tagNames.length)];
    const tagData = TAGS[randomTag];
    
    const newTag = {
      id: Date.now() + Math.random(),
      name: randomTag,
      ...tagData
    };
    
    // Apply instant tags immediately
    if (tagData.effect === 'money') {
      setMoney(prev => prev + tagData.value);
      setMessage(`Blind skipped! +${randomTag}: $${tagData.value}`);
    } else {
      setTags(prev => [...prev, newTag]);
      setMessage(`Blind skipped! Got ${randomTag}!`);
    }
    
    // Mark the blind as completed
    if (blindToSkip === 'small') {
      setBlindsCompleted(prev => ({ ...prev, small: true }));
    } else if (blindToSkip === 'big') {
      setBlindsCompleted(prev => ({ ...prev, big: true }));
    }
    
    // Go to shop
    setGameState('shop');
    generateShop();
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

  const moveJokerLeft = (index) => {
    if (index <= 0) return;
    setJokers(prev => {
      const newJokers = [...prev];
      [newJokers[index - 1], newJokers[index]] = [newJokers[index], newJokers[index - 1]];
      return newJokers;
    });
  };

  const moveJokerRight = (index) => {
    if (index >= jokers.length - 1) return;
    setJokers(prev => {
      const newJokers = [...prev];
      [newJokers[index], newJokers[index + 1]] = [newJokers[index + 1], newJokers[index]];
      return newJokers;
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
      } else if (effectiveBossBlind?.effect === 'debuff_clubs') {
        return card.suit === SUITS.CLUBS;
      } else if (effectiveBossBlind?.effect === 'debuff_diamonds') {
        return card.suit === SUITS.DIAMONDS;
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
    const effectiveLevel = effectiveBossBlind?.effect === 'decrease_hand_level' 
      ? Math.max(0, level - 1) 
      : level;
    currentChips += effectiveLevel * 30;
    currentMult += effectiveLevel * 3;
    
    if (effectiveBossBlind?.effect === 'half_chips_mult') {
      currentChips = Math.floor(currentChips / 2);
      currentMult = Math.floor(currentMult / 2);
    }

    const queue = [];

    // Helper to process a single card's scoring effects
    const processCard = (card) => {
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
      
      // Gold cards give $3 when scored
      if (card.enhancement === 'Gold') {
        setMoney(prev => prev + 3);
      }
      
      // Glass/Polychrome multiply
      if (card.enhancement === 'Glass') {
        currentMult = currentMult * 2;
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
        
        // Glass cards have 1 in 4 chance to break when scored
        if (Math.random() < 0.25) {
          // Mark card for destruction after scoring
          setTimeout(() => {
            setDeck(prev => prev.filter(c => c.id !== card.id));
            setHand(prev => prev.filter(c => c.id !== card.id));
            setDiscardPile(prev => prev.filter(c => c.id !== card.id));
            setMessage('Glass card shattered!');
          }, 2000);
        }
      }
      if (card.edition === 'Polychrome') {
        currentMult = Math.floor(currentMult * 1.5);
        queue.push({ sourceId: card.id, newChips: currentChips, newMult: currentMult });
      }
    };

    // 1. Base Cards - scoring cards only
    scoringCards.forEach(card => {
      processCard(card);
      
      // Red Seal: RETRIGGER (process card effects twice!)
      if (card.seal === 'Red') {
        processCard(card);
      }
      
      // Hack Joker: Retrigger 2, 3, 4, or 5
      const hackJoker = jokers.find(j => j.effect === 'retrigger_2345');
      if (hackJoker && ['2', '3', '4', '5'].includes(card.rank)) {
        processCard(card);
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
    // Helper function to process a joker's effect
    const processJokerEffect = (joker, jokerIndex) => {
      let triggered = false;
      let oldChips = currentChips;
      let oldMult = currentMult;
      
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
          currentMult += emptySlots * joker.value; // +1 Mult per empty slot
          triggered = true;
        }
      } else if (joker.effect === 'stone_card_chips') {
        const stoneCount = [...deck, ...hand, ...discardPile].filter(c => c.enhancement === 'Stone').length;
        if (stoneCount > 0) {
          currentChips += joker.value * stoneCount;
          triggered = true;
        }
      } else if (joker.effect === 'queen_mult') {
        const queensHeld = hand.filter(c => c.rank === 'Q' && !selectedCards.includes(c.id)).length;
        if (queensHeld > 0) {
          currentMult += joker.value * queensHeld;
          triggered = true;
        }
      } else if (joker.effect === 'stuntman') {
        currentChips += joker.value;
        triggered = true;
      } else if (joker.effect === 'seeing_double') {
        const hasClub = scoringCards.some(c => c.suit === SUITS.CLUBS);
        const hasOther = scoringCards.some(c => c.suit !== SUITS.CLUBS);
        if (hasClub && hasOther) {
          currentMult *= joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'baseball_card') {
        const uncommonCount = jokers.filter(j => j.rarity === 'uncommon').length;
        if (uncommonCount > 0) {
          currentMult = Math.floor(currentMult * Math.pow(joker.value, uncommonCount));
          triggered = true;
        }
      } else if (joker.effect === 'raised_fist') {
        const heldCards = hand.filter(c => !selectedCards.includes(c.id));
        if (heldCards.length > 0) {
          const lowestRank = heldCards.reduce((min, c) => {
            const val = CARD_VALUES[c.rank] || 0;
            return val < min ? val : min;
          }, 999);
          currentMult += lowestRank * 2;
          triggered = true;
        }
      } else if (joker.effect === 'eight_ball_mult') {
        const eights = scoringCards.filter(c => c.rank === '8');
        eights.forEach(() => {
          if (Math.random() < 0.25) {
            currentMult += joker.value;
            triggered = true;
          } else if (Math.random() < 0.5) {
            currentMult = Math.max(0, currentMult - joker.value);
            triggered = true;
          }
        });
      } else if (joker.effect === 'loyalty_mult') {
        if (joker.counter && joker.counter % 6 === 0) {
          currentMult *= joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'yorick_mult') {
        if (joker.value > 1) {
          currentMult *= joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'canio_mult') {
        if (joker.value > 1) {
          currentMult *= joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'idol_rank') {
        // Idol: Each played card of specific rank gives x2 Mult
        const idolCards = scoringCards.filter(c => c.rank === joker.rank);
        if (idolCards.length > 0) {
          currentMult = Math.floor(currentMult * Math.pow(joker.value, idolCards.length));
          triggered = true;
        }
      } else if (joker.effect === 'fibonacci') {
        // Fibonacci: Each played A, 2, 3, 5, 8 gives +8 Mult
        const fibRanks = ['A', '2', '3', '5', '8'];
        const count = scoringCards.filter(c => fibRanks.includes(c.rank)).length;
        if (count > 0) {
          currentMult += count * joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'face_chips') {
        // Scary Face: Played face cards give +30 Chips
        const faceCount = scoringCards.filter(c => ['J', 'Q', 'K'].includes(c.rank)).length;
        if (faceCount > 0) {
          currentChips += faceCount * joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'mult_per_joker') {
        // Abstract Joker: +3 Mult per Joker slot
        currentMult += jokers.length * joker.value;
        triggered = true;
      } else if (joker.effect === 'banana_mult') {
        // Gros Michel: +15 Mult
        currentMult += joker.value;
        triggered = true;
      } else if (joker.effect === 'backup_banana') {
        // Cavendish: +3 x Mult
        currentMult = Math.floor(currentMult * joker.value);
        triggered = true;
      } else if (joker.effect === 'ice_cream_chips') {
        // Ice Cream: +Chips (value decreases each hand)
        if (joker.value > 0) {
          currentChips += joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'erosion_mult') {
        // Erosion: +4 Mult per card below 52 in deck
        const cardsBelow52 = 52 - deck.length;
        if (cardsBelow52 > 0) {
          currentMult += cardsBelow52 * joker.value;
          triggered = true;
        }
      } else if (joker.effect === 'gold_money') {
        // Golden Ticket: Played Gold cards give $3
        const goldCards = scoringCards.filter(c => c.enhancement === 'Gold');
        if (goldCards.length > 0) {
          setMoney(prev => prev + (goldCards.length * joker.value));
          triggered = true;
        }
      } else if (joker.effect === 'lucky_cat_mult') {
        // Lucky Cat: x Mult for each successful Lucky trigger
        if (joker.counter > 1) {
          currentMult = Math.floor(currentMult * Math.pow(joker.value, joker.counter - 1));
          triggered = true;
        }
      } else if (joker.effect === 'blueprint' && jokerIndex < jokers.length - 1) {
        // Blueprint: copy joker to the right - RE-TRIGGER all its effects
        const rightJoker = jokers[jokerIndex + 1];
        // Allow copying ANY joker including Brainstorm, but not another Blueprint
        if (rightJoker && rightJoker.effect !== 'blueprint') {
          // First, the copied joker triggers and adds to queue
          const rightTriggered = processJokerEffect(rightJoker, jokerIndex + 1);
          if (rightTriggered) {
            // Add queue entry for the COPIED joker (showing it triggered)
            queue.push({ sourceId: rightJoker.id, newChips: currentChips, newMult: currentMult });
            // Blueprint itself also triggered (it caused the copy)
            triggered = true;
          }
        }
      } else if (joker.effect === 'brainstorm') {
        // Brainstorm: RE-RUN entire joker sequence from the beginning
        // This means ALL jokers trigger again in order!
        if (jokerIndex !== 0) { // Don't trigger if Brainstorm IS the leftmost
          // Process all jokers again from index 0
          for (let i = 0; i < jokers.length; i++) {
            const targetJoker = jokers[i];
            // Don't process Brainstorm itself or other Brainstorms in the re-trigger
            if (targetJoker.id !== joker.id && targetJoker.effect !== 'brainstorm') {
              const reTriggered = processJokerEffect(targetJoker, i);
              if (reTriggered) {
                queue.push({ sourceId: targetJoker.id, newChips: currentChips, newMult: currentMult });
              }
            }
          }
          triggered = true;
        }
      }
      
      return triggered;
    };

    jokers.forEach((joker, index) => {
      const triggered = processJokerEffect(joker, index);
      if (triggered) {
        queue.push({ sourceId: joker.id, newChips: currentChips, newMult: currentMult });
      }
      
      // Apply edition bonuses AFTER joker triggers
      if (joker.edition === 'Foil') {
        currentChips += 50;
        queue.push({ sourceId: joker.id, newChips: currentChips, newMult: currentMult });
      } else if (joker.edition === 'Holographic') {
        currentMult += 10;
        queue.push({ sourceId: joker.id, newChips: currentChips, newMult: currentMult });
      } else if (joker.edition === 'Polychrome') {
        currentMult = Math.floor(currentMult * 1.5);
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
    
    // Update loyalty card counter
    setJokers(prev => prev.map(j => {
      if (j.effect === 'loyalty_mult') {
        const newCounter = (j.counter || 0) + 1;
        return { ...j, counter: newCounter };
      }
      return j;
    }));
    
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
    
    // Track discards for Yorick
    setJokers(prev => prev.map(j => {
      if (j.effect === 'yorick_mult') {
        const newCounter = (j.counter || 0) + numDiscarded;
        if (newCounter >= 23) {
          return { ...j, counter: newCounter % 23, value: j.value + 1 };
        }
        return { ...j, counter: newCounter };
      }
      return j;
    }));
    
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
      // Green Deck: $1 per $5 (instead of per $10 default - wait, default IS per $5, so Green Deck gives +$1 bonus per $5)
      // Telescope voucher: +$1 interest per $5
      const greenDeckBonus = selectedDeck === 'Green Deck' ? 1 : 0;
      const telescopeBonus = vouchers.find(v => v.effect === 'interest_bonus') ? 1 : 0;
      const baseInterest = Math.min(Math.floor(money / 5), 5);
      const bonusInterest = Math.floor(money / 5) * (greenDeckBonus + telescopeBonus);
      const interest = baseInterest + bonusInterest;
      
      setMoney(prev => prev + reward + interest);
      
      jokers.forEach(joker => {
        if (joker.effect === 'end_round_money') {
          setMoney(prev => prev + joker.value);
        } else if (joker.effect === 'unused_discard_money') {
          // Delayed Gratification: $2 per unused discard
          const unusedDiscards = discardsRemaining;
          setMoney(prev => prev + (unusedDiscards * joker.value));
        } else if (joker.effect === 'rocket_money') {
          setMoney(prev => prev + joker.value);
          // Increase value if boss blind
          if (blindType === 'boss') {
            setJokers(prev => prev.map(j => 
              j.id === joker.id ? { ...j, value: j.value + 2 } : j
            ));
          }
        } else if (joker.effect === 'satellite_money') {
          // Money based on unique planets used (stored in counter)
          if (joker.counter > 0) {
            setMoney(prev => prev + joker.counter);
          }
        } else if (joker.effect === 'extra_interest') {
          // Extra $1 per $5
          const extraInterest = Math.floor(money / 5);
          setMoney(prev => prev + extraInterest);
        } else if (joker.effect === 'gift_card') {
          // Add $1 to sell value of all jokers and consumables
          setJokers(prev => prev.map(j => ({ ...j, price: (j.price || 5) + 1 })));
          setConsumables(prev => prev.map(c => ({ ...c, price: (c.price || 3) + 1 })));
        }
      });
      
      // Handle modifiers
      setJokers(prev => {
        let updated = prev.map(j => {
          // Perishable: countdown and destroy
          if (j.perishable) {
            const newRounds = (j.perishableRounds || 5) - 1;
            if (newRounds <= 0) {
              return null; // Will be filtered out
            }
            return { ...j, perishableRounds: newRounds };
          }
          // Egg: Gain $3 sell value
          if (j.effect === 'gain_sell_value') {
            return { ...j, price: (j.price || 4) + j.value };
          }
          // Ice Cream: Reduce chips by 5
          if (j.effect === 'ice_cream_chips') {
            return { ...j, value: Math.max(0, j.value - 5) };
          }
          // Turtle Bean: Reduce hand size by 1
          if (j.effect === 'turtle_bean_handsize') {
            const newValue = j.value - 1;
            if (newValue <= 0) {
              setHandSize(prev => prev - j.value); // Remove the bonus before destroying
              return null; // Destroy when reaches 0
            }
            setHandSize(prev => prev - 1); // Reduce hand size by 1
            return { ...j, value: newValue };
          }
          // Gros Michel: 1 in 4 chance to destroy
          if (j.effect === 'banana_mult' && Math.random() < 0.25) {
            // Check if Cavendish exists to replace it
            const hasCavendish = prev.find(joker => joker.effect === 'backup_banana');
            if (hasCavendish) {
              setMessage('Gros Michel destroyed! Cavendish activated!');
            } else {
              setMessage('Gros Michel destroyed!');
            }
            return null; // Destroy
          }
          // Idol: Choose random card from deck to determine new rank
          if (j.effect === 'idol_rank') {
            if (deck.length > 0) {
              const randomCard = deck[Math.floor(Math.random() * deck.length)];
              return { ...j, rank: randomCard.rank, desc: `Each played ${randomCard.rank} gives x2 Mult, card chosen at end of round` };
            }
            return j; // Keep same rank if deck is empty
          }
          return j;
        }).filter(Boolean);
        
        return updated;
      });
      
      // Rental: pay $3 per rental joker or they're destroyed
      const rentalJokers = jokers.filter(j => j.rental);
      if (rentalJokers.length > 0) {
        const rentalCost = rentalJokers.length * 3;
        if (money >= rentalCost) {
          setMoney(prev => prev - rentalCost);
          setMessage(`Blind cleared! +$${reward}${interest > 0 ? ` (Interest: $${interest})` : ''} -$${rentalCost} (Rental)`);
        } else {
          // Can't afford rental, destroy them
          setJokers(prev => prev.filter(j => !j.rental));
          setMessage(`Blind cleared! +$${reward}${interest > 0 ? ` (Interest: $${interest})` : ''} (Lost rental jokers!)`);
        }
      } else {
        setMessage(`Blind cleared! +$${reward}${interest > 0 ? ` (Interest: $${interest})` : ''}`);
      }
      
      // Blue/Purple Seal rewards (check held cards at end of round)
      const heldCards = hand;
      heldCards.forEach(card => {
        if (card.seal === 'Blue' && consumables.length < 2 + (vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0)) {
          // Blue Seal: Create random Planet card
          const planetHandTypes = ['Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush'];
          const handType = planetHandTypes[Math.floor(Math.random() * planetHandTypes.length)];
          setConsumables(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: 'planet',
            name: `Planet ${handType}`,
            handType,
            desc: `Level up ${handType}`
          }]);
        } else if (card.seal === 'Purple' && consumables.length < 2 + (vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0)) {
          // Purple Seal: Create random Tarot card
          const tarotNames = Object.keys(TAROT_CARDS);
          const name = tarotNames[Math.floor(Math.random() * tarotNames.length)];
          const tarotData = TAROT_CARDS[name];
          setConsumables(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: 'tarot',
            name,
            ...tarotData
          }]);
        }
      });
      
      // Mark blind as completed
      if (blindType === 'small') {
        setBlindsCompleted(prev => ({ ...prev, small: true }));
      } else if (blindType === 'big') {
        setBlindsCompleted(prev => ({ ...prev, big: true }));
      } else if (blindType === 'boss') {
        setBlindsCompleted(prev => ({ ...prev, boss: true }));
        // Reset maxHands in case boss blind (like The Needle) changed it
        setMaxHands(4);
      }
      
      setTimeout(() => {
        // ALWAYS go to shop first after clearing any blind
        setGameState('shop');
        generateShop();
      }, 2000);
    } else if (handsRemaining <= 0 && total < targetScore) {
      setMessage('Out of hands! Blind failed.');
      setTimeout(() => {
        setGameState('game_over');
      }, 2000);
    }
  };

  const generateShop = (includeVoucher = false) => {
    const shopJokers = [];
    for (let i = 0; i < 2; i++) {
      const jokerNames = Object.keys(JOKERS);
      const randomJoker = jokerNames[Math.floor(Math.random() * jokerNames.length)];
      const jokerData = JOKERS[randomJoker];
      
      // Apply random modifiers
      const newJoker = {
        name: randomJoker,
        ...jokerData,
        id: Math.random()
      };
      
      // Idol: Choose random card from deck to determine rank
      if (newJoker.effect === 'idol_rank') {
        if (deck.length > 0) {
          const randomCard = deck[Math.floor(Math.random() * deck.length)];
          newJoker.rank = randomCard.rank;
          newJoker.desc = `Each played ${randomCard.rank} gives x2 Mult, card chosen at end of round`;
        } else {
          // Fallback if deck is empty (shouldn't happen but just in case)
          newJoker.rank = 'K';
          newJoker.desc = `Each played K gives x2 Mult, card chosen at end of round`;
        }
      }
      
      // 5% chance for Negative (-1 joker slot)
      if (Math.random() < 0.05) {
        newJoker.negative = true;
        newJoker.price = Math.floor(newJoker.price * 1.5);
      }
      // 10% chance for Perishable (lasts 5 rounds)
      else if (Math.random() < 0.10) {
        newJoker.perishable = true;
        newJoker.perishableRounds = 5;
        newJoker.price = Math.floor(newJoker.price * 0.7);
      }
      // 10% chance for Rental (costs $3/round)
      else if (Math.random() < 0.10) {
        newJoker.rental = true;
        newJoker.price = 1;
      }
      // 5% chance for Eternal (cannot sell)
      else if (Math.random() < 0.05) {
        newJoker.eternal = true;
        newJoker.price = Math.floor(newJoker.price * 0.8);
      }
      
      shopJokers.push(newJoker);
    }
    
    const packs = [
      { type: 'Standard Pack', price: 4, contains: 'playing cards', id: Math.random() },
      { type: 'Arcana Pack', price: 4, contains: 'tarot cards', id: Math.random() },
      { type: 'Spectral Pack', price: 4, contains: 'spectral cards', id: Math.random() },
      { type: 'Celestial Pack', price: 4, contains: 'planet cards', id: Math.random() },
      { type: 'Buffoon Pack', price: 4, contains: 'jokers', id: Math.random() }
    ];
    
    const shopPacks = [];
    for (let i = 0; i < 2; i++) {
      const randomPack = packs[Math.floor(Math.random() * packs.length)];
      shopPacks.push({ ...randomPack, id: Math.random() });
    }
    
    // Only add voucher after boss blind (start of new ante)
    let shopVoucher = null;
    if (includeVoucher) {
      const availableVouchers = Object.keys(VOUCHERS).filter(v => !vouchers.find(owned => owned.name === v));
      if (availableVouchers.length > 0) {
        const voucherName = availableVouchers[Math.floor(Math.random() * availableVouchers.length)];
        const voucherData = VOUCHERS[voucherName];
        shopVoucher = {
          name: voucherName,
          ...voucherData,
          id: Math.random()
        };
      }
    } else {
      // Preserve existing voucher if not generating a new one
      shopVoucher = shop.voucher || null;
    }
    
    // Ghost Deck: Add spectral cards to shop
    let shopSpectrals = [];
    if (selectedDeck === 'Ghost Deck' && Math.random() < 0.5) { // 50% chance per shop
      const spectralNames = Object.keys(SPECTRAL_CARDS);
      const randomSpectral = spectralNames[Math.floor(Math.random() * spectralNames.length)];
      const spectralData = SPECTRAL_CARDS[randomSpectral];
      shopSpectrals.push({
        id: Math.random(),
        name: randomSpectral,
        ...spectralData,
        type: 'spectral'
      });
    }
    
    setShop({
      jokers: shopJokers,
      packs: shopPacks,
      voucher: shopVoucher,
      spectrals: shopSpectrals,
      packSelectionsCount: 0,
      openPack: null,
      packType: null
    });
  };

  const buyJoker = (joker) => {
    const negativeCount = jokers.filter(j => j.negative).length;
    const jokerBeingBoughtIsNegative = joker.negative ? 1 : 0;
    const blackDeckBonus = (selectedDeck === 'Black Deck') ? 1 : 0;
    const maxSlots = 5 + negativeCount + jokerBeingBoughtIsNegative + blackDeckBonus;
    
    // Check for tags
    const couponTag = tags.find(t => t.effect === 'discount');
    const negativeTag = tags.find(t => t.effect === 'next_negative');
    const foilTag = tags.find(t => t.effect === 'next_foil');
    const holoTag = tags.find(t => t.effect === 'next_holo');
    const polyTag = tags.find(t => t.effect === 'next_poly');
    const uncommonTag = tags.find(t => t.effect === 'free_uncommon');
    const rareTag = tags.find(t => t.effect === 'free_rare');
    
    const finalPrice = couponTag ? 0 : joker.price;
    
    if (money >= finalPrice && jokers.length < maxSlots) {
      setMoney(prev => prev - finalPrice);
      
      // Apply tags to joker
      const modifiedJoker = { ...joker, id: Math.random() };
      if (negativeTag) {
        modifiedJoker.negative = true;
        setTags(prev => prev.filter(t => t.id !== negativeTag.id));
      }
      if (foilTag) {
        modifiedJoker.edition = 'Foil';
        setTags(prev => prev.filter(t => t.id !== foilTag.id));
      }
      if (holoTag) {
        modifiedJoker.edition = 'Holographic';
        setTags(prev => prev.filter(t => t.id !== holoTag.id));
      }
      if (polyTag) {
        modifiedJoker.edition = 'Polychrome';
        setTags(prev => prev.filter(t => t.id !== polyTag.id));
      }
      
      setJokers(prev => [...prev, modifiedJoker]);
      setShop(prev => ({
        ...prev,
        jokers: prev.jokers.filter(j => j.id !== joker.id)
      }));
      
      // Consume Coupon Tag if used
      if (couponTag) {
        setTags(prev => prev.filter(t => t.id !== couponTag.id));
        setMessage(`Bought ${joker.name} for FREE with Coupon Tag!`);
      } else {
        setMessage(`Bought ${joker.name}!`);
      }
    } else if (jokers.length >= maxSlots) {
      setMessage('Joker slots full!');
    } else {
      setMessage('Not enough money!');
    }
  };

  const sellJoker = (joker) => {
    if (joker.eternal) {
      setMessage('Cannot sell Eternal joker!');
      return;
    }
    const sellValue = Math.floor(joker.price / 2);
    setMoney(prev => prev + sellValue);
    setJokers(prev => prev.filter(j => j.id !== joker.id));
    setMessage(`Sold ${joker.name} for $${sellValue}`);
  };

  const buyConsumable = (consumable) => {
    const crystalBallBonus = vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0;
    const maxSlots = 2 + crystalBallBonus;
    
    // Check for Coupon Tag
    const couponTag = tags.find(t => t.effect === 'discount');
    const finalPrice = couponTag ? 0 : consumable.price;
    
    if (money >= finalPrice && consumables.length < maxSlots) {
      setMoney(prev => prev - finalPrice);
      setConsumables(prev => [...prev, { ...consumable, id: Math.random() }]);
      setShop(prev => ({
        ...prev,
        spectrals: prev.spectrals.filter(s => s.id !== consumable.id)
      }));
      
      if (couponTag) {
        setTags(prev => prev.filter(t => t.id !== couponTag.id));
        setMessage(`Bought ${consumable.name} for FREE with Coupon Tag!`);
      } else {
        setMessage(`Bought ${consumable.name}!`);
      }
    } else if (consumables.length >= maxSlots) {
      setMessage('Consumable slots full!');
    } else {
      setMessage('Not enough money!');
    }
  };

  const buyVoucher = (voucher) => {
    // Check for Coupon Tag (makes item free)
    const couponTag = tags.find(t => t.effect === 'discount');
    const finalPrice = couponTag ? 0 : voucher.price;
    
    if (money < finalPrice) {
      setMessage('Not enough money!');
      return;
    }
    
    setMoney(prev => prev - finalPrice);
    setVouchers(prev => [...prev, { ...voucher }]);
    
    // Apply permanent effects immediately
    if (voucher.effect === 'hand_size') {
      setHandSize(prev => prev + voucher.value);
    } else if (voucher.effect === 'discard_size') {
      setMaxDiscards(prev => prev + voucher.value);
    }
    
    setShop(prev => ({ ...prev, voucher: null }));
    
    // Consume Coupon Tag if used
    if (couponTag) {
      setTags(prev => prev.filter(t => t.id !== couponTag.id));
      setMessage(`Bought ${voucher.name} for FREE with Coupon Tag!`);
    } else {
      setMessage(`Bought ${voucher.name}!`);
    }
  };

  const rerollShop = () => {
    const hasRerollSurplus = vouchers.find(v => v.effect === 'cheap_reroll');
    const rerollCost = hasRerollSurplus ? 2 : 5;
    
    if (money >= rerollCost) {
      setMoney(prev => prev - rerollCost);
      generateShop(false); // Don't generate new voucher on reroll
      setMessage(`Rerolled shop for $${rerollCost}!`);
    } else {
      setMessage(`Need $${rerollCost} to reroll!`);
    }
  };

  const buyPack = (pack) => {
    // Check for Coupon Tag (makes item free)
    const couponTag = tags.find(t => t.effect === 'discount');
    const finalPrice = couponTag ? 0 : pack.price;
    
    if (money >= finalPrice) {
      setMoney(prev => prev - finalPrice);
      
      // Consume Coupon Tag if used
      if (couponTag) {
        setTags(prev => prev.filter(t => t.id !== couponTag.id));
        setMessage(`Opening ${pack.type} for FREE with Coupon Tag!`);
      } else {
        setMessage(`Opening ${pack.type}...`);
      }
      
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
      } else if (pack.type === 'Spectral Pack') {
        const spectralNames = Object.keys(SPECTRAL_CARDS);
        for (let i = 0; i < 2; i++) { // Spectral packs only have 2 cards (more rare/powerful)
          const spectralName = spectralNames[Math.floor(Math.random() * spectralNames.length)];
          packContents.push({
            id: Math.random(),
            name: spectralName,
            ...SPECTRAL_CARDS[spectralName],
            type: 'spectral'
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
    } else if (item.type === 'tarot' || item.type === 'planet' || item.type === 'spectral') {
      const crystalBallBonus = vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0;
      const maxConsumableSlots = 2 + crystalBallBonus;
      
      if (consumables.length < maxConsumableSlots) {
        setConsumables(prev => [...prev, item]);
        setMessage(`Added ${item.name}!`);
        success = true;
      } else {
        setMessage('Consumable slots full!');
        return; // Don't count failed attempts
      }
    } else if (item.type === 'joker') {
      const negativeCount = jokers.filter(j => j.negative).length;
      const itemIsNegative = item.negative ? 1 : 0;
      const blackDeckBonus = (selectedDeck === 'Black Deck') ? 1 : 0;
      const maxSlots = 5 + negativeCount + itemIsNegative + blackDeckBonus;
      
      if (jokers.length < maxSlots) {
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
      setLastUsedConsumable(consumable); // Track for The Fool
      setMessage(`${handType} leveled up!`);
      
      // Track for Satellite joker
      setJokers(prev => prev.map(j => {
        if (j.effect === 'satellite_money') {
          return { ...j, counter: (j.counter || 0) + 1 };
        }
        return j;
      }));
    } else if (consumable.type === 'tarot') {
      // Instant effect tarots (no card selection needed)
      if (consumable.effect === 'double_money') {
        // The Hermit: Double money (max $20)
        const doubled = Math.min(money * 2, consumable.max || 20);
        setMoney(doubled);
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`Money doubled to $${doubled}!`);
      } else if (consumable.effect === 'create_planet') {
        // The High Priestess: Create 2 random planets
        // Note: This works even at 2 consumables because it removes itself first
        const planetHandTypes = ['Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush'];
        const newPlanets = [];
        const crystalBallBonus = vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0;
        const maxSlots = 2 + crystalBallBonus;
        const availableSlots = maxSlots - (consumables.length - 1); // -1 because we're removing the tarot itself
        for (let i = 0; i < Math.min(consumable.count || 2, availableSlots); i++) {
          const handType = planetHandTypes[Math.floor(Math.random() * planetHandTypes.length)];
          newPlanets.push({
            id: Date.now() + Math.random() + i, // Add i to ensure unique IDs
            type: 'planet',
            name: `Planet ${handType}`,
            handType,
            desc: `Level up ${handType}`
          });
        }
        setConsumables(prev => [...prev.filter(c => c.id !== consumable.id), ...newPlanets]);
        setMessage(`Created ${newPlanets.length} Planet card(s)!`);
      } else if (consumable.effect === 'create_tarot') {
        // The Emperor: Create 2 random tarots
        // Note: This works even at 2 consumables because it removes itself first
        const tarotNames = Object.keys(TAROT_CARDS).filter(t => t !== 'The Emperor' && t !== 'The High Priestess');
        const newTarots = [];
        const crystalBallBonus = vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0;
        const maxSlots = 2 + crystalBallBonus;
        const availableSlots = maxSlots - (consumables.length - 1); // -1 because we're removing Emperor itself
        for (let i = 0; i < Math.min(consumable.count || 2, availableSlots); i++) {
          const name = tarotNames[Math.floor(Math.random() * tarotNames.length)];
          const tarotData = TAROT_CARDS[name];
          newTarots.push({
            id: Date.now() + Math.random() + i,
            type: 'tarot',
            name,
            ...tarotData
          });
        }
        setConsumables(prev => [...prev.filter(c => c.id !== consumable.id), ...newTarots]);
        setMessage(`Created ${newTarots.length} Tarot card(s)!`);
      } else if (consumable.effect === 'create_last_tarot') {
        // The Fool: Creates the last tarot/planet used
        if (lastUsedConsumable) {
          const newConsumable = {
            id: Date.now() + Math.random(),
            ...lastUsedConsumable
          };
          setConsumables(prev => [...prev.filter(c => c.id !== consumable.id), newConsumable]);
          setMessage(`Created ${lastUsedConsumable.name}!`);
        } else {
          // Fallback if no consumable used yet - create random tarot
          const tarotNames = Object.keys(TAROT_CARDS).filter(t => t !== 'The Fool');
          const name = tarotNames[Math.floor(Math.random() * tarotNames.length)];
          const tarotData = TAROT_CARDS[name];
          const newTarot = {
            id: Date.now() + Math.random(),
            type: 'tarot',
            name,
            ...tarotData
          };
          setConsumables(prev => [...prev.filter(c => c.id !== consumable.id), newTarot]);
          setMessage(`Created ${name}! (No previous consumable)`);
        }
      } else if (consumable.effect === 'random_edition') {
        // Wheel of Fortune: Add random edition to random joker
        if (jokers.length > 0 && Math.random() < 0.25) {
          const editions = ['Foil', 'Holographic', 'Polychrome'];
          const edition = editions[Math.floor(Math.random() * editions.length)];
          const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
          setJokers(prev => prev.map(j => 
            j.id === randomJoker.id ? { ...j, edition } : j
          ));
          const editionIcon = edition === 'Foil' ? '✨' : edition === 'Holographic' ? '🌈' : '🎨';
          setMessage(`SUCCESS! ${randomJoker.name} gained ${edition} ${editionIcon} edition!`);
        } else if (jokers.length === 0) {
          setMessage('No jokers to modify!');
        } else {
          setMessage('Wheel of Fortune failed! (1 in 4 chance)');
        }
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
      } else if (consumable.effect === 'sell_jokers') {
        // Temperance: Sell all jokers for money (doesn't actually remove jokers, just calculates value)
        // But actually in real Balatro it DOES NOT sell them, just gives you their sell value
        let totalValue = 0;
        jokers.forEach(j => {
          totalValue += Math.floor((j.price || 5) / 2);
        });
        totalValue = Math.min(totalValue, consumable.max || 50);
        setMoney(prev => prev + totalValue); // ADD to current money
        setMessage(`Gained $${totalValue} from Joker sell values!`);
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
      } else if (consumable.effect === 'create_joker') {
        // Judgement: Create random joker
        if (jokers.length < 5) {
          const jokerNames = Object.keys(JOKERS);
          const name = jokerNames[Math.floor(Math.random() * jokerNames.length)];
          const jokerData = JOKERS[name];
          const newJoker = {
            id: Date.now() + Math.random(),
            name,
            ...jokerData
          };
          setJokers(prev => [...prev, newJoker]);
          setMessage(`Created ${name}!`);
        } else {
          setMessage('No Joker slots available!');
        }
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
      } else {
        // Card selection tarots (most tarots)
        setUsingConsumable(consumable);
        setMessage(`Select cards for ${consumable.name}`);
      }
    } else if (consumable.type === 'spectral') {
      // Spectral cards - implement key ones
      if (consumable.effect === 'upgrade_all_hands') {
        // Black Hole: Upgrade ALL poker hands by 1 level
        const allHandTypes = ['High Card', 'Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush'];
        setHandLevels(prev => {
          const newLevels = { ...prev };
          allHandTypes.forEach(handType => {
            newLevels[handType] = (newLevels[handType] || 0) + 1;
          });
          return newLevels;
        });
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage('All hands leveled up!');
      } else if (consumable.effect === 'add_negative_joker_nohand') {
        // Ectoplasm: Add Negative to random joker, -1 hand permanently
        if (jokers.length > 0) {
          const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
          setJokers(prev => prev.map(j => 
            j.id === randomJoker.id ? { ...j, negative: true } : j
          ));
          setMaxHands(prev => prev - 1);
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage(`${randomJoker.name} is now Negative! Permanently -1 hand per round!`);
        } else {
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage('No jokers to make Negative!');
        }
      } else if (consumable.effect === 'destroy_5_cards_add_20') {
        // Immolate: Destroy 5 random cards, add $20
        const cardsToDestroy = 5;
        let destroyed = 0;
        setDeck(prev => {
          const shuffled = [...prev].sort(() => Math.random() - 0.5);
          const keep = shuffled.slice(cardsToDestroy);
          destroyed = shuffled.length - keep.length;
          return keep;
        });
        setMoney(prev => prev + 20);
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`Destroyed ${destroyed} cards! Gained $20!`);
      } else if (consumable.effect === 'create_rare_joker_bankrupt') {
        // Wraith: Create rare joker, set money to $0
        const negativeCount = jokers.filter(j => j.negative).length;
        const blackDeckBonus = (selectedDeck === 'Black Deck') ? 1 : 0;
        const maxSlots = 5 + negativeCount + blackDeckBonus;
        
        if (jokers.length < maxSlots) {
          const rareJokers = Object.entries(JOKERS).filter(([name, data]) => data.rarity === 'rare');
          if (rareJokers.length > 0) {
            const [name, jokerData] = rareJokers[Math.floor(Math.random() * rareJokers.length)];
            setJokers(prev => [...prev, { id: Date.now() + Math.random(), name, ...jokerData }]);
            setMoney(0);
            setConsumables(prev => prev.filter(c => c.id !== consumable.id));
            setMessage(`Created ${name}! Money set to $0!`);
          } else {
            setConsumables(prev => prev.filter(c => c.id !== consumable.id));
            setMessage('No rare jokers available!');
          }
        } else {
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage('Joker slots full!');
        }
      } else if (consumable.effect === 'create_legendary_joker_bankrupt') {
        // The Soul: Create legendary joker, set money to $0
        const negativeCount = jokers.filter(j => j.negative).length;
        const blackDeckBonus = (selectedDeck === 'Black Deck') ? 1 : 0;
        const maxSlots = 5 + negativeCount + blackDeckBonus;
        
        if (jokers.length < maxSlots) {
          const legendaryJokers = Object.entries(JOKERS).filter(([name, data]) => data.rarity === 'legendary');
          if (legendaryJokers.length > 0) {
            const [name, jokerData] = legendaryJokers[Math.floor(Math.random() * legendaryJokers.length)];
            setJokers(prev => [...prev, { id: Date.now() + Math.random(), name, ...jokerData }]);
            setMoney(0);
            setConsumables(prev => prev.filter(c => c.id !== consumable.id));
            setMessage(`Created LEGENDARY ${name}! Money set to $0!`);
          } else {
            setConsumables(prev => prev.filter(c => c.id !== consumable.id));
            setMessage('No legendary jokers available!');
          }
        } else {
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage('Joker slots full!');
        }
      } else if (consumable.effect === 'convert_all_to_suit') {
        // Sigil: Convert all cards to 1 random suit
        const suits = Object.values(SUITS);
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        setDeck(prev => prev.map(c => ({ ...c, suit: randomSuit })));
        setHand(prev => prev.map(c => ({ ...c, suit: randomSuit })));
        setDiscardPile(prev => prev.map(c => ({ ...c, suit: randomSuit })));
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`All cards converted to ${randomSuit}!`);
      } else if (consumable.effect === 'destroy_random_add_random') {
        // Familiar: Destroy 1 random card, add 3 enhanced random cards
        setDeck(prev => {
          if (prev.length === 0) return prev;
          const newDeck = [...prev];
          const randomIndex = Math.floor(Math.random() * newDeck.length);
          newDeck.splice(randomIndex, 1);
          
          // Add 3 random enhanced cards
          const enhancements = ['Bonus', 'Mult', 'Glass', 'Steel', 'Lucky'];
          for (let i = 0; i < 3; i++) {
            const suit = Object.values(SUITS)[Math.floor(Math.random() * 4)];
            const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
            const enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
            newDeck.push({
              id: Date.now() + Math.random() + i,
              rank,
              suit,
              enhancement,
              edition: null,
              seal: null
            });
          }
          return newDeck;
        });
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage('Destroyed 1 card, added 3 enhanced cards!');
      } else if (consumable.effect === 'destroy_all_rank_add_money') {
        // Grim: Destroy all cards of 1 rank, gain $1 per destroyed
        const ranks = RANKS;
        const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
        let destroyedCount = 0;
        
        setDeck(prev => {
          const filtered = prev.filter(c => {
            if (c.rank === randomRank) {
              destroyedCount++;
              return false;
            }
            return true;
          });
          return filtered;
        });
        setHand(prev => prev.filter(c => c.rank !== randomRank));
        setDiscardPile(prev => prev.filter(c => c.rank !== randomRank));
        
        setMoney(prev => prev + destroyedCount);
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`Destroyed all ${randomRank}s (${destroyedCount} cards)! Gained $${destroyedCount}!`);
      } else if (consumable.effect === 'destroy_random_add_tarot_planet') {
        // Incantation: Destroy 1 random card, add 4 random Tarots/Planets
        setDeck(prev => {
          if (prev.length === 0) return prev;
          const newDeck = [...prev];
          const randomIndex = Math.floor(Math.random() * newDeck.length);
          newDeck.splice(randomIndex, 1);
          return newDeck;
        });
        
        // Add 4 random tarots/planets to consumables
        const crystalBallBonus = vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0;
        const maxSlots = 2 + crystalBallBonus;
        const availableSlots = maxSlots - (consumables.length - 1); // -1 for Incantation itself
        const toCreate = Math.min(4, availableSlots);
        
        const newConsumables = [];
        for (let i = 0; i < toCreate; i++) {
          const isTarot = Math.random() < 0.5;
          if (isTarot) {
            const tarotNames = Object.keys(TAROT_CARDS);
            const name = tarotNames[Math.floor(Math.random() * tarotNames.length)];
            newConsumables.push({
              id: Date.now() + Math.random() + i,
              type: 'tarot',
              name,
              ...TAROT_CARDS[name]
            });
          } else {
            const planetNames = Object.keys(PLANET_CARDS);
            const name = planetNames[Math.floor(Math.random() * planetNames.length)];
            newConsumables.push({
              id: Date.now() + Math.random() + i,
              type: 'planet',
              name,
              ...PLANET_CARDS[name]
            });
          }
        }
        
        setConsumables(prev => [...prev.filter(c => c.id !== consumable.id), ...newConsumables]);
        setMessage(`Destroyed 1 card, created ${toCreate} Tarots/Planets!`);
      } else if (consumable.effect === 'copy_joker_destroy_others') {
        // Ankh: Copy random Joker, destroy all other Jokers
        if (jokers.length === 0) {
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage('No jokers to copy!');
        } else if (jokers.length === 1) {
          // With only 1 joker, just keep it (nothing changes visually but it still works)
          const theJoker = jokers[0];
          const copiedJoker = {
            ...theJoker,
            id: Date.now() + Math.random(),
            eternal: false // Don't copy eternal status
          };
          setJokers([copiedJoker]);
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage(`Copied ${theJoker.name}! (Was only joker, so nothing destroyed)`);
        } else {
          // Multiple jokers - pick one and destroy the rest
          const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
          const copiedJoker = {
            ...randomJoker,
            id: Date.now() + Math.random(),
            eternal: false // Don't copy eternal status
          };
          const destroyedCount = jokers.length - 1;
          setJokers([copiedJoker]);
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage(`Copied ${randomJoker.name}! Destroyed ${destroyedCount} other joker${destroyedCount > 1 ? 's' : ''}!`);
        }
      } else if (consumable.effect === 'add_polychrome_joker_destroy_others') {
        // Hex: Add Polychrome to random Joker, destroy all others
        if (jokers.length === 0) {
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage('No jokers to modify!');
        } else if (jokers.length === 1) {
          // With only 1 joker, just add Polychrome to it
          const theJoker = jokers[0];
          const polyJoker = {
            ...theJoker,
            edition: 'Polychrome',
            eternal: false
          };
          setJokers([polyJoker]);
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage(`${theJoker.name} is now Polychrome! (Was only joker, so nothing destroyed)`);
        } else {
          // Multiple jokers - pick one, add Polychrome, destroy the rest
          const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
          const polyJoker = {
            ...randomJoker,
            edition: 'Polychrome',
            eternal: false
          };
          const destroyedCount = jokers.length - 1;
          setJokers([polyJoker]);
          setConsumables(prev => prev.filter(c => c.id !== consumable.id));
          setMessage(`${randomJoker.name} is now Polychrome! Destroyed ${destroyedCount} other joker${destroyedCount > 1 ? 's' : ''}!`);
        }
      } else if (consumable.effect === 'convert_all_rank_to_rank') {
        // Ouija: Convert all cards of 1 rank to another random rank
        const ranks = RANKS;
        const fromRank = ranks[Math.floor(Math.random() * ranks.length)];
        const toRank = ranks[Math.floor(Math.random() * ranks.length)];
        
        setDeck(prev => prev.map(c => c.rank === fromRank ? { ...c, rank: toRank } : c));
        setHand(prev => prev.map(c => c.rank === fromRank ? { ...c, rank: toRank } : c));
        setDiscardPile(prev => prev.map(c => c.rank === fromRank ? { ...c, rank: toRank } : c));
        
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`Converted all ${fromRank}s to ${toRank}s!`);
      } else if (consumable.effect.startsWith('add_') && consumable.effect.endsWith('_seal')) {
        // Seal spectrals (Talisman, Deja Vu, Trance, Medium)
        setUsingConsumable(consumable);
        setMessage(`Select ${consumable.count} card(s) for ${consumable.name}`);
      } else if (consumable.effect === 'add_edition_foil' || consumable.effect === 'create_copy_card') {
        // Card edition/copy spectrals (Aura, Cryptid)
        setUsingConsumable(consumable);
        setMessage(`Select ${consumable.count || 1} card(s) for ${consumable.name}`);
      } else {
        // Other spectrals not implemented yet
        setConsumables(prev => prev.filter(c => c.id !== consumable.id));
        setMessage(`${consumable.name} used! (Effect not fully implemented yet)`);
      }
    }
  };

  const applyTarot = () => {
    if (!usingConsumable || selectedCards.length === 0) return;
    
    const tarot = usingConsumable;
    
    // Get selected cards from hand (during play) or from deck (in shop)
    let selected;
    if (gameState === 'playing') {
      selected = hand.filter(card => selectedCards.includes(card.id));
    } else {
      // In shop, select from deck directly
      selected = deck.filter(card => selectedCards.includes(card.id));
    }
    
    if (tarot.effect === 'enhance_lucky') {
      selected.slice(0, tarot.count || 2).forEach(card => {
        const enhancement = 'Lucky';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_mult') {
      selected.slice(0, tarot.count || 2).forEach(card => {
        const enhancement = 'Mult';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_bonus') {
      selected.slice(0, tarot.count || 2).forEach(card => {
        const enhancement = 'Bonus';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_glass') {
      selected.slice(0, tarot.count || 1).forEach(card => {
        const enhancement = 'Glass';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_steel') {
      selected.slice(0, tarot.count || 1).forEach(card => {
        const enhancement = 'Steel';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_stone') {
      selected.slice(0, tarot.count || 1).forEach(card => {
        const enhancement = 'Stone';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'enhance_gold') {
      selected.slice(0, tarot.count || 1).forEach(card => {
        const enhancement = 'Gold';
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, enhancement } : c));
      });
    } else if (tarot.effect === 'destroy') {
      selected.slice(0, tarot.count || 2).forEach(card => {
        setDeck(prev => prev.filter(c => c.id !== card.id));
        setHand(prev => prev.filter(c => c.id !== card.id));
        setDiscardPile(prev => prev.filter(c => c.id !== card.id));
      });
    } else if (tarot.effect === 'upgrade_rank') {
      // Strength: Increase rank by 1
      const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      selected.slice(0, tarot.count || 2).forEach(card => {
        const currentIndex = rankOrder.indexOf(card.rank);
        if (currentIndex < rankOrder.length - 1) {
          const newRank = rankOrder[currentIndex + 1];
          setDeck(prev => prev.map(c => c.id === card.id ? { ...c, rank: newRank } : c));
          setHand(prev => prev.map(c => c.id === card.id ? { ...c, rank: newRank } : c));
          setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, rank: newRank } : c));
        }
      });
    } else if (tarot.effect === 'transform_card') {
      // Death: First card becomes EXACT copy of second card (all attributes)
      if (selected.length >= 2) {
        const [card1, card2] = selected;
        // Copy ALL properties: rank, suit, enhancement, edition, seal
        const copiedCard = {
          ...card1,
          rank: card2.rank,
          suit: card2.suit,
          enhancement: card2.enhancement,
          edition: card2.edition,
          seal: card2.seal
        };
        
        setDeck(prev => prev.map(c => c.id === card1.id ? copiedCard : c));
        setHand(prev => prev.map(c => c.id === card1.id ? copiedCard : c));
        setDiscardPile(prev => prev.map(c => c.id === card1.id ? copiedCard : c));
      }
    } else if (tarot.effect.startsWith('convert_')) {
      const suitMap = {
        'convert_diamonds': SUITS.DIAMONDS,
        'convert_clubs': SUITS.CLUBS,
        'convert_hearts': SUITS.HEARTS,
        'convert_spades': SUITS.SPADES
      };
      const newSuit = suitMap[tarot.effect];
      selected.slice(0, tarot.count || 3).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, suit: newSuit } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, suit: newSuit } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, suit: newSuit } : c));
      });
    } else if (tarot.effect === 'add_gold_seal') {
      // Talisman: Add Gold Seal
      selected.slice(0, tarot.count || 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Gold' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Gold' } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Gold' } : c));
      });
    } else if (tarot.effect === 'add_red_seal') {
      // Deja Vu: Add Red Seal
      selected.slice(0, tarot.count || 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Red' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Red' } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Red' } : c));
      });
    } else if (tarot.effect === 'add_blue_seal') {
      // Trance: Add Blue Seal
      selected.slice(0, tarot.count || 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Blue' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Blue' } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Blue' } : c));
      });
    } else if (tarot.effect === 'add_purple_seal') {
      // Medium: Add Purple Seal
      selected.slice(0, tarot.count || 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Purple' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Purple' } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, seal: 'Purple' } : c));
      });
    } else if (tarot.effect === 'add_edition_foil') {
      // Aura: Add Foil edition to 1 card
      selected.slice(0, tarot.count || 1).forEach(card => {
        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, edition: 'Foil' } : c));
        setHand(prev => prev.map(c => c.id === card.id ? { ...c, edition: 'Foil' } : c));
        setDiscardPile(prev => prev.map(c => c.id === card.id ? { ...c, edition: 'Foil' } : c));
      });
    } else if (tarot.effect === 'create_copy_card') {
      // Cryptid: Create 1 copy of selected card
      if (selected.length > 0) {
        const cardToCopy = selected[0];
        const copiedCard = {
          ...cardToCopy,
          id: Date.now() + Math.random()
        };
        setDeck(prev => [...prev, copiedCard]);
        setMessage(`Created a copy of ${cardToCopy.rank}${cardToCopy.suit}!`);
      }
    }
    
    setConsumables(prev => prev.filter(c => c.id !== tarot.id));
    setLastUsedConsumable(tarot); // Track for The Fool
    setUsingConsumable(null);
    setSelectedCards([]);
    setMessage(`${tarot.name} used!`);
  };

  const leaveShop = () => {
    // After completing boss blind
    if (blindType === 'boss' && blindsCompleted.boss) {
      if (ante === 8) { // Only at exactly Ante 8, not >= 8
        setGameState('endless_choice'); // Offer endless mode
      } else {
        setAnte(prev => prev + 1);
        setBlindsCompleted({ small: false, big: false, boss: false });
        // Generate new random boss for next ante
        const randomBoss = BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)];
        setUpcomingBoss(randomBoss);
        
        // Start new ante with shop that includes voucher
        setGameState('shop');
        generateShop(true); // true = include voucher
        return;
      }
    }
    // After completing small or big blind
    else if ((blindType === 'small' && blindsCompleted.small) || (blindType === 'big' && blindsCompleted.big)) {
      setGameState('blind_select');
    }
    // At game start or when no blinds completed yet - go to blind select
    else {
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
    
    // Build dynamic classes
    let bgClasses = 'bg-white';
    let borderClasses = 'border-gray-300';
    let shadowClasses = '';
    
    // Enhancements
    if (card.enhancement === 'Glass') {
      bgClasses = 'bg-gradient-to-br from-blue-100 to-blue-200';
    } else if (card.enhancement === 'Gold') {
      bgClasses = 'bg-gradient-to-br from-yellow-100 to-yellow-300';
    } else if (card.enhancement === 'Steel') {
      bgClasses = 'bg-gradient-to-br from-gray-400 to-gray-500';
    } else if (card.enhancement === 'Stone') {
      bgClasses = 'bg-gradient-to-br from-gray-300 to-gray-400';
    } else if (card.enhancement === 'Lucky') {
      bgClasses = 'bg-gradient-to-br from-green-100 to-green-200';
    } else if (card.enhancement === 'Mult') {
      bgClasses = 'bg-gradient-to-br from-red-100 to-red-200';
    } else if (card.enhancement === 'Bonus') {
      bgClasses = 'bg-gradient-to-br from-purple-100 to-purple-200';
    }
    
    // Editions (override enhancement backgrounds)
    if (card.edition === 'Foil') {
      shadowClasses = 'shadow-xl shadow-blue-400';
      borderClasses = 'border-blue-400';
    } else if (card.edition === 'Holographic') {
      bgClasses = 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100';
      shadowClasses = 'shadow-xl shadow-purple-400';
      borderClasses = 'border-purple-400';
    } else if (card.edition === 'Polychrome') {
      bgClasses = 'bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 via-blue-200 to-purple-200';
      shadowClasses = 'shadow-2xl shadow-pink-500';
      borderClasses = 'border-pink-400';
    }
    
    return (
      <div
        onClick={onClick}
        className={`${size} ${bgClasses} rounded-lg border-2 ${borderClasses} flex flex-col items-center justify-center cursor-pointer transition-all relative ${shadowClasses}
          ${selected ? 'border-yellow-400 -translate-y-4 shadow-lg shadow-yellow-400/50' : 'hover:border-yellow-300'}
          ${triggering ? 'scale-125 border-4 border-yellow-500 z-10 animate-bounce' : ''}
        `}
      >
        <div className={`text-lg font-bold ${card.enhancement === 'Steel' ? 'text-gray-200' : suitColor}`}>
          {card.enhancement === 'Stone' ? '?' : card.rank}
        </div>
        <div className={`text-2xl ${card.enhancement === 'Steel' ? 'text-gray-200' : suitColor}`}>
          {card.enhancement === 'Stone' ? '●' : card.suit}
        </div>
        {card.seal && (
          <div className={`absolute ${small ? '-top-0.5 -right-0.5 w-4 h-4 text-[8px]' : '-top-1 -right-1 w-6 h-6 text-xs'} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
            style={{ 
              backgroundColor: 
                card.seal === 'Gold' ? '#fbbf24' :
                card.seal === 'Red' ? '#ef4444' :
                card.seal === 'Blue' ? '#3b82f6' :
                card.seal === 'Purple' ? '#a855f7' : '#666'
            }}
          >
            {card.seal === 'Gold' ? '$' : 
             card.seal === 'Red' ? '2x' :
             card.seal === 'Blue' ? '🪐' :
             card.seal === 'Purple' ? '🔮' : '?'}
          </div>
        )}
      </div>
    );
  };

  const JokerCard = ({ joker, inShop, onBuy, onSell, triggering, onMoveLeft, onMoveRight, showReorder }) => {
    const rarityColors = {
      common: 'from-gray-400 to-gray-600',
      uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600',
      legendary: 'from-purple-500 to-pink-600'
    };
    
    // Edition effects
    let editionClasses = '';
    if (joker.edition === 'Foil') {
      editionClasses = 'ring-4 ring-blue-400 shadow-2xl shadow-blue-400';
    } else if (joker.edition === 'Holographic') {
      editionClasses = 'ring-4 ring-purple-400 shadow-2xl shadow-purple-400';
    } else if (joker.edition === 'Polychrome') {
      editionClasses = 'ring-4 ring-pink-400 shadow-2xl shadow-pink-500';
    }
    
    return (
      <div className="relative">
        <div className={`w-32 h-44 rounded-lg bg-gradient-to-br ${rarityColors[joker.rarity]} p-3 flex flex-col items-center justify-between text-white shadow-lg transition-transform ${triggering ? 'scale-110 ring-4 ring-yellow-400 z-20' : ''} ${joker.negative ? 'ring-4 ring-purple-500' : ''} ${editionClasses} relative`}>
          {/* Modifiers */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {joker.negative && <span className="text-xs bg-purple-600 px-1 rounded">-1</span>}
            {joker.perishable && <span className="text-xs bg-orange-600 px-1 rounded">⏱️{joker.perishableRounds || 5}</span>}
            {joker.rental && <span className="text-xs bg-yellow-600 px-1 rounded">$</span>}
            {joker.eternal && <span className="text-xs bg-blue-600 px-1 rounded">♾️</span>}
            {joker.edition && <span className="text-xs bg-gray-800 px-1 rounded">{joker.edition === 'Foil' ? '✨' : joker.edition === 'Holographic' ? '🌈' : '🎨'}</span>}
          </div>
          
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
          {!inShop && onSell && !joker.eternal && (
            <button
              onClick={() => onSell(joker)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-400"
            >
              Sell ${Math.floor(joker.price / 2)}
            </button>
          )}
        </div>
        {/* Reorder buttons */}
        {showReorder && (
          <div className="absolute -bottom-6 left-0 right-0 flex gap-1 justify-center">
            <button onClick={onMoveLeft} className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-400">←</button>
            <button onClick={onMoveRight} className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-400">→</button>
          </div>
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
            onClick={() => setGameState('deck_select')}
            className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-2xl font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/50"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'deck_select') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">Select Your Deck</h1>
        <p className="text-white text-xl mb-8">Each deck has unique advantages</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl">
          {Object.entries(DECKS).map(([deckName, deckData]) => (
            <div
              key={deckName}
              onClick={() => {
                setSelectedDeck(deckName);
                startGame(deckName);
              }}
              className={`w-48 h-64 bg-gradient-to-br ${deckData.color} rounded-xl p-6 flex flex-col items-center justify-between text-white cursor-pointer hover:scale-105 transition-all shadow-2xl border-4 border-white/20 hover:border-yellow-400`}
            >
              <div className="text-2xl font-bold text-center">{deckName}</div>
              <div className="text-6xl">🃏</div>
              <div className="text-sm text-center opacity-90">{deckData.desc}</div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setGameState('menu')}
          className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-400"
        >
          Back to Menu
        </button>
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
              {upcomingBoss && (
                <div className="mb-4 h-16">
                  <p className="text-red-200 font-bold text-lg">{upcomingBoss.name}</p>
                  <p className="text-red-300 text-sm">{upcomingBoss.desc}</p>
                </div>
              )}
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
          
          {/* Spectral Cards Section (Ghost Deck only) */}
          {shop.spectrals && shop.spectrals.length > 0 && (
            <div className="mb-8">
              <h3 className="text-3xl text-white mb-4 font-bold">Spectral Cards 👻</h3>
              <div className="flex gap-4 flex-wrap">
                {shop.spectrals.map(spectral => (
                  <div
                    key={spectral.id}
                    className="w-48 h-64 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-4 flex flex-col items-center justify-between text-white shadow-2xl border-2 border-purple-500"
                  >
                    <div className="text-center font-bold text-lg">{spectral.name}</div>
                    <div className="text-5xl">👻</div>
                    <div className="text-xs text-center opacity-90">{spectral.desc}</div>
                    <button
                      onClick={() => buyConsumable(spectral)}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-400 transition-all"
                    >
                      ${spectral.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Voucher Section */}
          {shop.voucher && (
            <div className="mb-8">
              <h3 className="text-3xl text-white mb-4 font-bold">Voucher</h3>
              <div className="w-64 h-40 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 flex flex-col items-center justify-between text-white shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">{shop.voucher.icon}</div>
                  <div className="font-bold text-xl">{shop.voucher.name}</div>
                </div>
                <div className="text-sm text-center opacity-90">{shop.voucher.desc}</div>
                <button
                  onClick={() => buyVoucher(shop.voucher)}
                  className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all"
                >
                  ${shop.voucher.price}
                </button>
              </div>
            </div>
          )}
          
          {/* Active Tags Display */}
          {tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-3xl text-white mb-4 font-bold">Active Tags</h3>
              <div className="flex gap-4 flex-wrap">
                {tags.map(tag => (
                  <div key={tag.id} className="w-48 h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 flex flex-col items-center justify-center text-white shadow-xl">
                    <div className="text-3xl mb-2">{tag.icon}</div>
                    <div className="font-bold text-center">{tag.name}</div>
                    <div className="text-xs text-center opacity-80">{tag.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Owned Vouchers Display */}
          {vouchers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-3xl text-white mb-4 font-bold">Owned Vouchers</h3>
              <div className="flex gap-4 flex-wrap">
                {vouchers.map((v, i) => (
                  <div key={i} className="w-48 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 flex flex-col items-center justify-center text-white shadow-xl opacity-75">
                    <div className="text-3xl mb-2">{v.icon}</div>
                    <div className="font-bold text-center text-sm">{v.name}</div>
                    <div className="text-xs text-center opacity-80">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Your Jokers ({jokers.length}/{5 + jokers.filter(j => j.negative).length + (selectedDeck === 'Black Deck' ? 1 : 0)})</h3>
            <div className="flex gap-4 flex-wrap max-h-96 overflow-y-auto p-2">
              {jokers.map(joker => (
                <JokerCard key={joker.id} joker={joker} onSell={sellJoker} />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl text-white mb-4 font-bold">Consumables ({consumables.length}/2)</h3>
            <div className="flex gap-4 flex-wrap">
              {consumables.map(cons => (
                <div key={cons.id} className="relative">
                  <div
                    onClick={() => useConsumable(cons)}
                    className="w-32 h-44 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 flex flex-col items-center justify-between text-white cursor-pointer hover:scale-105 transition-all shadow-xl"
                  >
                    <div className="text-center font-bold text-sm">{cons.name}</div>
                    <div className="text-4xl">🔮</div>
                    <div className="text-xs text-center opacity-90">{cons.desc}</div>
                  </div>
                  <button
                    onClick={() => {
                      setConsumables(prev => prev.filter(c => c.id !== cons.id));
                      setMessage(`Sold ${cons.name} for $1`);
                      setMoney(prev => prev + 1);
                    }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-400"
                  >
                    Sell $1
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tarot Card Selection Panel in Shop */}
          {usingConsumable && (
            <div className="mb-8 bg-purple-900 border-2 border-purple-400 rounded-xl p-6">
              <div className="text-white text-center mb-4 text-xl">
                Using: <span className="text-yellow-400 font-bold">{usingConsumable.name}</span> - Select up to {usingConsumable.count} cards from your deck
                {usingConsumable.effect === 'transform_card' && selectedCards.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="text-green-400">First card (✓) becomes exact copy of second</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap justify-center mb-4 max-h-96 overflow-y-auto">
                {deck.slice(0, 52).map((card, index) => {
                  const selectedIndex = selectedCards.indexOf(card.id);
                  const isFirst = usingConsumable.effect === 'transform_card' && selectedIndex === 0;
                  
                  return (
                    <div key={card.id} className="relative">
                      <Card
                        card={card}
                        small
                        selected={selectedCards.includes(card.id)}
                        onClick={() => toggleCard(card.id)}
                      />
                      {isFirst && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={applyTarot}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-400"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setUsingConsumable(null);
                    setSelectedCards([]);
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={rerollShop}
              className="bg-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-400 transition-all shadow-lg"
            >
              Reroll Shop ${vouchers.find(v => v.effect === 'cheap_reroll') ? '2' : '5'}
            </button>
            <button
              onClick={leaveShop}
              className="bg-green-500 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:bg-green-400 transition-all shadow-xl"
            >
              Continue to Next Blind
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'endless_choice') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-400 mb-4" style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.8)' }}>
            You Win!
          </h1>
          <p className="text-white text-3xl mb-2">Congratulations!</p>
          <p className="text-white text-xl mb-8">You beat Ante 8!</p>
          <p className="text-yellow-300 text-2xl mb-8">Continue to Endless Mode?</p>
          
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => {
                // Continue endless mode
                setAnte(prev => prev + 1);
                setBlindsCompleted({ small: false, big: false, boss: false });
                const randomBoss = BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)];
                setUpcomingBoss(randomBoss);
                setGameState('shop');
                generateShop(true);
              }}
              className="bg-green-500 text-white px-8 py-4 rounded-lg text-2xl font-bold hover:bg-green-400 transition-all shadow-lg hover:shadow-green-400/50"
            >
              Continue (Endless Mode)
            </button>
            <button
              onClick={() => setGameState('victory')}
              className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-2xl font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/50"
            >
              Finish Run
            </button>
          </div>
          
          <p className="text-white text-sm mt-8 opacity-75">
            Endless Mode: Infinite antes with scaling difficulty. How far can you go?
          </p>
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
          {hand.map(card => {
            const selectedIndex = selectedCards.indexOf(card.id);
            const isFirst = usingConsumable?.effect === 'transform_card' && selectedIndex === 0;
            
            // Check if card is debuffed by boss blind
            let isDebuffed = false;
            if (bossBlind?.effect === 'debuff_face') {
              isDebuffed = ['J', 'Q', 'K'].includes(card.rank);
            } else if (bossBlind?.effect === 'debuff_clubs') {
              isDebuffed = card.suit === SUITS.CLUBS;
            } else if (bossBlind?.effect === 'debuff_diamonds') {
              isDebuffed = card.suit === SUITS.DIAMONDS;
            }
            
            return (
              <div key={card.id} className="relative">
                <div className={isDebuffed ? 'opacity-40' : ''}>
                  <Card
                    card={card}
                    selected={selectedCards.includes(card.id)}
                    triggering={scoringState.triggeredId === card.id}
                    onClick={() => !usingConsumable && toggleCard(card.id)}
                  />
                </div>
                {isDebuffed && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="text-red-500 text-5xl font-bold opacity-80">✗</div>
                  </div>
                )}
                {isFirst && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consumable Use Panel */}
      {usingConsumable && (
        <div className="mx-4 mb-4 bg-purple-900 border-2 border-purple-400 rounded-xl p-4">
          <div className="text-white text-center mb-2">
            Using: <span className="text-yellow-400 font-bold">{usingConsumable.name}</span> - Select up to {usingConsumable.count} cards
            {usingConsumable.effect === 'transform_card' && selectedCards.length > 0 && (
              <div className="text-sm mt-1">
                <span className="text-green-400">First (✓) becomes exact copy of second</span>
              </div>
            )}
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
            <div className="text-yellow-400 mb-2 font-bold text-sm tracking-widest">
              JOKERS ({jokers.length}/{5 + jokers.filter(j => j.negative).length + (selectedDeck === 'Black Deck' ? 1 : 0)})
            </div>
            <div className="flex gap-2 overflow-x-auto pb-8 min-h-[200px]">
              {jokers.map((joker, index) => (
                <div key={joker.id} className="flex-shrink-0">
                  <JokerCard 
                    joker={joker} 
                    triggering={scoringState.triggeredId === joker.id}
                    showReorder={!scoringState.active}
                    onMoveLeft={() => moveJokerLeft(index)}
                    onMoveRight={() => moveJokerRight(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 border-l border-gray-700 pl-4">
            <div className="text-purple-400 mb-2 font-bold text-sm tracking-widest">CONSUMABLES ({consumables.length}/{2 + (vouchers.find(v => v.effect === 'consumable_slot') ? 1 : 0)})</div>
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
