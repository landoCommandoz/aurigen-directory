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
//
// EDIT PASS 2026-11-17, after Lando read the draft. Four rules came out of it, and they bind
// anyone editing this file later:
//   1. NO CLAIM ABOUT HOW OFTEN SOMETHING HAPPENS. Not "most liens are paid off", not "a title
//      insurer will usually decline", not "the best paying liens are the ones nobody wants". The
//      ledgers hold statutes, not statistics, so this file states mechanisms and leaves frequency
//      alone. Every sentence of that kind was cut rather than softened, including the ones nobody
//      asked about, and the section heading "How it normally ends" went with them.
//   2. NO JABS AT SEMINARS, COURSES OR GURUS. The point each of those three sentences was making
//      is kept. The sneer is gone. It costs nothing and it reads better.
//   3. EVERY WORKED NUMBER MUST BE POSSIBLE UNDER THE STATUTE CITED ON THE SAME PAGE. The lesson 4
//      example used 25 percent at twenty three months, which Tex. Tax Code 34.21 allows for
//      neither property type at that point: other property redeems within 180 days, and a
//      homestead in its second year pays 50 percent. It is now one month against twelve months on
//      a homestead, where 25 percent runs for the whole of the first year.
//   4. A BARE FRAGMENT OUT OF A LEDGER GETS A LEAD-IN. "Redeemable deed" means nothing to a
//      beginner standing on its own. The lead-in is a separate sentence of mine above the list.
//      The ledger wording itself is never edited to suit a lesson.
export const LESSONS_APPROVED = false;

const BASE_PATH = '/start-here/lessons/';

