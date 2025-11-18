// Portfolio P&L Roasts
export function getPnLRoast(pnlPercent, language = 'english') {
  const roasts = {
    english: {
      extremeProfit: [
        "🚀 Whoa! Are you Warren Buffett's secret student? Portfolio on fire!",
        "💰 Holy profits Batman! Someone's buying a Lamborghini tonight!",
        "🎯 You absolute legend! Market bowing down to you right now!",
        "👑 King/Queen of the market! Teach us your ways, master!",
      ],
      highProfit: [
        "📈 Nice gains! Keep this up and retirement comes early!",
        "😎 Looking good! Portfolio flexing like a bodybuilder!",
        "💪 Strong performance! Market respects the hustle!",
        "🎉 Party time! Profits looking tasty today!",
      ],
      moderateProfit: [
        "😊 Green is green! At least not in the red zone!",
        "👌 Not bad! Better than your savings account interest!",
        "🌱 Small gains, but gains nonetheless! Keep growing!",
        "📊 Positive territory! Baby steps to richness!",
      ],
      smallProfit: [
        "😅 Barely green! One bad trade and you're toast!",
        "🤏 Tiny profit! Can you even buy chai with this?",
        "😬 So close to red! Walking on thin ice here!",
        "🎪 Circus balancing act! One wrong step...",
      ],
      breakeven: [
        "😐 Perfectly balanced! But also perfectly boring!",
        "🤷 Zero is the hero? More like zero is a zero!",
        "⚖️ Break-even! All that effort for nothing!",
        "💤 Snooze fest! Did you even trade or just sleep?",
      ],
      smallLoss: [
        "😬 Red alert! Not critical yet but getting close!",
        "📉 Slipping! Someone call the lifeguard!",
        "😰 Uh oh! Portfolio catching a cold!",
        "🚨 Warning signs! Time to panic? Not yet!",
      ],
      moderateLoss: [
        "😨 Houston, we have a problem! Portfolio bleeding!",
        "🆘 Save yourself! It's getting ugly!",
        "💔 Heartbreak! Money going bye-bye!",
        "😭 Tears incoming! Wallet feeling lighter!",
      ],
      highLoss: [
        "💀 RIP portfolio! Should we hold a funeral?",
        "🔥 Everything is on fire! And not the good kind!",
        "⚰️ Dead and buried! Time to start over!",
        "😵 Knockout! Down for the count!",
      ],
      catastrophic: [
        "☠️ Total annihilation! Did you YOLO everything?",
        "🪦 Rest in pieces! This is beyond saving!",
        "🌋 Volcanic eruption of losses! Run away!",
        "😈 Hell hath no fury like your portfolio!",
      ]
    },
    hindi: {
      extremeProfit: [
        "🚀 Arrey waah! Rakesh Jhunjhunwala ban gaye kya? Kamaal!",
        "💰 Loot liya market ko! Aaj party pakki hai!",
        "😎 Badiya! Warren Buffett bhi seekh le tumse!",
        "👑 Raja ho tum! Market tumhara gulam!",
      ],
      highProfit: [
        "📈 Superhit! Bollywood ki tarah blockbuster!",
        "😎 Mast chal raha! Portfolio body building kar raha!",
        "💪 Zabardast! Market respect karta tumhe!",
        "🎉 Party karo! Profit dekho kitna!",
      ],
      moderateProfit: [
        "😊 Green hai toh sahi! Red se toh better!",
        "👌 Bura nahi! Bank se zyada interest!",
        "🌱 Thoda profit! Par profit toh hai!",
        "📊 Positive mein! Dheere dheere ameer!",
      ],
      smallProfit: [
        "😅 Barely green! Ek galti aur khatam!",
        "🤏 Chotu profit! Chai bhi nahi aa sakti!",
        "😬 Red ke paas! Patli ice pe chal rahe!",
        "🎪 Circus balance! Gir gaye toh...",
      ],
      breakeven: [
        "😐 Perfect balance! Par boring bhi!",
        "🤷 Zero hai boss! Mehnat bekaar!",
        "⚖️ Break-even! Itni mehnat kis liye?",
        "💤 Neend aa rahi! Trade kiya ya soye?",
      ],
      smallLoss: [
        "😬 Red alert! Critical nahi par paas hai!",
        "📉 Gir rahe ho! Lifeguard bulao!",
        "😰 Uh oh! Portfolio bimaar!",
        "🚨 Warning! Panic ka time?",
      ],
      moderateLoss: [
        "😨 Houston, problem hai! Khoon beh raha!",
        "🆘 Bachao khud ko! Bura lag raha!",
        "💔 Dil toota! Paisa ja raha!",
        "😭 Rone wale! Wallet khali!",
      ],
      highLoss: [
        "💀 RIP portfolio! Funeral karein?",
        "🔥 Sab jal raha! Aur accha nahi!",
        "⚰️ Mar gaya! Naya shuru karo!",
        "😵 Knockout! Gir gaye!",
      ],
      catastrophic: [
        "☠️ Total khatam! Sab laga diya kya?",
        "🪦 Rest in pieces! Bach nahi sakta!",
        "🌋 Volcano explosion! Bhag jao!",
        "😈 Narak bhi kam! Portfolio dekho!",
      ]
    }
  };

  const lang = roasts[language] || roasts.english;
  
  let category;
  if (pnlPercent > 50) category = 'extremeProfit';
  else if (pnlPercent > 20) category = 'highProfit';
  else if (pnlPercent > 10) category = 'moderateProfit';
  else if (pnlPercent > 2) category = 'smallProfit';
  else if (pnlPercent > -2) category = 'breakeven';
  else if (pnlPercent > -10) category = 'smallLoss';
  else if (pnlPercent > -20) category = 'moderateLoss';
  else if (pnlPercent > -40) category = 'highLoss';
  else category = 'catastrophic';

  const messages = lang[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getStockRoast(pnlPercent, language = 'english') {
  const roasts = {
    english: {
      bigWinner: [
        "🏆 This stock is your golden goose! Don't kill it!",
        "💎 Diamond in your portfolio! Protect at all costs!",
        "🌟 Star player! MVP of your portfolio!",
        "🚀 Rocket ship! To infinity and beyond!",
      ],
      winner: [
        "✅ Nice pick! Someone did their homework!",
        "📈 Green machine! Keep doing whatever you did!",
        "😊 Happy days! This one's a keeper!",
        "💚 Love this stock! It loves you back!",
      ],
      smallWinner: [
        "😌 Tiny win! Better than nothing, right?",
        "🤏 Micro profit! Can't even buy lunch!",
        "😅 Barely green! Don't celebrate too hard!",
      ],
      loser: [
        "📉 This one's dragging you down! Cut it loose?",
        "😬 Mistake detected! Exit strategy ready?",
        "💔 Heartbreaker! Why are you still holding?",
      ],
      bigLoser: [
        "💀 This stock is dead weight! Dump it already!",
        "🔴 Blood bath! Emergency exit needed!",
        "😱 Disaster stock! What were you thinking?",
      ]
    },
    hindi: {
      bigWinner: [
        "🏆 Sone ka anda! Ye stock rakh lo hamesha!",
        "💎 Heera hai ye! Kabhi mat bechna!",
        "🌟 Superstar! Portfolio ka hero!",
        "🚀 Rocket hai ye! Moon tak jayega!",
      ],
      winner: [
        "✅ Badiya choice! Dimag se trade kiya!",
        "📈 Mast chal raha! Aur khareed lo!",
        "😊 Happy stock! Khush rakhna isse!",
        "💚 Pyara stock! Pyar karta tumse!",
      ],
      smallWinner: [
        "😌 Thoda profit! Chai ka paisa mil gaya!",
        "🤏 Chotu profit! Par profit toh profit hai!",
        "😅 Barely green! Zyada khush mat ho!",
      ],
      loser: [
        "📉 Ye dubara hai! Bech do!",
        "😬 Galti ho gayi! Niklo jaldi!",
        "💔 Bewafa stock! Chhod do!",
      ],
      bigLoser: [
        "💀 Khatam! Isse toh fenk do!",
        "🔴 Barbaadi! Emergency mein bech do!",
        "😱 Disaster! Kya soch ke liya tha?",
      ]
    }
  };

  const lang = roasts[language] || roasts.english;
  
  let category;
  if (pnlPercent > 30) category = 'bigWinner';
  else if (pnlPercent > 10) category = 'winner';
  else if (pnlPercent > 2) category = 'smallWinner';
  else if (pnlPercent > -10) category = 'loser';
  else category = 'bigLoser';

  const messages = lang[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getFundsRoast(funds, language = 'english') {
  const roasts = {
    english: {
      rich: [
        "💎 Loaded! Bill Gates lite version detected!",
        "🤑 Money bags! Save some for us peasants!",
        "👑 Royalty! Your wallet is heavier than mine!",
      ],
      comfortable: [
        "💵 Decent balance! Room to play safely!",
        "😊 Not bad! You can afford mistakes!",
        "👍 Good cushion! Trade responsibly!",
      ],
      tight: [
        "😅 Running low! One bad trade and...",
        "🪙 Pocket change! Be very careful!",
        "😬 Slim pickings! Ration mode activated!",
      ],
      broke: [
        "💀 Zero balance! Game over man!",
        "😭 Bhikari alert! Need fund injection!",
        "🚫 Empty! Time to sell kidney?",
      ]
    },
    hindi: {
      rich: [
        "💎 Ameer log! Paisa hi paisa!",
        "🤑 Maaldar! Ambani lag rahe!",
        "👑 Raja Maharaja! Bank balance dekho!",
      ],
      comfortable: [
        "💵 Theek thaak! Trade karo bhai!",
        "😊 Accha hai! Mehnga stock le sakte!",
        "👍 Badiya balance! Tension free!",
      ],
      tight: [
        "😅 Kam hai! Sambhal ke trade karo!",
        "🪙 Thode paise! Khatam hone wale!",
        "😬 Tight budget! Careful!",
      ],
      broke: [
        "💀 Khatam! Zero balance!",
        "😭 Bhikari! Paisa khatam!",
        "🚫 Khali! Sell karo kuch!",
      ]
    }
  };

  const lang = roasts[language] || roasts.english;
  
  let category;
  if (funds === 0 || funds < 1000) category = 'broke';
  else if (funds < 10000) category = 'tight';
  else if (funds < 100000) category = 'comfortable';
  else category = 'rich';

  const messages = lang[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getRandomRoast(category, subcategory, language = 'english') {
  const roasts = {
    orderStatus: {
      success: {
        english: [
          "✅ Order placed! Now pray it works out!",
          "🎯 Done! May the market gods bless you!",
          "✨ Success! Now watch it like a hawk!",
          "🚀 Launched! Buckle up for the ride!",
        ],
        hindi: [
          "✅ Order done! Ab bhagwan bharose!",
          "🎯 Ho gaya! Market ki kripa rahe!",
          "✨ Success! Ab dekho kya hota!",
          "🚀 Order placed! Seat belt pehen lo!",
        ]
      },
      pending: {
        english: [
          "⏳ Waiting... Patience is a virtue!",
          "🕐 Pending! Don't refresh 100 times!",
          "😴 Still processing! Take a chill pill!",
        ],
        hindi: [
          "⏳ Wait karo... Sabr ka phal meetha!",
          "🕐 Pending hai! Bar bar mat dekho!",
          "😴 Process ho raha! Relax karo!",
        ]
      }
    }
  };

  const messages = roasts[category]?.[subcategory]?.[language];
  if (!messages || messages.length === 0) return '';
  return messages[Math.floor(Math.random() * messages.length)];
}