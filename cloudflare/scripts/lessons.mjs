// The five beginner lessons. DRAFT, PARKED, NOT LIVE.
//
// Written 2026-11-17 on Lando's instruction: five short plain-English lessons for someone who
// has never heard the words "tax lien" or "tax deed", as preview pages only, linked from
// nowhere, waiting for his approval. They are built OUT OF the Start Here page rather than
// beside it: same voice, same structure, same law-from-the-ledger rule, and every lesson ends
// by sending the reader to their own state page. There is no second beginner section.
//
// LESSONS_APPROVED is the single switch. While it is false, build-site.mjs does not write these
// pages, does not put them in the sitemap and does not link them from anywhere, so the live site
// cannot reach them even by guessing the address. Flip it to true and they appear, plus a link
// from the end of the Start Here page.
//
// THE LAW RULE IS THE SAME ONE THE REST OF THE SITE OBEYS. Every state-specific sentence here is
// rendered by lawList() out of the audited ledgers, with its statute, its official link and the
// date it was checked. Nothing is typed by hand. If a claim is dropped from a ledger, these
// pages throw at build time instead of quietly asserting law with nothing behind it.
//
// WHAT WAS LEFT OUT, AND WHY IT MATTERS. Lesson 5 is about clearing title. The audited ledgers
// contain NO claim about quiet title procedure, in any state: the whole id list is type, rate,
// rateNote, redemption, bidMethod, statute, auctionPlatform, auctionTiming, summary, typeWhy,
// rateWhy, keyNotes, beginnerTip, risks, ddExtra, signup, otc, platforms and surplus. So lesson
// 5 states no state-specific rule about quiet title. It uses the two audited Florida claims that
// genuinely bear on title after a sale, says plainly that the rest varies by state and county,
// and sends the reader to an attorney. That is the rule working, not a gap in the lesson.
export const LESSONS_APPROVED = false;

const BASE_PATH = '/start-here/lessons/';

// Every lesson carries the same two closing blocks, so a reader who lands on one of them alone
// still gets the pending warning and still gets pointed at their own state.
const pendingNote = (esc, pendingStates) => {
  const names = pendingStates.map((s) => esc(s.name)).join(', ').replace(/, ([^,]*)$/, ' and $1');
  return `
  <div class="pending" role="note">
    <p><b>Four states are still marked pending.</b> Platbook has not been able to read the official source for ${names}, so nothing anywhere on this site states the law of those four, including on this page. Their county offices, platforms and links are still accurate; the legal detail is deliberately blank rather than guessed.</p>
  </div>`;
};

const yourState = (n) => `
  <h2 id="your-state">Now read your own state</h2>
  <p>Everything above is the shape of the thing. The numbers that decide whether it is worth doing are set state by state, and sometimes county by county inside one state.</p>
  <p><a class="btn" href="/">Open the state list and pick yours</a></p>
  <p class="muted">Your state page gives the type of sale, the interest or the penalty, the redemption period, the bidding method and the statute behind each one, plus the counties and the offices that run the sales.</p>
  <p class="crumbs">${n < 5 ? `Next: <a href="${BASE_PATH}${n + 1}/">lesson ${n + 1}</a> &nbsp;·&nbsp; ` : ''}Back to <a href="/start-here/">Start here</a></p>`;

