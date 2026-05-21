import { useState } from "react";
 
// SIX AXES (each scored -2 to +2 per question, accumulated)
// Axis 1: INDIVIDUAL (+) vs COLLECTIVE (-)
// Axis 2: RULES (+) vs CONTEXT (-)
// Axis 3: SYSTEMS (+) vs PEOPLE (-)
// Axis 4: STABILITY (+) vs CHANGE (-)
// Axis 5: EARNED (+) vs EQUAL (-)
// Axis 6: RISK AVERSE (+) vs RISK TOLERANT (-)
 
// Each question answer YES=true, NO=false
// Score format: [individual, rules, systems, stability, earned, riskAverse]
// Positive = first option, Negative = second option
 
const questions = [
  {
    id: 1,
    scenario: "The Bakery",
    text: "It's early morning. A bakery has been on the same corner for thirty years. The owner is there every day before sunrise. You've walked past it your whole life. The city has approved a development — the building comes down. It's legal. He knew it was possible when he signed his lease. The new development brings 200 jobs to a neighborhood that badly needs them. The owner is 67. He has nowhere to go.\n\nDo you sign the petition to stop it?",
    // YES = protect individual over collective progress
    // NO = accept collective benefit over individual cost
    yes: [2, 0, -1, 2, 1, 1],   // individual, stability, earned, risk averse
    no:  [-2, 1, 1, -1, -1, -1], // collective, rules, systems, change
  },
  {
    id: 2,
    scenario: "The Teacher",
    text: "A teacher has been at the same school for twenty years. Everyone knows her. She's the one students come back to visit. Last spring she was caught changing a grade — not for money, not for herself. A student she'd watched struggle for three years finally had a path to college. One grade stood in the way. She changed it.\n\nThe school has a zero tolerance policy. No exceptions.\n\nYou're on the board. The vote is tomorrow.\n\nDo you let her go?",
    // YES = rules matter regardless of context
    // NO = context matters more than rules
    yes: [1, 2, 2, 1, 1, 0],    // rules, systems, stability, earned
    no:  [-1, -2, -1, 0, -1, 0], // context, people
  },
  {
    id: 3,
    scenario: "The Doctor",
    text: "Your father has been seeing the same doctor for fifteen years. Knows his kids' names. Calls to check in. Last month a new hospital system took over the practice. There's now a recommended treatment for your father's condition — standardized, efficient, rolled out across all 47 locations.\n\nHis doctor disagrees with it. Quietly. He told your father in the last five minutes of the appointment, hand on the door.\n\nThe treatment the hospital recommends has better outcomes statistically. The doctor's instinct is just that — an instinct. Thirty years of instinct, but still.\n\nDo you follow the hospital's recommendation?",
    // YES = trust the system over the individual
    // NO = trust the individual over the system
    yes: [0, 1, 2, 1, 0, 1],    // systems, rules, stability, risk averse
    no:  [1, -1, -2, 0, 0, -1],  // people, context, risk tolerant
  },
  {
    id: 4,
    scenario: "The Job Interview",
    text: "Two people interviewed for the same job. You're hiring.\n\nOn paper they're close. In the interview they're equal.\n\nAfterward you find out one of them worked two jobs through college. The other didn't have to.\n\nDo you factor that in?",
    // YES = context and circumstance matter (equal)
    // NO = performance is performance (earned)
    yes: [-1, -2, -1, 0, -2, 0], // collective, context, equal
    no:  [1, 2, 1, 1, 2, 0],     // individual, rules, earned
  },
  {
    id: 5,
    scenario: "The Mechanic",
    text: "You've been going to the same mechanic for twelve years. He's never cheated you but he's never wowed you either. Your car gets fixed. It takes a little longer than it should. The prices are fair.\n\nA new place just opened up down the street. Modern. Better reviews so far. Cheaper.\n\nBut it's three months old.\n\nDo you switch?",
    // YES = open to change, willing to take risk
    // NO = prefer stability and known quantity
    yes: [1, 0, -1, -2, 0, -2],  // change, risk tolerant, people
    no:  [0, 1, 1, 2, 0, 2],     // stability, systems, risk averse
  },
  {
    id: 6,
    scenario: "The Inherited House",
    text: "You move into a new house. It's yours. You saved for it. You're proud of it.\n\nA few months in you find out the previous owner dumped chemicals in the backyard twenty years ago. It's seeping into the neighbor's yard. Slowly. The damage is already done.\n\nThe previous owner is gone. Untraceable.\n\nThe cleanup costs $10,000.\n\nIs that your bill?",
    // YES = you accept inherited responsibility
    // NO = you don't own what you didn't cause
    yes: [-2, -1, 0, 0, -2, -1], // collective, context, equal
    no:  [2, 1, 0, 1, 2, 1],     // individual, rules, earned, stability
  },
  {
    id: 7,
    scenario: "The Company File",
    text: "You've worked at the same company for eleven years. Good job. Good people. You know everyone's name.\n\nYou find something in a file you weren't supposed to see. Nothing illegal. But people outside these walls would be angry if they knew. Your boss would be angry if he knew you saw it.\n\nTelling someone costs you everything in that building.\n\nNot telling anyone costs you nothing you can see.\n\nDo you say something?",
    // YES = individual conscience over institutional loyalty
    // NO = institutional loyalty over individual conscience
    yes: [2, -1, -2, -1, 0, -2], // individual, context, people, change, risk tolerant
    no:  [-1, 1, 2, 2, 0, 2],    // collective, rules, systems, stability, risk averse
  },
  {
    id: 8,
    scenario: "The House Sale",
    text: "You're selling your house. You have two offers.\n\nOne is $20,000 higher. A developer. The house comes down, something else goes up.\n\nThe other is a family. Young. It's the top of their budget. They've been looking for two years. The kids would go to the school down the street.\n\nYou don't need the $20,000. But it's yours to take.\n\nDo you take the higher offer?",
    // YES = individual right to what's earned
    // NO = consider collective human cost
    yes: [2, 1, 0, 1, 2, 1],     // individual, rules, stability, earned
    no:  [-2, -1, 0, 0, -2, 0],  // collective, context, equal
  },
  {
    id: 9,
    scenario: "The Robbery",
    text: "Someone robbed your neighbor. Caught. First offense. 24 years old.\n\nBefore sentencing you find out he'd lost his job. His daughter was sick. He took $400.\n\nThere's a program on the table instead of prison. Two years. Job training. Counseling.\n\nYour neighbor asks what you think.\n\nDo you tell him to push for prison?",
    // YES = retribution, rules matter, consequences are consequences
    // NO = restoration, context matters, people can change
    yes: [1, 2, 1, 2, 2, 1],     // rules, systems, stability, earned, risk averse
    no:  [-1, -2, -1, -1, -2, -1],// context, people, change, equal, risk tolerant
  },
  {
    id: 10,
    scenario: "The Cameras",
    text: "There's been a string of break-ins on your street. Six in three months. Nobody hurt but people are scared. A neighbor proposes a shared camera system. Covers every entrance to the block. Everyone chips in.\n\nIt would probably work.\n\nYour home is on camera twenty four hours a day.\n\nDo you chip in?",
    // YES = collective security over individual privacy
    // NO = individual privacy over collective security
    yes: [-2, 1, 2, 1, 0, 1],    // collective, systems, stability, risk averse
    no:  [2, -1, -1, 0, 0, -1],  // individual, context, risk tolerant
  },
  {
    id: 11,
    scenario: "The Reference",
    text: "Your closest friend is up for a promotion. You're asked by their boss as a reference. Informal. Just a conversation over coffee.\n\nYour friend is good at the job. Not great. The person they're competing against is genuinely better. You've seen them both work.\n\nYour friend has been there for you in ways that don't show up on any resume.\n\nNobody will ever know what you say in that coffee shop.\n\nDo you only talk about the work?",
    // YES = rules and fairness over personal loyalty
    // NO = personal loyalty over institutional fairness
    yes: [0, 2, 1, 1, 2, 0],     // rules, systems, stability, earned
    no:  [1, -2, -1, 0, -1, 0],  // individual, context, people
  },
  {
    id: 12,
    scenario: "The Highway",
    text: "A new highway is being built. It cuts twenty minutes off the commute for about 40,000 people every day.\n\nOne house is in the way. The family has lived there for thirty years. The city is offering double the market value.\n\nThey still don't want to leave.\n\nDo you authorize the demolition?",
    // YES = collective progress justifies individual cost
    // NO = individual cannot be sacrificed regardless of collective benefit
    yes: [-2, 1, 2, -1, 0, -1],  // collective, rules, systems, change
    no:  [2, -1, -1, 1, 1, 1],   // individual, context, people, stability, earned
  },
  {
    id: 13,
    scenario: "The Surgeons",
    text: "Two surgeons are up for the same position.\n\nOne has better results. Loses fewer patients. The numbers are clear.\n\nThe other is in the operating room twice as long on every case. Goes further. Tries harder. Sometimes it works. Sometimes it doesn't.\n\nYou're making the hire.\n\nDo you hire the one with the better numbers?",
    // YES = outcomes matter, systems and data over instinct
    // NO = effort and character matter, people over numbers
    yes: [0, 1, 2, 1, 2, 1],     // systems, rules, stability, earned, risk averse
    no:  [1, -1, -2, -1, -1, -1],// people, context, change, equal, risk tolerant
  },
  {
    id: 14,
    scenario: "The Wedding",
    text: "You hear something about your best friend's partner two weeks before the wedding. You can't confirm it. If it's true it would change everything.\n\nDo you tell your friend?",
    // YES = honesty and individual conscience over institutional moment
    // NO = protect stability, don't act on unconfirmed information
    yes: [2, -1, -1, -2, 0, -2], // individual, context, people, change, risk tolerant
    no:  [0, 1, 1, 2, 0, 2],     // rules, systems, stability, risk averse
  },
  {
    id: 15,
    scenario: "The Jury",
    text: "You're on a jury. A murder trial. Eleven people have already decided he's guilty. Deliberations have been going on for two days. Everyone is tired. The verdict feels inevitable.\n\nYou're not convinced.\n\nDo you hold out?",
    // YES = individual conviction over social pressure
    // NO = defer to collective judgment
    yes: [2, 1, -1, -1, 1, -2],  // individual, rules, people, change, risk tolerant
    no:  [-2, 0, 1, 2, 0, 2],    // collective, systems, stability, risk averse
  },
  {
    id: 16,
    scenario: "The Flood Fix",
    text: "Your neighborhood has a flooding problem. It's been manageable so far. Inconvenient but not devastating.\n\nThere's a fix. It's expensive. It requires every household to contribute. It might work. Engineers say 70% chance it solves it permanently. 30% chance it doesn't and the money is gone.\n\nDo you contribute?",
    // YES = collective action, risk tolerant, change oriented
    // NO = individual choice, risk averse, stability
    yes: [-2, 0, 1, -1, -1, -2], // collective, systems, change, equal, risk tolerant
    no:  [1, 0, 0, 2, 1, 2],     // individual, stability, earned, risk averse
  },
  {
    id: 17,
    scenario: "The Record",
    text: "Someone you grew up with did something serious in their twenties. They served their time. Twenty years later they're a different person. You can see it. Everyone who knows them now can see it.\n\nThey're applying for a job at your company. You're hiring.\n\nDo you give them a shot?",
    // YES = people change, context matters, restoration
    // NO = record is record, earned consequences persist
    yes: [-1, -2, -1, -1, -2, -1],// context, people, change, equal, risk tolerant
    no:  [1, 2, 1, 2, 2, 1],      // rules, systems, stability, earned, risk averse
  },
  {
    id: 18,
    scenario: "The Water",
    text: "Your city is short on water. A drought. Restrictions are in place but voluntary. Your household uses less than average already.\n\nCutting back further would genuinely inconvenience your family. It would also meaningfully help the overall shortage.\n\nDo you cut back?",
    // YES = collective good over personal comfort
    // NO = you've already done your part, individual right to comfort
    yes: [-2, 0, 1, 0, -1, -1],  // collective, systems, equal, risk tolerant
    no:  [2, 1, 0, 1, 2, 1],     // individual, rules, stability, earned, risk averse
  },
];
 
