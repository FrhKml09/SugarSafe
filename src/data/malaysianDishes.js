const malaysianDishes = [
  {
    dishName: 'Nasi Lemak',
    dishNameEn: 'Coconut Rice with Sambal',
    servingSize: '1 typical plate (~182g)',
    kcal: 264,
    carbsG: 51,
    sugarG: 7,
    proteinG: 10,
    fatG: 13,
    glycemicLoad: 'high',
    source: 'FatSecret',
    swapTips: [
      'Ask for setengah nasi (half rice)',
      'Keep the egg and ikan bilis for protein',
      'Go easy on the sambal for sodium',
    ],
  },
  {
    dishName: 'Char Kway Teow',
    dishNameEn: 'Fried Flat Rice Noodles',
    servingSize: '1 serving (~240g)',
    kcal: 364,
    carbsG: 37,
    sugarG: 0.7,
    proteinG: 17,
    fatG: 15,
    glycemicLoad: 'high',
    source: 'FatSecret',
    swapTips: [
      'Ask for extra bean sprouts/vegetables',
      'Request kurang minyak (less oil)',
    ],
  },
  {
    dishName: 'Roti Canai',
    dishNameEn: 'Flatbread with Dhal',
    servingSize: '1 piece roti (~95g) + ~150g dhal',
    kcal: 452,
    carbsG: 63,
    sugarG: 0.2,
    glycemicLoad: 'medium-high',
    source: 'FatSecret (roti figure verified); dhal portion is estimated',
    swapTips: [
      'Pair with dhal instead of a second roti or sweetened dipping sauce',
      'Ask for less oil in the cooking',
    ],
  },
  {
    dishName: 'Mee Goreng Mamak',
    dishNameEn: 'Fried Yellow Noodles',
    kcal: 700,
    carbsG: 90,
    sugarG: 10,
    glycemicLoad: 'high',
    source: 'estimated',
    swapTips: ['Ask for extra egg or tofu for protein', 'Skip the extra sweet sauce'],
  },
  {
    dishName: 'Teh Tarik',
    dishNameEn: 'Pulled Milk Tea',
    kcal: 150,
    carbsG: 22,
    sugarG: 20,
    glycemicLoad: 'medium',
    source: 'estimated',
    swapTips: ['Ask for kurang manis (less sweet)', 'Try teh o kosong (no sugar, no milk) instead'],
  },
  {
    dishName: 'Nasi Kandar',
    dishNameEn: 'Rice with Mixed Curries',
    kcal: 800,
    carbsG: 90,
    sugarG: 5,
    glycemicLoad: 'high',
    source: 'estimated',
    swapTips: ['Choose one curry, not gravy mixed from several', 'Ask for less rice, more vegetables/protein'],
  },
  {
    dishName: 'Nasi Ayam',
    dishNameEn: 'Hainanese Chicken Rice',
    servingSize: '1 plate (~230g)',
    kcal: 278,
    carbsG: 46,
    sugarG: 2,
    proteinG: 16.1,
    fatG: 3.22,
    glycemicLoad: 'medium-high',
    source: 'myfcd.moh.gov.my (NDB 221018, RICE CHICKEN / NASI AYAM); sugar not listed in source, estimated',
    swapTips: ['Remove the chicken skin', 'Ask for a smaller rice portion, extra cucumber'],
  },
  {
    dishName: 'Curry Laksa',
    dishNameEn: 'Curry Noodle Soup',
    servingSize: '1 bowl (~650g)',
    kcal: 761,
    carbsG: 73.5,
    sugarG: 4,
    proteinG: 22.75,
    fatG: 41.6,
    glycemicLoad: 'medium-high',
    source: 'myfcd.moh.gov.my (NDB 403004, CURRY LAKSA / KARI LAKSA); sugar not listed in source, estimated',
    swapTips: ['Ask for less santan (coconut milk) in the broth', 'Add extra tofu puffs/egg instead of extra noodles'],
  },
  {
    dishName: 'Banana Leaf Rice',
    dishNameEn: 'Mixed Rice with Curries & Vegetables',
    kcal: 750,
    carbsG: 85,
    sugarG: 5,
    glycemicLoad: 'high',
    source: 'estimated',
    swapTips: ['Fill half the leaf with vegetables before asking for more rice', 'Choose dry curries over extra gravy'],
  },
  {
    dishName: 'Mee Rebus',
    dishNameEn: 'Noodles in Sweet Potato Gravy',
    kcal: 600,
    carbsG: 80,
    sugarG: 8,
    glycemicLoad: 'high',
    source: 'estimated',
    swapTips: ['Ask for extra egg or tofu', 'Request a smaller portion of gravy'],
  },
  {
    dishName: 'Wantan Mee',
    dishNameEn: 'Dry Wonton Noodles',
    kcal: 550,
    carbsG: 65,
    sugarG: 5,
    glycemicLoad: 'medium-high',
    source: 'estimated',
    swapTips: ['Add extra vegetables (choy sum)', 'Ask for less dark sauce'],
  },
  {
    dishName: 'Nasi Goreng Kampung',
    dishNameEn: 'Village-Style Fried Rice',
    kcal: 600,
    carbsG: 70,
    sugarG: 4,
    glycemicLoad: 'high',
    source: 'estimated',
    swapTips: ['Ask for extra anchovies/egg for protein', 'Request a smaller rice portion'],
  },
  {
    dishName: 'Economy Rice (2 dishes)',
    dishNameEn: 'Mixed Rice, 2 Dishes',
    kcal: 550,
    carbsG: 60,
    sugarG: 3,
    glycemicLoad: 'medium-high',
    source: 'estimated',
    swapTips: [
      'Pick one vegetable dish and one protein dish, not two protein dishes',
      'Ask for less rice, more sayur (vegetables)',
    ],
  },
  {
    dishName: 'Satay (5 sticks + sauce)',
    dishNameEn: 'Grilled Skewers with Peanut Sauce',
    servingSize: '5 chicken satay sticks (~85g) + ~40g peanut sauce',
    kcal: 219,
    carbsG: 12.5,
    sugarG: 13,
    proteinG: 30,
    fatG: 10.5,
    glycemicLoad: 'medium',
    source:
      'myfcd.moh.gov.my (chicken satay R222029, 2024; satay sauce NDB 236004, 1997); sauce portion size and combined sugar are estimated',
    swapTips: ['Dip lightly instead of pouring sauce over', 'Pair with cucumber/onion instead of ketupat'],
  },
  {
    dishName: 'Roti Telur',
    dishNameEn: 'Egg Flatbread',
    kcal: 400,
    carbsG: 42,
    sugarG: 3,
    glycemicLoad: 'medium-high',
    source: 'estimated',
    swapTips: ['Pair with dhal instead of a sweetened dipping sauce', 'Ask for less oil in the cooking'],
  },
]

function normalize(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
}

export function findDish(dishName) {
  const target = normalize(dishName)
  if (!target) return null

  const exact = malaysianDishes.find((d) => normalize(d.dishName) === target)
  if (exact) return exact

  const fuzzy = malaysianDishes.find((d) => {
    const n = normalize(d.dishName)
    return target.includes(n) || n.includes(target)
  })
  return fuzzy || null
}

export default malaysianDishes