export function lessons({ esc, lawList, FL_LAW, TX_LAW, DISCLAIMER, pendingStates }) {
  const close = (n) => pendingNote(esc, pendingStates) + yourState(n);
  const head = (n, title, lede) => `
<section class="prose narrow">
  <p class="crumbs"><a href="/start-here/">Start here</a> / lesson ${n} of 5</p>
  <h1>${esc(title)}</h1>
  <p class="lede">${lede}</p>
  <p class="disclaimer-line">${DISCLAIMER}</p>`;

  return [
    {
      n: 1,
      slug: '1',
      title: 'Lesson 1: what a tax lien is',
      desc: 'A tax lien sale sells the unpaid tax bill, not the property. What you get, what you do not get, and what normally happens, with Florida as the worked example.',
      body: `${head(1, 'Lesson 1: what a tax lien is', 'In a tax lien sale you are not buying a house. You are buying somebody else’s unpaid tax bill, and the right to be paid back with interest the law sets. This lesson is that sentence, slowly.')}

  <h2 id="bill">It starts with a bill nobody paid</h2>
  <p>Every property in the country has a yearly property tax bill. Schools, roads, the fire service and the county offices are paid out of it. When an owner does not pay, the county has a problem with a date on it: the money was already spent in the budget.</p>
  <p>So the law gives the county a way to get the money now and hand the waiting to somebody else. That somebody is the person who buys the lien. You pay the county what the owner owed. The county is square. The debt is now owed to you.</p>

  <h2 id="what">What you actually own</h2>
  <p>You own a piece of paper, called a certificate, that says a specific amount is owed to you against a specific property, at an interest rate the statute fixes. That is all.</p>
  <p>You do not own the property. You cannot go in it. You cannot rent it out, mow the lawn, change the locks, sell it, or tell anybody to leave. The owner still owns it, still lives there if they live there, and still has to pay you back before the deadline the law gives them.</p>
  <p>This is the part beginners get wrong, and it is worth being blunt about: a tax lien is lending, with a legal claim behind it. It is not buying property cheap.</p>

  <h2 id="florida">A real one, with the law behind it</h2>
  <p>Florida is a lien state. These are its own rules, each read from the Florida Senate published statutes and each carrying the date it was checked:</p>
  ${lawList(FL_LAW, ['type', 'rate', 'bidMethod', 'redemption', 'summary.5'])}
  <p>Read the bidding rule twice, because it runs backwards from what people expect. The certificate goes to whoever will accept the <em>lowest</em> interest rate. You are not bidding more money. You are bidding to be paid less. In a crowded Florida sale the winner is the one willing to earn the least.</p>
  <p>Then read the last line again. Florida sets a minimum of five percent on redemption whatever rate you bid, except where the bid was zero percent. So there is a floor under a Florida certificate, and a bidder who drives the rate all the way to nothing has bid away the floor as well.</p>

  <h2 id="ending">How it normally ends</h2>
  <p>Most liens are paid off. The owner, or their bank, or whoever is selling the house, pays the county what is owed plus the interest, the county forwards it to you, and your involvement is over. That is the ordinary ending, and it is a good one. You lent money and you were paid back.</p>
  <p>Sometimes nobody pays. Then the statute gives the certificate holder a road to the property itself, and that road has its own waiting period, its own paperwork and its own bills to settle first:</p>
  ${lawList(FL_LAW, ['summary.1', 'summary.6', 'summary.4'])}
  <p>That last line is the one nobody mentions at a seminar. A certificate nobody wanted is kept by the county at the highest rate the law allows, which tells you something useful: the best paying liens are frequently the ones no investor would touch.</p>
${close(1)}
</section>`,
    },
    {
      n: 2,
      slug: '2',
      title: 'Lesson 2: what a tax deed is',
      desc: 'A tax deed sale sells the property itself. What arrives with the deed, what may still be attached to it, and why Texas is the clearest worked example.',
      body: `${head(2, 'Lesson 2: what a tax deed is', 'A tax deed sale sells the property, not the debt. If you win, you hold a deed. What you take on is a property you have almost certainly never been inside.')}

  <h2 id="difference">The one-line difference from lesson 1</h2>
  <p>In a lien sale you buy the debt and wait to be paid. In a deed sale you buy the real estate and there is nobody to wait for. There is no interest rate, because you are not lending anything. The property is the whole of what you get.</p>
  <p>Which also means the property is the whole of the risk. Nobody is going to send your money back with a nice percentage on top. What you have is what you bought, condition and all.</p>

  <h2 id="roads">There are two ways a deed sale happens</h2>
  <p><strong>Directly.</strong> Some states skip certificates altogether. The county takes the property to auction and sells a deed.</p>
  <p><strong>At the end of a lien.</strong> In a lien state, if nobody redeems, the certificate holder can start the deed process and the property goes to a public sale. Florida works this way, and the sale is run by a different office from the one that sold the certificate:</p>
  ${lawList(FL_LAW, ['summary.7', 'signup.deposit.2'])}
  <p>Worth noticing: that deposit is not refundable. The deed road has costs that start before you own anything.</p>

  <h2 id="texas">Texas, where the deed comes with a string attached</h2>
  <p>Texas is the example everyone should see first, because it is a deed state with a catch, and the catch is where the money is:</p>
  ${lawList(TX_LAW, ['type', 'typeWhy.1', 'redemption', 'rate', 'rateNote', 'keyNotes.3'])}
  <p>So in Texas you get the deed at the sale, you get use and possession, and the former owner can still undo it by paying you back with a flat percentage on top. Note what that percentage is calculated on: not just the back taxes, but your bid plus the recording fee plus the taxes and costs you paid.</p>
  <p>Sit with the flat percentage for a moment, because it is the most misunderstood number in this business. Twenty five percent is twenty five percent whether the owner redeems in the first week or eleven months later. Redeemed quickly it is a spectacular annual return on a very short loan. It is also the outcome where you owned a property for nine days. A redeemable deed state pays you in one of two completely different ways, and you do not get to pick which.</p>

  <h2 id="attached">What is still attached to the deed</h2>
  <p>A tax deed is not automatically a clean title. Some claims against a property survive the sale, and which ones is a matter of state law. Here is Florida, in the statute's own words:</p>
  ${lawList(FL_LAW, ['risks.3'])}
  <p>That is one state and one kind of claim. The general lesson is the one to carry: before you bid anywhere, ask the county what the sale clears and what it does not, and get the answer in writing. Lesson 5 is about this whole problem.</p>
${close(2)}
</section>`,
    },
    {
      n: 3,
      slug: '3',
      title: 'Lesson 3: how a tax sale works, start to finish',
      desc: 'The whole sequence in order: the unpaid bill, the advertisement, registering and the deposit, the bidding, what happens if nobody bids, and where the money goes afterwards.',
      body: `${head(3, 'Lesson 3: how a tax sale works, start to finish', 'The same seven steps happen almost everywhere. The dates, the deposits and the way bidding works change state by state and often county by county. Here is the sequence, with Florida and Texas showing both shapes.')}

  <h2 id="step1">Step one: a bill goes unpaid, and a date passes</h2>
  <p>The tax becomes officially late on a date the statute names. Almost every other deadline in this business is counted from that date, not from the day the bill arrived and not from the day of the sale. Getting that one date right is most of the work.</p>

  <h2 id="step2">Step two: the county advertises</h2>
  <p>A sale has to be public, which means notice, in a form and for a time the statute sets:</p>
  ${lawList(FL_LAW, ['auctionTiming', 'signup.steps.3'])}
  <p>And Texas, where the whole state sells on the same day of the month:</p>
  ${lawList(TX_LAW, ['auctionTiming', 'signup.steps.1'])}
  <p>A statewide sale day is a practical fact worth planning around: every county competes for the same bidders on the same morning.</p>

  <h2 id="step3">Step three: you register, and usually you pay a deposit</h2>
  ${lawList(FL_LAW, ['signup.deposit.1'])}
  ${lawList(TX_LAW, ['signup.steps.3', 'ddExtra.2'])}
  <p>That Texas requirement catches people: you cannot be handed the deed if you owe delinquent property tax yourself, and the officer cannot waive it.</p>

  <h2 id="step4">Step four: the bidding, which is not what you think</h2>
  <p>There is no single way to win a tax sale. The three common shapes are bidding the interest rate down, bidding money up, and a rotation that hands liens out in turn. Here are the two in our examples:</p>
  ${lawList(FL_LAW, ['summary.2', 'summary.3'])}
  ${lawList(TX_LAW, ['bidMethod'])}
  <p>Two different games. In Florida you compete by accepting less. In Texas you compete by paying more, against a minimum the county sets.</p>

  <h2 id="step5">Step five: what happens when nobody bids</h2>
  ${lawList(FL_LAW, ['summary.4', 'otc.note.1'])}
  ${lawList(TX_LAW, ['beginnerTip.1', 'otc.note.2'])}
  <p>This is the quiet part of the market. What nobody wanted at the sale can often be bought afterwards, straight from the county or the taxing unit, with no auction at all. In Texas, note that a resale is still subject to the former owner's right to redeem.</p>

  <h2 id="step6">Step six: the wait, and then the deed</h2>
  <p>In a lien state there is a waiting period before the holder can move on the property, and other certificates on the same property have to be settled first:</p>
  ${lawList(FL_LAW, ['summary.1', 'summary.6'])}
  <p>In a redeemable deed state the wait is the other way round: you already hold the deed, and you are waiting to see whether the former owner takes it back. Lesson 4 is entirely about that wait.</p>

  <h2 id="step7">Step seven: the money afterwards</h2>
  <p>When a property sells for more than was owed, the difference does not belong to the county and it does not belong to you. There is a statutory queue for it, and a deadline:</p>
  ${lawList(FL_LAW, ['surplus.1', 'surplus.2'])}
  ${lawList(TX_LAW, ['surplus.1'])}

  <h2 id="county">The step that is not in any statute</h2>
  <p>Call the county. A state page here is the baseline the statute sets; the office running the sale is the authority on how that sale actually works this year, on which platform, with which deposit, at which hour. One phone call before any money moves has saved more beginners than any course.</p>
${close(3)}
</section>`,
    },
    {
      n: 4,
      slug: '4',
      title: 'Lesson 4: what redemption means',
      desc: 'Redemption is the owner right to pay everything back and undo the sale. When the clock starts, what gets repaid, and why a fast redemption can be the best or the worst outcome.',
      body: `${head(4, 'Lesson 4: what redemption means', 'Redemption is the owner’s right to pay what is owed and put things back as they were. It is the single most important idea in this business, because it decides what you end up holding and when.')}

  <h2 id="what">What it is</h2>
  <p>After a tax sale, the law usually gives the former owner, and sometimes other people with an interest in the property, a window in which they can pay everything owed and undo the sale. If they do, that is called redeeming.</p>
  <p>If you bought a lien, redemption is how you get paid. If you bought a deed in a state that allows it, redemption is how you lose the property and get your money back with a premium instead.</p>

  <h2 id="clock">The clock almost never starts at the sale</h2>
  <p>This is the most expensive misunderstanding in the whole subject. Every state names the date the redemption clock starts, and it is usually not the day of the auction. It may be the day a certificate was issued, the day a deed was recorded, or a fixed calendar date in the year after.</p>
  ${lawList(FL_LAW, ['redemption', 'summary.1'])}
  <p>Florida measures the road to a deed from April the first of the year the certificate was issued, not from the sale. Buy a certificate late in the cycle and your two years are already partly spent.</p>
  ${lawList(TX_LAW, ['redemption', 'risks.3'])}
  <p>Texas counts from the recording of the deed, and the length depends on what kind of property it is. Two years for a homestead, agricultural land or a mineral interest; one hundred and eighty days for everything else. Working out which one you are bidding on is a job to do before the sale, not after.</p>

  <h2 id="paid">What gets repaid, and what that is worth</h2>
  <p>In a lien state, you are repaid the amount plus interest, with whatever floor the statute puts under it:</p>
  ${lawList(FL_LAW, ['summary.5', 'rateWhy.3'])}
  <p>In a redeemable deed state, you are repaid a flat percentage on a larger base:</p>
  ${lawList(TX_LAW, ['risks.1', 'keyNotes.1', 'keyNotes.2'])}
  <p>Here is the arithmetic nobody does at the seminar. A flat twenty five percent paid back after one month is an annual rate of roughly three hundred percent. The same twenty five percent paid back after twenty three months is about thirteen percent a year. Same statute, same number, same deal, and a twenty fold difference in what it was worth. A headline percentage on its own tells you almost nothing.</p>
  <p>And the opposite trap, in a rate state: a certificate redeemed a month after you bought it earns you a month of interest, not a year of it, unless the statute puts a minimum in your way. Florida has one. Many states do not.</p>

  <h2 id="meanwhile">Who holds the property while the clock runs</h2>
  ${lawList(TX_LAW, ['keyNotes.3'])}
  <p>That is Texas. It means the deed buyer, not the former owner, has use and possession during the redemption window. It does not mean the same thing anywhere else, and it is exactly the kind of rule to read in your own state before you plan on collecting any rent.</p>
  ${lawList(TX_LAW, ['summary.7'])}
  <p>Note what that last line does to the bargain hunting end of the market: a property the county resells later still carries the former owner's right to redeem with it.</p>

  <h2 id="plan">What this means for you before you bid</h2>
  <p>Decide which outcome you actually want, then pick states that pay that outcome. If you want to be paid interest and be done with it, you want a lien state with a reliable floor and a redemption rate near one hundred percent. If you want to end up owning property, redemption is the thing standing between you and it, and the longest redemption periods are the ones most likely to end with you still holding the keys.</p>
${close(4)}
</section>`,
    },
    {
      n: 5,
      slug: '5',
      title: 'Lesson 5: how title gets cleared after a sale',
      desc: 'A tax deed is not automatically a clean title. What a cloud on title is, what can survive a tax sale, why this varies by state and county, and why this part of the job goes to a real estate attorney.',
      body: `${head(5, 'Lesson 5: how title gets cleared after a sale', 'You won the sale and you are holding a deed. That is not the same as being able to sell, insure or borrow against the property. This lesson is about the gap between those two things, and it is the lesson where I tell you to hire somebody.')}

  <h2 id="title">What title means, in plain words</h2>
  <p>Title is the record of who owns a property and who else has a claim against it. It lives in the county records as a chain of documents going back years: sales, mortgages, liens, judgments, easements, divorces, deaths. A buyer, a lender and an insurer all read that chain before they will do anything.</p>
  <p>A cloud on title is anything in that chain that makes a reader stop. Not necessarily something fatal. Something unresolved.</p>

  <h2 id="why">Why a tax deed often arrives with a cloud</h2>
  <p>A tax deed comes from a process, not from a seller sitting across a table. It gets recorded in a way that is different from an ordinary sale, and it may leave questions on the record that nobody has formally answered: whether everyone entitled to notice got it, whether some other claim survived the sale, whether the former owner has any remaining right.</p>
  <p>Until those questions are answered, a title insurer will often decline to insure, and if they will not insure it, most buyers cannot get a loan to buy it from you. The property is yours. Selling it at a normal price is a different matter.</p>

  <h2 id="survives">Some claims survive the sale, and which ones is state law</h2>
  <p>This is the one part of the problem with a hard, readable answer, and here it is for Florida, in the statute's own words:</p>
  ${lawList(FL_LAW, ['risks.3', 'ddExtra.2'])}
  <p>Government liens of record that are not paid out of the sale proceeds survive the issuance of the deed. So a municipal, county or special district claim can walk through a tax sale untouched and land on you. That is checkable before you bid, at the city and the county, and it is one of the cheapest checks there is.</p>
  <p>Florida also puts an outer limit on one kind of challenge:</p>
  ${lawList(FL_LAW, ['risks.2'])}
  <p>Four years after the deed is issued, the former owner and anyone claiming under them can no longer bring an action. That is a real and useful fact about Florida, and the reason it is on this page is that it is in the audited record with the statute behind it.</p>

  <h2 id="quiet">What this page deliberately does not tell you</h2>
  <p>There is a court process, generally called quiet title, used after some tax deed sales to get a judgment settling who owns the property so that the title becomes insurable. Whether you need it, what it costs, how long it takes, who has to be served and what happens if somebody objects are all set by state law and local court practice.</p>
  <p><strong>This site states none of that for any state, on purpose.</strong> Platbook publishes a legal statement only when it has read the statute from the official source and recorded the citation, the link and the date. The audited records behind this site hold claims about sale types, rates, redemption, bidding, auctions, over the counter sales, due diligence and surplus funds. They hold nothing about quiet title procedure, in any state. So rather than fill the gap with something that sounds right, this lesson leaves it empty and says so.</p>
  <p>It also varies below the state level. Two counties in one state can run the recording, the notice and the local court step differently, and the clerk in the county where the property sits is the authority on how it is done there.</p>

  <h2 id="attorney">The part I do not do myself</h2>
  <p>I hand title work to a real estate attorney. Every time, in every state, and I have never done it myself.</p>
  <p>That is not modesty and it is not a disclaimer. Title is the one place in this business where being almost right costs more than being slow. An attorney licensed in the state where the property sits can read the actual chain of title, tell you whether the deed is insurable as it stands, run the court step if it is needed, and carry the professional responsibility for the answer. None of those four things can be done from a website, including this one.</p>
  <p>What you should take from this lesson is a shape, not a procedure: budget for a title opinion before you bid, not after you win, and treat any property whose title cannot be cleared economically as a property you did not want.</p>
${close(5)}
</section>`,
    },
  ];
}

// The index page the five lessons hang off. Reachable only when LESSONS_APPROVED is true.
export function lessonsIndexBody({ esc, items, DISCLAIMER }) {
  return `
<section class="prose narrow">
  <p class="crumbs"><a href="/start-here/">Start here</a> / the five lessons</p>
  <h1>The five lessons</h1>
  <p class="lede">Start here explains the whole idea on one page. These five go slower, one idea at a time, for somebody who has never heard these words before. Read them in order, or pick the one you need.</p>
  <p class="disclaimer-line">${DISCLAIMER}</p>
  <ol class="cards">
    ${items.map((l) => `<li class="card"><a href="${BASE_PATH}${l.slug}/"><span class="card-name">${esc(l.title.replace(/^Lesson \d+: /, ''))}</span><span class="card-facts"><span>${esc(l.desc)}</span></span></a></li>`).join('')}
  </ol>
  <p class="muted">Every legal statement in these lessons carries its statute, a link to the official source and the date it was checked. Where the audited records hold nothing, the lesson says so rather than filling the gap.</p>
  <p class="crumbs">Back to <a href="/start-here/">Start here</a> &nbsp;·&nbsp; or straight to <a href="/">your state</a></p>
</section>`;
}

export const LESSONS_BASE = BASE_PATH;