// EIGHT GROUPS defined by axis tendencies
// Format: thresholds are relative — which axes dominate
const groups = [
  {
    emoji: "🗿",
    name: "The Foundation",
    axes: { individual: 1, rules: 1, systems: 1, stability: 1, earned: 1, riskAverse: 1 },
    description: "You believe structure is what makes freedom possible. Rules exist for a reason — the moment you start making exceptions the whole thing unravels. Change should be slow, proven, and deliberate. You're not opposed to progress but you want to see it work somewhere else before it comes here. People know where they stand with you.",
    spectrum: "Your values sit toward the traditional conservative end of the spectrum — not because of party, but because of a deep belief that what's been built deserves respect before it gets replaced.",
  },
  {
    emoji: "🌊",
    name: "The Current",
    axes: { individual: -1, rules: -1, systems: -1, stability: -1, earned: -1, riskAverse: -1 },
    description: "You move toward people, not systems. Circumstances matter more to you than categories. You believe the goal of any rule is a good outcome — and when the rule stops producing good outcomes it stops deserving your loyalty. You're willing to accept real disruption if it means something genuinely better on the other side.",
    spectrum: "Your values sit toward the progressive end of the spectrum — not because of party, but because you weigh human cost heavily and believe systems should serve people, not the other way around.",
  },
  {
    emoji: "🌾",
    name: "The Steward",
    axes: { individual: -1, rules: -1, systems: 0, stability: 1, earned: -1, riskAverse: 1 },
    description: "You feel responsible for things beyond yourself — your community, your neighborhood, the people who came before and will come after. You're not looking to upend anything. You want to take care of what's here. You believe we inherit obligations alongside everything else.",
    spectrum: "Your values are communitarian — neither traditionally liberal nor conservative. You care about people close to you and believe responsibility runs in every direction.",
  },
  {
    emoji: "⚡",
    name: "The Charge",
    axes: { individual: 1, rules: 0, systems: -1, stability: -1, earned: 1, riskAverse: -1 },
    description: "You trust individuals over institutions and you're willing to bet on it. You believe people given real freedom — and real consequences — find better solutions than any committee ever designed. You're not reckless. You just think the cost of playing it safe is higher than most people admit.",
    spectrum: "Your values sit in libertarian territory — skeptical of both government and corporate systems, oriented toward personal freedom and personal responsibility.",
  },
  {
    emoji: "🏛️",
    name: "The Architect",
    axes: { individual: -1, rules: 1, systems: 1, stability: -1, earned: -1, riskAverse: 0 },
    description: "You believe well designed systems produce fair outcomes and the problem is usually bad design not bad people. You want to fix the structure not just patch the symptom. You're drawn to solutions that scale — things that work for everyone, not just the people in the room.",
    spectrum: "Your values sit toward the institutional progressive end — you believe in collective solutions delivered through well-built systems.",
  },
  {
    emoji: "🧭",
    name: "The Realist",
    axes: { individual: 1, rules: -1, systems: 0, stability: 1, earned: 1, riskAverse: 1 },
    description: "You judge situations one at a time. Rules are a starting point not a destination. You've seen enough to know that ideology — any ideology — eventually stops fitting reality. You trust what you can verify. You're skeptical of anyone who seems too certain.",
    spectrum: "Your values are moderate and pragmatic — you resist easy categorization because you think easy categorization is part of the problem.",
  },
  {
    emoji: "🌱",
    name: "The Grower",
    axes: { individual: -1, rules: -1, systems: 0, stability: 0, earned: -1, riskAverse: -1 },
    description: "You believe people are capable of more than their circumstances suggest and that the job of any decent society is to make room for that. You weight potential heavily. You're willing to give chances others wouldn't because you've seen what happens when nobody does.",
    spectrum: "Your values lean progressive on human potential and equal opportunity — you believe where someone starts shouldn't determine where they end up.",
  },
  {
    emoji: "⚖️",
    name: "The Scale",
    axes: { individual: 0, rules: 1, systems: 1, stability: 1, earned: 0, riskAverse: 1 },
    description: "You believe in fair process above all else. If the process was fair the outcome deserves respect even when it's hard. You're not indifferent to people — you just believe that consistent rules protect everyone more reliably than case by case judgment. Especially the people with the least power.",
    spectrum: "Your values are rule-of-law oriented — you believe in the system not because it's perfect but because the alternative is worse.",
  },
];
 