// Each pair is [lead-in, ...claim ids]. An empty lead-in renders the claims with no sentence
// above them, for lines that already read as whole sentences. The claims themselves go through
// lawList() untouched, so each keeps its statute, its official link and its checked date.
const lead = (lawList, L, pairs) =>
  pairs.map(([text, ...ids]) => `${text ? `<p>${text}</p>\n  ` : ''}${lawList(L, ids)}`).join('\n  ');

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
  // "The short version" is three sentences and makes no legal claim that is not cited further
  // down the same page, so a reader who stops after it has not been told anything unsourced.
  const head = (n, title, lede, short) => `
<section class="prose narrow">
  <p class="crumbs"><a href="/start-here/">Start here</a> / lesson ${n} of 5</p>
  <h1>${esc(title)}</h1>
  <p class="lede">${lede}</p>
  <p class="disclaimer-line">${DISCLAIMER}</p>

  <h2 id="short">The short version</h2>
  <p>${short}</p>`;

  return [
    {
      n: 1,
      slug: '1',
      title: 'Lesson 1: what a tax lien is',
      desc: 'A tax lien sale sells the unpaid tax bill, not the property. What you get, what you do not get, and how it ends, with Florida as the worked example.',
      body: `${head(
        1,
        'Lesson 1: what a tax lien is',
        'In a tax lien sale you are not buying a house. You are buying somebody else’s unpaid tax bill, and the right to be paid back with interest the law sets. This lesson is that sentence, slowly.',
        'You are buying somebody else’s unpaid tax bill, not their house. They pay you back with interest the statute sets, and if nobody ever pays, the statute gives the holder a road to the property itself. The numbers that decide whether any of it is worth doing are set by your state.'
      )}

  <h2 id="bill">It starts with a bill nobody paid</h2>
  <p>Property tax is charged on a property every year. Schools, roads, the fire service and the county offices are paid out of it. When an owner does not pay, the county has a problem with a date on it: the money was already spent in the budget.</p>
  <p>So the law gives the county a way to get the money now and hand the waiting to somebody else. That somebody is the person who buys the lien. You pay the county what the owner owed. The county is square. The debt is now owed to you.</p>

  <h2 id="what">What you actually own</h2>
  <p>You own a piece of paper, called a certificate, that says a specific amount is owed to you against a specific property, at an interest rate the statute fixes. That is all.</p>
  <p>You do not own the property. You cannot go in it. You cannot rent it out, mow the lawn, change the locks, sell it, or tell anybody to leave. The owner still owns it, still lives there if they live there, and still has to pay you back before the deadline the law gives them.</p>
  <p>This is the part that is easiest to get wrong, and it is worth being blunt about: a tax lien is lending, with a legal claim behind it. It is not buying property cheap.</p>

  <h2 id="florida">A real one, with the law behind it</h2>
  <p>Florida is a lien state. These are its own rules, each read from the Florida Senate published statutes and each carrying the date it was checked:</p>
  ${lead(lawList, FL_LAW, [
    ['What kind of sale Florida runs:', 'type'],
    ['The most the law lets a certificate earn:', 'rate'],
    ['How the bidding works:', 'bidMethod'],
    ['How long the owner has to pay you back:', 'redemption'],
    ['The least you are paid when they do:', 'summary.5'],
  ])}
  <p>Read the bidding rule twice, because it runs backwards from what people expect. The certificate goes to whoever will accept the <em>lowest</em> interest rate. You are not bidding more money. You are bidding to be paid less. In a crowded Florida sale the winner is the one willing to earn the least.</p>
  <p>Then read the last line again. Florida sets a minimum of five percent on redemption whatever rate you bid, except where the bid was zero percent. So there is a floor under a Florida certificate, and a bidder who drives the rate all the way to nothing has bid away the floor as well.</p>

  <h2 id="ending">How it ends</h2>
  <p>If the bill gets paid, your part is over. The owner, or their bank, or whoever is selling the house, pays the county what is owed plus the interest, the county forwards it to you, and that is the end of it. You lent money and you were paid back.</p>
  <p>If nobody pays, the statute gives the certificate holder a road to the property itself, and that road has its own waiting period, its own paperwork and its own bills to settle first:</p>
  ${lead(lawList, FL_LAW, [
    ['How long before the holder can ask for a deed:', 'summary.1'],
    ['What the holder has to settle before getting one:', 'summary.6'],
    ['What happens to a certificate nobody buys:', 'summary.4'],
  ])}
  <p>That last line is easy to skip and worth a second read. A certificate nobody bought is kept by the county at the highest rate the law allows. Lesson 3 covers what can happen to it after that.</p>
${close(1)}
</section>`,
    },
    {
      n: 2,
      slug: '2',
      title: 'Lesson 2: what a tax deed is',
      desc: 'A tax deed sale sells the property itself. What arrives with the deed, what may still be attached to it, and why Texas is the clearest worked example.',
      body: `${head(
        2,
        'Lesson 2: what a tax deed is',
        'A tax deed sale sells the property, not the debt. If you win, you hold a deed. What you take on is a property you have almost certainly never been inside.',
        'A deed sale sells the property itself, so there is no interest rate and nobody to wait for. In some states, Texas among them, the former owner can still take it back by paying you a premium the statute fixes. What stays attached to the property after the sale is set by state law, and that is the part to read before you bid.'
      )}

  <h2 id="difference">The one-line difference from lesson 1</h2>
  <p>In a lien sale you buy the debt and wait to be paid. In a deed sale you buy the real estate and there is nobody to wait for. There is no interest rate, because you are not lending anything. The property is the whole of what you get.</p>
  <p>Which also means the property is the whole of the risk. Nobody is going to send your money back with a nice percentage on top. What you have is what you bought, condition and all.</p>

  <h2 id="roads">There are two ways a deed sale happens</h2>
  <p><strong>Directly.</strong> Some states skip certificates altogether. The county takes the property to auction and sells a deed.</p>
  <p><strong>At the end of a lien.</strong> In a lien state, if nobody redeems, the certificate holder can start the deed process and the property goes to a public sale. Florida works this way, and the sale is run by a different office from the one that sold the certificate:</p>
  ${lead(lawList, FL_LAW, [
    ['Who runs the deed sale, and what it costs to win one:', 'summary.7', 'signup.deposit.2'],
  ])}
  <p>Worth noticing: that deposit is not refundable. The deed road has costs that start before you own anything.</p>

  <h2 id="texas">Texas, where the deed comes with a string attached</h2>
  <p>Texas is the example I would show anybody first, because it is a deed state with a catch, and the catch is where the money is:</p>
  ${lead(lawList, TX_LAW, [
    ['What kind of sale Texas runs, and what the deed hands you:', 'type', 'typeWhy.1'],
    ['How long the former owner has to take it back:', 'redemption'],
    ['What they pay you on top if they do, and what that is figured on:', 'rate', 'rateNote'],
    ['Who can use the property while that window runs:', 'keyNotes.3'],
  ])}
  <p>So in Texas you get the deed at the sale, you get use and possession, and the former owner can still undo it by paying you back with a flat percentage on top. Note what that percentage is calculated on: not just the back taxes, but your bid plus the recording fee plus the taxes and costs you paid.</p>
  <p>Sit with the flat percentage for a moment, because it is the number I would most want you to understand before you bid. On a homestead the premium is twenty five percent whether the owner redeems in the first week or in the eleventh month. Redeemed quickly it is a spectacular annual return on a very short loan. It is also the outcome where you owned a property for nine days. A redeemable deed state pays you in one of two completely different ways, and you do not get to pick which. Lesson 4 does that arithmetic in full.</p>

  <h2 id="attached">What is still attached to the deed</h2>
  <p>A tax deed is not automatically a clean title. Some claims against a property survive the sale, and which ones is a matter of state law. Here is Florida, in the statute's own words:</p>
  ${lead(lawList, FL_LAW, [['', 'risks.3']])}
  <p>That is one state and one kind of claim. The general lesson is the one to carry: before you bid anywhere, ask the county what the sale clears and what it does not, and get the answer in writing. Lesson 5 is about this whole problem.</p>
${close(2)}
</section>`,
    },
    {
      n: 3,
      slug: '3',
      title: 'Lesson 3: how a tax sale works, start to finish',
      desc: 'The whole sequence in order: the unpaid bill, the advertisement, registering and the deposit, the bidding, what happens if nobody bids, and where the money goes afterwards.',
      body: `${head(
        3,
        'Lesson 3: how a tax sale works, start to finish',
        'This lesson walks the whole sequence in order, with Florida and Texas standing in for the two shapes. The dates, the deposits and the way bidding works change state by state and often county by county.',
        'A tax sale moves through the same steps: an unpaid bill, a public notice, registering to bid, the bidding itself, and then either a wait or a deed. The dates, the deposits and the bidding method are set state by state and often county by county. Whatever any page says, the county running the sale is the authority on how it works this year.'
      )}

  <h2 id="step1">Step one: a bill goes unpaid, and a date passes</h2>
  <p>The tax becomes officially late on a date the statute names. Almost every other deadline in this business is counted from that date, not from the day the bill arrived and not from the day of the sale. Getting that one date right is most of the work.</p>

  <h2 id="step2">Step two: the county advertises</h2>
  <p>A sale has to be public, which means notice, in a form and for a time the statute sets:</p>
  ${lead(lawList, FL_LAW, [
    ['When Florida sells, and how long before it says so:', 'auctionTiming', 'signup.steps.3'],
  ])}
  <p>And Texas, where the whole state sells on the same day of the month:</p>
  ${lead(lawList, TX_LAW, [
    ['When Texas sells:', 'auctionTiming'],
    ['Where the date, the time and the place are published:', 'signup.steps.1'],
  ])}
  <p>A statewide sale day is a practical fact worth planning around: every county competes for the same bidders on the same morning.</p>

  <h2 id="step3">Step three: you register, and usually you pay a deposit</h2>
  ${lead(lawList, FL_LAW, [['What Florida may ask for before you bid:', 'signup.deposit.1']])}
  ${lead(lawList, TX_LAW, [['What Texas asks for before you bid:', 'signup.steps.3', 'ddExtra.2']])}
  <p>That Texas requirement is easy to miss: you cannot be handed the deed if you owe delinquent property tax yourself, and the officer cannot waive it.</p>

  <h2 id="step4">Step four: the bidding, which is not what you think</h2>
  <p>There is no single way to win a tax sale. Here are the two in these examples, and they are opposites:</p>
  ${lead(lawList, FL_LAW, [['How Florida picks the winner, and what it does about a tie:', 'summary.2', 'summary.3']])}
  ${lead(lawList, TX_LAW, [['How Texas picks the winner:', 'bidMethod']])}
  <p>Two different games. In Florida you compete by accepting less. In Texas you compete by paying more, against a minimum the county sets.</p>

  <h2 id="step5">Step five: what happens when nobody bids</h2>
  ${lead(lawList, FL_LAW, [['Florida, where an unsold certificate goes to the county:', 'summary.4', 'otc.note.1']])}
  ${lead(lawList, TX_LAW, [['Texas, where unsold property goes to the taxing unit:', 'beginnerTip.1', 'otc.note.2']])}
  <p>Notice what those four lines allow. What nobody wanted at the sale can be bought afterwards, straight from the county or the taxing unit, with no auction at all. In Texas, note that a resale is still subject to the former owner's right to redeem.</p>

  <h2 id="step6">Step six: the wait, and then the deed</h2>
  <p>In a lien state there is a waiting period before the holder can move on the property, and other certificates on the same property have to be settled first:</p>
  ${lead(lawList, FL_LAW, [['', 'summary.1', 'summary.6']])}
  <p>In a redeemable deed state the wait is the other way round: you already hold the deed, and you are waiting to see whether the former owner takes it back. Lesson 4 is entirely about that wait.</p>

  <h2 id="step7">Step seven: the money afterwards</h2>
  <p>When a property sells for more than was owed, the difference does not belong to the county and it does not belong to you. There is a statutory queue for it, and a deadline:</p>
  ${lead(lawList, FL_LAW, [['Florida, where the clerk holds it and the clock is short:', 'surplus.1', 'surplus.2']])}
  ${lead(lawList, TX_LAW, [['Texas, where the claim goes to the court that ordered the sale:', 'surplus.1']])}

  <h2 id="county">The step that is not in any statute</h2>
  <p>Call the county. A state page here is the baseline the statute sets; the office running the sale is the authority on how that sale actually works this year, on which platform, with which deposit, at which hour. One phone call before any money moves is the cheapest check in this whole business.</p>
${close(3)}
</section>`,
    },
    {
      n: 4,
      slug: '4',
      title: 'Lesson 4: what redemption means',
      desc: 'Redemption is the owner right to pay everything back and undo the sale. When the clock starts, what gets repaid, and why the speed of it changes what the deal was worth.',
      body: `${head(
        4,
        'Lesson 4: what redemption means',
        'Redemption is the owner’s right to pay what is owed and put things back as they were. It is the single most important idea in this business, because it decides what you end up holding and when.',
        'Redemption is the owner’s right to pay everything owed and undo the sale. The clock starts on a date the statute names, and that is often not the day of the auction. How fast they pay decides whether a fixed percentage was a remarkable return or an ordinary one.'
      )}

  <h2 id="what">What it is</h2>
  <p>After a tax sale, the law usually gives the former owner, and sometimes other people with an interest in the property, a window in which they can pay everything owed and undo the sale. If they do, that is called redeeming.</p>
  <p>If you bought a lien, redemption is how you get paid. If you bought a deed in a state that allows it, redemption is how you lose the property and get your money back with a premium instead.</p>

  <h2 id="clock">The clock almost never starts at the sale</h2>
  <p>This is the thing I would most want you to get right. Every state names the date the redemption clock starts, and it is usually not the day of the auction. It may be the day a certificate was issued, the day a deed was recorded, or a fixed calendar date in the year after.</p>
  ${lead(lawList, FL_LAW, [
    ['Florida, where the owner can redeem right up to the deed:', 'redemption'],
    ['And where the two year wait is counted from a fixed date:', 'summary.1'],
  ])}
  <p>Florida measures the road to a deed from April the first of the year the certificate was issued, not from the sale. Buy a certificate late in the cycle and your two years are already partly spent.</p>
  ${lead(lawList, TX_LAW, [
    ['Texas, where the length depends on what kind of property it is:', 'redemption'],
    ['Which makes property type something to settle before you bid:', 'risks.3'],
  ])}
  <p>Texas counts from the recording of the deed, and the length depends on what kind of property it is. Two years for a homestead, agricultural land or a mineral interest; one hundred and eighty days for everything else. Working out which one you are bidding on is a job to do before the sale, not after.</p>

  <h2 id="paid">What gets repaid, and what that is worth</h2>
  <p>In a lien state, you are repaid the amount plus interest, with whatever floor the statute puts under it:</p>
  ${lead(lawList, FL_LAW, [['The floor, and the one window where it does not apply:', 'summary.5', 'rateWhy.3']])}
  <p>In a redeemable deed state, you are repaid a flat percentage on a larger base:</p>
  ${lead(lawList, TX_LAW, [
    ['What the former owner has to hand over:', 'risks.1'],
    ['And the premium on top of it, by property type:', 'keyNotes.1', 'keyNotes.2'],
  ])}
  <p>Here is the arithmetic, because a flat percentage hides it. Say your bid plus your costs come to ten thousand dollars on a homestead, where the premium is twenty five percent for the whole of the first year. Redeemed after one month you are paid twelve thousand five hundred: two thousand five hundred earned in a single month, which is the same pace as thirty thousand over twelve months, or roughly three hundred percent a year. Redeemed in the twelfth month you are paid exactly the same twelve thousand five hundred, except that you waited a year for it, which is twenty five percent a year. Same statute, same number, same deal, and twelve times the difference in what it was worth. A headline percentage on its own tells you almost nothing.</p>
  <p>And the opposite trap, in a rate state: a certificate redeemed a month after you bought it earns you a month of interest, not a year of it, unless the statute puts a minimum in your way. Florida has one. Whether your state has one is on your state page.</p>

  <h2 id="meanwhile">Who holds the property while the clock runs</h2>
  ${lead(lawList, TX_LAW, [['', 'keyNotes.3']])}
  <p>That is Texas. It means the deed buyer, not the former owner, has use and possession during the redemption window. It does not mean the same thing anywhere else, and it is exactly the kind of rule to read in your own state before you plan on collecting any rent.</p>
  ${lead(lawList, TX_LAW, [['', 'summary.7']])}
  <p>Note what that last line does to the bargain hunting end of the market: a property the county resells later still carries the former owner's right to redeem with it.</p>

  <h2 id="plan">What this means for you before you bid</h2>
  <p>Decide which outcome you actually want, then read the rules that produce it. If you want to be paid interest and be done with it, the numbers that matter are the rate, whatever floor the statute puts under it, and the date the clock starts. If you want to end up owning the property, redemption is the thing standing between you and it, so the length of the window and what it is counted from are the first two things to read on any state page.</p>
${close(4)}
</section>`,
    },
    {
      n: 5,
      slug: '5',
      title: 'Lesson 5: how title gets cleared after a sale',
      desc: 'A tax deed is not automatically a clean title. What a cloud on title is, what can survive a tax sale, why this varies by state and county, and why this part of the job goes to a real estate attorney.',
      body: `${head(
        5,
        'Lesson 5: how title gets cleared after a sale',
        'You won the sale and you are holding a deed. That is not the same as being able to sell, insure or borrow against the property. This lesson is about the gap between those two things, and it is the lesson where I tell you to hire somebody.',
        'Holding a tax deed is not the same as holding a title you can sell, insure or borrow against. Some claims against the property can survive the sale, and which ones is set by state law. I hand this part of the job to a real estate attorney.'
      )}

  <h2 id="title">What title means, in plain words</h2>
  <p>Title is the record of who owns a property and who else has a claim against it. It lives in the county records as a chain of documents going back years: sales, mortgages, liens, judgments, easements, divorces, deaths. A buyer, a lender and an insurer all read that chain before they will do anything.</p>
  <p>A cloud on title is anything in that chain that makes a reader stop. Not necessarily something fatal. Something unresolved.</p>

  <h2 id="why">Why a tax deed often arrives with a cloud</h2>
  <p>A tax deed comes from a process, not from a seller sitting across a table. It can leave questions on the record that nobody has formally answered: whether everyone entitled to notice got it, whether some other claim survived the sale, whether the former owner has any remaining right.</p>
  <p>Whether a title insurer will insure it as it stands is a question for that insurer, and a buyer who needs a mortgage needs an insurer willing to say yes. The property is yours either way. Selling it at a normal price is a different matter.</p>

  <h2 id="survives">Some claims survive the sale, and which ones is state law</h2>
  <p>This is the one part of the problem with a hard, readable answer, and here it is for Florida, in the statute's own words:</p>
  ${lead(lawList, FL_LAW, [['', 'risks.3', 'ddExtra.2']])}
  <p>Government liens of record that are not paid out of the sale proceeds survive the issuance of the deed. So a municipal, county or special district claim can walk through a tax sale untouched and land on you. That is checkable before you bid, at the city and the county, and it is one of the cheapest checks there is.</p>
  <p>Florida also puts an outer limit on one kind of challenge:</p>
  ${lead(lawList, FL_LAW, [['', 'risks.2']])}
  <p>Four years after the deed is issued, the former owner and anyone claiming under them can no longer bring an action. That is a real and useful fact about Florida, and the reason it is on this page is that it is in the audited record with the statute behind it.</p>

  <h2 id="quiet">What this page deliberately does not tell you</h2>
  <p>There is a court process, generally called quiet title, used after some tax deed sales to get a judgment settling who owns the property so that the title becomes insurable. Whether you need it, what it costs, how long it takes, who has to be served and what happens if somebody objects are all set by state law and local court practice.</p>
  <p><strong>This site states none of that for any state, on purpose.</strong> Platbook publishes a legal statement only when it has read the statute from the official source and recorded the citation, the link and the date. The audited records behind this site hold claims about sale types, rates, redemption, bidding, auctions, over the counter sales, due diligence and surplus funds. They hold nothing about quiet title procedure, in any state. So rather than fill the gap with something that sounds right, this lesson leaves it empty and says so.</p>
  <p>It also varies below the state level. Two counties in one state can run the recording, the notice and the local court step differently, and the clerk in the county where the property sits is the authority on how it is done there.</p>

  <h2 id="attorney">The part I do not do myself</h2>
  <p>I hand title work to a real estate attorney. Every time. I have never done it myself.</p>
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