function scoreToGroup(answers) {
  // Calculate axis totals
  const totals = [0, 0, 0, 0, 0, 0];
  answers.forEach((answer, i) => {
    const scores = answer ? questions[i].yes : questions[i].no;
    scores.forEach((s, j) => totals[j] += s);
  });
 
  const [individual, rules, systems, stability, earned, riskAverse] = totals;
 
  // Find closest group by dot product similarity
  let bestGroup = 0;
  let bestScore = -Infinity;
 
  groups.forEach((group, i) => {
    const g = group.axes;
    const score =
      Math.sign(individual) * g.individual +
      Math.sign(rules) * g.rules +
      Math.sign(systems) * g.systems +
      Math.sign(stability) * g.stability +
      Math.sign(earned) * g.earned +
      Math.sign(riskAverse) * g.riskAverse;
    if (score > bestScore) {
      bestScore = score;
      bestGroup = i;
    }
  });
 
  return { group: groups[bestGroup], totals };
}
 
const axisLabels = [
  ["Individual", "Collective"],
  ["Rules", "Context"],
  ["Systems", "People"],
  ["Stability", "Change"],
  ["Earned", "Equal"],
  ["Risk Averse", "Risk Tolerant"],
];
 
export default function App() {
  const [screen, setScreen] = useState("intro"); // intro, quiz, result
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [revealing, setRevealing] = useState(false);
 
  function handleAnswer(yes) {
    const newAnswers = [...answers, yes];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const scored = scoreToGroup(newAnswers);
      setResult(scored);
      setRevealing(true);
      setTimeout(() => {
        setScreen("result");
        setRevealing(false);
      }, 1200);
    }
  }
 
  function goBack() {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswers(answers.slice(0, -1));
    }
  }
 
  function restart() {
    setScreen("intro");
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  }
 
  const progress = (current / questions.length) * 100;
 
  return (
    <div style={{
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      background: "#0d1117",
      minHeight: "100vh",
      color: "#e8e4dc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
 
      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ maxWidth: "540px", width: "100%", textAlign: "center" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#666",
            fontFamily: "monospace",
            marginBottom: "32px"
          }}>
            ANTI-ECHO
          </div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "normal",
            lineHeight: 1.1,
            marginBottom: "24px",
            color: "#f0ece4"
          }}>
            Escape the chamber.<br />Discover who you really are.
          </h1>
          <p style={{
            fontSize: "16px",
            lineHeight: 1.8,
            color: "#888",
            marginBottom: "48px"
          }}>
            Eighteen scenarios. No right answers. No wrong answers. Just choices that reveal something true about what you actually value — not what you think you value.
          </p>
          <button
            onClick={() => setScreen("quiz")}
            style={{
              background: "#e8e4dc",
              color: "#0d1117",
              border: "none",
              padding: "16px 48px",
              fontSize: "13px",
              letterSpacing: "0.15em",
              fontFamily: "monospace",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            BEGIN
          </button>
          <p style={{ fontSize: "12px", color: "#444", marginTop: "24px", fontFamily: "monospace" }}>
            ~8 minutes · no account required · nothing stored
          </p>
        </div>
      )}
 
      {/* QUIZ */}
      {screen === "quiz" && !revealing && (
        <div style={{ maxWidth: "620px", width: "100%" }}>
          {/* Branding */}
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#555",
            fontFamily: "monospace",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            ANTI-ECHO
          </div>
 
          {/* Progress */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <div style={{
              fontSize: "11px",
              color: "#444",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap"
            }}>
              {current + 1} / {questions.length}
            </div>
            <div style={{
              flex: 1,
              height: "1px",
              background: "#1e2d40",
              margin: "0 16px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progress}%`,
                background: "#e8e4dc",
                transition: "width 0.4s ease"
              }} />
            </div>
            <div style={{
              fontSize: "11px",
              color: "#333",
              fontFamily: "monospace",
              whiteSpace: "nowrap"
            }}>
              {questions[current].scenario}
            </div>
          </div>
 
          {/* Scenario */}
            <div style={{
              fontSize: "17px",
              lineHeight: "1.75",
              color: "#d4cfc6",
              whiteSpace: "pre-line",
              minHeight: "calc(17px * 1.75 * 10)",
              marginBottom: "32px"
            }}>
              {questions[current].text}
            </div>
 
          {/* Buttons */}
          <style>{`
            .answer-btn {
              flex: 1;
              padding: 18px;
              background: none;
              border: 1px solid #2a2a30;
              color: #e8e4dc;
              font-size: 14px;
              letter-spacing: 0.1em;
              font-family: monospace;
              cursor: pointer;
              transition: background 0.15s, color 0.15s;
            }
            .answer-btn:hover {
              background: #e8e4dc;
              color: #0c0c0e;
            }
          `}</style>
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              key={"yes-" + current}
              className="answer-btn"
              onClick={() => handleAnswer(true)}
            >
              YES
            </button>
            <button
              key={"no-" + current}
              className="answer-btn"
              onClick={() => handleAnswer(false)}
            >
              NO
            </button>
          </div>
          {current > 0 && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                onClick={goBack}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3a4a5a",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  padding: "8px 16px",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.target.style.color = "#8a9ab0"}
                onMouseLeave={e => e.target.style.color = "#3a4a5a"}
              >
                ← BACK
              </button>
            </div>
          )}
        </div>
      )}
 
      {/* REVEALING */}
      {revealing && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "72px",
            animation: "pulse 1.2s ease-in-out infinite",
          }}>
            ◦
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }`}</style>
        </div>
      )}
 
      {/* RESULT */}
      {screen === "result" && result && (
        <div style={{ maxWidth: "620px", width: "100%" }}>
          {/* Emoji reveal */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              fontSize: "80px",
              marginBottom: "20px",
              lineHeight: 1,
              userSelect: "none",
            }}>
              <span role="img" aria-label="result">{result.group.emoji}</span>
            </div>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "#555",
              fontFamily: "monospace",
              marginBottom: "6px"
            }}>
              YOU ARE
            </div>
            <div style={{
              fontSize: "26px",
              fontWeight: "normal",
              color: "#c8c4bc",
              fontStyle: "italic"
            }}>
              {result.group.name}
            </div>
          </div>
 
          {/* Share */}
          <ShareButton group={result.group} />
 
          {/* Description */}
          <p style={{
            fontSize: "17px",
            lineHeight: 1.85,
            color: "#b8b4ac",
            marginBottom: "40px",
            borderLeft: "2px solid #2a2a30",
            paddingLeft: "24px"
          }}>
            {result.group.description}
          </p>
 
          {/* Axis breakdown */}
          <div style={{
            background: "#111827",
            border: "1px solid #1e1e22",
            padding: "24px",
            marginBottom: "32px"
          }}>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#444",
              fontFamily: "monospace",
              marginBottom: "20px"
            }}>
              YOUR PROFILE
            </div>
            {axisLabels.map(([left, right], i) => {
              const val = result.totals[i];
              const max = 36;
              // dot left = positive val (left label), dot right = negative val (right label)
              const pct = (((-val) + max) / (max * 2)) * 100;
              const dotLeft = pct <= 50;
              return (
                <div key={i} style={{ marginBottom: "16px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    marginBottom: "6px"
                  }}>
                    <span style={{ color: dotLeft ? "#e8e4dc" : "#444" }}>{left}</span>
                    <span style={{ color: !dotLeft ? "#e8e4dc" : "#444" }}>{right}</span>
                  </div>
                  <div style={{
                    height: "2px",
                    background: "#1e2d40",
                    position: "relative"
                  }}>
                    <div style={{
                      position: "absolute",
                      left: `${Math.min(Math.max(pct, 2), 98)}%`,
                      top: "-3px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#e8e4dc",
                      transform: "translateX(-50%)"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Spectrum note */}
          <div style={{
            borderTop: "1px solid #1e1e22",
            paddingTop: "24px",
            marginBottom: "40px"
          }}>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#333",
              fontFamily: "monospace",
              marginBottom: "12px"
            }}>
              FOR WHAT IT'S WORTH
            </div>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#666",
              fontStyle: "italic"
            }}>
              {result.group.spectrum}
            </p>
          </div>
 
          <button
            onClick={restart}
            style={{
              background: "none",
              border: "1px solid #2a2a30",
              color: "#666",
              padding: "12px 32px",
              fontSize: "11px",
              letterSpacing: "0.15em",
              fontFamily: "monospace",
              cursor: "pointer"
            }}
          >
            START OVER
          </button>
 
          {/* Browse others */}
          <div style={{ marginTop: "72px", borderTop: "1px solid #141416", paddingTop: "40px", marginBottom: "48px" }}>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#1e3a5f",
              fontFamily: "monospace",
              marginBottom: "28px"
            }}>
              THE REST OF THE MAP
            </div>
            <BrowseGroups currentEmoji={result.group.emoji} />
          </div>
 
        </div>
      )}
    </div>
  );
}
 
const groupSummaries = [
  {
    emoji: "🗿",
    name: "The Foundation",
    summary: "People here believe the rules hold everything together. They're not resistant to change out of fear — they're resistant because they've seen what happens when you pull the wrong thread. Consistency matters to them more than outcomes."
  },
  {
    emoji: "🌊",
    name: "The Current",
    summary: "These people feel their way through decisions more than they think their way through them. They weigh the human cost of every choice and are willing to accept disruption if it means something genuinely better exists on the other side."
  },
  {
    emoji: "🌾",
    name: "The Steward",
    summary: "Community first. These people feel a deep sense of obligation to the people and places around them. They're not trying to change the world — they're trying to take care of their corner of it."
  },
  {
    emoji: "⚡",
    name: "The Charge",
    summary: "These people bet on individuals over institutions every time. They believe real freedom includes the freedom to fail and that systems — however well designed — eventually stop serving the people they were built for."
  },
  {
    emoji: "🏛️",
    name: "The Architect",
    summary: "These people think in systems. When something is broken they want to redesign it not patch it. They believe collective problems need collective solutions and that the right structure produces fair outcomes."
  },
  {
    emoji: "🧭",
    name: "The Realist",
    summary: "These people resist every label including this one. They judge situations individually, distrust ideology in any direction, and believe that certainty — more than anything else — is usually a warning sign."
  },
  {
    emoji: "🌱",
    name: "The Grower",
    summary: "These people believe in people more than most. They give chances others wouldn't, weigh potential over record, and believe where someone starts shouldn't determine where they end up."
  },
  {
    emoji: "⚖️",
    name: "The Scale",
    summary: "These people believe fair process is the whole game. If the process was fair the outcome deserves respect even when it hurts. They believe consistent rules protect everyone — especially the people with the least power."
  },
];
 
function ShareButton({ group }) {
  const [copied, setCopied] = useState(false);
 
  async function handleShare() {
    const text = `I got ${group.emoji} on Anti-Echo. Escape the chamber and find out where you actually stand — antiecho.io`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // user cancelled, do nothing
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }
 
  return (
    <button
      onClick={handleShare}
      style={{
        background: "none",
        border: "1px solid #2a2a30",
        color: copied ? "#e8ff47" : "#555",
        padding: "10px 24px",
        fontSize: "11px",
        letterSpacing: "0.15em",
        fontFamily: "monospace",
        cursor: "pointer",
        marginBottom: "32px",
        transition: "color 0.2s, border-color 0.2s",
        borderColor: copied ? "#e8ff47" : "#1e2d40",
      }}
    >
      {copied ? "COPIED ✓" : `SHARE  ${group.emoji}`}
    </button>
  );
}
 
function BrowseGroups({ currentEmoji }) {
  const [open, setOpen] = useState(null);
 
  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        marginBottom: "24px"
      }}>
        {groupSummaries.map((g) => {
          const isMe = g.emoji === currentEmoji;
          const isOpen = open === g.emoji;
          return (
            <button
              key={g.emoji}
              onClick={() => setOpen(isOpen ? null : g.emoji)}
              style={{
                background: isMe ? "#111827" : "none",
                border: isMe ? "1px solid #2e2e38" : "1px solid #141416",
                borderRadius: "4px",
                padding: "14px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                opacity: isMe ? 1 : 0.45,
                transition: "opacity 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = isMe ? 1 : 0.45}
            >
              <span style={{ fontSize: "28px", lineHeight: 1 }}>{g.emoji}</span>
              {isMe && (
                <span style={{
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  color: "#444",
                  fontFamily: "monospace"
                }}>YOU</span>
              )}
            </button>
          );
        })}
      </div>
 
      {/* Expanded summary */}
      {open && (() => {
        const g = groupSummaries.find(x => x.emoji === open);
        return (
          <div style={{
            background: "#111827",
            border: "1px solid #1e1e22",
            padding: "20px 24px",
          }}>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "#555",
              fontFamily: "monospace",
              marginBottom: "10px"
            }}>
              {g.emoji} {g.name.toUpperCase()}
            </div>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#888",
              margin: 0
            }}>
              {g.summary}
            </p>
          </div>
        );
      })()}
    </div>
  );
}